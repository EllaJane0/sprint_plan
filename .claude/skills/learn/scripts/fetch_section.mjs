#!/usr/bin/env node
// Fetch one `##` section of the MSB 341 course book, word for word, from its source on GitHub.
//
//   node fetch_section.mjs "https://byu-strategy.github.io/product-management/05-interface-and-flow.html#flows-before-screens"
//   node fetch_section.mjs "https://byu-strategy.github.io/product-management/05-interface-and-flow.html"   (lists the sections)
//   node fetch_section.mjs                                                                                (lists the chapters)
//   node fetch_section.mjs DE02                                                                           (the passage for one concept)
//   node fetch_section.mjs "https://byu-strategy.github.io/product-management/05-interface-and-flow.html?c=DE02#flows-before-screens Focus on DE02"
//
// A builder concept id (two letters and two digits, such as DE02) can come alone, inside the
// text, or as ?c=DE02 in the link. The skill then looks the concept up in the book repo's
// scripts/grading/book-passages.json (and its name in scripts/grading/concepts/*.json), and,
// when that map cannot be read, in the concept tags of the chapter sources themselves.
//
// The first line of output is always a status: LEARN-SECTION-OK, LEARN-NEED-SECTION,
// LEARN-NEED-CHAPTER, or LEARN-SECTION-ERROR. It always exits 0, because the /learn skill
// injects this output into its prompt and a non-zero exit would abort the whole skill.
// Needs only Node (any version from 16 on). Reads nothing on this computer and sends nothing.

import https from "node:https";

const SITE = "https://byu-strategy.github.io/product-management/";
const REPO = "byu-strategy/product-management";
const BRANCH = "main";
const RAW = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/`;
const CONCEPT_ID = /(?:[?&]c=|(?:^|[\s"'(<]))((?:AW|DI|DE|AA|AS|LL)\d{2})(?=$|[^\w])/i;
const CONCEPT_FILES = { AW: "agentic", DI: "discovery", DE: "design", AA: "architecture", AS: "aisystems", LL: "launch" };
const CHAPTER_LINE = /^\s*-\s+(\d\d[a-z]?-[\w-]+)\.qmd\s*$/gm;

function get(url, redirects = 3) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { "User-Agent": "msb341-learn" }, timeout: 20000 }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location && redirects > 0) {
        res.resume();
        resolve(get(new URL(res.headers.location, url).toString(), redirects - 1));
        return;
      }
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (c) => (body += c));
      res.on("end", () => resolve({ status: res.statusCode, body }));
    });
    req.on("timeout", () => req.destroy(new Error("timed out after 20 seconds")));
    req.on("error", reject);
  });
}

// ---- Turn a heading into the id Quarto (pandoc) gives it -------------------------------------
// Pandoc's default auto_identifiers: take the heading's plain text, lowercase it, keep only
// letters, digits, spaces, "_", "-" and ".", join the words with "-", drop everything before
// the first letter. An explicit {#id} on the heading wins. Duplicates get -1, -2, ...

function plainText(md) {
  let s = md;
  s = s.replace(/\^\[[^\]]*\]/g, "");                    // inline footnotes
  s = s.replace(/\[\^[^\]]*\]/g, "");                    // footnote references
  s = s.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");        // images -> alt text
  s = s.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");         // links -> text
  s = s.replace(/\[([^\]]*)\]\{[^}]*\}/g, "$1");         // spans -> text
  s = s.replace(/<[^>]+>/g, "");                         // raw HTML tags
  s = s.replace(/`+([^`]*)`+/g, "$1");                   // code -> its text
  s = s.replace(/\\(.)/g, "$1");                         // backslash escapes
  s = s.replace(/[*~]/g, "");                            // emphasis, strikeout
  s = s.replace(/(^|[^\p{L}\p{N}])_+|_+(?=$|[^\p{L}\p{N}])/gu, "$1"); // _emphasis_, not snake_case
  s = s.replace(/---/g, "—").replace(/--/g, "–"); // smart dashes (then dropped)
  return s.trim();
}

function autoId(text) {
  let s = text.toLowerCase();
  s = s.replace(/[^\p{L}\p{N}\s_.\-]/gu, "");
  s = s.split(/\s+/).filter(Boolean).join("-");
  s = s.replace(/^[^\p{L}]+/u, "");
  return s || "section";
}

function parseHeading(line) {
  const m = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
  if (!m) return null;
  let text = m[2];
  let explicit = null;
  const attr = /\s*\{([^{}]*)\}\s*$/.exec(text);
  if (attr) {
    const id = /(?:^|\s)#([^\s}]+)/.exec(attr[1]);
    if (id) explicit = id[1];
    text = text.slice(0, attr.index);
  }
  return { level: m[1].length, text: plainText(text), explicit };
}

