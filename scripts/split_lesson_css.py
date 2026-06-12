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
