# [Your product, or your part of it]

> One sentence: what this is and who it is for.

**Where to see it:** [URL, or where the work lives: a live app, a published page, a model in this repo]
**Built by:** [your name], MSB 341 Product Management, BYU

## Context

Fill this in during Sprint 1 and keep it current. Every sprint is read against it.

- **My role:** [the hats you wear, and what you own. Most roles combine several: product,
  engineering, design, go-to-market, pricing, analytics, operations. A solo builder wears most
  of them]
- **What I am working on:** [your product, or your part of a team's product. "Not decided" is
  fine early on; list the options you are weighing]
- **Who it is for:** [the customer or segment the work ultimately serves]
- **Who uses my work:** [the specific person who will use what you make, and how you reach
  them. On a team this can be your teammates: engineers using your specs, sales using your
  pricing]

If your situation changes, revise this and note what changed. That is normal; a silent
mismatch between this file and your work is not.

## Where the work lives

Everything someone would need to check your output. List each place on its own line.

- **Repos:** [this repo, and any other repo your work happens in. Share it with `sdmurff` if you
  can. A company repo you cannot share is fine: say so here, and
  `/sprint-review` will summarize its commits (dates and messages, never code)]
- **Live:** [the app, page, store listing, or file someone else can open]

## What is in this repo

| Folder | What lives here |
|---|---|
| `sprints/` | One plan and one review per sprint |
| `discovery/` | Interviews, personas, what you learned about your user |
| `design/` | Flows, screens, usability test notes |
| `product/` | The work itself: code, a pricing model, a copy deck, an automation |
| `specs/` | One spec per piece of work, written before you make it |
| `gtm/` | Launch, channels, copy, experiments |
| `metrics/` | What you measure and what it says |
| `decisions/` | Numbered records of what you decided and why |
| `learning/` | One log per `/learn` session: what you explained, what you missed, what you still wonder |

Not everyone in this course writes software. An interview, a pricing model, a landing page
draft, and a usability finding are all artifacts, and they get committed like anything else.
Use the folders that fit your role and ignore the rest.

If you build an AI feature, put its eval set in `product/evals/`. A test set is how you know
whether a change to a prompt helped or hurt.

## Running it

[If your work includes code: how to run it locally. Delete this section if it does not.]

## Sprints

Each sprint:

```bash
/sprint-plan     # start of the sprint: commit the plan, submit it on Canvas by Wednesday
# ...do the work...
/sprint-review   # on or before the Monday the sprint ends: writes the report, asks your five retro questions, then commit
# when your sprint report arrives: press Copy prompt in it and paste the prompt into Claude Code;
# the sprint-coach skill goes over the report with you and updates your next plan
```

## Learning a section

Sections of the [course book](https://byu-strategy.github.io/product-management/) that teach a
model have a **Learn in Claude** button beside their heading. It copies a prompt; paste it into
Claude Code for a tutoring session on that section. Bring your own questions, or let Claude lead,
and say "quick" or "go deeper" whenever you like. It ends with a short check and commits a log to
`learning/`.

When an idea will not click in words, type `/eli5 <the idea>` (or say "explain it like I'm
five"). Claude draws a one-page picture of it with very few words and gives you a link to open
it (or, if it cannot make a link, saves it under `learning/eli5/` and tells you where). `/learn`
offers this on its own when you get stuck.

### Get /learn in an existing repo

If you made your repo before `/learn` existed, run this once from your repo's folder, in the
VS Code terminal (Git Bash on Windows). It copies the skill, the log template, `/eli5`, and the updated
`/sprint-review`, which lists your learning sessions:

```bash
B=https://raw.githubusercontent.com/byu-strategy/builder-template/main; for f in .claude/skills/learn/SKILL.md .claude/skills/learn/scripts/fetch_section.mjs .claude/skills/eli5/SKILL.md .claude/skills/eli5/LICENSE learning/000-learning-template.md .claude/skills/sprint-review/SKILL.md .claude/skills/sprint-review/scripts/sprint_scan.py; do curl -fsSL --create-dirs -o "$f" "$B/$f" || echo "Could not download $f"; done
```

Then commit the new files (`git add .claude learning && git commit -m "Add /learn"`) and start
a new Claude Code session so it picks up the skill.

## Ground rules

- **Spec before work.** For anything non-trivial, the spec's commit should predate the
  work's commits.
- **Decisions get recorded.** When you make a real choice, write it in `decisions/` with the
  alternatives you rejected.
- **No real customer contact details anywhere in this repo.** Anonymize people in interview
  notes: "dental office manager, Provo" rather than a name and an email.
- **Keep `CLAUDE.md` current.** It is what your agent knows about your work. Stale context
  produces bad output.