// ---- Split a .qmd into headings, skipping front matter and fenced code ----------------------

function scan(source) {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const headings = [];
  const used = new Set();
  let title = null;
  let i = 0;
  if (lines[0] === "---") {
    for (i = 1; i < lines.length && !/^(---|\.\.\.)\s*$/.test(lines[i]); i++) {
      const t = /^title:\s*["']?(.*?)["']?\s*$/.exec(lines[i]);
      if (t) title = t[1];
    }
    i++;
  }
  const bodyStart = i;
  let fence = null;
  let calloutOpen = false; // a heading right after ::: {.callout-...} is the callout's title
  for (; i < lines.length; i++) {
    const line = lines[i];
    const afterCallout = calloutOpen;
    if (line.trim() !== "") calloutOpen = false;
    const f = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fence) {
      if (f && f[1][0] === fence[0] && f[1].length >= fence.length && /^\s*[`~]+\s*$/.test(line)) fence = null;
      continue;
    }
    if (f) { fence = f[1]; continue; }
    if (/^\s*:{3,}\s*\{?[^}]*\.callout/.test(line)) { calloutOpen = true; continue; }
    const h = parseHeading(line);
    if (!h || afterCallout) continue;
    let id = h.explicit || autoId(h.text);
    if (!h.explicit && used.has(id)) {
      let n = 1;
      while (used.has(`${id}-${n}`)) n++;
      id = `${id}-${n}`;
    }
    used.add(id);
    headings.push({ ...h, id, line: i });
    if (h.level === 1 && !title) title = h.text;
  }
  return { lines, headings, title, bodyStart };
}

function sectionText(doc, h) {
  const next = doc.headings.find((x) => x.line > h.line && x.level <= 2);
  const end = next ? next.line : doc.lines.length;
  const body = doc.lines.slice(h.line, end);
  while (body.length && (body[body.length - 1].trim() === "" || /^<!--\s*learn\s*-->$/.test(body[body.length - 1].trim()))) body.pop();
  return body.join("\n");
}

// ---- Read the argument ---------------------------------------------------------------------

// The argument may carry a link, a concept id, and free text ("Focus on DE02 Flows before
// screens"). Return the concept id (or "") and the part that names the page.
function splitArg(raw) {
  const text = (raw || "").trim();
  const c = CONCEPT_ID.exec(text);
  const concept = c ? c[1].toUpperCase() : "";
  const link = /(?:https?:\/\/|byu-strategy\.github\.io)\S+|\S+\.(?:html|qmd)(?:[?#]\S*)?/i.exec(text);
  if (link) return { concept, page: link[0].replace(/[).,;'">]+$/, "") };
  return { concept, page: concept ? "" : text };
}

function parseArg(raw) {
  let arg = (raw || "").trim().replace(/^<|>$/g, "").replace(/^["']|["']$/g, "");
  if (!arg) return null;
  let anchor = "";
  const hash = arg.indexOf("#");
  if (hash >= 0) { anchor = decodeURIComponent(arg.slice(hash + 1)); arg = arg.slice(0, hash); }
  arg = arg.split("?")[0];
  const file = arg.split("/").filter(Boolean).pop() || "";
  const stem = file.replace(/\.(html|qmd)$/i, "");
  if (!/^[\w.-]+$/.test(stem) || stem === "product-management" || stem === "byu-strategy.github.io") {
    return { stem: "", anchor };
  }
  return { stem, anchor };
}

function sectionList(doc, stem) {
  return doc.headings
    .filter((h) => h.level === 2)
    .map((h) => `- ${h.text}\n  /learn ${SITE}${stem}.html#${h.id}`)
    .join("\n");
}

async function listChapters(reason) {
  console.log(reason);
  try {
    const r = await get(RAW + "_quarto.yml");
    if (r.status !== 200) throw new Error(`HTTP ${r.status}`);
    const files = [...r.body.matchAll(CHAPTER_LINE)].map((m) => m[1]).filter((f) => !f.startsWith("00-") && Number(f.slice(0, 2)) <= 15);
    console.log("Chapters of the course book (paste one, or a section link from its page):");
    for (const f of files) {
      const [num, ...rest] = f.split("-");
      const words = rest.join(" ");
      console.log(`- ${num} ${words[0].toUpperCase()}${words.slice(1)}: ${SITE}${f}.html`);
    }
  } catch (e) {
    console.log(`(Could not load the chapter list: ${e.message}. The book is at ${SITE})`);
  }
}

// ---- Concepts ------------------------------------------------------------------------------
// The concept's name and plain definition, and the passages that teach it: from the map first,
// then from the concept tags in the chapter sources (::: {.concept data-c="DE02"}).

async function getJson(url) {
  try {
    const r = await get(url);
    return r.status === 200 ? JSON.parse(r.body) : null;
  } catch { return null; }
}

function taggedPassages(lines, id) {
  // [{start, end}] for each fenced div tagged with this concept id.
  const out = [];
  const re = new RegExp(`^\\s*(:{3,})\\s*\\{[^}]*\\.concept\\b[^}]*data-c="[^"]*\\b${id}\\b`);
  for (let i = 0; i < lines.length; i++) {
    const m = re.exec(lines[i]);
    if (!m) continue;
    const fence = m[1].length;
    let j = i + 1;
    for (; j < lines.length; j++) {
      const c = /^\s*(:{3,})\s*$/.exec(lines[j]);
      if (c && c[1].length === fence) break;
    }
    out.push({ start: i, end: j });
  }
  return out;
}

async function conceptInfo(id) {
  const info = { id, name: "", what: "", axis: "", passages: [], source: "" };
  const file = CONCEPT_FILES[id.slice(0, 2)];
  const list = file ? await getJson(`${RAW}scripts/grading/concepts/${file}.json`) : null;
  const c = list && (list.concepts || []).find((x) => x.id === id);
  if (c) { info.name = c.name || ""; info.what = c.what || ""; }
  if (list) info.axis = list.axis || "";
  const map = await getJson(`${RAW}scripts/grading/book-passages.json`);
  if (map && Array.isArray(map[id]) && map[id].length) {
    info.passages = map[id].map((p) => ({ stem: String(p.page || "").replace(/\.html$/, ""), anchor: p.anchor || "", section: p.section || "" }));
    info.source = "book-passages.json";
    return info;
  }
  // No map: look for the tag in each chapter's source.
  try {
    const r = await get(RAW + "_quarto.yml");
    if (r.status !== 200) return info;
    for (const m of r.body.matchAll(CHAPTER_LINE)) {
      const q = await get(`${RAW}${m[1]}.qmd`).catch(() => null);
      if (!q || q.status !== 200) continue;
      const doc = scan(q.body);
      for (const t of taggedPassages(doc.lines, id)) {
        const h = [...doc.headings].reverse().find((x) => x.line < t.start && x.level >= 2);
        if (h) info.passages.push({ stem: m[1], anchor: h.id, section: h.text });
      }
    }
    if (info.passages.length) info.source = "concept tags in the chapter sources";
  } catch { /* the caller reports that nothing was found */ }
  return info;
}

async function main() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const started = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const { concept: conceptId, page } = splitArg(process.argv.slice(2).join(" "));
  let concept = null;
  let raw = page;
  if (conceptId) {
    concept = await conceptInfo(conceptId);
    const named = parseArg(page);
    if (!(named && named.stem && named.anchor)) {
      // No section in the link: use the concept's first passage (on the linked page, if one was given).
      const pick = concept.passages.find((p) => !named || !named.stem || p.stem === named.stem) || concept.passages[0];
      if (!pick) {
        console.log(`LEARN-SECTION-ERROR: could not find a passage in the course book for concept ${conceptId}${concept.name ? ` (${concept.name})` : ""}. The concept id may be mistyped, or the book may be unreachable.`);
        await listChapters("Pick a section instead:");
        return;
      }
      raw = `${SITE}${pick.stem}.html#${pick.anchor}`;
    }
  }
  const parsed = parseArg(raw);
  if (!parsed) {
    await listChapters("LEARN-NEED-CHAPTER: no section link was given.");
    return;
  }
  if (!parsed.stem) {
    await listChapters(`LEARN-NEED-CHAPTER: "${raw.trim()}" does not name a chapter page of the course book.`);
    return;
  }

  const rawUrl = `${RAW}${parsed.stem}.qmd`;
  let res;
  try {
    res = await get(rawUrl);
  } catch (e) {
    console.log(`LEARN-SECTION-ERROR: could not reach GitHub to read ${parsed.stem}.qmd (${e.message}). Check the internet connection, or open ${SITE}${parsed.stem}.html in a browser.`);
    console.log(`Source tried: ${rawUrl}`);
    return;
  }
  if (res.status === 404) {
    await listChapters(`LEARN-SECTION-ERROR: there is no chapter called "${parsed.stem}" in the course book.`);
    return;
  }
  if (res.status !== 200) {
    console.log(`LEARN-SECTION-ERROR: GitHub answered HTTP ${res.status} for ${rawUrl}.`);
    return;
  }

  const doc = scan(res.body);
  const chapter = doc.title || parsed.stem;
  if (!parsed.anchor) {
    console.log(`LEARN-NEED-SECTION: the link names the chapter "${chapter}" but not a section.`);
    console.log(`Sections in this chapter:\n${sectionList(doc, parsed.stem)}`);
    return;
  }

  const want = parsed.anchor.toLowerCase();
  const h = doc.headings.find((x) => x.id.toLowerCase() === want);
  if (!h) {
    console.log(`LEARN-SECTION-ERROR: the chapter "${chapter}" has no section with the anchor #${parsed.anchor}. The section may have been renamed or moved.`);
    console.log(`Sections in this chapter:\n${sectionList(doc, parsed.stem)}`);
    return;
  }
  if (h.level !== 2) {
    const parent = [...doc.headings].reverse().find((x) => x.line < h.line && x.level === 2);
    console.log(`NOTE: #${h.id} is a subsection${parent ? ` of "${parent.text}"` : ""}; teaching it on its own.`);
  }

  const text = h.level === 2 ? sectionText(doc, h) : (() => {
    const next = doc.headings.find((x) => x.line > h.line && x.level <= h.level);
    return doc.lines.slice(h.line, next ? next.line : doc.lines.length).join("\n").trimEnd();
  })();

  console.log("LEARN-SECTION-OK");
  if (concept) {
    console.log(`Concept: ${concept.id}${concept.name ? ` ${concept.name}` : " (name not found)"}`);
    if (concept.what) console.log(`Concept means: ${concept.what}`);
    if (concept.axis) console.log(`Concept axis: ${concept.axis}`);
  }
  console.log(`Chapter: ${chapter}`);
  console.log(`Section: ${h.text}`);
  console.log(`URL: ${SITE}${parsed.stem}.html${concept ? `?c=${concept.id}` : ""}#${h.id}`);
  console.log(`Slug: ${h.id.replace(/\./g, "")}`);
  console.log(`Source: ${rawUrl}`);
  console.log(`Fetched: ${started} (local time on this computer)`);
  if (concept) {
    // The tagged passage(s) for this concept inside the section, word for word.
    const sectionEnd = h.line + text.split("\n").length;
    const tags = taggedPassages(doc.lines, concept.id).filter((t) => t.start >= h.line && t.start < sectionEnd);
    for (const t of tags) {
      console.log(`----- CONCEPT PASSAGE START (${concept.id}) -----`);
      console.log(doc.lines.slice(t.start + 1, t.end).join("\n").trim());
      console.log("----- CONCEPT PASSAGE END -----");
    }
    if (!tags.length) console.log(`NOTE: no passage in this section is tagged ${concept.id}; the whole section teaches it.`);
    const others = concept.passages.filter((p) => !(p.stem === parsed.stem && p.anchor.toLowerCase() === h.id.toLowerCase()));
    if (others.length) {
      console.log(`Other passages for ${concept.id}:`);
      for (const p of others) console.log(`- ${p.section || p.anchor}\n  /learn ${SITE}${p.stem}.html?c=${concept.id}#${p.anchor}`);
    }
  }
  console.log("----- SECTION TEXT START -----");
  console.log(text);
  console.log("----- SECTION TEXT END -----");
  await printPractice(parsed.stem, h.id);
}

// ---- Practice items for this section ------------------------------------------------------
// practice/version-a.json in the book repo is a public practice form, parallel to the midterm.
// Each item lists the book sections it draws on as "<chapter>.qmd#<anchor>". Print the items
// that cite this section, with any case they belong to. A missing file is not an error.

async function printPractice(stem, id) {
  let r;
  try { r = await get(RAW + "practice/version-a.json"); } catch { return; }
  if (r.status !== 200) return;
  let bank;
  try { bank = JSON.parse(r.body); } catch { return; }
  const key = `${stem}.qmd#${id}`.toLowerCase();
  const items = (bank.items || []).filter((it) =>
    (it.sections || []).some((s) => s.toLowerCase() === key));
  if (!items.length) return;
  const caseIds = new Set(items.map((it) => it.case_id).filter(Boolean));
  const listIds = new Set(items.map((it) => it.emi_list_id).filter(Boolean));
  const out = {
    cases: (bank.cases || []).filter((c) => caseIds.has(c.id)),
    option_lists: (bank.option_lists || []).filter((l) => listIds.has(l.id)),
    items,
  };
  console.log(`----- PRACTICE ITEMS START (${items.length}, Version A) -----`);
  console.log(JSON.stringify(out, null, 1));
  console.log("----- PRACTICE ITEMS END -----");
}

main().catch((e) => {
  console.log(`LEARN-SECTION-ERROR: the section fetcher failed unexpectedly (${e && e.message}).`);
});
