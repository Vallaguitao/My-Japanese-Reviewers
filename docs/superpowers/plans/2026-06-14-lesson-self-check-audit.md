# Lesson Self-Check Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a repeatable audit harness, use it to find the lesson self-check failures across all 61 lesson HTML files, apply targeted repairs, and produce a per-file verification report.

**Architecture:** Add a no-dependency Node-based audit CLI under `tools/lesson-audit/` with static checks and Chrome DevTools Protocol browser smoke checks. Keep fixes inside each affected lesson's existing N5/N4 structure, and generate before/after reports under `docs/superpowers/reports/`.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node 24 standard library, installed Chrome headless, PowerShell, git.

---

## Execution Preflight

Before implementation, create or switch to an isolated worktree with `superpowers:using-git-worktrees`. The current primary workspace has an unrelated `index.html` landing-page cleanup in progress; do not include `index.html` in lesson-audit commits.

Run these from `C:\Users\valla\Downloads\My-Japanese-Reviewers`:

```powershell
git status --short
git worktree list
git worktree add .worktrees\lesson-self-check-audit -b codex/lesson-self-check-audit HEAD
```

Expected:

```text
Preparing worktree (new branch 'codex/lesson-self-check-audit')
HEAD is now at the current design-spec commit.
```

If the branch already exists, use:

```powershell
git worktree add .worktrees\lesson-self-check-audit codex/lesson-self-check-audit
```

Then run all implementation commands from:

```text
C:\Users\valla\Downloads\My-Japanese-Reviewers\.worktrees\lesson-self-check-audit
```

Use the bundled Node runtime because `node` is not on PATH in this shell:

```powershell
$NODE = 'C:\Users\valla\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
```

## File Structure

- Create: `tools/lesson-audit/lesson-audit.js`
  - CLI and reusable helpers for lesson discovery, static checks, browser smoke checks, targeted repair helpers, and report generation.
- Create: `tools/lesson-audit/lesson-audit.test.js`
  - Node built-in test coverage for static parsing, classification, handler validation, smoke-plan selection, and quote repair.
- Create: `tools/lesson-audit/fixtures/broken-onclick.html`
  - Fixture proving raw double quotes inside `onclick="..."` are detected.
- Create: `tools/lesson-audit/fixtures/working-n5.html`
  - Fixture proving a valid N5 fill-blank and multiple-choice page passes static checks.
- Create: `tools/lesson-audit/fixtures/n4-book2.html`
  - Fixture proving N4 Book 2 style `selectMC(...)` and `checkQuiz...()` controls are recognized.
- Create: `docs/superpowers/reports/2026-06-14-lesson-self-check-audit.md`
  - Human-readable per-file before/fix/after report.
- Create as generated outputs during implementation:
  - `docs/superpowers/reports/2026-06-14-lesson-static-before.json`
  - `docs/superpowers/reports/2026-06-14-lesson-browser-before.json`
  - `docs/superpowers/reports/2026-06-14-lesson-static-after.json`
  - `docs/superpowers/reports/2026-06-14-lesson-browser-after.json`
- Modify: affected `Lessons/**/*.html`
  - Only change markup or script that directly breaks self-check, assessment, scoring, feedback, or related navigation.
- Do not modify: `index.html`
  - The landing-page path-display cleanup is separate work.

### Task 1: Add Static Audit Failing Tests

**Files:**
- Create: `tools/lesson-audit/fixtures/broken-onclick.html`
- Create: `tools/lesson-audit/fixtures/working-n5.html`
- Create: `tools/lesson-audit/fixtures/n4-book2.html`
- Create: `tools/lesson-audit/lesson-audit.test.js`

- [ ] **Step 1: Add the broken inline-handler fixture**

Create `tools/lesson-audit/fixtures/broken-onclick.html`:

```html
<!doctype html>
<html lang="en">
<body>
  <input id="q1">
  <div id="q1-feedback"></div>
  <button class="check-btn" onclick="checkFillBlank('q1',['の'],'の','テーブルの 下に = \"at the under of the table\" = under the table.')">Check</button>
  <script>
    function checkFillBlank(id, answers, display, explanation) {
      document.getElementById(`${id}-feedback`).textContent = explanation;
    }
  </script>
</body>
</html>
```

- [ ] **Step 2: Add the valid N5 fixture**

Create `tools/lesson-audit/fixtures/working-n5.html`:

```html
<!doctype html>
<html lang="en">
<body>
  <input id="q1" value="の">
  <div id="q1-feedback"></div>
  <button class="check-btn" onclick="checkFillBlank('q1',['の'],'の','テーブルの 下に = &quot;under the table&quot;')">Check Fill</button>
  <div id="q2-feedback"></div>
  <button class="choice-btn" onclick="checkMC('q2', true, 'Correct', 'Because this answer matches the key.')">Choice</button>
  <script>
    function checkFillBlank(id, answers, display, explanation) {
      document.getElementById(`${id}-feedback`).textContent = explanation;
    }
    function checkMC(id, isCorrect, correctText, explanation) {
      document.getElementById(`${id}-feedback`).textContent = isCorrect ? correctText : explanation;
    }
  </script>
</body>
</html>
```

- [ ] **Step 3: Add the N4 Book 2 fixture**

Create `tools/lesson-audit/fixtures/n4-book2.html`:

```html
<!doctype html>
<html lang="en">
<body>
  <div class="option" onclick="selectMC('q10', 0, this)">A</div>
  <div id="q10-feedback"></div>
  <button class="check-btn" onclick="checkQuizFinal()">Check Answers</button>
  <script>
    const selectedAnswers = {};
    function selectMC(questionId, index, element) {
      selectedAnswers[questionId] = index;
      element.classList.add('selected');
    }
    function checkQuizFinal() {
      document.getElementById('q10-feedback').textContent = selectedAnswers.q10 === 0 ? 'Correct' : 'Try again';
    }
  </script>
</body>
</html>
```

- [ ] **Step 4: Add failing tests for the audit helpers**

Create `tools/lesson-audit/lesson-audit.test.js`:

```javascript
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const audit = require('./lesson-audit');

const fixtureDir = path.join(__dirname, 'fixtures');

function readFixture(name) {
  return fs.readFileSync(path.join(fixtureDir, name), 'utf8');
}

test('classifies the three live lesson patterns by path and content', () => {
  assert.equal(
    audit.classifyLessonFile('Lessons/N5-Lessons/Lesson_10.html', readFixture('working-n5.html')),
    'n5-inline-checker'
  );
  assert.equal(
    audit.classifyLessonFile('Lessons/N4-Lessons-Book 2/Lesson_1.html', readFixture('n4-book2.html')),
    'n4-book2-interactive'
  );
  assert.equal(
    audit.classifyLessonFile('Lessons/N4-Lessons-Book-1/Lesson_5.html', '<button class="check-btn" onclick="nextSlide()">Check Answers</button>'),
    'n4-book1-answer-card'
  );
});

test('detects raw double quotes that break an onclick attribute', () => {
  const result = audit.analyzeHtml('fixtures/broken-onclick.html', readFixture('broken-onclick.html'));
  assert.equal(result.ok, false);
  assert.equal(result.inlineHandlerErrors.length, 1);
  assert.match(result.inlineHandlerErrors[0].message, /Invalid|Unexpected|missing|token/i);
});

test('passes a valid N5 page with encoded quote text', () => {
  const result = audit.analyzeHtml('fixtures/working-n5.html', readFixture('working-n5.html'));
  assert.equal(result.ok, true);
  assert.equal(result.scriptErrors.length, 0);
  assert.equal(result.inlineHandlerErrors.length, 0);
  assert.equal(result.missingHandlers.length, 0);
});

test('builds smoke actions for N4 Book 2 interactive quizzes', () => {
  const actions = audit.buildSmokePlan('fixtures/n4-book2.html', readFixture('n4-book2.html'));
  assert.deepEqual(actions.map(action => action.kind), ['select-option', 'click-check']);
});

test('repairs raw double quotes inside onclick source without changing visible text', () => {
  const source = readFixture('broken-onclick.html');
  const repaired = audit.repairInlineOnclickQuotes(source);
  assert.match(repaired, /&quot;at the under of the table\\&quot;|\\&quot;at the under of the table\\&quot;/);
  const result = audit.analyzeHtml('fixtures/repaired.html', repaired);
  assert.equal(result.ok, true);
});
```

