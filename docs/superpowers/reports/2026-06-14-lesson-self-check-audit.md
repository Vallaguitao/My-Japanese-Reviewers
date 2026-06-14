# Lesson Self-Check Audit Report

Generated: 2026-06-14T12:26:25.548Z

## Summary

- Lessons scanned: 61
- Static audit before: 17 failing file(s), 27 inline handler syntax error(s)
- Browser smoke before: 2 failing file(s)
- Repair applied: 17 file(s)
- Static audit after: 0 failing file(s)
- Browser audit after: 0 failing file(s), 1531 exercised action(s), 453 planned check-control click(s), 0 failed action(s)

## Root Cause

The shared failure pattern was raw double quotes inside double-quoted HTML `onclick` attributes in N5 lesson self-check explanation text. The browser parsed those attributes early, so the affected handler source was truncated and clicking some controls raised `Invalid or unexpected token`. The targeted repair encodes only those internal quotes as `&quot;`, leaving the visible lesson text unchanged.

## Harness Changes

- Static audit compiles script blocks and decoded inline event handlers, including double-quoted, single-quoted, and unquoted handler attributes.
- Browser audit uses the bundled `playwright-core` with installed Chrome/Edge, loads each lesson from `file://`, fills all detected blank inputs, clicks all detected self-check controls, clicks/selects all detected multiple-choice controls, and records page errors, console errors, per-element action results, and feedback text.
- Repair mode supports `--fix-inline-onclick-quotes` and `--dry-run` for repeatable previews and targeted application.

## Per-File Summary

