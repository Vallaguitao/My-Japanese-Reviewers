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
  const selectActionText = JSON.stringify(actions[0]).replace(/\\"/g, '"');
  assert.match(selectActionText, /\.mc-option|\[onclick\*="selectMC"\]/);
});

test('repairs raw double quotes inside onclick source without changing visible text', () => {
  const source = readFixture('broken-onclick.html');
  const repaired = audit.repairInlineOnclickQuotes(source);
  const result = audit.analyzeHtml('fixtures/repaired.html', repaired);
  assert.equal(result.ok, true);
  assert.match(repaired, /at the under of the table/);
  assert.match(repaired, /&quot;at the under of the table&quot;/);
});