- [ ] **Step 5: Run tests and confirm they fail because the harness does not exist**

Run:

```powershell
& $NODE --test tools\lesson-audit\lesson-audit.test.js
```

Expected:

```text
not ok 1 - tools\lesson-audit\lesson-audit.test.js
Error: Cannot find module './lesson-audit'
```

### Task 2: Implement Static Audit CLI

**Files:**
- Create: `tools/lesson-audit/lesson-audit.js`
- Modify: `tools/lesson-audit/lesson-audit.test.js` if a helper name in the implementation needs a clearer assertion

- [ ] **Step 1: Implement the static helper module and CLI**

Create `tools/lesson-audit/lesson-audit.js` with these public exports:

```javascript
module.exports = {
  analyzeFile,
  analyzeHtml,
  buildSmokePlan,
  classifyLessonFile,
  findLessonFiles,
  repairInlineOnclickQuotes,
  runBrowserAudit,
  runCli,
  runStaticAudit,
};
```

Implementation requirements:

```javascript
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const LESSON_ROOT = path.join(REPO_ROOT, 'Lessons');
const EVENT_ATTR_RE = /\s(on[a-z]+)="([^"]*)"/gi;
const SCRIPT_RE = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function lineNumberForIndex(source, index) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function findLessonFiles(root = LESSON_ROOT) {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) files.push(fullPath);
    }
  }
  walk(root);
  return files.sort((a, b) => toPosix(a).localeCompare(toPosix(b)));
}

function classifyLessonFile(filePath, html) {
  const normalized = toPosix(filePath);
  if (normalized.includes('N5-Lessons/')) return 'n5-inline-checker';
  if (normalized.includes('N4-Lessons-Book 2/')) return 'n4-book2-interactive';
  if (normalized.includes('N4-Lessons-Book-1/')) return 'n4-book1-answer-card';
  if (/checkFillBlank|checkMC/.test(html)) return 'n5-inline-checker';
  if (/selectMC|checkQuiz/.test(html)) return 'n4-book2-interactive';
  return 'unknown';
}
```

The rest of the implementation must:

- extract script blocks with `SCRIPT_RE`
- compile each script with `new Function(scriptSource)`
- extract inline handler attributes with `EVENT_ATTR_RE`
- compile each parsed handler value with `new Function(handlerSource)`
- collect called function names from inline handlers with `/\b([A-Za-z_$][\w$]*)\s*\(/g`
- collect declared function names from scripts with `/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g`
- report a missing handler when an inline handler calls a non-built-in function that is not declared in any script block
- return `{ file, classification, ok, scriptErrors, inlineHandlerErrors, missingHandlers, smokePlan }`
- support `--mode static`, `--out docs\superpowers\reports\2026-06-14-lesson-static-before.json`, `--batch-size 15`, and `--batch-index 1`

- [ ] **Step 2: Implement the quote repair helper**

Add `repairInlineOnclickQuotes(html)` to `lesson-audit.js`:

```javascript
function repairInlineOnclickQuotes(html) {
  return html.replace(/<([a-z][\w:-]*)(\b[^>]*?\sonclick=")([\s\S]*?)("\s*[^>]*>)/gi, (full, tag, before, handlerSource, after) => {
    if (!handlerSource.includes('"')) return full;
    const repairedHandler = handlerSource.replace(/"/g, '&quot;');
    return `<${tag}${before}${repairedHandler}${after}`;
  });
}
```

This helper intentionally repairs only raw double quotes inside an already located `onclick` source. It must not change single quotes, Japanese text, answer keys, or lesson content outside event-handler attributes.

- [ ] **Step 3: Run unit tests and make them pass**

Run:

```powershell
& $NODE --test tools\lesson-audit\lesson-audit.test.js
```

Expected:

```text
# tests 5
# pass 5
# fail 0
```

- [ ] **Step 4: Run a full static baseline**

Run:

```powershell
& $NODE tools\lesson-audit\lesson-audit.js --mode static --out docs\superpowers\reports\2026-06-14-lesson-static-before.json
```

Expected:

```text
Scanned 61 lesson file(s).
Static failures: 17
```

The known failure set should include:

```text
Lessons/N5-Lessons/Lesson_10.html
Lessons/N5-Lessons/Lesson_11.html
Lessons/N5-Lessons/Lesson_12.html
Lessons/N5-Lessons/Lesson_13.html
Lessons/N5-Lessons/Lesson_14.html
Lessons/N5-Lessons/Lesson_16.html
Lessons/N5-Lessons/Lesson_17.html
Lessons/N5-Lessons/Lesson_18.html
Lessons/N5-Lessons/Lesson_19.html
Lessons/N5-Lessons/Lesson_2.html
Lessons/N5-Lessons/Lesson_20.html
Lessons/N5-Lessons/Lesson_21.html
Lessons/N5-Lessons/Lesson_25.html
Lessons/N5-Lessons/Lesson_5.html
Lessons/N5-Lessons/Lesson_7.html
Lessons/N5-Lessons/Lesson_8.html
Lessons/N5-Lessons/Lesson_9.html
```

- [ ] **Step 5: Commit the static harness**

Run:

```powershell
git add tools\lesson-audit
git add -f docs\superpowers\reports\2026-06-14-lesson-static-before.json
git commit -m "Add lesson self-check audit harness"
```

Expected:

```text
Commit is created on `codex/lesson-self-check-audit` with message `Add lesson self-check audit harness`.
```

### Task 3: Add Browser Smoke Audit

**Files:**
- Modify: `tools/lesson-audit/lesson-audit.js`
- Modify: `tools/lesson-audit/lesson-audit.test.js`

- [ ] **Step 1: Add failing tests for smoke-plan selection**

Extend `tools/lesson-audit/lesson-audit.test.js` with:

```javascript
test('builds N5 smoke actions for fill blank and multiple choice controls', () => {
  const actions = audit.buildSmokePlan('fixtures/working-n5.html', readFixture('working-n5.html'));
  assert.deepEqual(actions.map(action => action.kind), ['fill-input', 'click-check', 'click-choice']);
});

test('does not invent grading checks for answer-card slides', () => {
  const html = '<button class="check-btn" onclick="nextSlide()">Check Answers</button><script>function nextSlide(){}</script>';
  const actions = audit.buildSmokePlan('Lessons/N4-Lessons-Book-1/Lesson_1.html', html);
  assert.deepEqual(actions.map(action => action.kind), ['click-check']);
});
```

Run:

```powershell
& $NODE --test tools\lesson-audit\lesson-audit.test.js
```

Expected:

```text
not ok
```

The failure should be about smoke-plan action arrays.

- [ ] **Step 2: Implement `buildSmokePlan`**

Update `buildSmokePlan(filePath, html)` in `lesson-audit.js`:

