---
name: eli5
description: Explain one idea like the builder is five, as a one-page HTML picture explainer with big shapes and very few words, saved under learning/eli5/ and opened in the browser. Use when the user types /eli5 <topic>, says "explain it like I'm five", "explain that simpler", "draw me a picture of how X works", or when the /learn skill offers a simpler picture of a building block.
argument-hint: "[the idea to explain, e.g. how a pull request works]"
---

# Explain it like I'm five

Make one web page that explains **one idea** to someone who knows nothing about it, with big
pictures and very few words. The picture carries the idea; the words only name things.

Idea: $ARGUMENTS

If no idea was given, ask for one in a single question and wait.

## Steps

1. **Find the one idea.** Write it as one plain sentence ("A pull request is a proposed change
   that waits for checks and a review before it joins main"). If the request holds two ideas,
   pick the one the builder needs now and say so.
2. **Make it theirs.** If you are inside the builder's repo, read `README.md` and the newest
   file in `sprints/` and use their product as the example (their app, their users, their data).
   Otherwise use one everyday example.
3. **Plan three to six panels,** each one small step. Each panel is a picture made of simple
   shapes, with a label of one to four words. Read left to right or top to bottom. Show the
   mechanism, the actual parts and what moves between them, never a box labeled with the
   idea's name.
4. **Build one self-contained HTML file** and save it as
   `learning/eli5/<short-idea-name>.html` (create the folder if needed):
   - Inline SVG for every picture; no external images, scripts, or fonts; no emoji.
   - A system font stack, large type (body 20px or more), plenty of white space, one accent
     color, works on a phone.
   - At most about 60 words on the whole page, not counting labels. No title larger than the
     pictures.
   - A short `alt`-style description in each SVG's `<title>` for screen readers.
   - At the bottom, two lines in small type: **Where this picture is simplified:** one
     sentence naming what the picture leaves out. **Say it back:** one question the builder
     answers in their own words.
5. **Open it.** On macOS run `open <file>`; on Windows (Git Bash) run `start <file>`. If
   neither works, print the file path.
6. **Check understanding.** Ask the "Say it back" question in the chat and wait. If the answer
   shows a wrong model, name it plainly and point at the panel that shows the right one.

## Rules

- **Simple, never wrong.** Leave details out; do not change how the thing works. If the
  everyday example is an analogy, it must be accurate, and the page says where it breaks.
- One idea per page. Make a second page for a second idea.
- Literal labels ("saves the row", "waits for review"), never cute ones.
- Do not commit the page unless the builder asks; it is a study aid. The `/learn` log records
  that it was used.

## Credit

Adapted from the `eli5` skill by Thariq Shihipar (Claude community plugins, MIT License).
See `LICENSE` in this folder.
