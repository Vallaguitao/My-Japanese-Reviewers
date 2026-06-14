# Lesson Self-Check Audit And Repair

Date: 2026-06-14
Status: Approved design direction
Target files: `Lessons/**/*.html`

## Goal

Audit and repair the self-check, quiz, and assessment behavior across all 61 lesson HTML files. The finished pass must confirm that lesson pages load without script errors, their self-check controls respond, and any scoring or feedback behavior already present in the lesson works as intended.

This pass is limited to lesson behavior repair. It does not add breadcrumb navigation, redesign lesson pages, convert files to a new quiz format, or modify unrelated landing-page UI.

## Current Lesson Inventory

The live repository contains 61 lesson files:

- `Lessons/N5-Lessons`: 25 files
- `Lessons/N4-Lessons-Book-1`: 18 files
- `Lessons/N4-Lessons-Book 2`: 18 files

The current lesson files do not use the prompt's `QUIZ_CONFIG` structure. The audit treats the live files as the source of truth and works with their existing patterns:

- N5 inline checker pages using functions such as `checkFillBlank(...)` and `checkMC(...)`
- N4 Book 1 slide and answer-card pages, where some check controls advance to answer slides rather than grade inline
- N4 Book 2 interactive quiz slides using functions such as `selectMC(...)` and `checkQuiz...()`

## Known Evidence

The first read-only static pass found a shared root-cause family in N5 lesson files: inline `onclick="..."` attributes pass explanation strings that contain raw double quotes. In HTML, a backslash does not escape a double quote inside a double-quoted attribute, so the browser truncates the handler before JavaScript can run.

This is distinct from the previously known apostrophe bug. The audit must still search for unescaped apostrophes and other malformed string literals, but it must not assume they are the only failure mode.

## Approach

Use an audit harness plus targeted fixes.

The harness is temporary local tooling used to inspect every lesson file consistently. It should not change the lesson architecture or require a build step. It will classify each file, run static checks, run browser smoke checks where possible, and produce a per-file report.

Fixes should be narrow and root-cause based:

- Apply shared fixes across all affected files when the same malformed pattern recurs.
- Keep each lesson inside its current structure.
- Avoid one-off rewrites unless a file has an isolated defect.
- Preserve existing lesson text, answer keys, slide order, keyboard behavior, and navigation controls unless they directly cause the self-check failure.

## Static Audit

For every lesson file, the harness should check:

- HTML file can be read as UTF-8.
- All script blocks parse as JavaScript.
- Parsed inline event-handler attributes compile as JavaScript.
- Referenced inline handler functions exist on the page.
- Common broken string patterns are detected, including raw quotes inside `onclick` arguments.
- Self-check related controls can be identified by selectors such as `.check-btn`, `onclick`, `checkFillBlank`, `checkMC`, `checkQuiz`, and `selectMC`.

Static findings should include file path, approximate line number, failing attribute or script block, and the parse error message when available.

## Browser Smoke Audit

For every lesson file, run a browser-based smoke check that opens the file directly from disk or through a local static server. The check should capture:

- page-load JavaScript errors
- console errors
- missing event handlers
- check buttons that throw when clicked
- expected feedback regions that do not update after interaction
- navigation buttons that stop working because a malformed handler broke script execution

The smoke check should match each live pattern:

- N5 pages: exercise at least one fill-blank and one multiple-choice check when present.
- N4 Book 1 pages: confirm check controls advance or reveal answer content without throwing.
- N4 Book 2 pages: confirm option selection and quiz check controls update feedback or score state without throwing.

Where a full scoring assertion is practical from the page structure, the harness should assert it. Where a lesson only exposes answer-card behavior, the harness should verify the control response and absence of runtime errors.

## Fix Strategy

Primary expected fix family:

- Replace malformed inline explanation arguments with safe HTML attribute encoding or equivalent safe JavaScript string construction.
- Prefer minimal text-preserving fixes over behavior rewrites.

Other possible fix families:

- Escape malformed apostrophes or quotes in script string literals.
- Correct mismatched handler names between markup and script.
- Correct missing IDs or selectors used by check functions.
- Repair local scoring logic when a handler runs but grades incorrectly.
- Restore broken feedback rendering when a handler runs but produces no visible response.

Any file whose issue does not match a known pattern should be flagged for closer inspection before patching.

## Batching

Work in batches of 10 to 15 files.

After the first batch:

- identify whether the same broken-handler pattern is recurring
- decide whether a shared transform can repair the affected files safely
- continue file-by-file for anything outside the shared pattern

Each batch should end with an updated audit report showing remaining failures.

## Report

The final report should list all 61 files with:

- before status
- issue found, if any
- fix applied, if any
- after status
- verification evidence

If a shared root cause affects many files, the report should call it out once and list the affected files beneath it.

## Validation

Before claiming completion:

- all 61 lesson files must pass the static audit
- all 61 lesson files must pass the browser smoke audit, or any environment-limited checks must be explicitly identified
- no lesson should have page-load console errors caused by lesson code
- self-check controls should respond without throwing
- scoring and feedback should be verified where the page structure supports deterministic checks
- unrelated files should not be modified, except the separately approved `index.html` path-display cleanup

## Non-Goals

- Do not add breadcrumb navigation in this pass.
- Do not convert lessons to `QUIZ_CONFIG`.
- Do not introduce frameworks, bundlers, or external runtime dependencies.
- Do not redesign the landing page as part of the lesson repair.
- Do not change lesson content unless the content string itself is breaking JavaScript or HTML event handling.
