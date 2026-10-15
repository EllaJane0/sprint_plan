#!/usr/bin/env python3
"""Scan local Claude Code and Codex session transcripts for a sprint window.

Reads only what it is told to read. --list reads each transcript's recorded working
directory and nothing else; message content is opened solely for the projects named
with --projects. Nothing is sent anywhere.
"""
import argparse, json, os, re, sys, datetime as dt
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path.home() / ".claude" / "projects"
CODEX = Path.home() / ".codex" / "sessions"   # Codex CLI and the Codex VS Code extension


def codex_cwd(jsonl: Path) -> str:
    """Codex records its working directory in the first line, a session_meta record."""
    try:
        with open(jsonl, "r", errors="replace") as fh:
            for i, line in enumerate(fh):
                if i > 5:
                    break
                d = json.loads(line)
                if d.get("type") == "session_meta":
                    return (d.get("payload") or {}).get("cwd") or "?codex"
    except (OSError, ValueError):
        pass
    return "?codex"


def project_cwd(jsonl: Path, fallback: str) -> str:
    """The real working directory, read from the first record that carries one.

    The directory name under ~/.claude/projects encodes both "/" and "-" as "-",
    so it cannot be decoded unambiguously. Each transcript records its own cwd.
    """
    try:
        with open(jsonl, "r", errors="replace") as fh:
            for i, line in enumerate(fh):
                if i > 40:
                    break
                try:
                    d = json.loads(line)
                except Exception:
                    continue
                if d.get("cwd"):
                    return d["cwd"]
    except OSError:
        pass
    return fallback


def sessions(since: dt.datetime):
    """Yield (tool, cwd, jsonl_path, mtime) for Claude Code and Codex sessions active since `since`."""
    def recent(f):
        try:
            m = dt.datetime.fromtimestamp(f.stat().st_mtime, dt.timezone.utc)
        except OSError:
            return None
        return m if m >= since else None

    if ROOT.is_dir():
        for proj in sorted(ROOT.iterdir()):
            if proj.is_dir():
                for f in proj.glob("*.jsonl"):
                    m = recent(f)
                    if m:
                        yield "claude", project_cwd(f, "?" + proj.name), f, m
    if CODEX.is_dir():
        for f in CODEX.rglob("rollout-*.jsonl"):
            m = recent(f)
            if m:
                yield "codex", codex_cwd(f), f, m


def cmd_list(since):
    agg = defaultdict(lambda: {"n": 0, "first": None, "last": None, "tools": Counter()})
    for tool, key, f, m in sessions(since):
        a = agg[key]
        a["n"] += 1
        a["tools"][tool] += 1
        a["first"] = m if a["first"] is None else min(a["first"], m)
        a["last"] = m if a["last"] is None else max(a["last"], m)
    if not agg:
        print("No sessions found in the window.")
        return
    rows = sorted(agg.items(), key=lambda kv: kv[1]["n"], reverse=True)
    print(f"{'sessions':>8}  {'first':<11} {'last':<11} {'tool':<14} project")
    for path, a in rows:
        tools = ", ".join(f"{k} {v}" for k, v in sorted(a["tools"].items()))
        print(f"{a['n']:>8}  {a['first']:%Y-%m-%d}  {a['last']:%Y-%m-%d}  {tools:<14} {path}")
    print(f"\n{len(rows)} projects, {sum(a['n'] for _, a in rows)} sessions.")


def codex_records(path):
    try:
        fh = open(path, "r", errors="replace")
    except OSError:
        return
    with fh:
        for line in fh:
            try:
                d = json.loads(line)
            except Exception:
                continue
            if d.get("type") == "response_item" and isinstance(d.get("payload"), dict):
                yield d.get("timestamp", ""), d["payload"]