| File | Category | Static Before | Browser Before | Fix Applied | Static After | Browser After | Exercised Actions | Planned Check Clicks |
|---|---|---:|---:|---|---:|---:|---:|---:|
| Lessons/N4-Lessons-Book 2/Lesson_1.html | n4-book2-interactive | Pass | Pass | No change required | Pass | Pass | 44 | 6 |
| Lessons/N4-Lessons-Book 2/Lesson_10.html | n4-book2-interactive | Pass | Pass | No change required | Pass | Pass | 37 | 6 |
| Lessons/N4-Lessons-Book 2/Lesson_11.html | n4-book2-interactive | Pass | Pass | No change required | Pass | Pass | 36 | 6 |
| Lessons/N4-Lessons-Book 2/Lesson_12.html | n4-book2-interactive | Pass | Pass | No change required | Pass | Pass | 24 | 4 |
| Lessons/N4-Lessons-Book 2/Lesson_13.html | n4-book2-interactive | Pass | Pass | No change required | Pass | Pass | 30 | 4 |
| Lessons/N4-Lessons-Book 2/Lesson_14.html | n4-book2-interactive | Pass | Pass | No change required | Pass | Pass | 26 | 3 |
| Lessons/N4-Lessons-Book 2/Lesson_15.html | n4-book2-interactive | Pass | Pass | No change required | Pass | Pass | 25 | 3 |
| Lessons/N4-Lessons-Book 2/Lesson_16.html | n4-book2-interactive | Pass | Pass | No change required | Pass | Pass | 31 | 4 |
| Lessons/N4-Lessons-Book 2/Lesson_17.html | n4-book2-interactive | Pass | Pass | No change required | Pass | Pass | 26 | 3 |
| Lessons/N4-Lessons-Book 2/Lesson_18.html | n4-book2-interactive | Pass | Pass | No change required | Pass | Pass | 25 | 4 |
| Lessons/N4-Lessons-Book 2/Lesson_2.html | n4-book2-interactive | Pass | Pass | No change required | Pass | Pass | 38 | 5 |
| Lessons/N4-Lessons-Book 2/Lesson_3.html | n4-book2-interactive | Pass | Pass | No change required | Pass | Pass | 38 | 5 |
| Lessons/N4-Lessons-Book 2/Lesson_4.html | n4-book2-interactive | Pass | Pass | No change required | Pass | Pass | 46 | 6 |
| Lessons/N4-Lessons-Book 2/Lesson_5.html | n4-book2-interactive | Pass | Pass | No change required | Pass | Pass | 46 | 6 |
| Lessons/N4-Lessons-Book 2/Lesson_6.html | n4-book2-interactive | Pass | Pass | No change required | Pass | Pass | 45 | 6 |
| Lessons/N4-Lessons-Book 2/Lesson_7.html | n4-book2-interactive | Pass | Pass | No change required | Pass | Pass | 29 | 4 |
| Lessons/N4-Lessons-Book 2/Lesson_8.html | n4-book2-interactive | Pass | Pass | No change required | Pass | Pass | 32 | 4 |
| Lessons/N4-Lessons-Book 2/Lesson_9.html | n4-book2-interactive | Pass | Pass | No change required | Pass | Pass | 56 | 7 |
| Lessons/N4-Lessons-Book-1/Lesson_1.html | n4-book1-answer-card | Pass | Pass | No change required | Pass | Pass | 7 | 7 |
| Lessons/N4-Lessons-Book-1/Lesson_10.html | n4-book1-answer-card | Pass | Pass | No change required | Pass | Pass | 6 | 6 |
| Lessons/N4-Lessons-Book-1/Lesson_11.html | n4-book1-answer-card | Pass | Pass | No change required | Pass | Pass | 5 | 5 |
| Lessons/N4-Lessons-Book-1/Lesson_12.html | n4-book1-answer-card | Pass | Pass | No change required | Pass | Pass | 6 | 6 |
| Lessons/N4-Lessons-Book-1/Lesson_13.html | n4-book1-answer-card | Pass | Pass | No change required | Pass | Pass | 6 | 6 |
| Lessons/N4-Lessons-Book-1/Lesson_14.html | n4-book1-answer-card | Pass | Pass | No change required | Pass | Pass | 6 | 6 |
| Lessons/N4-Lessons-Book-1/Lesson_15.html | n4-book1-answer-card | Pass | Pass | No change required | Pass | Pass | 24 | 24 |
| Lessons/N4-Lessons-Book-1/Lesson_16.html | n4-book1-answer-card | Pass | Pass | No change required | Pass | Pass | 22 | 22 |
| Lessons/N4-Lessons-Book-1/Lesson_17.html | n4-book1-answer-card | Pass | Pass | No change required | Pass | Pass | 22 | 22 |
| Lessons/N4-Lessons-Book-1/Lesson_18.html | n4-book1-answer-card | Pass | Pass | No change required | Pass | Pass | 24 | 24 |
| Lessons/N4-Lessons-Book-1/Lesson_2.html | n4-book1-answer-card | Pass | Pass | No change required | Pass | Pass | 8 | 8 |
| Lessons/N4-Lessons-Book-1/Lesson_3.html | n4-book1-answer-card | Pass | Pass | No change required | Pass | Pass | 9 | 9 |
| Lessons/N4-Lessons-Book-1/Lesson_4.html | n4-book1-answer-card | Pass | Pass | No change required | Pass | Pass | 6 | 6 |
| Lessons/N4-Lessons-Book-1/Lesson_5.html | n4-book1-answer-card | Pass | Pass | No change required | Pass | Pass | 5 | 5 |
| Lessons/N4-Lessons-Book-1/Lesson_6.html | n4-book1-answer-card | Pass | Pass | No change required | Pass | Pass | 5 | 5 |
| Lessons/N4-Lessons-Book-1/Lesson_7.html | n4-book1-answer-card | Pass | Pass | No change required | Pass | Pass | 5 | 5 |
| Lessons/N4-Lessons-Book-1/Lesson_8.html | n4-book1-answer-card | Pass | Pass | No change required | Pass | Pass | 5 | 5 |
| Lessons/N4-Lessons-Book-1/Lesson_9.html | n4-book1-answer-card | Pass | Pass | No change required | Pass | Pass | 6 | 6 |
| Lessons/N5-Lessons/Lesson_1.html | n5-inline-checker | Pass | Pass | No change required | Pass | Pass | 37 | 5 |
| Lessons/N5-Lessons/Lesson_10.html | n5-inline-checker | Fail | Pass | Encoded raw double quotes in inline onclick explanations (1 -> 0) | Pass | Pass | 25 | 3 |
| Lessons/N5-Lessons/Lesson_11.html | n5-inline-checker | Fail | Pass | Encoded raw double quotes in inline onclick explanations (3 -> 0) | Pass | Pass | 22 | 4 |
| Lessons/N5-Lessons/Lesson_12.html | n5-inline-checker | Fail | Pass | Encoded raw double quotes in inline onclick explanations (3 -> 0) | Pass | Pass | 25 | 6 |
| Lessons/N5-Lessons/Lesson_13.html | n5-inline-checker | Fail | Fail | Encoded raw double quotes in inline onclick explanations (2 -> 0) | Pass | Pass | 27 | 6 |
| Lessons/N5-Lessons/Lesson_14.html | n5-inline-checker | Fail | Fail | Encoded raw double quotes in inline onclick explanations (2 -> 0) | Pass | Pass | 30 | 10 |
| Lessons/N5-Lessons/Lesson_15.html | n5-inline-checker | Pass | Pass | No change required | Pass | Pass | 26 | 5 |
| Lessons/N5-Lessons/Lesson_16.html | n5-inline-checker | Fail | Pass | Encoded raw double quotes in inline onclick explanations (1 -> 0) | Pass | Pass | 28 | 8 |
| Lessons/N5-Lessons/Lesson_17.html | n5-inline-checker | Fail | Pass | Encoded raw double quotes in inline onclick explanations (1 -> 0) | Pass | Pass | 30 | 11 |
| Lessons/N5-Lessons/Lesson_18.html | n5-inline-checker | Fail | Pass | Encoded raw double quotes in inline onclick explanations (2 -> 0) | Pass | Pass | 30 | 9 |
| Lessons/N5-Lessons/Lesson_19.html | n5-inline-checker | Fail | Pass | Encoded raw double quotes in inline onclick explanations (1 -> 0) | Pass | Pass | 31 | 12 |
| Lessons/N5-Lessons/Lesson_2.html | n5-inline-checker | Fail | Pass | Encoded raw double quotes in inline onclick explanations (2 -> 0) | Pass | Pass | 39 | 6 |
| Lessons/N5-Lessons/Lesson_20.html | n5-inline-checker | Fail | Pass | Encoded raw double quotes in inline onclick explanations (1 -> 0) | Pass | Pass | 26 | 8 |
| Lessons/N5-Lessons/Lesson_21.html | n5-inline-checker | Fail | Pass | Encoded raw double quotes in inline onclick explanations (2 -> 0) | Pass | Pass | 32 | 10 |
| Lessons/N5-Lessons/Lesson_22.html | n5-inline-checker | Pass | Pass | No change required | Pass | Pass | 30 | 11 |
| Lessons/N5-Lessons/Lesson_23.html | n5-inline-checker | Pass | Pass | No change required | Pass | Pass | 30 | 12 |
| Lessons/N5-Lessons/Lesson_24.html | n5-inline-checker | Pass | Pass | No change required | Pass | Pass | 26 | 9 |
| Lessons/N5-Lessons/Lesson_25.html | n5-inline-checker | Fail | Pass | Encoded raw double quotes in inline onclick explanations (2 -> 0) | Pass | Pass | 28 | 12 |
| Lessons/N5-Lessons/Lesson_3.html | n5-inline-checker | Pass | Pass | No change required | Pass | Pass | 36 | 6 |
| Lessons/N5-Lessons/Lesson_4.html | n5-inline-checker | Pass | Pass | No change required | Pass | Pass | 31 | 8 |
| Lessons/N5-Lessons/Lesson_5.html | n5-inline-checker | Fail | Pass | Encoded raw double quotes in inline onclick explanations (1 -> 0) | Pass | Pass | 32 | 6 |
| Lessons/N5-Lessons/Lesson_6.html | n5-inline-checker | Pass | Pass | No change required | Pass | Pass | 28 | 6 |
| Lessons/N5-Lessons/Lesson_7.html | n5-inline-checker | Fail | Pass | Encoded raw double quotes in inline onclick explanations (1 -> 0) | Pass | Pass | 25 | 7 |
| Lessons/N5-Lessons/Lesson_8.html | n5-inline-checker | Fail | Pass | Encoded raw double quotes in inline onclick explanations (1 -> 0) | Pass | Pass | 25 | 5 |
| Lessons/N5-Lessons/Lesson_9.html | n5-inline-checker | Fail | Pass | Encoded raw double quotes in inline onclick explanations (1 -> 0) | Pass | Pass | 21 | 5 |

