# Lesson Asset Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix slide navigation and per-lesson theming on all 61 lesson pages by dropping `type="module"` from `assets/lesson/lesson.js`, and split the 42,566-line `assets/lesson/lesson.css` into a small shared base layer plus 61 per-lesson override files.

**Architecture:** Two small Python scripts under `scripts/` perform the one-time restructuring: `split_lesson_css.py` splits `lesson.css` into a base layer + `assets/lesson/overrides/<id>.css` files (unscoping the `body[data-mjr-lesson="<id>"]` selectors), and `update_lesson_html.py` edits all 61 lesson HTML files to drop `type="module"` and link the new override stylesheet. A shared `lesson_ids.py` module provides the lesson-id mapping both scripts need. `lesson.js` then has its now-dead `data-mjr-lesson` code removed.

**Tech Stack:** Python 3 (stdlib only — `re`, `pathlib`, `unittest`), Node.js (for `node --check` syntax validation of `lesson.js`).

**Spec:** `docs/superpowers/specs/2026-06-12-lesson-asset-restructure-design.md`

---

## Reference facts (verified against the current repo)

- `assets/lesson/lesson.css` is 42,566 lines. Lines 1–442 are the shared "Base structural layer" (ends with a `}` closing a `@media (max-width: 480px)` block on line 442, then a blank line 443).
- Line 1 is exactly: `/* Shared lesson presentation styles. Generated from the migrated lesson HTML in Phase 1. */`
- Starting at line 444, there are exactly 61 blocks, each beginning with a line matching `/* Legacy-compatible overrides: <path> */`, e.g. `/* Legacy-compatible overrides: Lessons/N5-Lessons/Lesson_1.html */`.
- Every one of the 9,128 occurrences of `data-mjr-lesson` in `lesson.css` is on a selector line that ends with `{`, in one of these exact forms (where `<id>` is e.g. `n5-1`, `n4b1-12`, `n4b2-3`):
  - `body[data-mjr-lesson="<id>"] <descendant-selector> {` (possibly multiple comma-separated)
  - `body[data-mjr-lesson="<id>"] {` (bare)
  - `html:has(body[data-mjr-lesson="<id>"]) {`
