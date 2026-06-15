const assert = require('node:assert/strict');
const test = require('node:test');

const {
  categoryFor,
  pageLabelFor,
  relativeIndexHref,
  transformHtml,
  walkHtmlFiles
} = require('./breadcrumbs.cjs');

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