## Files Changed By Repair

- Lessons/N5-Lessons/Lesson_10.html: Encoded raw double quotes in inline onclick explanations (1 -> 0); static-only failure before repair.
- Lessons/N5-Lessons/Lesson_11.html: Encoded raw double quotes in inline onclick explanations (3 -> 0); static-only failure before repair.
- Lessons/N5-Lessons/Lesson_12.html: Encoded raw double quotes in inline onclick explanations (3 -> 0); static-only failure before repair.
- Lessons/N5-Lessons/Lesson_13.html: Encoded raw double quotes in inline onclick explanations (2 -> 0); also failed browser smoke before repair.
- Lessons/N5-Lessons/Lesson_14.html: Encoded raw double quotes in inline onclick explanations (2 -> 0); also failed browser smoke before repair.
- Lessons/N5-Lessons/Lesson_16.html: Encoded raw double quotes in inline onclick explanations (1 -> 0); static-only failure before repair.
- Lessons/N5-Lessons/Lesson_17.html: Encoded raw double quotes in inline onclick explanations (1 -> 0); static-only failure before repair.
- Lessons/N5-Lessons/Lesson_18.html: Encoded raw double quotes in inline onclick explanations (2 -> 0); static-only failure before repair.
- Lessons/N5-Lessons/Lesson_19.html: Encoded raw double quotes in inline onclick explanations (1 -> 0); static-only failure before repair.
- Lessons/N5-Lessons/Lesson_2.html: Encoded raw double quotes in inline onclick explanations (2 -> 0); static-only failure before repair.
- Lessons/N5-Lessons/Lesson_20.html: Encoded raw double quotes in inline onclick explanations (1 -> 0); static-only failure before repair.
- Lessons/N5-Lessons/Lesson_21.html: Encoded raw double quotes in inline onclick explanations (2 -> 0); static-only failure before repair.
- Lessons/N5-Lessons/Lesson_25.html: Encoded raw double quotes in inline onclick explanations (2 -> 0); static-only failure before repair.
- Lessons/N5-Lessons/Lesson_5.html: Encoded raw double quotes in inline onclick explanations (1 -> 0); static-only failure before repair.
- Lessons/N5-Lessons/Lesson_7.html: Encoded raw double quotes in inline onclick explanations (1 -> 0); static-only failure before repair.
- Lessons/N5-Lessons/Lesson_8.html: Encoded raw double quotes in inline onclick explanations (1 -> 0); static-only failure before repair.
- Lessons/N5-Lessons/Lesson_9.html: Encoded raw double quotes in inline onclick explanations (1 -> 0); static-only failure before repair.

## Code Review Follow-Up

- Strengthened browser audit after review: previous browser smoke clicked only one representative selector per page; the current after report exercises all detected controls and fails on any failed action.
- `docs/` is ignored by the repo, so these report artifacts must be force-added if they should be committed.
- Repair report `ok` now reflects every scanned file after repair, not only files changed by the repair mode.

## Verification Commands

```powershell
& 'C:\Users\valla\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tools\lesson-audit\lesson-audit.test.js
& 'C:\Users\valla\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tools\lesson-audit\lesson-audit.js --mode static --out docs\superpowers\reports\2026-06-14-lesson-static-after.json
& 'C:\Users\valla\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tools\lesson-audit\lesson-audit.js --mode browser --out docs\superpowers\reports\2026-06-14-lesson-browser-after.json
```

