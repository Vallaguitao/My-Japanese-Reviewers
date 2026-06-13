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
