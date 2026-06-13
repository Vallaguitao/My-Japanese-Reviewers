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
