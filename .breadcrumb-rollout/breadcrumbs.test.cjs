const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  BREADCRUMB_END,
  BREADCRUMB_START,
  CSS_END,
  CSS_START,
  applyBreadcrumbs,
  audit,
  auditFile,
  breadcrumbCss,
  breadcrumbHtml,
  categoryFor,
  pageLabelFor,
  relativeIndexHref,
  transformHtml,
  walkHtmlFiles
} = require('./breadcrumbs.cjs');

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'breadcrumbs-test-'));
  fs.mkdirSync(path.join(root, 'Vocabulary'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'index.html'),
    [
      "id: 'lessons'",
      "id: 'vocabulary'",
      "id: 'quiz'",
      "id: 'kanji'",
      "id: 'jft-mock'",
      "id: 'jlpt-mock'",
      "id: 'targeted-quiz'",
      "id: 'specialized-lessons'"
    ].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'Vocabulary', 'vocabulary1.html'),
    transformHtml('Vocabulary/vocabulary1.html', '<html><head><style>body{}</style></head><body><main></main></body></html>'),
    'utf8'
  );
  return root;
}

test('maps top-level folders to root category hashes', () => {
  assert.deepEqual(categoryFor('Lessons/N5-Lessons/Lesson_1.html'), { label: 'Lessons', hash: 'lessons' });
  assert.deepEqual(categoryFor('Vocabulary/vocabulary1.html'), { label: 'Vocabulary', hash: 'vocabulary' });
  assert.deepEqual(categoryFor('Quiz/Vocabulary-1_n5.html'), { label: 'Quiz', hash: 'quiz' });
  assert.deepEqual(categoryFor('Kanji/Kanji_flashcard.html'), { label: 'Kanji', hash: 'kanji' });
  assert.deepEqual(categoryFor('JFT-Mock/Jimushitsu Set.html'), { label: 'JFT Mock', hash: 'jft-mock' });
  assert.deepEqual(categoryFor('JLPT-Mock/N5-N4_Mock.html'), { label: 'JLPT Mock', hash: 'jlpt-mock' });
  assert.deepEqual(categoryFor('Targeted-Quiz/Counters_Quiz.html'), { label: 'Targeted Quiz', hash: 'targeted-quiz' });
  assert.deepEqual(categoryFor('Specialized-Lessons/Verb_Conjugation_Lesson.html'), { label: 'Specialized Lessons', hash: 'specialized-lessons' });
});

test('computes relative Home hrefs from one-level and two-level paths', () => {
  assert.equal(relativeIndexHref('Kanji/Kanji_flashcard.html'), '../index.html');
  assert.equal(relativeIndexHref('Vocabulary/vocabulary25.html'), '../index.html');
  assert.equal(relativeIndexHref('Lessons/N5-Lessons/Lesson_1.html'), '../../index.html');
  assert.equal(relativeIndexHref('Lessons/N4-Lessons-Book 2/Lesson_10.html'), '../../index.html');
});

test('creates current page labels for known page families and generic files', () => {
  assert.equal(pageLabelFor('Lessons/N5-Lessons/Lesson_18.html'), 'N5 Lesson 18');
  assert.equal(pageLabelFor('Lessons/N4-Lessons-Book-1/Lesson_7.html'), 'N4 Book 1 Lesson 7');
  assert.equal(pageLabelFor('Lessons/N4-Lessons-Book 2/Lesson_12.html'), 'N4 Book 2 Lesson 12');
  assert.equal(pageLabelFor('Vocabulary/vocabulary25.html'), 'Vocabulary 25');
  assert.equal(pageLabelFor('JFT-Mock/Jimushitsu Set.html'), 'Jimushitsu Set');
  assert.equal(pageLabelFor('JFT-Mock/N5-Mock_Practice.html'), 'N5 Mock Practice');
});

test('inserts progress-page breadcrumb before presentation wrapper', () => {
  const html = '<html><head><style>body{}</style></head><body><div class="progress-container"></div>\n    <div class="presentation"></div></body></html>';
  const result = transformHtml('Lessons/N5-Lessons/Lesson_1.html', html);
  assert.match(result, /Site Breadcrumb/);
  assert.ok(result.indexOf('site-breadcrumb') < result.indexOf('<div class="presentation">'));
  assert.match(result, /href="..\/..\/index.html#lessons"/);
});

