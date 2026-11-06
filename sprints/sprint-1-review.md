# Sprint 1 Review

**Window:** Oct 24, 2026 to Nov 6, 2026
**Sessions reviewed:** 4 across 2 projects (Claude Code 4, Codex 0; 1 session excluded)
**Not visible to this review:** the Anthropic Academy course; conversations with Indigo's placement coordinator and co-founder; the placement-agent write-up

## Work files and links

- **EllaJane0/sprint_plan** (this repo, public): 3 commits in the window, on Oct 24 (2) and Nov 5 (1). All three are sprint plan commits.
- **Indigo-Institute/Main_Website** (client repo, private; whether it is shared with sdmurff could not be checked): 1 commit in the window.
  - Nov 3: "Remove hidden Indigo Promise block with outdated 50% refund claim" (about-us.html, locations.html, partner-with-indigo.html)
- **Live:** https://indigoinstitute.com (tested with the website-reviewer subagent on Nov 5)
- **Outside any repo:** the website-reviewer subagent, at `~/.claude/agents/website-reviewer.md`, created Nov 5.

## When you worked

5 of 14 days had activity: Oct 24, Oct 30, Nov 3, Nov 5 and Nov 6. 36 of 43 prompts came on two days: Oct 24 (21) and Nov 5 (15). Nov 6 was this review.

## Where you got stuck

1. **The plan format (Oct 24).** The first plan was written and pushed in the MSB 341 format, because the repo had no `course.json` and its name does not include "foundry". You noticed the missing Foundry fields, and the plan was rewritten in the Foundry format and pushed the same evening.
2. **A setup step on the Indigo site (Nov 3).** After removing the 50% refund block, you asked for help setting something up, and the next prompt came about 50 minutes later, after you signed in to Chrome.
3. **Pushing the plan change (Nov 5).** The push failed because the active GitHub account was Indigo-Institute, which cannot write to this repo. Switching accounts was not enough, because git was using a login saved in the macOS keychain. The commit was pushed once with the GitHub CLI login. You then ran `gh auth setup-git`, so git now uses whichever account is active in the GitHub CLI.

## What took the most time

Session durations were not available, so this is by prompt volume. Sprint planning on Oct 24 took 21 prompts over about 40 minutes. On Nov 5, changing the plan, building the website-reviewer subagent and running it on indigoinstitute.com took 15 prompts over about 35 minutes. The Nov 3 fix on the Indigo site took 4 prompts.

## Builder tools you used

| Tool | What it is | What you used this sprint |
|---|---|---|
| Skills you wrote | Skills you made yourself | not used |
| Course skills | sprint-plan, sprint-review, sprint-coach, learn, eli5 | none recorded by the scan (sprint-plan and sprint-review were followed from the repo's skill files) |
| Plugins | Add-ons that bring skills or subagents | not used |
| Slash commands | Commands typed with `/` | list-agents (1), agents (1) |
| Hooks | Scripts that run automatically on events | not used |
| Subagents | Helper agents a session hands work to | named: website-reviewer (1); built-in: none |
| Messages to other sessions | Messages between Claude sessions | none |
| Plan mode | Planning before acting | not used |
| Permission mode | How tool calls are approved | `auto` (46 turns) |
| Permission prompts and denials | Calls that were approved, declined or blocked | 1 blocked by auto mode |
| Where sessions ran | Interactive, `claude -p`, Agent SDK, desktop or IDE | terminal or IDE, interactive (4) |
| Worktrees | Separate git working copies | not used |
| Memory and instructions | CLAUDE.md, MEMORY.md and similar | MEMORY.md loaded (1); none edited |
| Reaching outside the repo | Service CLI tools, MCP servers and connectors, direct API calls | CLI: gh (9); MCP: none recorded; API calls: none |

Not used this sprint: your own skills, plugins, hooks, plan mode, worktrees.

Scan version: sprint_scan 2026-10-16.

## Users this sprint

| Date | What happened | Change that followed |
|---|---|---|
| Nov 3 | A report that students who asked Claude to search the website's code were finding a 50% tuition offer that does not appear on the site | Commit 951ec0a in Indigo-Institute/Main_Website removed the hidden Indigo Promise block with the outdated 50% refund claim |

## Learning sessions

None logged this sprint. The sprint's work advanced Agentic Workflow.

## Axis

**Agentic Workflow.** The main output was a named Claude Code subagent (website-reviewer), with its own tool list and instructions, which you ran against the client's live site.

## Plan compared with the work

**Goal was:** I will have learned more about subagent construction and limitations, and learned about the scope and responsibility of the placement agents.

**Build for Indigo Institute, discovery (a write-up of the placement agent's context and requirements):** No write-up appears in this repo or the confirmed projects, and the README's Work files and links section does not list one. You reported that the write-up and the conversations with the placement coordinator and co-founder happened outside what this scan can see.

**Learn: Introduction to Subagents (Anthropic Academy):** The deliverable is present: the website-reviewer subagent was created on Nov 5 and run on indigoinstitute.com the same day. The certificate of completion was not found in the repo, and the README does not link it. The Nov 5 plan change shifted the sprint from building the placement agent to this course and the write-up, and the reason recorded in the plan is the builder's.

---

## Your sprint retrospective

*The builder's own answers, recorded word for word.*

**Did you hit the goal?** Partly, I completed two Claude Code courses with an emphasis on building agents and subagents, and interviewed the placement team as well as the co-founders to speak about what the placement agent looks like and to build out the workflow. I still need to speak to the other learning management system developer to speak about how that agent is going to interact with the LMS and placement platform, but that is happening tomorrow afternoon. I learned a lot more about the definitions of certain Claude features and learned a few commands I can use in the terminal that will help improve the speed of my workflow.

**What did the client or your users say?** They're excited for the agent, and I was able to build out all of the logic for the agent, which was really exciting. I think this will be really, really impactful on the team.

**What did the report show you?** The report pulled a major security hole that I didn't anticipate, showing that I had a GitHub personal access token saved in a public repo. It also helped me patch up that hole, and so I'm grateful that it flagged that issue.

**If the plan changed, why?** The plan did change based on the availability of the team members I was working with. I wanted to complete the agent before the end of this sprint, but I was only able to meet with the team earlier this week in the second half of the sprint. I won't be able to finish building the agent before the end of the sprint, but I did learn a lot about what the agent needs to look like.

**Actual difficulty:** I say it's pretty accurate to the two I predicted.

**What will you change next sprint?** Next sprint, I'd like to spend more time in my sprint planning. I had to change the sprint plan partially way into the sprint because my sprint plan initially was not as thorough as I wanted it to be. When I write the sprint plan, I want to also have my calendar open and schedule when I'm going to do certain tasks.
