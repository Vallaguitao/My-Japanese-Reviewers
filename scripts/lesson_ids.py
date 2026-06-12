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