def user_turns(path, tool="claude"):
    """Yield (timestamp, text) for the human's own turns only."""
    if tool == "codex":
        for ts, p in codex_records(path):
            if p.get("type") == "message" and p.get("role") == "user":
                text = " ".join(b.get("text", "") for b in p.get("content") or []
                                if isinstance(b, dict) and b.get("type") == "input_text").strip()
                if text and not text.startswith("<"):
                    yield ts, text
        return
    try:
        fh = open(path, "r", errors="replace")
    except OSError:
        return
    with fh:
        for line in fh:
            try:
                d = json.loads(line)
            except Exception:
                continue
            if d.get("type") != "user":
                continue
            msg = d.get("message") or {}
            c = msg.get("content")
            text = ""
            if isinstance(c, str):
                text = c
            elif isinstance(c, list):
                text = " ".join(
                    b.get("text", "") for b in c
                    if isinstance(b, dict) and b.get("type") == "text"
                )
            text = text.strip()
            if text and not text.startswith("<"):
                yield d.get("timestamp", ""), text


def tool_uses(path, tool="claude"):
    if tool == "codex":
        for _ts, p in codex_records(path):
            if p.get("type") in ("function_call", "custom_tool_call"):
                yield p.get("name", "?")
        return
    try:
        fh = open(path, "r", errors="replace")
    except OSError:
        return
    with fh:
        for line in fh:
            try:
                d = json.loads(line)
            except Exception:
                continue
            if d.get("type") != "assistant":
                continue
            for b in (d.get("message") or {}).get("content") or []:
                if isinstance(b, dict) and b.get("type") == "tool_use":
                    yield b.get("name", "?")


COURSE_SKILLS = {"sprint-plan", "sprint-review", "learn", "eli5"}
# Command-line tools for outside services: one of the three routes beyond the repo (with MCP
# servers and direct API calls). Shell basics like ls or git are not counted here.
SERVICE_CLIS = {"gh", "supabase", "vercel", "netlify", "stripe", "firebase", "aws", "gcloud", "az",
                "heroku", "railway", "fly", "flyctl", "wrangler", "render", "expo", "eas", "neonctl",
                "turso", "prisma", "doctl", "linear", "op", "resend", "twilio", "shopify", "sentry-cli"}
API_CLIS = {"curl", "wget", "http", "https", "xh"}


def programs(command):
    """The program at the start of each part of a shell command, skipping VAR=value prefixes and
    sudo; for npx and bunx, the package it runs."""
    for part in re.split(r"&&|\|\||;|\|", command):
        words = [w for w in part.strip().split() if not re.match(r"^\w+=", w) and w != "sudo"]
        if words and words[0] in ("npx", "bunx", "pnpx") and len(words) > 1:
            words = [w for w in words[1:] if not w.startswith("-")] or words
        if words:
            yield Path(words[0]).name


