# Sprint 2 Review

**Window:** 2026-11-06 to 2026-11-19
**Sessions reviewed:** 0 across 0 projects (Claude Code 0, Codex 0; 7 sessions excluded at your request)
**Not visible to this review:** Claude on the web or desktop (where PokéLift was built), work on another computer, and user testing.

## Work files and links

- **PokéLift repo:** https://github.com/EllaJane0/poke-lift. Public. Not shared with sdmurff as a collaborator, but anyone can read it. Created 2026-11-15. 11 commits in the window (dates in Mountain Time):
  - 2026-11-15: Add PokéLift workout tracker prototype
  - 2026-11-15: Add accounts and per-user cloud sync with Supabase
  - 2026-11-15: Use the lifting Pikachu art for the favicon and home-screen icons
  - 2026-11-15: Document both email templates and the redirect URL setting
  - 2026-11-15: Explain the email rate limit on the sign-in screen
  - 2026-11-15: Level by pounds lifted: 20,000 lb = 1 level at any level
  - 2026-11-16: Walking encounters, streak tiers, PR-boosted shinies, iPhone step sync
  - 2026-11-16: Drop the unused egg-steps setting from new accounts
  - 2026-11-16: Clarify key vs value in the Shortcut setup steps
  - 2026-11-16: Fix ambiguous column in pokelift_report_steps
  - 2026-11-17: Encounters every 10,000 cumulative steps at 50/30/20 odds
- **Live:** https://poke-lift.vercel.app (responds, checked 2026-11-19).
- **Course repo:** https://github.com/EllaJane0/sprint_plan. Public, shared with sdmurff. 1 commit in the window: 2026-11-06 "Sprint 2 plan". `README.md` and `CLAUDE.md` have uncommitted edits.
- **Claude artifact:** https://claude.ai/artifact/AK7fviXevqm4sUfbNWr7vF, last updated 2026-11-18, set to private.
- The README's **Work files and links** section does not list the poke-lift repo or the live URL. It lists `agentic_experiments`, which is empty, and its **Live** line says "nothing yet".

## When you worked

- **Commits:** on 3 of the 14 days: Nov 15 (6 commits), Nov 16 (4) and Nov 17 (1). All were in the evening.
- **Before Nov 15:** the only commit was the plan on Nov 6. Any work in claude.ai before Nov 15 is not visible.
- **Work in claude.ai:** the artifact was last updated Nov 18. These chats are not visible, so the days and hours can't be counted.

## Where you got stuck

The chats where the app was built are not visible. The commit messages show three fix-ups that came right after setup work:
- **Sign-in email:** the email templates and redirect URL setting were documented, then the email rate limit was explained on the sign-in screen. Both commits came on Nov 15, after Supabase accounts were added.
- **iPhone step sync:** the Shortcut instructions were clarified (key vs value) on Nov 16, after step sync went in.
- **Database:** an ambiguous column in the `pokelift_report_steps` database function was fixed on Nov 16.

All three are done in the repo. This review can't see how long each took.

## What took the most time

This review cannot measure session time or prompt volume. By commit count:
- **Setup and integration: 6 of 11 commits.** This covers accounts and cloud sync, email setup, step sync and the database fix.
- **Game mechanics: 3 commits.** This covers leveling by pounds lifted, encounters and shinies.

Commit count does not show how long each one took.

## Builder tools you used

| Building block | What it is | What you used this sprint |
|---|---|---|
| Skills you wrote | Your own reusable instructions for Claude | Not visible |
| Course skills | sprint-plan, sprint-review, sprint-coach, learn, eli5 | sprint-review (this session) |
| Plugins | Bundled add-ons | Not visible |
| Slash commands | Typed shortcuts | Not visible |
| Hooks | Scripts that run automatically on events | Not visible |
| Subagents | Named: from `.claude/agents`, a plugin, or you. Built-in: ones Claude starts itself, such as Explore | Not visible |
| Messages to other sessions | Sending work to another Claude session | Not visible |
| Plan mode | Planning before editing | Not visible |
| Permission mode | How edits and commands get approved | Not visible |
| Permission prompts and denials | Approvals and blocks during sessions | Not visible |
| Where sessions ran | Claude Code, desktop app, VS Code, claude.ai | claude.ai on the web or desktop, and another computer (from what you reported) |
| Worktrees | Separate working copies | Not visible |
| Memory and instructions | CLAUDE.md, MEMORY.md | `CLAUDE.md` in the course repo was edited but not committed |
| Reaching outside the repo | CLIs, MCP servers and connectors, direct API calls | Supabase (accounts and database) and Vercel (hosting), from the repo and the live URL. How you reached them is not visible. |

No Claude Code or Codex sessions were confirmed for this sprint, so the scan has nothing to count.

Scan version: sprint_scan 2026-10-16.

## Users this sprint

You reported user testing. None of the commit messages names a user or a ticket, so there are no instances to list. Your retro answer to question 2 is the record.

## Learning sessions

None were logged this sprint. You studied no axis. The sprint's work advanced Application Architecture.

## Axis

**Application Architecture.** Six of the 11 commits are about accounts, cloud sync, the database, iPhone step sync and deployment. The rest is game mechanics and interface (Design). Time per area is not visible, so this split is by commit count only.

## Plan compared with the work

**Goal was:** PokéLift will be a usable web app for desktop and mobile: a basic version of the workout tracker with the calendar copy-and-paste function, plus an XP tracking feature with one character (it may not even be a Pokémon). The Pokémon aspect is a future build: no gym battles and no leveling for 151 Pokémon. I may add the step count feature, but probably not.

**Build for my own product: PokéLift, engineering (a basic workout tracker web app):**
- **Matches the plan:** the workout tracker, calendar copy and paste, and XP tracking are built. The app is at a live URL (https://poke-lift.vercel.app) and in a repo, as "done" required.
- **Goes past the plan:** the build also has accounts and cloud sync, step tracking with iPhone sync, walking encounters, and leveling and shinies across many creatures. The Claude artifact also has gym battles. The plan named Pokémon features and step count as future work or "probably not". The plan file has no **Changes:** note.
- **Not checked:** the Loom demo.

---

## Your sprint retrospective

**Did you hit the goal?** Yes! Built a working app that my husband is now using at the gym and super excited about. I also did a bunch of development work at indigo, but on the company claude, so the information isn't on here. That work included building a resume rewrite feature with Claude API, rerouting all of our backend flow, transferring supabase accounts, cost analysis for our netlify subscription, in depth security reviews and changes, as well as basic user flow redesign with more to come. I also routed everything through Github, set up VS Code and github branches with 5 employees and approved 8 PRs from other staff

**What did the client or your users say?** Indigo is thrilled with the new backend and to have a lot of things cleaned up. My husband, [my husband] has never been so excited to work out, and has shared the app with many friends

**What did the report show you?** I was surprised that the pokelift app was built in 3 days looking back, because it felt longer, mostly bc the pre build work was heavier

**If the plan changed, why?** The initial sprint plan includes less about indigo because two weeks ago, the cofounder was protecting her code, and not letting anyone else push to it, or me help her edit it. She came into town last week, and I was able to work nearly 20 hours with her and the staff to help them build a lot of cool things

**Actual difficulty:** 3 - had to learn how to use netlify, and more about security, and work with someone else's codebase, which is always a little challenging

**What will you change next sprint?** It is sometimes difficult to plan because indigo needs come up daily, but I want to be better at scheduling items
