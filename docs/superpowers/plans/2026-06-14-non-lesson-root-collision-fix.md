# Non-Lesson `:root` Collision Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the `tokens.css` `:root` cascade collision (same bug fixed for the 61 lesson files in Task 8 of `docs/superpowers/plans/2026-06-12-lesson-asset-restructure.md`) on the 13 remaining affected non-lesson pages, so each page's own color palette wins over `tokens.css`'s blue/teal defaults.

**Architecture:** A new script, `scripts/relocate_root_after_links.py`, extracts the single `:root { ... }` block from each page's big inline `<style>` block and reinserts it as a new `<style>:root{...}</style>` block immediately after the page's last `<link rel="stylesheet">` tag (always `contrast-fixes.css`). The rest of each page's CSS stays in place. The same `move_root_after_links(text)` function handles both the 2-link head shape (`site-nav.css`, `contrast-fixes.css`) and the 4-link shape (`tokens.css`, `components.css`, `site-nav.css`, `contrast-fixes.css`), since it always targets the *last* stylesheet `<link>` regardless of how many there are.

**Tech Stack:** Python 3 (stdlib `re`, `pathlib`), `unittest`.

**Reference spec:** `docs/superpowers/specs/2026-06-14-non-lesson-root-collision-fix-design.md`

---

### Task 1: Write and test `relocate_root_after_links.py`

**Files:**
- Create: `scripts/relocate_root_after_links.py`
- Test: `scripts/test_relocate_root_after_links.py`

- [ ] **Step 1: Write the failing tests**

Create `scripts/test_relocate_root_after_links.py`:

```python
import unittest

from relocate_root_after_links import move_root_after_links


class TestMoveRootAfterLinks(unittest.TestCase):
    def test_moves_root_after_last_link_two_link_head(self):
        text = (
            "<head>\n"
            "<style>\n"
            "  /* THEME comment */\n"
            "  :root {\n"
            "    --bg-card: #221d2e;\n"
            "    --accent-start: #e8b4c8;\n"
            "  }\n"
            "  .quiz { color: var(--accent-start); }\n"
            "</style>\n"
            '  <link rel="stylesheet" href="../assets/site-nav.css">\n'
            '  <link rel="stylesheet" href="../assets/contrast-fixes.css">\n'
            "</head>\n"
        )

        result = move_root_after_links(text)

        expected = (
            "<head>\n"
            "<style>\n"
            "  /* THEME comment */\n"
            "  \n"
            "  .quiz { color: var(--accent-start); }\n"
            "</style>\n"
            '  <link rel="stylesheet" href="../assets/site-nav.css">\n'
            '  <link rel="stylesheet" href="../assets/contrast-fixes.css">'
            "\n<style>\n"
            ":root {\n"
            "    --bg-card: #221d2e;\n"
            "    --accent-start: #e8b4c8;\n"
            "  }\n"
            "</style>\n"
            "</head>\n"
        )
        self.assertEqual(result, expected)

    def test_moves_root_after_last_link_four_link_head(self):
        text = (
            "<head>\n"
            "<style>\n"
            "  :root {\n"
            "    --accent: #8b5cf6;\n"
            "  }\n"
            "  .card { color: var(--accent); }\n"
            "</style>\n"
            '  <link rel="stylesheet" href="../assets/tokens.css">\n'
            '  <link rel="stylesheet" href="../assets/components.css">\n'
            '  <link rel="stylesheet" href="../assets/site-nav.css">\n'
            '  <link rel="stylesheet" href="../assets/contrast-fixes.css">\n'
            "</head>\n"
        )

        result = move_root_after_links(text)

        expected = (
            "<head>\n"
            "<style>\n"
            "  \n"
            "  .card { color: var(--accent); }\n"
            "</style>\n"
            '  <link rel="stylesheet" href="../assets/tokens.css">\n'
            '  <link rel="stylesheet" href="../assets/components.css">\n'
            '  <link rel="stylesheet" href="../assets/site-nav.css">\n'
            '  <link rel="stylesheet" href="../assets/contrast-fixes.css">'
            "\n<style>\n"
            ":root {\n"
            "    --accent: #8b5cf6;\n"
            "  }\n"
            "</style>\n"
            "</head>\n"
        )
        self.assertEqual(result, expected)

    def test_no_root_block_raises(self):
        text = (
            "<head>\n"
            "<style>\n"
            "  .card { color: red; }\n"
            "</style>\n"
            '  <link rel="stylesheet" href="../assets/contrast-fixes.css">\n'
            "</head>\n"
        )
        with self.assertRaises(ValueError):
            move_root_after_links(text)

    def test_multiple_root_blocks_raises(self):
        text = (
            "<head>\n"
            "<style>\n"
            "  :root { --accent: #8b5cf6; }\n"
            "  :root { --accent: #000000; }\n"
            "</style>\n"
            '  <link rel="stylesheet" href="../assets/contrast-fixes.css">\n'
            "</head>\n"
        )
        with self.assertRaises(ValueError):
            move_root_after_links(text)

    def test_no_stylesheet_link_raises(self):
        text = (
            "<head>\n"
            "<style>\n"
            "  :root { --accent: #8b5cf6; }\n"
            "  .card { color: var(--accent); }\n"
            "</style>\n"
            "</head>\n"
        )
        with self.assertRaises(ValueError):
            move_root_after_links(text)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python scripts/test_relocate_root_after_links.py -v`