- The lesson-id scheme (already used by `lesson.js`'s `lessonIdFromPath`):
  - `Lessons/N5-Lessons/Lesson_N.html` → `n5-N`
  - `Lessons/N4-Lessons-Book-1/Lesson_N.html` → `n4b1-N`
  - `Lessons/N4-Lessons-Book 2/Lesson_N.html` → `n4b2-N`
- All 61 lesson HTML files contain exactly these two lines, verbatim, with 2-space indentation:
  ```
    <link rel="stylesheet" href="../../assets/lesson/lesson.css">
  ```
  ```
    <script type="module" src="../../assets/lesson/lesson.js"></script>
  ```
- `data-mjr-lesson` / `lessonIdFromPath` / `applyLessonId` / `normalizePath` / `LESSON_PATH_RE` in `assets/lesson/lesson.js` are only used by each other — nothing else in the repo reads `data-mjr-lesson` or calls these functions. `window.MJRLesson` (the public API object) and `window.MJRLessonOnRestart` (a per-lesson hook some lessons define) are separate and must be kept.

---

### Task 1: Shared lesson-id mapping module

**Files:**
- Create: `scripts/lesson_ids.py`
- Create: `scripts/test_lesson_ids.py`

- [ ] **Step 1: Write the failing test**

Create `scripts/test_lesson_ids.py`:

```python
import unittest

from lesson_ids import lesson_id_from_path


class TestLessonIdFromPath(unittest.TestCase):
    def test_n5(self):
        self.assertEqual(lesson_id_from_path("Lessons/N5-Lessons/Lesson_1.html"), "n5-1")

    def test_n4b1(self):
        self.assertEqual(lesson_id_from_path("Lessons/N4-Lessons-Book-1/Lesson_12.html"), "n4b1-12")

    def test_n4b2(self):
        self.assertEqual(lesson_id_from_path("Lessons/N4-Lessons-Book 2/Lesson_3.html"), "n4b2-3")

    def test_unrecognized(self):
        with self.assertRaises(ValueError):
            lesson_id_from_path("Lessons/Unknown/Lesson_1.html")


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python scripts/test_lesson_ids.py -v`
Expected: FAIL/ERROR — `ModuleNotFoundError: No module named 'lesson_ids'`

- [ ] **Step 3: Write the implementation**

Create `scripts/lesson_ids.py`:

```python
"""Shared lesson-id mapping for the lesson asset restructure scripts.

Maps lesson HTML paths to the short ids already used by
assets/lesson/lesson.js (lessonIdFromPath) and by the data-mjr-lesson
values in assets/lesson/lesson.css, e.g.
Lessons/N5-Lessons/Lesson_1.html -> "n5-1".
"""

import re

FOLDER_MAP = {
    "N5-Lessons": "n5",
    "N4-Lessons-Book-1": "n4b1",
    "N4-Lessons-Book 2": "n4b2",
}

PATH_RE = re.compile(
    r"Lessons/(N5-Lessons|N4-Lessons-Book-1|N4-Lessons-Book 2)/Lesson_(\d+)\.html$"
)


def lesson_id_from_path(path):
    match = PATH_RE.search(path.replace("\\", "/"))
    if not match:
        raise ValueError(f"Unrecognized lesson path: {path!r}")
    folder, num = match.group(1), match.group(2)
    return f"{FOLDER_MAP[folder]}-{int(num)}"
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python scripts/test_lesson_ids.py -v`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/lesson_ids.py scripts/test_lesson_ids.py
git commit -m "Add shared lesson-id mapping module"
```

---

### Task 2: CSS selector-unscoping + splitter script

**Files:**
- Create: `scripts/split_lesson_css.py`
- Create: `scripts/test_split_lesson_css.py`

- [ ] **Step 1: Write the failing test**

Create `scripts/test_split_lesson_css.py`:

```python
import unittest

from split_lesson_css import split, unscope_block, unscope_selector


class TestUnscopeSelector(unittest.TestCase):
    def test_descendant_class(self):
        self.assertEqual(
            unscope_selector('body[data-mjr-lesson="n5-1"] .progress-container', "n5-1"),
            ".progress-container",
        )

    def test_body_alone(self):
        self.assertEqual(unscope_selector('body[data-mjr-lesson="n5-1"]', "n5-1"), "body")

    def test_html_has(self):
        self.assertEqual(
            unscope_selector('html:has(body[data-mjr-lesson="n5-1"])', "n5-1"), "html"
        )

    def test_nested_descendant(self):
        self.assertEqual(
            unscope_selector('body[data-mjr-lesson="n5-1"] .title-slide .book-badge', "n5-1"),
            ".title-slide .book-badge",
        )

    def test_pseudo_class(self):
        self.assertEqual(
            unscope_selector('body[data-mjr-lesson="n5-1"] .nav-btn:hover', "n5-1"),
            ".nav-btn:hover",
        )

    def test_unexpected_selector_raises(self):
        with self.assertRaises(ValueError):
            unscope_selector(".unrelated", "n5-1")


class TestUnscopeBlock(unittest.TestCase):
    def test_multi_selector_universal(self):
        css = (
            'body[data-mjr-lesson="n5-1"] *, body[data-mjr-lesson="n5-1"] *::before, '
            'body[data-mjr-lesson="n5-1"] *::after {\n'
            "box-sizing: border-box;\n"
            "}"
        )
        expected = "*, *::before, *::after {\nbox-sizing: border-box;\n}"
        self.assertEqual(unscope_block(css, "n5-1"), expected)

    def test_media_query_wrapper_untouched(self):
        css = (
            "@media (max-width: 768px) {\n"
            'body[data-mjr-lesson="n5-1"] .progress-header {\n'
            "flex-direction: column;\n"
            "}\n"
            "}"
        )
        expected = (
            "@media (max-width: 768px) {\n"
            ".progress-header {\n"
            "flex-direction: column;\n"
            "}\n"
            "}"
        )
        self.assertEqual(unscope_block(css, "n5-1"), expected)


class TestSplit(unittest.TestCase):
    def test_split_two_lessons(self):
        text = (
            "/* Shared lesson presentation styles. Generated from the migrated lesson HTML in Phase 1. */\n"
            "body { color: red; }\n"
            "\n"
            "/* Legacy-compatible overrides: Lessons/N5-Lessons/Lesson_1.html */\n"
            'body[data-mjr-lesson="n5-1"] .foo {\n'
            "color: blue;\n"
            "}\n"
            "/* Legacy-compatible overrides: Lessons/N4-Lessons-Book-1/Lesson_2.html */\n"
            'body[data-mjr-lesson="n4b1-2"] .bar {\n'
            "color: green;\n"
            "}\n"
        )
        base_text, overrides = split(text)

        self.assertNotIn("Generated from the migrated lesson HTML", base_text)
        self.assertIn("body { color: red; }", base_text)
        self.assertEqual(set(overrides), {"n5-1", "n4b1-2"})
        self.assertIn(".foo {\ncolor: blue;\n}", overrides["n5-1"])
        self.assertIn(".bar {\ncolor: green;\n}", overrides["n4b1-2"])


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python scripts/test_split_lesson_css.py -v`
Expected: FAIL/ERROR — `ModuleNotFoundError: No module named 'split_lesson_css'`

- [ ] **Step 3: Write the implementation**

Create `scripts/split_lesson_css.py`:

```python
"""Split assets/lesson/lesson.css into a shared base layer plus
per-lesson override files under assets/lesson/overrides/.

Each `/* Legacy-compatible overrides: <path> */` block is scoped with
`body[data-mjr-lesson="<id>"]` selectors that only match once
lesson.js sets that attribute at runtime. This script extracts each
block into its own file with the scoping stripped, so the styling
applies unconditionally.
"""

import re
from pathlib import Path

from lesson_ids import lesson_id_from_path

REPO_ROOT = Path(__file__).resolve().parent.parent
LESSON_CSS = REPO_ROOT / "assets" / "lesson" / "lesson.css"
OVERRIDES_DIR = REPO_ROOT / "assets" / "lesson" / "overrides"

MARKER_RE = re.compile(r"^/\* Legacy-compatible overrides: (.+) \*/$")

OLD_HEADER = (
    "/* Shared lesson presentation styles. Generated from the migrated lesson HTML in Phase 1. */"
)
NEW_HEADER = (
    "/* Shared lesson presentation base layer: structure only. "
    "Per-lesson colors and content-specific styling live in "
    "assets/lesson/overrides/<lesson-id>.css. */"
)


def unscope_selector(selector, lesson_id):
    selector = selector.strip()
    prefix = f'body[data-mjr-lesson="{lesson_id}"]'
    has_prefix = f"html:has({prefix})"
    if selector == has_prefix:
        return "html"
    if selector == prefix:
        return "body"
    if selector.startswith(prefix + " "):
        return selector[len(prefix) + 1 :]
    raise ValueError(f"Unexpected selector {selector!r} for lesson {lesson_id}")


def unscope_block(css_text, lesson_id):
    out_lines = []
    for line in css_text.split("\n"):
        stripped = line.rstrip()
        if "data-mjr-lesson" in stripped and stripped.endswith("{"):
            selectors = stripped[:-1].split(",")
            unscoped = [unscope_selector(s, lesson_id) for s in selectors]
            out_lines.append(", ".join(unscoped) + " {")
        else:
            out_lines.append(line)
    return "\n".join(out_lines)


def split(text):
    """Split lesson.css text into (base_layer_text, {lesson_id: override_text})."""
    lines = text.split("\n")
    marker_indices = [i for i, l in enumerate(lines) if MARKER_RE.match(l)]
    if not marker_indices:
        raise ValueError("No '/* Legacy-compatible overrides: ... */' markers found")

    base_lines = lines[: marker_indices[0]]
    while base_lines and base_lines[-1].strip() == "":
        base_lines.pop()
    base_text = "\n".join(base_lines).replace(OLD_HEADER, NEW_HEADER) + "\n"

    overrides = {}
    for idx, start in enumerate(marker_indices):
        end = marker_indices[idx + 1] if idx + 1 < len(marker_indices) else len(lines)
        path = MARKER_RE.match(lines[start]).group(1)
        lesson_id = lesson_id_from_path(path)

        block_lines = lines[start + 1 : end]
        while block_lines and block_lines[0].strip() == "":
            block_lines.pop(0)
        while block_lines and block_lines[-1].strip() == "":
            block_lines.pop()

        unscoped = unscope_block("\n".join(block_lines), lesson_id)
        header = f"/* Lesson-specific styles for {path} */\n"
        overrides[lesson_id] = header + unscoped + "\n"

    return base_text, overrides


def main():
    text = LESSON_CSS.read_text(encoding="utf-8")
    base_text, overrides = split(text)

    OVERRIDES_DIR.mkdir(parents=True, exist_ok=True)
    for lesson_id, content in overrides.items():
        (OVERRIDES_DIR / f"{lesson_id}.css").write_text(content, encoding="utf-8")

    LESSON_CSS.write_text(base_text, encoding="utf-8")
    print(
        f"Wrote base layer ({len(base_text.splitlines())} lines) "
        f"and {len(overrides)} override files"
    )


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python scripts/test_split_lesson_css.py -v`
Expected: PASS (8 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/split_lesson_css.py scripts/test_split_lesson_css.py
git commit -m "Add lesson.css splitter script with unit tests"
```

---

### Task 3: Run the CSS splitter on the real lesson.css

**Files:**
- Modify: `assets/lesson/lesson.css` (truncated to base layer)
- Create: `assets/lesson/overrides/*.css` (61 files)

- [ ] **Step 1: Run the splitter**

Run: `python scripts/split_lesson_css.py`
Expected output: `Wrote base layer (442 lines) and 61 override files`

- [ ] **Step 2: Verify file counts and sizes**

Run:
```bash
find assets/lesson/overrides -name "*.css" | wc -l
wc -l assets/lesson/lesson.css
```
Expected: `61` and `442 assets/lesson/lesson.css`

- [ ] **Step 3: Sanity-check total line count against the original**

Run:
```bash
python -c "
from pathlib import Path
base = len(Path('assets/lesson/lesson.css').read_text(encoding='utf-8').splitlines())
overrides = sum(
    len(f.read_text(encoding='utf-8').splitlines())
    for f in Path('assets/lesson/overrides').glob('*.css')
)
print(f'base={base} overrides_total={overrides} sum={base + overrides}')
"
```
Expected: `sum` close to the original 42,566 (within roughly 200 lines — each of the 61 blocks lost one `/* Legacy-compatible overrides: ... */` marker line but gained one `/* Lesson-specific styles for ... */` header line, and a few leading/trailing blank lines per block were trimmed).

- [ ] **Step 4: Verify no data-mjr-lesson references remain in CSS**

Run:
```bash
grep -rl "data-mjr-lesson" assets/lesson/ || echo "clean"
```
Expected: `clean`

- [ ] **Step 5: Verify brace balance on every CSS file**

Run:
```bash
python -c "
from pathlib import Path
files = [Path('assets/lesson/lesson.css'), *Path('assets/lesson/overrides').glob('*.css')]
for f in files:
    t = f.read_text(encoding='utf-8')
    assert t.count('{') == t.count('}'), f
print('brace check ok:', len(files), 'files')
"
```
Expected: `brace check ok: 62 files`

- [ ] **Step 6: Spot-check one override file**

Run: `head -20 assets/lesson/overrides/n5-1.css`
Expected: starts with `/* Lesson-specific styles for Lessons/N5-Lessons/Lesson_1.html */`, followed by `*, *::before, *::after {`, `html {`, `body {`, `.progress-container {`, etc. — all selectors unscoped (no `body[data-mjr-lesson=...]`).

- [ ] **Step 7: Commit**

```bash
git add assets/lesson/lesson.css assets/lesson/overrides/
git commit -m "Split lesson.css into shared base layer plus per-lesson override files"
```

---

### Task 4: HTML updater script

**Files:**
- Create: `scripts/update_lesson_html.py`
- Create: `scripts/test_update_lesson_html.py`

- [ ] **Step 1: Write the failing test**

Create `scripts/test_update_lesson_html.py`:

```python
import unittest

from update_lesson_html import OLD_LINK, OLD_SCRIPT, updated_text


class TestUpdatedText(unittest.TestCase):
    def test_replaces_script_and_adds_link(self):
        text = (
            "<head>\n"
            f"{OLD_LINK}"
            '  <link rel="stylesheet" href="../../assets/site-nav.css">\n'
            "</head>\n"
            "<body>\n"
            f"{OLD_SCRIPT}"
            "</body>\n"
        )

        result = updated_text(text, "n5-1")

        self.assertIn(
            '  <link rel="stylesheet" href="../../assets/lesson/lesson.css">\n'
            '  <link rel="stylesheet" href="../../assets/lesson/overrides/n5-1.css">\n',
            result,
        )
        self.assertIn('  <script src="../../assets/lesson/lesson.js"></script>\n', result)
        self.assertNotIn('type="module"', result)

    def test_missing_link_raises(self):
        with self.assertRaises(ValueError):
            updated_text("<head></head>", "n5-1")


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python scripts/test_update_lesson_html.py -v`
Expected: FAIL/ERROR — `ModuleNotFoundError: No module named 'update_lesson_html'`

- [ ] **Step 3: Write the implementation**

Create `scripts/update_lesson_html.py`:

```python
"""Update all 61 lesson HTML files:

- Drop `type="module"` from the lesson.js script tag. Module scripts
  are blocked by CORS when a page is opened via file://, which broke
  slide navigation on every lesson.
- Link each lesson's new assets/lesson/overrides/<id>.css file, which
  now carries that lesson's color theme and content-specific styling
  unconditionally (see split_lesson_css.py).
"""

from pathlib import Path

from lesson_ids import lesson_id_from_path

REPO_ROOT = Path(__file__).resolve().parent.parent
LESSONS_DIR = REPO_ROOT / "Lessons"

OLD_LINK = '  <link rel="stylesheet" href="../../assets/lesson/lesson.css">\n'
OLD_SCRIPT = '  <script type="module" src="../../assets/lesson/lesson.js"></script>\n'
NEW_SCRIPT = '  <script src="../../assets/lesson/lesson.js"></script>\n'


def updated_text(text, lesson_id):
    if OLD_LINK not in text:
        raise ValueError("missing lesson.css link")
    if OLD_SCRIPT not in text:
        raise ValueError("missing module script tag")

    override_link = (
        f'  <link rel="stylesheet" href="../../assets/lesson/overrides/{lesson_id}.css">\n'
    )
    text = text.replace(OLD_LINK, OLD_LINK + override_link)
    text = text.replace(OLD_SCRIPT, NEW_SCRIPT)
    return text


def main():
    files = sorted(LESSONS_DIR.glob("*/Lesson_*.html"))
    if len(files) != 61:
        raise SystemExit(f"expected 61 lesson files, found {len(files)}")

    for path in files:
        rel = path.relative_to(REPO_ROOT).as_posix()
        lesson_id = lesson_id_from_path(rel)
        text = path.read_text(encoding="utf-8")
        path.write_text(updated_text(text, lesson_id), encoding="utf-8")
        print(f"{rel} -> {lesson_id}")


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python scripts/test_update_lesson_html.py -v`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/update_lesson_html.py scripts/test_update_lesson_html.py
git commit -m "Add lesson HTML updater script with unit tests"
```

---

### Task 5: Run the HTML updater on all 61 lesson files

**Files:**
- Modify: all 61 files under `Lessons/*/Lesson_*.html`

- [ ] **Step 1: Run the updater**

Run: `python scripts/update_lesson_html.py`
Expected: 61 lines of output, e.g. `Lessons/N5-Lessons/Lesson_1.html -> n5-1`, ending with `Lessons/N4-Lessons-Book 2/Lesson_18.html -> n4b2-18`.

- [ ] **Step 2: Verify no module-script tag remains for lesson.js**

Run:
```bash
grep -rl 'type="module" src="../../assets/lesson/lesson.js"' Lessons/ || echo "clean"
```
Expected: `clean`

- [ ] **Step 3: Verify every lesson links its override file**

Run:
```bash
grep -rl "assets/lesson/overrides/" Lessons/ | wc -l
```
Expected: `61`

- [ ] **Step 4: Spot-check one file's `<head>`**

Run: `grep -n "lesson.css\|lesson.js\|overrides" "Lessons/N4-Lessons-Book 2/Lesson_1.html"`
Expected:
```
  <link rel="stylesheet" href="../../assets/lesson/lesson.css">
  <link rel="stylesheet" href="../../assets/lesson/overrides/n4b2-1.css">
  <script src="../../assets/lesson/lesson.js"></script>
```
(plus `resource-data.js` / `site-nav.js` lines unchanged)

- [ ] **Step 5: Commit**

```bash
git add Lessons/
git commit -m "Link per-lesson override CSS and drop type=module from lesson.js script tag"
```

---

### Task 6: Remove dead data-mjr-lesson code from lesson.js

**Files:**
- Modify: `assets/lesson/lesson.js`

- [ ] **Step 1: Remove LESSON_PATH_RE, normalizePath, lessonIdFromPath, applyLessonId**

In `assets/lesson/lesson.js`, replace:

```javascript
(function () {
  const LESSON_PATH_RE = /lessons\/([^/]+)\/lesson_(\d+)\.html$/i;
  let currentSlide = 1;
  let touchStartX = 0;
  let touchStartY = 0;

  function normalizePath(value) {
    return decodeURIComponent(value || '')
      .replace(/\\/g, '/')
      .replace(/^\/+/, '')
      .toLowerCase();
  }

  function lessonIdFromPath() {
    const match = normalizePath(window.location.pathname).match(LESSON_PATH_RE);
    if (!match) return 'unknown';

    const folder = match[1]
      .replace(/^n5-lessons$/, 'n5')
      .replace(/^n4-lessons-book-1$/, 'n4b1')
      .replace(/^n4-lessons-book 2$/, 'n4b2')
      .replace(/[^a-z0-9]+/g, '-');

    return `${folder}-${Number(match[2])}`;
  }

  function applyLessonId() {
    if (!document.body) return;
    document.body.dataset.mjrLesson = lessonIdFromPath();
  }

  function slideNumbers() {
```

with:

```javascript
(function () {
  let currentSlide = 1;
  let touchStartX = 0;
  let touchStartY = 0;

  function slideNumbers() {
```

- [ ] **Step 2: Remove the applyLessonId() call in updateSlide()**

In the same file, replace:

```javascript
  function updateSlide(options) {
    applyLessonId();

    const total = totalSlides();
```

with:

```javascript
  function updateSlide(options) {
    const total = totalSlides();
```

- [ ] **Step 3: Verify no dead references remain**

Run:
```bash
grep -rn "data-mjr-lesson\|LESSON_PATH_RE\|lessonIdFromPath\|applyLessonId\|normalizePath\|dataset.mjrLesson" assets/ Lessons/ || echo "clean"
```
Expected: `clean`

- [ ] **Step 4: Verify JS syntax is still valid**

Run: `node --check assets/lesson/lesson.js`
Expected: no output, exit code 0

- [ ] **Step 5: Commit**

```bash
git add assets/lesson/lesson.js
git commit -m "Remove dead data-mjr-lesson code from lesson.js"
```

---

### Task 7: Manual smoke test

**Files:** none (verification only)

- [ ] **Step 1: Open one lesson per book directly from disk (file://)**

Open each of these in a browser by double-clicking (or File > Open):
- `Lessons/N5-Lessons/Lesson_1.html`
- `Lessons/N4-Lessons-Book-1/Lesson_1.html`
- `Lessons/N4-Lessons-Book 2/Lesson_1.html`

For each:
- Confirm the page shows its own distinct color theme (not the flat blue/white look) — e.g. N5 Lesson 1 should show its navy/orange theme, N4 Book 2 Lesson 1 its amber/teal theme.
- Click the **Next ▶** button and confirm the presentation advances to slide 2 (progress bar and slide counter update).
- Click **◀ Back** and confirm it returns to slide 1.
- Open the browser DevTools console and confirm there are no JavaScript errors.

- [ ] **Step 2: Report results**

If all three lessons pass, the restructure is complete. If any lesson still shows the flat blue/white look or navigation doesn't work, note which lesson and what's wrong before moving on — do not commit further changes until this is resolved.

- [ ] **Step 3: If the color-theme check failed, do Task 8 then re-run Step 1**

A manual run of Step 1 found navigation working but every lesson still showing the flat blue/white palette instead of its own theme. Task 8 below fixes the underlying cause. After Task 8 is complete, re-run Step 1 on the same three lessons (`Lessons/N5-Lessons/Lesson_1.html`, `Lessons/N4-Lessons-Book-1/Lesson_1.html`, `Lessons/N4-Lessons-Book 2/Lesson_1.html`) and confirm each now shows its navy/orange "book intro" theme (not blue/teal/white), with navigation and console still clean. Then this task is complete.

---

### Task 8: Fix per-lesson `:root` palette being overridden by `assets/tokens.css`

**Background:** Each lesson's `<head>` has an inline `<style>` block defining `:root { --primary: ...; --accent: ...; --bg-light: ...; --text-primary: ...; ... }` — that lesson's color palette. `assets/site-nav.css` (linked later in `<head>`) starts with `@import url("./tokens.css");`, and `assets/tokens.css` defines its OWN `:root` with the same custom-property names (`--primary`, `--accent`, `--bg-light`, `--text-primary`, etc.) aliased to a single global blue/teal/white palette (`--primary: var(--mjr-primary)` = `#2563eb`, etc.). Both are `:root` selectors (equal specificity, 0-1-0), and CSS resolves ties by source order — `@import`ed rules take the position of the `<link>` that imports them, so `tokens.css`'s `:root` comes AFTER each lesson's inline `:root` and wins. Every lesson therefore renders with `tokens.css`'s blue/teal/white palette instead of its own.

This is a pre-existing bug (predates this plan), but it's why Task 7's manual smoke test still shows a flat blue/white look even though navigation and per-lesson override CSS (Tasks 1-6) are correct. The fix: move each lesson's `<style>:root{...}</style>` block to load AFTER `site-nav.css` and `contrast-fixes.css`, so the lesson's own `:root` declarations win the cascade instead.

Verified against all 61 lesson files: each has exactly one `<style>` block containing only a `:root {...}` rule (with a leading comment), immediately followed by exactly these 4 `<link>` tags in this order:
```
  <link rel="stylesheet" href="../../assets/lesson/lesson.css">
  <link rel="stylesheet" href="../../assets/lesson/overrides/<id>.css">
  <link rel="stylesheet" href="../../assets/site-nav.css">
  <link rel="stylesheet" href="../../assets/contrast-fixes.css">
```

`assets/contrast-fixes.css` defines its own `:root` too, but only for `--mjr-*`-prefixed names (e.g. `--mjr-primary`), not `--primary`/`--accent`/`--bg-light`/etc., so moving the lesson's `<style>` block after it does not create a new collision. `contrast-fixes.css`'s `!important` badge/button rules are unaffected by `:root` ordering and are out of scope (see spec).

**Files:**
- Create: `scripts/reorder_lesson_style.py`
- Create: `scripts/test_reorder_lesson_style.py`
- Modify: all 61 files under `Lessons/*/Lesson_*.html`

- [ ] **Step 1: Write the failing test**

Create `scripts/test_reorder_lesson_style.py`:

```python
import unittest

from reorder_lesson_style import move_style_after_links


class TestMoveStyleAfterLinks(unittest.TestCase):
    def test_moves_style_block_after_four_links(self):
        text = (
            "<head>\n"
            "    <style>\n"
            "        :root { --primary: #1a365d; }\n"
            "    </style>\n"
            '  <link rel="stylesheet" href="../../assets/lesson/lesson.css">\n'
            '  <link rel="stylesheet" href="../../assets/lesson/overrides/n5-1.css">\n'
            '  <link rel="stylesheet" href="../../assets/site-nav.css">\n'
            '  <link rel="stylesheet" href="../../assets/contrast-fixes.css">\n'
            "</head>\n"
        )

        result = move_style_after_links(text)

        expected = (
            "<head>\n"
            '  <link rel="stylesheet" href="../../assets/lesson/lesson.css">\n'
            '  <link rel="stylesheet" href="../../assets/lesson/overrides/n5-1.css">\n'
            '  <link rel="stylesheet" href="../../assets/site-nav.css">\n'
            '  <link rel="stylesheet" href="../../assets/contrast-fixes.css">\n'
            "    <style>\n"
            "        :root { --primary: #1a365d; }\n"
            "    </style>\n"
            "</head>\n"
        )
        self.assertEqual(result, expected)

    def test_missing_style_raises(self):
        with self.assertRaises(ValueError):
            move_style_after_links("<head></head>")


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python scripts/test_reorder_lesson_style.py -v`
Expected: FAIL/ERROR — `ModuleNotFoundError: No module named 'reorder_lesson_style'`

- [ ] **Step 3: Write the implementation**

Create `scripts/reorder_lesson_style.py`:

```python
"""Move each lesson's inline <style>:root{...}</style> block to load
after assets/site-nav.css and assets/contrast-fixes.css.

assets/tokens.css (imported by site-nav.css) defines a :root with the
same custom-property names (--primary, --accent, --bg-light, etc.) as
each lesson's inline block. With equal :root specificity, the later
declaration wins -- previously that was tokens.css, so every lesson
rendered with tokens.css's blue/teal palette instead of its own theme.
Moving the lesson's <style> block after contrast-fixes.css makes its
:root win instead.
"""

import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
LESSONS_DIR = REPO_ROOT / "Lessons"

STYLE_AND_LINKS_RE = re.compile(
    r"(?P<style>[ \t]*<style>.*?</style>\n)"
    r"(?P<links>(?:\s*<link rel=\"stylesheet\" href=\"\.\./\.\./assets/"
    r"(?:lesson/lesson\.css|lesson/overrides/[^\"]+\.css|site-nav\.css|contrast-fixes\.css)\">\n){4})",
    re.DOTALL,
)


def move_style_after_links(text):
    match = STYLE_AND_LINKS_RE.search(text)
    if not match:
        raise ValueError("expected <style> block followed by 4 stylesheet links")
    return text[: match.start()] + match.group("links") + match.group("style") + text[match.end() :]


def main():
    files = sorted(LESSONS_DIR.glob("*/Lesson_*.html"))
    if len(files) != 61:
        raise SystemExit(f"expected 61 lesson files, found {len(files)}")

    for path in files:
        rel = path.relative_to(REPO_ROOT).as_posix()
        text = path.read_text(encoding="utf-8")
        path.write_text(move_style_after_links(text), encoding="utf-8")
        print(rel)


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python scripts/test_reorder_lesson_style.py -v`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit the script**

```bash
git add scripts/reorder_lesson_style.py scripts/test_reorder_lesson_style.py
git commit -m "Add script to move lesson style blocks after site-nav/contrast-fixes CSS"
```

- [ ] **Step 6: Run the reorder script on all 61 lesson files**

Run: `python scripts/reorder_lesson_style.py`
Expected: 61 lines of output, e.g. `Lessons/N5-Lessons/Lesson_1.html`, ending with `Lessons/N4-Lessons-Book 2/Lesson_18.html`.

- [ ] **Step 7: Verify the new `<head>` order on a sample file**

Run: `grep -n -E "<style>|</style>|lesson.css|overrides/|site-nav.css|contrast-fixes.css" "Lessons/N5-Lessons/Lesson_1.html" | head -8`
Expected: the four `<link>` lines (`lesson.css`, `overrides/n5-1.css`, `site-nav.css`, `contrast-fixes.css`) now appear BEFORE the `<style>`/`</style>` lines.

- [ ] **Step 8: Verify no content was lost**

Run:
```bash
python3 - <<'EOF'
from pathlib import Path

files = sorted(Path("Lessons").glob("*/Lesson_*.html"))
for f in files:
    text = f.read_text(encoding="utf-8")
    assert text.count("<style>") == 1, f
    assert text.count("</style>") == 1, f
print(f"ok: {len(files)} files each have exactly one <style>/</style> pair")
EOF
```
Expected: `ok: 61 files each have exactly one <style>/</style> pair`

- [ ] **Step 9: Commit the reordered lesson files**

```bash
git add Lessons/
git commit -m "Move per-lesson :root palette after tokens.css so it wins the cascade"
```
