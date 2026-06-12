# Lesson Presentation Asset Restructure

## Background

The "Centralize lesson presentation assets" commit (5e58e5e) replaced each of
the 61 lesson HTML files' inline navigation `<script>` with:

```html
<script type="module" src="../../assets/lesson/lesson.js"></script>
```

and replaced each lesson's inline presentation `<style>` block with a link to
a shared `assets/lesson/lesson.css`.

## Root cause of the two reported bugs

Both reported symptoms trace back to the same cause: **browsers refuse to
fetch `type="module"` scripts from `file://` pages** (CORS error). When a
lesson HTML file is opened directly from disk, `lesson.js` never executes.

1. **Slide navigation is broken on all 61 lessons.** `nextSlide()` /
   `prevSlide()` are defined inside `lesson.js` and attached to `window`.
   If the script never runs, those functions don't exist, so the inline
   `onclick="nextSlide()"` / `onclick="prevSlide()"` handlers throw
   `ReferenceError`.

2. **Every lesson renders as a flat blue/white page instead of its own
   theme.** `lesson.js` also sets `document.body.dataset.mjrLesson` (e.g.
   `"n5-1"`). `lesson.css` is built as a ~440-line generic "Base structural
   layer" plus 61 per-lesson "Legacy-compatible overrides" blocks, each
   scoped to `body[data-mjr-lesson="n5-1"] ...`. Without JS setting that
   attribute, none of the 61 themed override blocks ever match. Every lesson
   falls back to the generic base layer plus `contrast-fixes.css`'s
   hardcoded blue (`#1d4ed8`) badge/button colors — hence the uniform
   "blue/white" look regardless of each lesson's intended color theme.

`lesson.js` is a self-contained IIFE (no `import`/`export`); it does not need
module semantics. Loading it as a regular script restores both navigation and
the lesson-specific CSS, since `data-mjr-lesson` would once again be set.

## Additional problem: lesson.css size

Independent of the bug above, `assets/lesson/lesson.css` is 1.3MB / 42,566
lines: the ~440-line base layer plus 61 full per-lesson override blocks
(~600-900 lines each), all concatenated into one file. Every lesson page
currently downloads styling for all 61 lessons, and the styling is wired to
all 61 lessons via a single runtime-set `data-mjr-lesson` attribute — a
fragile coupling (as this bug demonstrates).

## Goals

- Fix navigation on all 61 lesson pages.
- Restore each lesson's distinct visual theme.
- Shrink `lesson.css` to just the shared base layer; give each lesson its own
  small override file that is always loaded (no JS dependency for styling).
- Remove the `data-mjr-lesson` mechanism from `lesson.js` once nothing
  consumes it.

## Design

### 1. File layout

```
assets/lesson/
  lesson.css              ← shrinks from 42,566 → ~440 lines (shared base layer only)
  lesson.js                ← drops dead data-mjr-lesson code
  overrides/
    n5-1.css … n5-25.css
    n4b1-1.css … n4b1-18.css
    n4b2-1.css … n4b2-18.css   (61 files total)
```

Override filenames reuse the id scheme `lesson.js` already computes
(`n5-1`, `n4b1-12`, `n4b2-3`, ...), matching the existing
`/* Legacy-compatible overrides: <path> */` markers in `lesson.css` 1:1:

- `Lessons/N5-Lessons/Lesson_N.html` → `n5-N`
- `Lessons/N4-Lessons-Book-1/Lesson_N.html` → `n4b1-N`
- `Lessons/N4-Lessons-Book 2/Lesson_N.html` → `n4b2-N`

### 2. CSS extraction (lesson.css → overrides/*.css)

For each of the 61 `/* Legacy-compatible overrides: <path> */` blocks
(everything up to the next block marker or EOF):

- Write the block to `overrides/<id>.css`.
- Strip the `body[data-mjr-lesson="<id>"]` scoping from every selector in the
  block, including inside its `@media` blocks:
  - `body[data-mjr-lesson="n5-1"] .foo` → `.foo`
  - `body[data-mjr-lesson="n5-1"] *, ...*::before, ...*::after` →
    `*, *::before, *::after`
  - `body[data-mjr-lesson="n5-1"]` (selector targeting body itself) → `body`
  - `html:has(body[data-mjr-lesson="n5-1"])` → `html`

Each override file is loaded only on its own lesson page, so unscoped
selectors are safe — no cross-lesson leakage. Because the override file is
linked after `lesson.css` in `<head>`, equal-specificity rules (e.g.
`.progress-container` defined in both base layer and override) resolve in
favor of the override via source order, matching the pre-refactor behavior.

`lesson.css` is truncated to lines 1–443 (the base structural layer), with
its header comment updated to drop the now-inaccurate "Generated from..."
note.

### 3. HTML changes (61 lesson files)

For each lesson, two edits in `<head>`:

- `<script type="module" src="../../assets/lesson/lesson.js"></script>` →
  `<script src="../../assets/lesson/lesson.js"></script>` (fixes navigation)
- Insert `<link rel="stylesheet" href="../../assets/lesson/overrides/<id>.css">`
  immediately after the `lesson.css` link, before `site-nav.css`.

### 4. lesson.js cleanup

`data-mjr-lesson` becomes dead once nothing in CSS reads it. Remove
`LESSON_PATH_RE`, `normalizePath`, `lessonIdFromPath`, `applyLessonId`, and
the `applyLessonId()` call inside `updateSlide()`. The `MJRLessonOnRestart`
hook and the rest of the navigation API are untouched.

### 5. Verification

- Structural checks: brace-balance on `lesson.css` and all 61 new override
  files; confirm zero remaining `data-mjr-lesson` references anywhere in the
  repo.
- Sanity check: base layer (~440 lines) + sum of the 61 override files ≈ the
  original 42,566 lines.
- Manual check: open one lesson from each book (N5, N4B1, N4B2) via `file://`
  — confirm Next/Back navigation advances slides, and each lesson shows its
  own distinct color theme (not flat blue/white).

## Out of scope

A site-wide WCAG/contrast audit (covering Quiz/, Targeted-Quiz/, JFT-Mock/,
JLPT-Mock/, Vocabulary/, Kanji/, Specialized-Lessons/, etc. — e.g.
`Adjective_Conjugation.html`, `Counters_Quiz.html`) is a separate piece of
work with its own root causes and will be handled as its own
brainstorm/spec/plan after this one ships.
