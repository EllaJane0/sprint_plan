# Sprint Plan: AI Foundry

Follow `SKILL.md`, with these differences, when `course.json` at the repo root says
`"course": "ai-foundry"`. The rules students read are at
https://byu-strategy.github.io/ai-foundry/students/11-sprints.html, and the shared model is
`.claude/sprint-model.md` in this repo. If this file and the page ever disagree, the page wins;
say so to the builder.

## Dates

The plan is due **the Monday after the sprint starts, at 11:59 PM**, not Wednesday.

| Sprint | Starts | Plan due | Wrap-up due |
|---|---|---|---|
| 1 | Fri, Oct 23, 2026 | Mon, Oct 26, 11:59 PM | Fri, Nov 6, 8:00 AM |
| 2 | Fri, Nov 6 | Mon, Nov 9, 11:59 PM | Fri, Nov 20, 8:00 AM |
| 3 | Fri, Nov 20 | Mon, Nov 23, 11:59 PM | Fri, Dec 4, 8:00 AM |

## Context (step 2)

Read the README as usual. A Foundry builder's README may still say MSB 341 on the **Built by**
line; on the first run, change that line to "AI Foundry, BYU" and include `README.md` in the
commit. If the Context section is blank, ask what they are working on this sprint and whether
they are staffed on a client engagement before the goal, and offer to fill in the Context
section with their answers.

## The menu comes first (step 3)

Before the goal, ask: "Are you staffed on a client engagement this sprint?"

- **Staffed:** their first item is **Build for that client**. Ask which client and which part of
  the engagement they own. Then ask: "Are you also working on anything else this sprint, such
  as a Claude course?"
- **Not staffed:** ask what they will do from the menu, one or two items:
  - **Build** for the Foundry (internal tools, business development with a prospective client, a
    customer story, recruiting) or for their own product (a studio project).
  - **Learn**: a Claude course on the Anthropic Academy, or chapters of the Product Management
    book.

Build is any part of the value chain: discovery, design, engineering, go-to-market, pricing,
sales and outreach, analytics, operations. Never steer a builder toward code.

Then interview for these fields, one at a time, in this order: Teammates, Goal, My part (skip it
for Solo), Who will see it, Why this, Done looks like, Predicted difficulty.

- **Who will see it.** For each Build item: a client, user, or teammate, other than the builder
  and Professor Murff, who will use or see the work, and what they will see.
- **Done looks like.** For a Learn item it must name the proof:
  - a Claude course: the certificate of completion, plus the thing the course teaches, built and
    used in real work (for example a Skill used on the client repo, an MCP server on the studio
    project's data, an evaluation harness);
  - Product Management book chapters: which chapters, the `/learn` logs for them, and a Builder
    practice exam result.

## Checks (step 4), in addition to the usual ones

- **Staffed, but no client item.** Say once that staffed students build for their client first,
  then accept their answer.
- **Nobody named.** A Build item with no one named under Who will see it.
- **Learn with no proof.** A Learn item whose Done looks like names no certificate and
  deliverable, or no logs and practice exam.
- **Learn-only and too small.** A Learn-only sprint is allowed, with no limit, but it has to fill
  two weeks. One course takes a few hours; ask what else they will learn in the sprint.
- **My part is the team's goal.** On a team, if My part repeats the Goal, ask which part is
  theirs.

## The file (step 5)

```markdown
# Sprint N Plan

**Menu:** <each item: "Build for <client name | the Foundry | my own product: name>,
<part of the value chain>" or "Learn: <course or chapters>">

**Teammates:** ...

**Goal:** ...

**My part:** ...

**Who will see it:** ...

**Why this:** ...

**Done looks like:** ...

**Predicted difficulty:** N
```

Client names may appear; never put client data, figures, or anything confidential in the plan.

## Commit and submit (step 6)

On the first run, include `course.json` (and `README.md` if you edited it):

```bash
git add course.json README.md sprints/sprint-N-plan.md && git commit -m "Sprint N plan" && git push
```

Then tell them to paste the file's GitHub link into **Sprint N Plan** on Canvas by **Monday,
11:59 PM**.

## What output means

Use this table in place of the one in `SKILL.md`.

| If the work is | Output means |
|---|---|
| A feature or deployed change | It works, in a repo or deployed, and the demo shows it working |
| An agent, automation, or integration | It runs, and the demo shows it running |
| Design | The interface or the designs exist |
| Discovery or research | The findings are written up, with what was concluded |
| A client deliverable (memo, deck, plan) | The deliverable, and the decision it asks the client to make |
| A landing page or campaign | Built, published or ready to publish |
| Pricing or financial modeling | The model exists and runs on real numbers |
| Marketing or sales copy | The copy is finished |
| Selling, outreach, or business development | The asks are made and on record: who, when, what, and the answer |
| Analytics or measurement | The tracking returns real data |