Expected: fails immediately with `ModuleNotFoundError: No module named 'relocate_root_after_links'`.

- [ ] **Step 3: Write the implementation**

Create `scripts/relocate_root_after_links.py`:

```python
"""Relocate each page's :root block to load after its stylesheet links.

assets/tokens.css defines a global :root with aliases like --primary,
--accent, --bg-card, --ink, --paper, --gold, etc. (loaded via
site-nav.css's @import or directly via a <link>). Pages that define their
own :root with some of the same names, but place that <style> block before
their stylesheet <link> tags, have those names silently overridden --
equal :root specificity, later source order wins.

Each of the 13 files this script processes has one big inline <style>
block (the page's entire CSS) containing exactly one :root { ... } rule
near the top. This script extracts just that :root block and reinserts it
as a new <style>:root{...}</style> block immediately after the page's last
stylesheet <link> (always contrast-fixes.css), so the page's own :root
wins. The rest of the page's CSS stays in its original <style> block,
unchanged.
"""

import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

ROOT_RE = re.compile(r":root\s*\{[^}]*\}", re.DOTALL)
LINK_RE = re.compile(r'<link rel="stylesheet" href="[^"]*">')

FILES = [
    "JLPT-Mock/N5-N4_Mock.html",
    "JFT-Mock/Jimushitsu Set.html",
    "JFT-Mock/Kawaii Set.html",
    "JFT-Mock/Mix Set.html",
    "JFT-Mock/Sarada Set.html",
    "JFT-Mock/Shatsu Set.html",
    "JFT-Mock/Soba Set.html",
    "JFT-Mock/Tana Set.html",
    "Quiz/Expressions-1_n4.html",
    "Quiz/Expressions-2_n4.html",
    "Quiz/N4-Book-2.html",
    "Specialized-Lessons/Verb_Conjugation_Lesson.html",
    "Kanji/Kanji_flashcard.html",
]


def move_root_after_links(text):
    root_matches = list(ROOT_RE.finditer(text))
    if len(root_matches) != 1:
        raise ValueError(f"expected exactly one :root block, found {len(root_matches)}")
    root_match = root_matches[0]
    root_block = root_match.group(0)

    text_without_root = text[: root_match.start()] + text[root_match.end() :]

    link_matches = list(LINK_RE.finditer(text_without_root))
    if not link_matches:
        raise ValueError("expected at least one stylesheet <link>")
    last_link = link_matches[-1]

    insertion = f"\n<style>\n{root_block}\n</style>"
    return (
        text_without_root[: last_link.end()]
        + insertion
        + text_without_root[last_link.end() :]
    )


def main():
    if len(FILES) != 13:
        raise SystemExit(f"expected 13 files, found {len(FILES)}")

    for rel in FILES:
        path = REPO_ROOT / rel
        text = path.read_text(encoding="utf-8")
        path.write_text(move_root_after_links(text), encoding="utf-8")
        print(rel)


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python scripts/test_relocate_root_after_links.py -v`

Expected:
```
test_moves_root_after_last_link_four_link_head ... ok
test_moves_root_after_last_link_two_link_head ... ok
test_multiple_root_blocks_raises ... ok
test_no_root_block_raises ... ok
test_no_stylesheet_link_raises ... ok

----------------------------------------------------------------------
Ran 5 tests in 0.00Xs

OK
```

- [ ] **Step 5: Commit**

```bash
git add scripts/relocate_root_after_links.py scripts/test_relocate_root_after_links.py
git commit -m "Add script to relocate :root blocks after stylesheet links"
```

---

### Task 2: Apply the fix to all 13 files and verify

**Files:**
- Modify: `JLPT-Mock/N5-N4_Mock.html`
- Modify: `JFT-Mock/Jimushitsu Set.html`
- Modify: `JFT-Mock/Kawaii Set.html`
- Modify: `JFT-Mock/Mix Set.html`
- Modify: `JFT-Mock/Sarada Set.html`
- Modify: `JFT-Mock/Shatsu Set.html`
- Modify: `JFT-Mock/Soba Set.html`
- Modify: `JFT-Mock/Tana Set.html`
- Modify: `Quiz/Expressions-1_n4.html`
- Modify: `Quiz/Expressions-2_n4.html`
- Modify: `Quiz/N4-Book-2.html`
- Modify: `Specialized-Lessons/Verb_Conjugation_Lesson.html`
- Modify: `Kanji/Kanji_flashcard.html`