```javascript
function buildSmokePlan(filePath, html) {
  const classification = classifyLessonFile(filePath, html);
  const actions = [];
  if (classification === 'n5-inline-checker') {
    if (/\bcheckFillBlank\s*\(/.test(html)) actions.push({ kind: 'fill-input', selector: 'input[id^="q"]', value: 'test' });
    if (/\bcheckFillBlank\s*\(/.test(html)) actions.push({ kind: 'click-check', selector: '.check-btn' });
    if (/\bcheckMC\s*\(/.test(html)) actions.push({ kind: 'click-choice', selector: '.choice-btn, .option, button[onclick*="checkMC"]' });
  } else if (classification === 'n4-book1-answer-card') {
    actions.push({ kind: 'click-check', selector: '.check-btn, button[onclick*="nextSlide"]' });
  } else if (classification === 'n4-book2-interactive') {
    if (/\bselectMC\s*\(/.test(html)) actions.push({ kind: 'select-option', selector: '[onclick*="selectMC"], .option' });
    actions.push({ kind: 'click-check', selector: '.check-btn, button[onclick*="checkQuiz"]' });
  }
  return actions;
}
```

- [ ] **Step 3: Implement Chrome CDP browser smoke checks**

Add browser audit support to `lesson-audit.js` using only Node built-ins:

- find Chrome in this order:
  - `C:\Program Files\Google\Chrome\Application\chrome.exe`
  - `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`
- start with:
  - `--headless=new`
  - `--remote-debugging-port=0`
  - `--user-data-dir=` followed by a directory created with `fs.mkdtempSync(path.join(os.tmpdir(), 'lesson-audit-chrome-'))`
  - `--disable-gpu`
  - `about:blank`
- read the DevTools websocket URL from Chrome stderr line matching `DevTools listening on`
- connect with the global `WebSocket`
- send CDP messages for:
  - `Runtime.enable`
  - `Page.enable`
  - `Log.enable`
  - `Page.navigate`
  - `Runtime.evaluate`
- collect:
  - `Runtime.exceptionThrown`
  - `Log.entryAdded` where level is `error`
  - failed `Runtime.evaluate` results from click actions

The page interaction evaluation should:

```javascript
(() => {
  const errors = [];
  const clickFirst = selector => {
    const element = document.querySelector(selector);
    if (!element) return false;
    element.click();
    return true;
  };
  const firstInput = document.querySelector('input[id^="q"], textarea[id^="q"]');
  if (firstInput) {
    firstInput.value = firstInput.value || 'test';
    firstInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
  return {
    title: document.title,
    checkButtons: document.querySelectorAll('.check-btn, button[onclick*="check"], button[onclick*="nextSlide"]').length,
    clickedCheck: clickFirst('.check-btn, button[onclick*="check"], button[onclick*="nextSlide"]'),
    clickedChoice: clickFirst('.choice-btn, [onclick*="checkMC"], [onclick*="selectMC"], .option'),
    feedbackText: Array.from(document.querySelectorAll('[id$="-feedback"], .feedback, .result, .score, .answer-card'))
      .map(node => node.textContent.trim())
      .filter(Boolean)
      .slice(0, 5)
  };
})()
```

`runBrowserAudit` should return one result per file:

```javascript
{
  file,
  classification,
  ok,
  title,
  checkButtons,
  clickedCheck,
  clickedChoice,
  feedbackText,
  pageErrors,
  consoleErrors
}
```

- [ ] **Step 4: Run tests and browser baseline**

Run:

```powershell
& $NODE --test tools\lesson-audit\lesson-audit.test.js
& $NODE tools\lesson-audit\lesson-audit.js --mode browser --out docs\superpowers\reports\2026-06-14-lesson-browser-before.json
```

Expected:

```text
# fail 0
Scanned 61 lesson file(s).
Browser failures: nonzero before fixes if runtime-only lesson issues remain
```

If Chrome launch fails because of the Windows environment, capture the exact failure in the report and continue with static repairs. Do not mark browser verification as passed if it did not run.

- [ ] **Step 5: Commit browser audit support**

Run:

```powershell
git add tools\lesson-audit
git add -f docs\superpowers\reports\2026-06-14-lesson-browser-before.json
git commit -m "Add lesson browser smoke audit"
```

Expected:

```text
Commit is created on `codex/lesson-self-check-audit` with message `Add lesson browser smoke audit`.
```

### Task 4: Apply Shared N5 Inline Handler Repair

**Files:**
- Modify: `tools/lesson-audit/lesson-audit.js`
- Modify: affected `Lessons/N5-Lessons/*.html`
- Modify: `docs/superpowers/reports/2026-06-14-lesson-self-check-audit.md`

- [ ] **Step 1: Add CLI support for dry-run and apply repair**

Extend `runCli` in `lesson-audit.js` to support:

```text
--fix-inline-onclick-quotes
--dry-run
```

Behavior:

- scan all lesson files
- run `analyzeFile` before repair
- only consider files with inline handler errors
- call `repairInlineOnclickQuotes(html)`
- run `analyzeHtml(file, repairedHtml)`
- in dry-run mode, print files where the repair changes text and clears static inline-handler errors
- in apply mode, write only files where the repaired result has fewer inline-handler errors

- [ ] **Step 2: Run dry-run and confirm the target set**

Run:

```powershell
& $NODE tools\lesson-audit\lesson-audit.js --fix-inline-onclick-quotes --dry-run
```

Expected target set:

```text
Lessons/N5-Lessons/Lesson_10.html
Lessons/N5-Lessons/Lesson_11.html
Lessons/N5-Lessons/Lesson_12.html
Lessons/N5-Lessons/Lesson_13.html
Lessons/N5-Lessons/Lesson_14.html
Lessons/N5-Lessons/Lesson_16.html
Lessons/N5-Lessons/Lesson_17.html
Lessons/N5-Lessons/Lesson_18.html
Lessons/N5-Lessons/Lesson_19.html
Lessons/N5-Lessons/Lesson_2.html
Lessons/N5-Lessons/Lesson_20.html
Lessons/N5-Lessons/Lesson_21.html
Lessons/N5-Lessons/Lesson_25.html
Lessons/N5-Lessons/Lesson_5.html
Lessons/N5-Lessons/Lesson_7.html
Lessons/N5-Lessons/Lesson_8.html
Lessons/N5-Lessons/Lesson_9.html
```

If the dry-run target set includes any N4 files, stop and inspect before applying the repair.

- [ ] **Step 3: Apply the shared repair**

Run:

```powershell
& $NODE tools\lesson-audit\lesson-audit.js --fix-inline-onclick-quotes
```

Expected:

```text
Repaired 17 file(s).
```

- [ ] **Step 4: Verify static audit now passes or exposes different failures**

Run:

```powershell
& $NODE tools\lesson-audit\lesson-audit.js --mode static --out docs\superpowers\reports\2026-06-14-lesson-static-after-n5.json
```

Expected:

```text
Scanned 61 lesson file(s).
Static failures: 0
```

If failures remain, inspect each remaining file and repair only the named defect.

- [ ] **Step 5: Add report entry for the shared root cause**

Create or update `docs/superpowers/reports/2026-06-14-lesson-self-check-audit.md` with:

```markdown
# Lesson Self-Check Audit Report

Date: 2026-06-14

## Shared Root Cause

N5 lesson files used double-quoted HTML `onclick="..."` attributes while explanation strings inside the handler contained raw double quotes. The browser treated those quotes as the end of the attribute, which truncated the handler and prevented self-check controls from running. The repair encoded raw double quotes inside affected `onclick` handlers as `&quot;`, preserving the explanation text and keeping the existing functions.

## Affected Files

| File | Before | Fix | After |
| --- | --- | --- | --- |
| `Lessons/N5-Lessons/Lesson_10.html` | Inline handler parse failure | Encoded raw quotes in `onclick` explanation text | Static pass |
```

Complete one row for every affected file from the dry-run target set.