def builder_tools(path, tool="claude"):
    """Which Claude Code building blocks a session used: skills, slash commands, hooks, subagents,
    MCP servers, plan mode, permission modes, worktrees, and the memory and instruction files it
    loaded or wrote. Counts and names only; never prompt or file content. Codex logs carry tool
    names only, so they add nothing here."""
    out = {k: Counter() for k in ("skills", "commands", "hooks", "hooks_blocked", "subagents", "mcp",
                                  "cli", "api_calls", "plugins", "messages", "modes", "plan", "worktrees",
                                  "instructions_loaded", "memory_written")}
    if tool == "codex":
        return out
    try:
        fh = open(path, "r", errors="replace")
    except OSError:
        return out
    with fh:
        for line in fh:
            try:
                d = json.loads(line)
            except Exception:
                continue
            t = d.get("type")
            if t == "user":
                if d.get("permissionMode"):
                    out["modes"][d["permissionMode"]] += 1
                c = (d.get("message") or {}).get("content")
                if isinstance(c, str):
                    m = re.search(r"<command-name>/?([^<]+)</command-name>", c)
                    if m:
                        out["commands"][m.group(1).strip()] += 1
                elif isinstance(c, list):
                    for b in c:
                        if isinstance(b, dict) and b.get("type") == "tool_result" and "hook error" in str(b.get("content", "")):
                            ev = re.search(r"(\w+(?::\w+)?) hook error", str(b.get("content", "")))
                            out["hooks_blocked"][ev.group(1) if ev else "hook"] += 1
            elif t == "attachment":
                a = d.get("attachment") or {}
                if a.get("type") == "hook_success":
                    out["hooks"][a.get("hookName") or a.get("hookEvent") or "hook"] += 1
                elif a.get("type") == "invoked_skills":
                    for sk in a.get("skills") or []:
                        out["skills"][sk.get("name", "?")] += 1
                elif a.get("type") == "instructions":
                    for f in a.get("files") or []:
                        out["instructions_loaded"][f"{f.get('type', '?')}: {Path(f.get('path', '?')).name}"] += 1
            elif t == "assistant":
                for b in (d.get("message") or {}).get("content") or []:
                    if not (isinstance(b, dict) and b.get("type") == "tool_use"):
                        continue
                    name, inp = b.get("name", ""), b.get("input") or {}
                    if name == "Bash":
                        for prog in programs(str(inp.get("command", ""))):
                            if prog in SERVICE_CLIS:
                                out["cli"][prog] += 1
                            elif prog in API_CLIS:
                                out["api_calls"][prog] += 1
                    if name == "Skill":
                        out["skills"][inp.get("skill", "?")] += 1
                    elif name in ("Agent", "Task"):
                        out["subagents"][inp.get("subagent_type") or "general-purpose"] += 1
                    elif name.startswith("mcp__"):
                        out["mcp"][name.split("__")[1]] += 1
                    elif name == "SendMessage":
                        to = str(inp.get("to") or "")
                        if re.fullmatch(r"a[0-9a-f]{12,}", to):
                            out["messages"]["a subagent"] += 1
                        elif to.startswith(("uds:", "pipe:")) or not to:
                            out["messages"]["a session on this computer"] += 1
                        else:
                            out["messages"][f"session {to}"] += 1
                    elif name == "ListAgents":
                        out["messages"]["listed reachable sessions"] += 1
                    elif name in ("EnterPlanMode", "ExitPlanMode"):
                        out["plan"][name] += 1
                    elif name in ("EnterWorktree", "ExitWorktree"):
                        out["worktrees"][name] += 1
                    elif name in ("Write", "Edit", "MultiEdit"):
                        fp = str(inp.get("file_path", ""))
                        if "/memory/" in fp or fp.endswith(("CLAUDE.md", "AGENTS.md", "MEMORY.md")):
                            out["memory_written"][Path(fp).name] += 1
    return out


def cmd_analyze(since, wanted):
    want = {w.rstrip("/") for w in wanted}
    picked = [(tool, f) for tool, cwd, f, _m in sessions(since)
              if any(cwd.rstrip("/").startswith(w) for w in want)]
    if not picked:
        print("No sessions matched those projects.")
        return

    by_day, prompts, tools = Counter(), [], Counter()
    bt = {}
    for tool, f in picked:
        for ts, text in user_turns(f, tool):
            if ts:
                by_day[ts[:10]] += 1
            prompts.append((ts, text))
        tools.update(tool_uses(f, tool))
        for k, v in builder_tools(f, tool).items():
            bt.setdefault(k, Counter()).update(v)

    by_tool = Counter(tool for tool, _ in picked)
    print(f"SESSIONS: {len(picked)} ({', '.join(f'{k} {v}' for k, v in sorted(by_tool.items()))})")
    print(f"PROMPTS: {len(prompts)}")
    print(f"DAYS ACTIVE: {len(by_day)}\n")

    print("ACTIVITY BY DAY")
    for day in sorted(by_day):
        print(f"  {day}  {'#' * min(by_day[day], 50)} {by_day[day]}")

    print("\nTOOL USE")
    for name, n in tools.most_common(12):
        print(f"  {n:>5}  {name}")

    def show(label, c, note=""):
        items = ", ".join(f"{k} ({v})" for k, v in c.most_common(10))
        print(f"  {label:<22} {items or 'none'}{note}")
    # A skill or subagent named plugin:name came from a plugin.
    for k, v in list(bt["skills"].items()) + list(bt["subagents"].items()):
        if ":" in k:
            bt["plugins"][k.split(":")[0]] += v
    own = Counter({k: v for k, v in bt["skills"].items() if k not in COURSE_SKILLS})
    course = Counter({k: v for k, v in bt["skills"].items() if k in COURSE_SKILLS})
    print("\nBUILDER TOOLS USED (counts across the confirmed sessions)")
    show("Skills, your own", own)
    show("Skills, course", course)
    show("Slash commands", bt["commands"])
    show("Hooks that ran", bt["hooks"])
    show("Hooks that blocked", bt["hooks_blocked"])
    show("Subagents", bt["subagents"])
    show("MCP servers", bt["mcp"], "  (connectors from the Claude app appear as claude_ai_...)")
    show("Service CLI tools", bt["cli"])
    show("Direct API calls", bt["api_calls"], "  (curl and similar, run by the agent)")
    show("Plugins", bt["plugins"], "  (skills or subagents that came from a plugin)")
    show("Messages to sessions", bt["messages"], "  (to subagents or your other sessions, by recipient)")
    show("Plan mode", bt["plan"])
    show("Permission modes", bt["modes"], "  (turns in each mode)")
    show("Worktrees", bt["worktrees"])
    show("Instructions loaded", bt["instructions_loaded"], "  (times each file was loaded)")
    show("Memory written", bt["memory_written"], "  (edits to memory or instruction files)")

    print("\nPROMPTS (chronological, truncated)")
    for ts, text in sorted(prompts, key=lambda x: x[0]):
        one = " ".join(text.split())
        print(f"  [{ts[:16]}] {one[:220]}")


