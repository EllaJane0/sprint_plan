# The sprint model

One sprint model for every course that uses this template: MSB 341 Product Management, AI Foundry
(MBA 693R / STRAT 490R), and from Winter 2027 STRAT 477R internships. The parts below marked
**fixed** are the same in every course. The parts marked **per course** are set in each course's
settings (`course.json`) and its published sprints page. `/sprint-plan` and `/sprint-review`
implement this file; when it changes, they change in the same commit.

Agreed with Scott Murff, 2026-10-22.

## Fixed: the sprint

- A sprint is a fixed two weeks. Its dates do not follow any project's phases.
- Every enrolled student runs every sprint, whatever their staffing or placement.
- Four deliverables every sprint: **Plan**, **Output**, **Review**, **Demo**.
- The plan is graded for completion. Predicted difficulty is never graded.
- Plans change. A change is made by running `/sprint-plan` again, which adds a dated note saying
  what changed and why. Output is read against the plan as it stands at the end.
- Canvas applies late penalties. Graders never deduct for lateness.
- A grading rule costs points only if it was published before the sprint started. The course
  page and the grader rubric change together.

## Fixed: the menu

Each sprint plan holds **one or two items**. There are two kinds.

| Item | What it is |
|---|---|
| **Build** | Real work on any part of the value chain: discovery, design, engineering, go-to-market, pricing, sales and outreach, analytics, operations |
| **Learn** | Structured study (a course or book chapters) that ends in proof the student can use it |

A Build item and a Learn item can share a sprint, for example "Build for the client, go-to-market"
plus "Learn: Claude Code in Action, with a Skill used on the client repo." Two Builds can share a
sprint when the student works on two things.

### Build: who it's for

Every Build item names who the work is for. Client work and non-client work are the same activity;
this field records the difference.

| Who it's for | Arrangement | Who sets the goal | Who gives the outside signal | Confidentiality |
|---|---|---|---|---|
| **Client, project** | A scoped, time-boxed engagement (fee-for-service or unfunded), staffed by the program | The team, with the client | The client contact | The engagement's terms |
| **Client, embedded** | The student works inside a company, paid or unpaid, on what the company assigns | The company | The supervisor | The company's terms |
| **The organization** | Work on the program itself: internal tools, business development, a customer story, recruiting | The student, with faculty or a program leader | Faculty or the program leader | None beyond normal care |
| **Own product** | A product or venture the student (or their team) owns | The student | Its users | The student's choice |

Every Build plan names at least one person, other than the student and faculty, who will use or
see the work.

### Build: what counts as output

One rule for every Build item, whoever it is for. Output is real, finished for this sprint, and
checkable by the course. It does not have to be public, launched, or used by anyone yet. Any digital
artifact that reflects real work counts, in whatever form the work takes.

| If the work was | Output means |
|---|---|
| A product feature or deployed change | It works, in a repo or deployed, and the demo shows it working |
| Design | The interface or the designs exist |
| Discovery or research | The findings are written up, with what was concluded |
| A landing page or campaign | The page or campaign is built, published or ready to publish |
| Pricing or financial modeling | The model exists and runs on real numbers |
| Marketing or sales copy | The copy is finished |
| Selling, outreach, or recruiting partners | The asks are made and on record |
| An automation, agent, or integration | It runs, and the demo shows it running |
| Analytics or measurement | The tracking returns real data |
| A client deliverable (memo, deck, plan) | The deliverable, and the decision it asks for |

- **Difficulty.** From Sprint 2 on, output is weighed by how hard the work was for the student,
  judged from the work itself.
- **Goals that need someone else's yes** (a sign-off, a signup, a payer) are graded on the asks
  made and on record: who, when, what was asked, and the answer.
- **Waiting on a client or company** counts when the student records what they were waiting on,
  when they asked, and what they did meanwhile.
- **Confidential work.** A company or client repo is never required to be shared. The student can
  share it with faculty, leave it unshared and let `/sprint-review` summarize its commits locally
  (dates, messages, file names, never code), show the result instead, or build a version on sample
  data. Nothing has to be public.

### Learn: what counts as output

Studying alone produces nothing to check, so every Learn item ends in proof. The course sets which
sources are on its menu.

| Source | Proof |
|---|---|
| A Claude course (Anthropic Academy) | The certificate of completion, plus the thing the course teaches, built and used in real work (a Skill and hooks, an MCP server, an evaluation harness) |
| Product Management book chapters | `/learn` logs for the chapters, plus a Builder practice exam result |

## Fixed: the review

`/sprint-review` writes a report from the projects the student confirms (when they worked, where
they got stuck and how they got unstuck, what took the most time, which Builder axes advanced),
then asks six retro questions and saves the answers word for word:

1. Did you hit the goal? Yes, partly, or no, and why.
2. What did the client, your supervisor, or your users say or do about the work?
3. What did the report show you that you did not expect?
4. If the plan changed, why?
5. Actual difficulty, 1 to 5, and why it differed from what you predicted.
6. What will you change next sprint?

Question 2 is the outside signal. For a Learn-only sprint, it asks who the student showed the
work to.

## Fixed: the demo

2 to 3 minutes on Loom of the work, working, with real content. Loom only. Shared as "Anyone with
the link" or with the instructor. For client or company work whose terms do not allow recording,
the demo uses sample data and says so at the start. For Learn, the demo shows the built deliverable
running, or a teach-back of one concept applied to the student's own work.

## Per course

| Setting | MSB 341, Fall 2026 | AI Foundry, Fall 2026 | STRAT 477R, Winter 2027 |
|---|---|---|---|
| Canvas | 36977 | 37925 | to set |
| Student repo | `<netid>_msb341` | `<netid>_foundry` | to set |
| Sprints | 6 | 3 (Oct 23 to Dec 4) | to set |
| Points per sprint | Plan 10, Output 20, Review 10, Demo 10 (Sprint 6: 10/50/20/20) | 120: Plan 10, Output 60, Review 25, Demo 25 | to set |
| Plan due / Wrap-up due | First Wednesday / the Monday it ends | The Monday after it starts, 11:59 PM / the Friday it ends, 8:00 AM | to set |
| Who it's for, allowed | Own product; client, embedded | Client, project; the organization; own product | Client, embedded |
| Priority rule | None | Staffed students' Build is for their client first | The placement first |
| Learn sources | Book chapters (through the course itself) | Claude courses; Product Management book with the practice exam | to set |
| Learn-only sprint | n/a | Allowed, no limit, when it covers two weeks of real learning, each item with its proof | to set |
| Feedback report | HTML attached on Canvas | The Builder tab in the Foundry app | to set |

**MSB 341 keeps its published Fall 2026 rules.** It already runs this model with Build only; the
menu framing and the six-question retro apply from its next offering, published before it starts.

## Open

- The outside signal for embedded and some client work: whether the supervisor or client confirms
  each sprint review (Breckenridge now; every 477R placement in winter).
- Whether colleagues rate Builder axes, and whether sprint evidence counts toward Consultant
  points or only informs them (AI Foundry developmentship, fall round).