- [ ] **Step 1: Run the script**

Run: `python scripts/relocate_root_after_links.py`

Expected: prints each of the 13 relative paths, one per line, e.g.:
```
JLPT-Mock/N5-N4_Mock.html
JFT-Mock/Jimushitsu Set.html
JFT-Mock/Kawaii Set.html
JFT-Mock/Mix Set.html
JFT-Mock/Sarada Set.html
JFT-Mock/Shatsu Set.html
JFT-Mock/Soba Set.html
JFT-Mock/Tana Set.html
Quiz/Expressions-1_n4.html
Quiz/Expressions-2_n4.html
Quiz/N4-Book-2.html
Specialized-Lessons/Verb_Conjugation_Lesson.html
Kanji/Kanji_flashcard.html
```

- [ ] **Step 2: Verify each file has exactly one `:root` block, positioned after its last stylesheet link**

Run:
```bash
python3 - <<'EOF'
import re
from pathlib import Path

FILES = [
    "JLPT-Mock/N5-N4_Mock.html",
    "JFT-Mock/Jimushitsu Set.html",
    "JFT-Mock/Kawaii Set.html",
    "JFT-Mock/Mix Set.html",
    "JFT-Mock/Sarada Set.html",
    "JFT-Mock/Shatsu Set.html",
    "JFT-Mock/Soba Set.html",
    "JFT-Mock/Tana Set.html",
    "Quiz/Expressions-1_n4.html",
    "Quiz/Expressions-2_n4.html",
    "Quiz/N4-Book-2.html",
    "Specialized-Lessons/Verb_Conjugation_Lesson.html",
    "Kanji/Kanji_flashcard.html",
]

ROOT_RE = re.compile(r":root\s*\{[^}]*\}", re.DOTALL)
LINK_RE = re.compile(r'<link rel="stylesheet" href="[^"]*">')

for rel in FILES:
    text = Path(rel).read_text(encoding="utf-8")
    roots = list(ROOT_RE.finditer(text))
    links = list(LINK_RE.finditer(text))
    assert len(roots) == 1, f"{rel}: expected 1 :root block, found {len(roots)}"
    assert links, f"{rel}: no stylesheet <link> found"
    assert roots[0].start() > links[-1].end(), f"{rel}: :root is not after last stylesheet <link>"
    print(f"OK {rel}")
EOF
```

Expected: prints `OK <path>` for each of the 13 files, in the same order as `FILES`, with no `AssertionError`.

- [ ] **Step 3: Verify only the 13 expected files changed**

Run: `git status --porcelain`

Expected: exactly 13 lines, each ` M <path>` (modified), matching the 13 files listed in this task's **Files** section above — no other files changed.

- [ ] **Step 4: Spot-check that only the `:root` block moved**

Run: `git diff -- "Quiz/Expressions-1_n4.html"`

Expected: the diff shows the `:root { ... }` block (and its `--bg-base`, `--accent-start`, etc. lines) removed from inside the original `<style>` block, and the same block re-added (wrapped in a new `<style>...</style>`) immediately after the `contrast-fixes.css` `<link>` line. No other lines should be added, removed, or modified.

- [ ] **Step 5: Commit**

```bash
git add "JLPT-Mock/N5-N4_Mock.html" "JFT-Mock/Jimushitsu Set.html" "JFT-Mock/Kawaii Set.html" "JFT-Mock/Mix Set.html" "JFT-Mock/Sarada Set.html" "JFT-Mock/Shatsu Set.html" "JFT-Mock/Soba Set.html" "JFT-Mock/Tana Set.html" "Quiz/Expressions-1_n4.html" "Quiz/Expressions-2_n4.html" "Quiz/N4-Book-2.html" "Specialized-Lessons/Verb_Conjugation_Lesson.html" "Kanji/Kanji_flashcard.html"
git commit -m "Fix tokens.css :root collision on 13 non-lesson pages"
```

---

## Final Manual Check (after Task 2)

Open these 5 files directly via `file://` in a browser and confirm each shows its own intended palette (not `tokens.css`'s flat blue/teal default):

- `Quiz/Expressions-1_n4.html` — dark "sakura" theme (near-black background, pink accent)
- `Quiz/N4-Book-2.html` — pink "sakura" theme (cream background, pink accent)
- `Specialized-Lessons/Verb_Conjugation_Lesson.html` — emerald theme (green primary/accent)
- Any one `JFT-Mock/*.html` file — sakura palette
- `Kanji/Kanji_flashcard.html` — slate/blue theme

## Out of Scope

`index.html` (home page) — has the same collision (6 colliding names: `--ink`, `--paper`, `--red`, `--gold`, `--green`, `--shadow`) but is deferred to a separate follow-up, per `docs/superpowers/specs/2026-06-14-non-lesson-root-collision-fix-design.md`.
