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
