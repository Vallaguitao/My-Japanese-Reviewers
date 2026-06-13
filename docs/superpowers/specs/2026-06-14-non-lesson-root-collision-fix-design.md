# Non-Lesson `:root` Collision Fix

## Background

The "Lesson Presentation Asset Restructure" plan
(`docs/superpowers/plans/2026-06-12-lesson-asset-restructure.md`, Task 8,
commits `7f33725`/`f861bcf`) fixed a CSS cascade bug on all 61
`Lessons/*/Lesson_*.html` files: each page's inline
`<style>:root{...}</style>` block — defining custom properties like
`--primary`, `--accent`, `--bg-light` — was being overridden by
`assets/tokens.css`'s global `:root`, which aliases the same property names
to a fixed blue/teal/white palette and is loaded later (via
`assets/site-nav.css`'s `@import url("./tokens.css")`). Equal specificity,
later source order wins, so every lesson rendered the same flat blue/white
page instead of its own theme. The fix moved each lesson's `<style>:root{...}</style>`
block to load after the stylesheet `<link>` tags, so the page's own `:root`
wins.

During that investigation, a broader search found **13 more files** (outside
`Lessons/` and outside `index.html`) with the exact same collision shape: an
inline `:root` block defining one or more of `tokens.css`'s aliased
custom-property names (`--primary`, `--accent`, `--accent-start`,
`--accent-end`, `--bg-card`, `--text-primary`, `--text-muted`, `--border`,
`--success`, `--error`, `--warning`, `--shadow`, `--shadow-lg`, `--radius-lg`,
`--ink`, `--paper`, `--gold`, `--green`, `--red`, `--sakura-*`, etc.), loaded
*before* `tokens.css`/`site-nav.css`. This spec covers the fix for those 13
files.

`index.html` (the site's home page) was also found to have the same
collision (6 colliding names: `--ink`, `--paper`, `--red`, `--gold`,
`--green`, `--shadow`), but is **deferred to a separate follow-up** — it was
recently redesigned and warrants a closer look before changing its cascade.

## Root cause

Identical to the lesson bug: `:root` selectors have equal specificity
(0,1,0). With no `!important`, the `:root` block that appears later in the
final cascaded source order wins for any custom property both blocks define.
`assets/tokens.css`'s `:root` (loaded via `site-nav.css`'s `@import`, or
directly via a `<link>`) defines aliases for many common names. Each of the
13 affected pages defines its *own* `:root` with some of those same names,
but places that `<style>` block *before* the stylesheet `<link>` tags in
`<head>` — so `tokens.css`'s values win, and the page's intended palette is
silently replaced.

## Affected files (13)

Unlike the 61 lesson files (whose entire `<style>` block was *just* the
`:root` rule), each of these 13 files has **one large `<style>` block
(220-660 lines) containing the page's entire CSS**, with a single
`:root { ... }` rule near the top (the first rule, sometimes preceded by a
descriptive comment). `</style>` is immediately followed by the page's
stylesheet `<link>` tags. All 13 files are one directory level below the
project root, so all asset paths are `../assets/...`.

Two `<head>` shapes, both ending in `contrast-fixes.css` as the last
stylesheet link:

| Shape | Stylesheet `<link>`s (in order) | Files |
|---|---|---|
| 4-link | `tokens.css`, `components.css`, `site-nav.css`, `contrast-fixes.css` | `JLPT-Mock/N5-N4_Mock.html`, `JFT-Mock/Jimushitsu Set.html`, `JFT-Mock/Kawaii Set.html`, `JFT-Mock/Mix Set.html`, `JFT-Mock/Sarada Set.html`, `JFT-Mock/Shatsu Set.html`, `JFT-Mock/Soba Set.html`, `JFT-Mock/Tana Set.html` |
| 2-link | `site-nav.css`, `contrast-fixes.css` | `Quiz/Expressions-1_n4.html`, `Quiz/Expressions-2_n4.html`, `Quiz/N4-Book-2.html`, `Specialized-Lessons/Verb_Conjugation_Lesson.html`, `Kanji/Kanji_flashcard.html` |

Each file's single `:root { ... }` block has been verified to contain no
nested `{`/`}` (it's a flat list of custom-property declarations), so it can
be matched with a simple non-greedy regex: `r":root\s*\{[^}]*\}"`.

## Fix approach

For each of the 13 files:

1. Find the single `:root { ... }` block inside the page's `<style>` using
   `r":root\s*\{[^}]*\}"` (`re.DOTALL`).
2. Remove it from its current location inside `<style>`. Any descriptive
   comment that previously sat directly above it (e.g.
   `/* THEME — sakura (default). Swap this :root block to retheme. */`)
   stays behind — this is cosmetic only (a comment now sits above a different
   rule) and has no functional effect.
3. Insert a new block, `<style>\n:root {\n  ...\n}\n</style>\n`, immediately
   after the **last stylesheet `<link>`** in `<head>` — which is
   `contrast-fixes.css` for all 13 files, regardless of whether the head has
   the 2-link or 4-link shape.

After this change, the page's own `:root` is the last `:root` rule in the
cascaded source order, so its custom-property values win over
`tokens.css`'s aliases. The other 220-660 lines of each page's CSS (button,
card, layout rules, etc.) remain in their original `<style>` block at their
original position — their cascade order relative to `site-nav.css`,
`components.css`, and `contrast-fixes.css` is unchanged, keeping the blast
radius limited to `:root` custom-property resolution.

## Implementation

- New script `scripts/relocate_root_after_links.py`, generalizing the
  approach used in `scripts/reorder_lesson_style.py` (Task 8):
  - A shared `move_root_after_links(text)` function implementing the three
    steps above. It locates the last stylesheet `<link>` by matching all
    `r'<link rel="stylesheet" href="[^"]*">'` occurrences and using the last
    one — this works uniformly for both the 2-link and 4-link shapes without
    needing to special-case either.
  - Raises a clear error if a file has zero or more-than-one `:root` blocks,
    or zero stylesheet `<link>` tags.
  - `main()` iterates over an explicit list of the 13 file paths (not a glob
    — these files span multiple directories with two different head shapes,
    unlike the uniform `Lessons/*/Lesson_*.html` set).
- New test file `scripts/test_relocate_root_after_links.py` (TDD):
  - A fixture with the 2-link shape: `move_root_after_links` relocates
    `:root` to after the single `contrast-fixes.css` link.
  - A fixture with the 4-link shape: `move_root_after_links` relocates
    `:root` to after `contrast-fixes.css` (the last of the 4 links), not
    after the first link.
  - A fixture with no `:root` block: raises `ValueError`.
  - A fixture with no stylesheet `<link>`: raises `ValueError`.

## Verification

- **Structural**: after running the script, re-run the `:root`-matching
  regex on each of the 13 files — confirm exactly one `:root{...}` block
  remains, and that it appears after the file's last stylesheet `<link>`.
- **Content-preservation**: `git diff` for each file should show only the
  `:root` block moving — no lines added, removed, or otherwise changed
  besides the relocation (plus the new wrapping `<style>`/`</style>` tags and
  the blank line/whitespace left behind at the old location).
- **Manual/visual**: open one file from each distinct visual family directly
  via `file://` and confirm it now shows its own intended palette instead of
  `tokens.css`'s flat blue/teal default:
  - `Quiz/Expressions-1_n4.html` (dark "sakura" theme)
  - `Quiz/N4-Book-2.html` (pink "sakura" theme)
  - `Specialized-Lessons/Verb_Conjugation_Lesson.html` (emerald theme)
  - One `JFT-Mock/*.html` set (sakura palette)
  - `Kanji/Kanji_flashcard.html` (slate/blue theme)

## Out of scope

- `index.html` (the home page) — has the same collision (6 colliding custom
  properties: `--ink`, `--paper`, `--red`, `--gold`, `--green`, `--shadow`),
  but is deferred to a separate follow-up given its recent redesign and high
  visibility; it warrants closer review before changing its cascade.
- Any other site-wide WCAG/contrast audit work, as already noted out of scope
  in `docs/superpowers/specs/2026-06-12-lesson-asset-restructure-design.md`.
