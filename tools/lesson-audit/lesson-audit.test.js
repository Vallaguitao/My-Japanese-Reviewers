const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
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

test('analyzes single-quoted and unquoted event handlers for missing functions', () => {
  const html = `
    <!doctype html>
    <button onclick='missingSingle()'>Single</button>
    <button onmouseover=missingBare()>Bare</button>
  `;
  const result = audit.analyzeHtml('fixtures/mixed-handler-quotes.html', html);

  assert.equal(result.ok, false);
  assert.equal(result.inlineHandlerErrors.length, 0);
  assert.deepEqual(
    result.missingHandlers.map(handler => handler.functionName).sort(),
    ['missingBare', 'missingSingle']
  );
});

test('decodes entity-encoded handler source before analysis', () => {
  const html = `
    <!doctype html>
    <button onclick="alert(&quot;x&quot;); show(&#39;&lt;span&gt;&amp;&#39;, &#x22;z&#x22;, &apos;a&apos;)">Decode</button>
    <script>
      function show(first, second, third) {
        return [first, second, third].join('');
      }
    </script>
  `;
  const result = audit.analyzeHtml('fixtures/entity-handler.html', html);

  assert.equal(result.ok, true);
  assert.equal(result.inlineHandlerErrors.length, 0);
  assert.equal(result.missingHandlers.length, 0);
});

test('does not treat script variables as inline event attributes', () => {
  const html = `
    <!doctype html>
    <script>
      const onclickAttr = option.getAttribute("onclick");
      function option() {}
    </script>
  `;
  const result = audit.analyzeHtml('fixtures/script-onclick-variable.html', html);

  assert.equal(result.ok, true);
  assert.equal(result.inlineHandlerErrors.length, 0);
  assert.equal(result.missingHandlers.length, 0);
});

test('builds smoke actions for N4 Book 2 interactive quizzes', () => {
  const actions = audit.buildSmokePlan('fixtures/n4-book2.html', readFixture('n4-book2.html'));
  assert.deepEqual(actions.map(action => action.kind), ['fill-input', 'select-option', 'click-check']);
  const selectActionText = JSON.stringify(actions[0]).replace(/\\"/g, '"');
  assert.match(selectActionText, /\.blank-input|input/);
});

test('builds N5 smoke actions for fill blank and multiple choice controls', () => {
  const actions = audit.buildSmokePlan('fixtures/working-n5.html', readFixture('working-n5.html'));
  assert.deepEqual(actions.map(action => action.kind), ['fill-input', 'click-check', 'click-choice']);
});

test('builds browser smoke actions that cover all matching controls', () => {
  const n5Actions = audit.buildSmokePlan('fixtures/working-n5.html', readFixture('working-n5.html'));
  assert.ok(n5Actions.every(action => action.scope === 'all'));

  const n4Book2Actions = audit.buildSmokePlan('fixtures/n4-book2.html', readFixture('n4-book2.html'));
  assert.ok(n4Book2Actions.every(action => action.scope === 'all'));
  assert.deepEqual(n4Book2Actions.map(action => action.kind), ['fill-input', 'select-option', 'click-check']);

  const n4Book1Actions = audit.buildSmokePlan(
    'Lessons/N4-Lessons-Book-1/Lesson_1.html',
    '<button class="check-btn" onclick="nextSlide()">Check Answers</button><script>function nextSlide(){}</script>'
  );
  assert.ok(n4Book1Actions.every(action => action.scope === 'all'));
});

test('does not invent grading checks for answer-card slides', () => {
  const html = '<button class="check-btn" onclick="nextSlide()">Check Answers</button><script>function nextSlide(){}</script>';
  const actions = audit.buildSmokePlan('Lessons/N4-Lessons-Book-1/Lesson_1.html', html);
  assert.deepEqual(actions.map(action => action.kind), ['click-check']);
});

test('runs browser audit through an injected backend', async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lesson-audit-browser-'));
  const lessonPath = path.join(tempRoot, 'Lesson_1.html');
  const calls = [];

  fs.writeFileSync(lessonPath, '<!doctype html><title>Smoke</title>', 'utf8');

  try {
    const report = await audit.runBrowserAudit({
      root: tempRoot,
      browserBackend: {
        name: 'fake-browser',
        executable: 'fake-browser.exe',
        async auditFile(filePath) {
          calls.push(path.basename(filePath));
          return {
            file: path.basename(filePath),
            classification: 'fake',
            ok: true,
            title: 'Smoke',
            checkButtons: 0,
            clickedCheck: false,
            clickedChoice: false,
            actionResults: [],
            feedbackText: [],
            pageErrors: [],
            consoleErrors: [],
            evaluationError: null,
            smokePlan: [],
          };
        },
        async close() {
          calls.push('close');
        },
      },
    });

    assert.equal(report.ok, true);
    assert.equal(report.scanned, 1);
    assert.equal(report.browserFailures, 0);
    assert.equal(report.browserBackend, 'fake-browser');
    assert.equal(report.browserExecutable, 'fake-browser.exe');
    assert.deepEqual(calls, ['Lesson_1.html', 'close']);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test('repairs raw double quotes inside onclick source without changing visible text', () => {
  const source = readFixture('broken-onclick.html');
  const repaired = audit.repairInlineOnclickQuotes(source);
  const result = audit.analyzeHtml('fixtures/repaired.html', repaired);
  assert.equal(result.ok, true);
  assert.match(repaired, /at the under of the table/);
  assert.match(repaired, /&quot;at the under of the table&quot;/);
});

test('previews and applies inline onclick quote repairs to lesson files', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lesson-audit-repair-'));
  const brokenPath = path.join(tempRoot, 'Lesson_1.html');
  const cleanPath = path.join(tempRoot, 'Lesson_2.html');
  const brokenSource = readFixture('broken-onclick.html');

  fs.writeFileSync(brokenPath, brokenSource, 'utf8');
  fs.writeFileSync(cleanPath, readFixture('working-n5.html'), 'utf8');

  try {
    const preview = audit.repairLessonFiles({ root: tempRoot, dryRun: true });
    assert.equal(preview.dryRun, true);
    assert.equal(preview.scanned, 2);
    assert.equal(preview.changed, 1);
    assert.deepEqual(preview.changedFiles, ['Lesson_1.html']);
    assert.equal(fs.readFileSync(brokenPath, 'utf8'), brokenSource);

    const applied = audit.repairLessonFiles({ root: tempRoot });
    assert.equal(applied.dryRun, false);
    assert.equal(applied.changed, 1);
    assert.notEqual(fs.readFileSync(brokenPath, 'utf8'), brokenSource);
    assert.equal(audit.analyzeFile(brokenPath).ok, true);
    assert.equal(audit.analyzeFile(cleanPath).ok, true);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test('repair report remains failing when unchanged files still have static errors', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lesson-audit-repair-ok-'));
  const brokenPath = path.join(tempRoot, 'Lesson_1.html');

  fs.writeFileSync(brokenPath, '<!doctype html><button onclick="missingHandler()">Broken</button>', 'utf8');

  try {
    const report = audit.repairLessonFiles({ root: tempRoot });
    assert.equal(report.changed, 0);
    assert.equal(report.ok, false);
    assert.equal(report.results[0].staticOkAfter, false);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