def field(text, label):
    """The value after **Label:** on one line, or the paragraph under a ## Label heading."""
    import re
    m = re.search(r"^\*\*" + re.escape(label) + r":\*\*\s*(.+)$", text, re.M)
    if m:
        return m.group(1).strip()
    m = re.search(r"^##\s+" + re.escape(label) + r"\s*\n+(.*?)(?=\n##\s|\Z)", text, re.M | re.S)
    if m:
        return " ".join(m.group(1).split())
    return ""


def cmd_learning(since, repo):
    """List the /learn sessions logged in learning/ during the window. Facts only, no score."""
    import re
    folder = Path(repo) / "learning"
    day0 = since.date()
    logs = []
    for f in sorted(folder.glob("*.md")) if folder.is_dir() else []:
        m = re.match(r"(\d{4}-\d{2}-\d{2})-", f.name)
        if not m:
            continue                      # skips 000-learning-template.md
        try:
            day = dt.date.fromisoformat(m.group(1))
        except ValueError:
            continue
        if day < day0:
            continue
        text = f.read_text(errors="replace")
        title = re.search(r"^#\s+(?:Learning log:\s*)?(.+)$", text, re.M)
        logs.append({
            "day": day.isoformat(),
            "file": f"learning/{f.name}",
            "section": title.group(1).strip() if title else f.stem,
            "finished": field(text, "Finished"),
            "axis": field(text, "Axis"),
            "time": field(text, "Time"),
            "start": field(text, "Starting point"),
            "confidence": field(text, "Confidence"),
            "asked": field(text, "What I asked about"),
            "question": field(text, "Still wondering"),
        })
    print(f"LEARNING SESSIONS: {len(logs)}")
    axes = {}
    for g in logs:
        if g["axis"]:
            axes[g["axis"]] = axes.get(g["axis"], 0) + 1
    if axes:
        print("  by axis: " + ", ".join(f"{k} {v}" for k, v in sorted(axes.items(), key=lambda x: -x[1])))
    for g in logs:
        print(f"\n  {g['day']}  {g['section']}  ({g['file']})")
        for k in ("time", "finished", "axis", "asked", "start", "confidence", "question"):
            if g[k]:
                print(f"    {k}: {g[k][:300]}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--since", required=True, help="ISO date, e.g. 2026-10-12")
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--analyze", action="store_true")
    ap.add_argument("--projects", nargs="*", default=[])
    ap.add_argument("--learning", metavar="REPO", help="list /learn logs in REPO/learning/ since --since")
    a = ap.parse_args()

    try:
        since = dt.datetime.fromisoformat(a.since)
    except ValueError:
        sys.exit(f"Bad --since: {a.since}")
    if since.tzinfo is None:
        since = since.replace(tzinfo=dt.timezone.utc)

    if a.learning:
        cmd_learning(since, a.learning)
    elif a.list:
        cmd_list(since)
    elif a.analyze:
        if not a.projects:
            sys.exit("--analyze needs --projects")
        cmd_analyze(since, a.projects)
    else:
        sys.exit("Pass --list, --analyze, or --learning")


if __name__ == "__main__":
    main()