test('inserts non-progress breadcrumb immediately after opening body tag', () => {
  const html = '<html><head><style>body{}</style></head><body class="page"><main></main></body></html>';
  const result = transformHtml('Kanji/Kanji_flashcard.html', html);
  assert.match(result, /<body class="page">\n\n<!-- Site Breadcrumb -->/);
  assert.match(result, /href="..\/index.html#kanji"/);
});

test('repeated transform is idempotent', () => {
  const html = '<html><head><style>body{}</style></head><body><main></main></body></html>';
  const once = transformHtml('Vocabulary/vocabulary1.html', html);
  const twice = transformHtml('Vocabulary/vocabulary1.html', once);
  assert.equal(twice, once);
  assert.equal((twice.match(/<!-- Site Breadcrumb -->/g) || []).length, 1);
  assert.equal((twice.match(/\/\* ========== Site Breadcrumb ========== \*\//g) || []).length, 1);
});

test('walkHtmlFiles excludes root index and worktree files', () => {
  const files = walkHtmlFiles(process.cwd());
  assert.ok(!files.includes('index.html'));
  assert.ok(files.every(file => !file.startsWith('.worktrees/')));
  assert.equal(files.length, 109);
});

test('audit rejects unknown --only selections', () => {
  const root = makeFixture();
  const result = audit(root, 'Typo/Nope.html');

  assert.equal(result.ok, false);
  assert.equal(result.scanned, 0);
  assert.deepEqual(result.selectionFailures, ['unknown --only path: Typo/Nope.html']);
});

test('audit rejects empty --only selections', () => {
  const root = makeFixture();
  const result = audit(root, ' , ');

  assert.equal(result.ok, false);
  assert.equal(result.scanned, 0);
  assert.deepEqual(result.selectionFailures, ['--only did not include any paths']);
});

test('full audit reports inventory drift without enforcing count for --only subsets', () => {
  const root = makeFixture();
  const fullResult = audit(root);
  const subsetResult = audit(root, 'Vocabulary/vocabulary1.html');

  assert.equal(fullResult.ok, false);
  assert.equal(fullResult.scanned, 1);
  assert.deepEqual(fullResult.inventoryFailures, ['expected 109 target files, found 1']);
  assert.equal(subsetResult.ok, true);
  assert.deepEqual(subsetResult.inventoryFailures, []);
});

test('full apply reports inventory drift before writing', () => {
  const root = makeFixture();
  const relPath = 'Vocabulary/vocabulary1.html';
  const before = fs.readFileSync(path.join(root, relPath), 'utf8');
  const result = applyBreadcrumbs(root);
  const after = fs.readFileSync(path.join(root, relPath), 'utf8');

  assert.equal(result.ok, false);
  assert.equal(result.scanned, 1);
  assert.deepEqual(result.changed, []);
  assert.deepEqual(result.inventoryFailures, ['expected 109 target files, found 1']);
  assert.equal(after, before);
});

test('audit validates both breadcrumb and CSS end markers', () => {
  const root = makeFixture();
  const relPath = 'Vocabulary/vocabulary1.html';
  const html = [
    breadcrumbCss().replace(CSS_END, ''),
    breadcrumbHtml(relPath).replace(BREADCRUMB_END, '')
  ].join('\n');
  fs.writeFileSync(path.join(root, relPath), html, 'utf8');

  const problems = auditFile(root, relPath);

  assert.ok(problems.includes('expected exactly one breadcrumb end marker, found 0'));
  assert.ok(problems.includes('expected exactly one breadcrumb CSS end marker, found 0'));
});

test('audit validates breadcrumb content inside the generated block', () => {
  const root = makeFixture();
  const relPath = 'Vocabulary/vocabulary1.html';
  const otherRelPath = 'Vocabulary/vocabulary2.html';
  const html = [
    breadcrumbCss(),
    breadcrumbHtml(otherRelPath),
    `<!-- global decoys: href="../index.html" href="../index.html#vocabulary" >Vocabulary</a> aria-current="page">Vocabulary 1</span> -->`
  ].join('\n');
  fs.writeFileSync(path.join(root, relPath), html, 'utf8');

  const problems = auditFile(root, relPath);

  assert.deepEqual(problems, ['breadcrumb block does not match generated content']);
});