- [ ] **Step 6: Commit the N5 repair batch**

Run:

```powershell
git add tools\lesson-audit Lessons\N5-Lessons
git add -f docs\superpowers\reports\2026-06-14-lesson-static-after-n5.json docs\superpowers\reports\2026-06-14-lesson-self-check-audit.md
git commit -m "Fix N5 self-check inline handlers"
```

Expected:

```text
Commit is created on `codex/lesson-self-check-audit` with message `Fix N5 self-check inline handlers`.
```

### Task 5: Batch Audit And Repair Remaining Lesson Files

**Files:**
- Modify: affected `Lessons/**/*.html`
- Modify: `docs/superpowers/reports/2026-06-14-lesson-self-check-audit.md`

- [ ] **Step 1: Run static and browser audits in batches of 15**

Run:

```powershell
& $NODE tools\lesson-audit\lesson-audit.js --mode static --batch-size 15 --batch-index 1 --out docs\superpowers\reports\batch-1-static.json
& $NODE tools\lesson-audit\lesson-audit.js --mode browser --batch-size 15 --batch-index 1 --out docs\superpowers\reports\batch-1-browser.json
& $NODE tools\lesson-audit\lesson-audit.js --mode static --batch-size 15 --batch-index 2 --out docs\superpowers\reports\batch-2-static.json
& $NODE tools\lesson-audit\lesson-audit.js --mode browser --batch-size 15 --batch-index 2 --out docs\superpowers\reports\batch-2-browser.json
& $NODE tools\lesson-audit\lesson-audit.js --mode static --batch-size 15 --batch-index 3 --out docs\superpowers\reports\batch-3-static.json
& $NODE tools\lesson-audit\lesson-audit.js --mode browser --batch-size 15 --batch-index 3 --out docs\superpowers\reports\batch-3-browser.json
& $NODE tools\lesson-audit\lesson-audit.js --mode static --batch-size 15 --batch-index 4 --out docs\superpowers\reports\batch-4-static.json
& $NODE tools\lesson-audit\lesson-audit.js --mode browser --batch-size 15 --batch-index 4 --out docs\superpowers\reports\batch-4-browser.json
& $NODE tools\lesson-audit\lesson-audit.js --mode static --batch-size 15 --batch-index 5 --out docs\superpowers\reports\batch-5-static.json
& $NODE tools\lesson-audit\lesson-audit.js --mode browser --batch-size 15 --batch-index 5 --out docs\superpowers\reports\batch-5-browser.json
```

Expected:

```text
Batch 1: scanned 15 file(s)
Batch 2: scanned 15 file(s)
Batch 3: scanned 15 file(s)
Batch 4: scanned 15 file(s)
Batch 5: scanned 1 file(s)
```

- [ ] **Step 2: Repair isolated failures one file at a time**

For each failing file reported after the N5 shared fix:

1. Open the exact file and line reported by the harness.
2. Identify whether the problem is:
   - malformed event-handler source
   - missing function referenced by markup
   - selector or ID mismatch
   - handler runs but feedback does not update
   - handler runs but scoring is wrong
3. Patch only that file's local issue.
4. Re-run the exact failing batch command.
5. Add or update one row in `docs/superpowers/reports/2026-06-14-lesson-self-check-audit.md`.

Use this row format for isolated fixes, replacing the example values with the actual file and harness evidence:

```markdown
| `Lessons/N4-Lessons-Book 2/Lesson_1.html` | Browser smoke clicked the check button but no feedback text changed | Corrected the local feedback selector used by `checkQuizFinal()` | Batch 1 static pass and browser pass |
```

- [ ] **Step 3: Stop for closer review if a file does not match a known pattern**

If a failure cannot be explained by one of the five categories in Step 2, do not patch it by guesswork. Add a section to the report:

```markdown
## Needs Closer Review

| File | Evidence | Why it needs review |
| --- | --- | --- |
| `Lessons/N4-Lessons-Book-1/Lesson_5.html` | Browser smoke reports a click handler exception from `nextSlide()` | The file does not match the N4 Book 1 answer-card pattern closely enough to patch without confirming intended behavior |
```

Then ask the user before changing that file.

- [ ] **Step 4: Commit remaining lesson fixes**

After a batch passes and no "Needs Closer Review" items are pending, run:

```powershell
git add Lessons
git add -f docs\superpowers\reports\batch-*-static.json docs\superpowers\reports\batch-*-browser.json docs\superpowers\reports\2026-06-14-lesson-self-check-audit.md
git commit -m "Repair remaining lesson self-check issues"
```

Expected:

```text
Commit is created on `codex/lesson-self-check-audit` with message `Repair remaining lesson self-check issues`.
```

If no remaining lesson files needed changes after the N5 shared fix, skip this commit and write that outcome in the report.

### Task 6: Final Verification And Report

**Files:**
- Modify: `docs/superpowers/reports/2026-06-14-lesson-self-check-audit.md`
- Modify: generated JSON reports if final audit outputs differ

- [ ] **Step 1: Run final static audit**

Run:

```powershell
& $NODE tools\lesson-audit\lesson-audit.js --mode static --out docs\superpowers\reports\2026-06-14-lesson-static-after.json
```

Expected:

```text
Scanned 61 lesson file(s).
Static failures: 0
```

- [ ] **Step 2: Run final browser smoke audit**

Run:

```powershell
& $NODE tools\lesson-audit\lesson-audit.js --mode browser --out docs\superpowers\reports\2026-06-14-lesson-browser-after.json
```

Expected when Chrome is available:

```text
Scanned 61 lesson file(s).
Browser failures: 0
```

If Chrome is blocked by the environment, the report must say browser verification was blocked and include the exact launch or connection failure. Do not replace the browser audit with a success claim.

- [ ] **Step 3: Verify repository hygiene**

Run:

```powershell
git diff --check
git status --short
```

Expected:

```text
No git diff --check errors
 M docs/superpowers/reports/2026-06-14-lesson-self-check-audit.md
 M docs/superpowers/reports/2026-06-14-lesson-static-after.json
 M docs/superpowers/reports/2026-06-14-lesson-browser-after.json
```

`index.html` must not appear in this worktree's status.

- [ ] **Step 4: Complete the report summary**

Ensure `docs/superpowers/reports/2026-06-14-lesson-self-check-audit.md` contains:

```markdown
## Final Verification

| Check | Result |
| --- | --- |
| Static audit | 61 / 61 passed |
| Browser smoke audit | 61 / 61 passed |
| `git diff --check` | Passed |

## Per-File Summary

| File | Before | Fix | After |
| --- | --- | --- |
```

The per-file summary must include all 61 lesson files. Files with no issue should use:

```markdown
| `Lessons/N5-Lessons/Lesson_1.html` | Passed baseline audit | No change | Passed final audit |
```

- [ ] **Step 5: Commit final verification artifacts**

Run:

```powershell
git add -f docs\superpowers\reports\2026-06-14-lesson-self-check-audit.md docs\superpowers\reports\2026-06-14-lesson-static-after.json docs\superpowers\reports\2026-06-14-lesson-browser-after.json
git commit -m "Document lesson self-check verification"
```

Expected:

```text
Commit is created on `codex/lesson-self-check-audit` with message `Document lesson self-check verification`.
```

If the previous repair commit already included the final report and there are no changes, skip this commit and note that no final artifact changes remained.

## Final Handoff

At completion, provide:

- isolated worktree path
- branch name
- commit list
- shared root cause summary
- files changed
- verification commands and results
- link to `docs/superpowers/reports/2026-06-14-lesson-self-check-audit.md`

Do not claim browser verification passed unless the final browser smoke audit completed with `Browser failures: 0`.
