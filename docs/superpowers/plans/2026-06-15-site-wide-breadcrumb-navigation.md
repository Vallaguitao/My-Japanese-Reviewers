# Site-Wide Breadcrumb Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add duplicated, self-contained breadcrumb HTML/CSS to every current content HTML page, using `Home > Category > Current Page` links back to the existing root category hashes.

**Architecture:** Keep the site runtime as plain static HTML/CSS/vanilla JS with no shared breadcrumb JavaScript. Use a temporary Node helper only during implementation to generate, insert, and audit identical breadcrumb snippets across the 109 content pages. Delete the helper before final handoff so the committed runtime remains only the edited HTML files.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js built-ins, PowerShell validation commands, bundled Codex Node, optional Playwright browser smoke using installed Chrome.

---

## Files

- Read: `docs/superpowers/specs/2026-06-15-site-wide-breadcrumb-navigation-design.md`
- Read: `index.html`
- Temporarily create: `.breadcrumb-rollout/breadcrumbs.cjs`
- Temporarily create: `.breadcrumb-rollout/breadcrumbs.test.cjs`
- Modify: `JFT-Mock/*.html`
- Modify: `JLPT-Mock/*.html`
- Modify: `Kanji/*.html`
- Modify: `Lessons/N5-Lessons/*.html`
- Modify: `Lessons/N4-Lessons-Book-1/*.html`
- Modify: `Lessons/N4-Lessons-Book 2/*.html`
- Modify: `Quiz/*.html`
- Modify: `Specialized-Lessons/*.html`
- Modify: `Targeted-Quiz/*.html`
- Modify: `Vocabulary/*.html`
- Do not modify: `index.html`, except to read and validate its category hash data.
- Delete before final commit: `.breadcrumb-rollout/`

## Current Target Counts

The rollout targets 109 content pages, excluding root `index.html`, `.git`, and `.worktrees`:

- `Lessons`: 61
- `Vocabulary`: 25
- `Quiz`: 8
- `JFT-Mock`: 7
- `Targeted-Quiz`: 3
- `Kanji`: 2
- `Specialized-Lessons`: 2
- `JLPT-Mock`: 1

---

### Task 1: Create The Temporary Breadcrumb Rollout Helper

**Files:**
- Create: `.breadcrumb-rollout/breadcrumbs.cjs`
- Create: `.breadcrumb-rollout/breadcrumbs.test.cjs`

- [ ] **Step 1: Create the temporary helper directory**

Run:

```powershell
New-Item -ItemType Directory -Force -Path .\.breadcrumb-rollout | Out-Null
```

Expected: directory exists and is untracked.

- [ ] **Step 2: Add the breadcrumb helper**

Create `.breadcrumb-rollout/breadcrumbs.cjs` with:

```javascript
const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const BREADCRUMB_START = '<!-- Site Breadcrumb -->';
const BREADCRUMB_END = '<!-- End Site Breadcrumb -->';
const CSS_START = '/* ========== Site Breadcrumb ========== */';
const CSS_END = '/* ========== End Site Breadcrumb ========== */';

const CATEGORY_MAP = {
  'Lessons': { label: 'Lessons', hash: 'lessons' },
  'Vocabulary': { label: 'Vocabulary', hash: 'vocabulary' },
  'Quiz': { label: 'Quiz', hash: 'quiz' },
  'Kanji': { label: 'Kanji', hash: 'kanji' },
  'JFT-Mock': { label: 'JFT Mock', hash: 'jft-mock' },
  'JLPT-Mock': { label: 'JLPT Mock', hash: 'jlpt-mock' },
  'Targeted-Quiz': { label: 'Targeted Quiz', hash: 'targeted-quiz' },
  'Specialized-Lessons': { label: 'Specialized Lessons', hash: 'specialized-lessons' }
};

function toPosix(value) {
  return value.replace(/\\/g, '/');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function walkHtmlFiles(dir, root = dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === '.worktrees' || entry.name === '.breadcrumb-rollout') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(fullPath, root, out);
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      const rel = toPosix(path.relative(root, fullPath));
      if (rel !== 'index.html') {
        out.push(rel);
      }
    }
  }
  return out.sort((a, b) => a.localeCompare(b, 'en'));
}

function categoryFor(relPath) {
  const topLevel = toPosix(relPath).split('/')[0];
  const category = CATEGORY_MAP[topLevel];
  if (!category) {
    throw new Error(`No breadcrumb category for ${relPath}`);
  }
  return category;
}

function relativeIndexHref(relPath) {
  const dirName = toPosix(path.posix.dirname(toPosix(relPath)));
  const depth = dirName === '.' ? 0 : dirName.split('/').filter(Boolean).length;
  return '../'.repeat(depth) + 'index.html';
}

function numberFromName(relPath, prefix) {
  const match = path.posix.basename(toPosix(relPath)).match(new RegExp(`${prefix}(\\d+)`, 'i'));
  return match ? Number(match[1]) : null;
}

function titleCaseFromFile(relPath) {
  return path.posix.basename(toPosix(relPath), '.html')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pageLabelFor(relPath) {
  const rel = toPosix(relPath);
  const lessonNo = numberFromName(rel, 'Lesson_');
  const vocabNo = numberFromName(rel, 'vocabulary');

  if (rel.startsWith('Lessons/N5-Lessons/') && lessonNo) {
    return `N5 Lesson ${lessonNo}`;
  }
  if (rel.startsWith('Lessons/N4-Lessons-Book-1/') && lessonNo) {
    return `N4 Book 1 Lesson ${lessonNo}`;
  }
  if (rel.startsWith('Lessons/N4-Lessons-Book 2/') && lessonNo) {
    return `N4 Book 2 Lesson ${lessonNo}`;
  }
  if (rel.startsWith('Vocabulary/') && vocabNo) {
    return `Vocabulary ${vocabNo}`;
  }

  return titleCaseFromFile(rel);
}

function breadcrumbCss() {
  return `${CSS_START}
.site-breadcrumb,
.site-breadcrumb * {
  box-sizing: border-box;
}

.site-breadcrumb {
  position: relative;
  z-index: 20;
  width: min(1180px, calc(100% - 32px));
  margin: 16px auto 12px;
  font-family: "Noto Sans JP", "Outfit", system-ui, sans-serif;
  color: #18202f;
}

.site-breadcrumb__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 8px 12px;
  border: 1px solid rgba(24, 32, 47, 0.12);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.94);
  box-shadow: 0 10px 30px rgba(24, 32, 47, 0.08);
}

.site-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  color: #667085;
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.4;
}

.site-breadcrumb__item + .site-breadcrumb__item::before {
  content: "/";
  margin: 0 8px;
  color: rgba(169, 52, 42, 0.42);
  font-weight: 800;
}

.site-breadcrumb__link {
  color: #667085;
  text-decoration: none;
  transition: color 0.18s ease, background 0.18s ease;
}

.site-breadcrumb__link:hover,
.site-breadcrumb__link:focus-visible {
  color: #a9342a;
  outline: none;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.site-breadcrumb__category {
  color: #a9342a;
}

.site-breadcrumb__current {
  color: #18202f;
  overflow-wrap: anywhere;
}

@media (max-width: 640px) {
  .site-breadcrumb {
    width: min(100% - 20px, 680px);
    margin: 12px auto 10px;
  }

  .site-breadcrumb__list {
    padding: 8px 10px;
  }

  .site-breadcrumb__item {
    font-size: 0.78rem;
  }
}
${CSS_END}`;
}

function breadcrumbHtml(relPath) {
  const category = categoryFor(relPath);
  const homeHref = relativeIndexHref(relPath);
  const categoryHref = `${homeHref}#${category.hash}`;
  const current = pageLabelFor(relPath);

  return `${BREADCRUMB_START}
<nav class="site-breadcrumb" aria-label="Breadcrumb">
  <ol class="site-breadcrumb__list">
    <li class="site-breadcrumb__item"><a class="site-breadcrumb__link" href="${homeHref}">Home</a></li>
    <li class="site-breadcrumb__item"><a class="site-breadcrumb__link site-breadcrumb__category" href="${categoryHref}">${escapeHtml(category.label)}</a></li>
    <li class="site-breadcrumb__item"><span class="site-breadcrumb__current" aria-current="page">${escapeHtml(current)}</span></li>
  </ol>
</nav>
${BREADCRUMB_END}`;
}

function stripExisting(html) {
  return html
    .replace(new RegExp(`\\n?\\s*${escapeRegExp(CSS_START)}[\\s\\S]*?${escapeRegExp(CSS_END)}\\n?`, 'g'), '\n')
    .replace(new RegExp(`\\n?\\s*${escapeRegExp(BREADCRUMB_START)}[\\s\\S]*?${escapeRegExp(BREADCRUMB_END)}\\n?`, 'g'), '\n');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function insertCss(html) {
  if (!/<\/style>/i.test(html)) {
    throw new Error('No </style> tag found');
  }
  return html.replace(/<\/style>/i, `\n\n${breadcrumbCss()}\n    </style>`);
}

function insertBreadcrumb(html, relPath) {
  const crumb = breadcrumbHtml(relPath);
  const presentationMatch = html.match(/\n\s*<div class="presentation">/);

  if (html.includes('progress-container') && presentationMatch) {
    return html.replace(presentationMatch[0], `\n${crumb}\n${presentationMatch[0]}`);
  }

  if (!/<body\b[^>]*>/i.test(html)) {
    throw new Error('No <body> tag found');
  }

  return html.replace(/<body\b[^>]*>/i, match => `${match}\n\n${crumb}`);
}

function transformHtml(relPath, html) {
  const stripped = stripExisting(html);
  return insertBreadcrumb(insertCss(stripped), relPath);
}

function countNeedle(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function auditFile(root, relPath) {
  const fullPath = path.join(root, relPath);
  const html = fs.readFileSync(fullPath, 'utf8');
  const category = categoryFor(relPath);
  const homeHref = relativeIndexHref(relPath);
  const categoryHref = `${homeHref}#${category.hash}`;
  const current = pageLabelFor(relPath);
  const problems = [];

  if (countNeedle(html, BREADCRUMB_START) !== 1) {
    problems.push(`expected exactly one breadcrumb marker, found ${countNeedle(html, BREADCRUMB_START)}`);
  }
  if (countNeedle(html, CSS_START) !== 1) {
    problems.push(`expected exactly one breadcrumb CSS marker, found ${countNeedle(html, CSS_START)}`);
  }
  if (!html.includes(`href="${homeHref}"`)) {
    problems.push(`missing Home href ${homeHref}`);
  }
  if (!html.includes(`href="${categoryHref}"`)) {
    problems.push(`missing category href ${categoryHref}`);
  }
  if (!html.includes(`>${escapeHtml(category.label)}</a>`)) {
    problems.push(`missing category label ${category.label}`);
  }
  if (!html.includes(`aria-current="page">${escapeHtml(current)}</span>`)) {
    problems.push(`missing current label ${current}`);
  }

  return problems;
}

function selectedFiles(root, onlyArg) {
  const files = walkHtmlFiles(root);
  if (!onlyArg) return files;
  const wanted = new Set(onlyArg.split(',').map(item => toPosix(item.trim())).filter(Boolean));
  return files.filter(file => wanted.has(file));
}

function applyBreadcrumbs(root, onlyArg) {
  const files = selectedFiles(root, onlyArg);
  const changed = [];
  for (const rel of files) {
    const fullPath = path.join(root, rel);
    const original = fs.readFileSync(fullPath, 'utf8');
    const next = transformHtml(rel, original);
    if (next !== original) {
      fs.writeFileSync(fullPath, next, 'utf8');
      changed.push(rel);
    }
  }
  return { scanned: files.length, changed };
}

function audit(root, onlyArg) {
  const files = selectedFiles(root, onlyArg);
  const failures = [];
  for (const rel of files) {
    const problems = auditFile(root, rel);
    if (problems.length) failures.push({ file: rel, problems });
  }

  const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const missingHashes = Object.values(CATEGORY_MAP)
    .map(category => category.hash)
    .filter(hash => !indexHtml.includes(`id: '${hash}'`) && !indexHtml.includes(`id: "${hash}"`));

  return {
    ok: failures.length === 0 && missingHashes.length === 0 && !indexHtml.includes(BREADCRUMB_START),
    scanned: files.length,
    failures,
    missingHashes,
    rootHasBreadcrumb: indexHtml.includes(BREADCRUMB_START)
  };
}

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : '';
}

function main() {
  const only = argValue('--only');
  if (process.argv.includes('--apply')) {
    const result = applyBreadcrumbs(ROOT, only);
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (process.argv.includes('--audit')) {
    const result = audit(ROOT, only);
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exitCode = 1;
    return;
  }

  console.log('Usage: node .breadcrumb-rollout/breadcrumbs.cjs --audit|--apply [--only path1,path2]');
}

if (require.main === module) {
  main();
}

module.exports = {
  CATEGORY_MAP,
  audit,
  auditFile,
  breadcrumbCss,
  breadcrumbHtml,
  categoryFor,
  pageLabelFor,
  relativeIndexHref,
  stripExisting,
  transformHtml,
  walkHtmlFiles
};
```

- [ ] **Step 3: Add helper tests**

Create `.breadcrumb-rollout/breadcrumbs.test.cjs` with:

```javascript
const assert = require('node:assert/strict');
const test = require('node:test');

const {
  categoryFor,
  pageLabelFor,
  relativeIndexHref,
  stripExisting,
  transformHtml,
  walkHtmlFiles
} = require('./breadcrumbs.cjs');

test('maps top-level folders to root category hashes', () => {
  assert.deepEqual(categoryFor('Lessons/N5-Lessons/Lesson_1.html'), { label: 'Lessons', hash: 'lessons' });
  assert.deepEqual(categoryFor('Kanji/Kanji_flashcard.html'), { label: 'Kanji', hash: 'kanji' });
  assert.deepEqual(categoryFor('Targeted-Quiz/Counters_Quiz.html'), { label: 'Targeted Quiz', hash: 'targeted-quiz' });
});

test('computes relative Home hrefs from file depth', () => {
  assert.equal(relativeIndexHref('Kanji/Kanji_flashcard.html'), '../index.html');
  assert.equal(relativeIndexHref('Lessons/N5-Lessons/Lesson_1.html'), '../../index.html');
  assert.equal(relativeIndexHref('Lessons/N4-Lessons-Book 2/Lesson_10.html'), '../../index.html');
});

test('creates short current page labels', () => {
  assert.equal(pageLabelFor('Lessons/N5-Lessons/Lesson_18.html'), 'N5 Lesson 18');
  assert.equal(pageLabelFor('Lessons/N4-Lessons-Book-1/Lesson_7.html'), 'N4 Book 1 Lesson 7');
  assert.equal(pageLabelFor('Lessons/N4-Lessons-Book 2/Lesson_12.html'), 'N4 Book 2 Lesson 12');
  assert.equal(pageLabelFor('Vocabulary/vocabulary25.html'), 'Vocabulary 25');
  assert.equal(pageLabelFor('JFT-Mock/Jimushitsu Set.html'), 'Jimushitsu Set');
});

test('inserts progress-page breadcrumb before presentation wrapper', () => {
  const html = '<html><head><style>body{}</style></head><body><div class="progress-container"></div>\\n    <div class="presentation"></div></body></html>';
  const result = transformHtml('Lessons/N5-Lessons/Lesson_1.html', html);
  assert.match(result, /Site Breadcrumb/);
  assert.ok(result.indexOf('site-breadcrumb') < result.indexOf('<div class="presentation">'));
  assert.match(result, /href="..\\/..\\/index.html#lessons"/);
});

test('inserts non-progress breadcrumb after body opening tag', () => {
  const html = '<html><head><style>body{}</style></head><body class="page"><main></main></body></html>';
  const result = transformHtml('Kanji/Kanji_flashcard.html', html);
  assert.match(result, /<body class="page">\\n\\n<!-- Site Breadcrumb -->/);
  assert.match(result, /href="..\\/index.html#kanji"/);
});

test('stripExisting makes repeated transforms idempotent', () => {
  const html = '<html><head><style>body{}</style></head><body><main></main></body></html>';
  const once = transformHtml('Vocabulary/vocabulary1.html', html);
  const twice = transformHtml('Vocabulary/vocabulary1.html', once);
  assert.equal(twice, once);
  assert.equal((twice.match(/Site Breadcrumb/g) || []).length, 2);
});

test('walkHtmlFiles excludes root index and worktree files', () => {
  const files = walkHtmlFiles(process.cwd());
  assert.ok(!files.includes('index.html'));
  assert.ok(files.every(file => !file.startsWith('.worktrees/')));
  assert.equal(files.length, 109);
});
```

- [ ] **Step 4: Run helper tests**

Run:

```powershell
$node = "C:\Users\valla\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
& $node --test .\.breadcrumb-rollout\breadcrumbs.test.cjs
```

Expected: all 7 tests pass.

- [ ] **Step 5: Run the failing baseline breadcrumb audit**

Run:

```powershell
$node = "C:\Users\valla\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
& $node .\.breadcrumb-rollout\breadcrumbs.cjs --audit
```

Expected: non-zero exit; JSON shows `scanned` is `109` and the content pages are missing breadcrumb markers. This confirms the audit catches the current pre-rollout state.

---

### Task 2: Apply And Inspect A Representative Smoke Set

**Files:**
- Modify: `Lessons/N5-Lessons/Lesson_1.html`
- Modify: `Vocabulary/vocabulary1.html`
- Modify: `Kanji/Kanji_dictionary.html`
- Modify: `Targeted-Quiz/Counters_Quiz.html`

- [ ] **Step 1: Apply breadcrumbs to four representative files**

Run:

```powershell
$node = "C:\Users\valla\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
& $node .\.breadcrumb-rollout\breadcrumbs.cjs --apply --only "Lessons/N5-Lessons/Lesson_1.html,Vocabulary/vocabulary1.html,Kanji/Kanji_dictionary.html,Targeted-Quiz/Counters_Quiz.html"
```

Expected: JSON shows `scanned` is `4` and `changed` contains the four listed files.

- [ ] **Step 2: Audit the smoke set**

Run:

```powershell
$node = "C:\Users\valla\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
& $node .\.breadcrumb-rollout\breadcrumbs.cjs --audit --only "Lessons/N5-Lessons/Lesson_1.html,Vocabulary/vocabulary1.html,Kanji/Kanji_dictionary.html,Targeted-Quiz/Counters_Quiz.html"
```

Expected: JSON shows `"ok": true`, `scanned` is `4`, `failures` is empty, `missingHashes` is empty, and `rootHasBreadcrumb` is `false`.

- [ ] **Step 3: Inspect the changed snippets**

Run:

```powershell
git diff -- Lessons/N5-Lessons/Lesson_1.html Vocabulary/vocabulary1.html Kanji/Kanji_dictionary.html Targeted-Quiz/Counters_Quiz.html
```

Expected:

```text
Lessons/N5-Lessons/Lesson_1.html has Home href ../../index.html and category href ../../index.html#lessons.
Vocabulary/vocabulary1.html has Home href ../index.html and category href ../index.html#vocabulary.
Kanji/Kanji_dictionary.html has Home href ../index.html and category href ../index.html#kanji.
Targeted-Quiz/Counters_Quiz.html has Home href ../index.html and category href ../index.html#targeted-quiz.
```

Do not commit yet. The smoke files will be included in the full rollout commit.

---

### Task 3: Roll Out Breadcrumbs To All Content Pages

**Files:**
- Modify: all 109 content HTML files under `JFT-Mock/`, `JLPT-Mock/`, `Kanji/`, `Lessons/`, `Quiz/`, `Specialized-Lessons/`, `Targeted-Quiz/`, and `Vocabulary/`

- [ ] **Step 1: Apply breadcrumbs to all content pages**

Run:

```powershell
$node = "C:\Users\valla\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
& $node .\.breadcrumb-rollout\breadcrumbs.cjs --apply
```

Expected: JSON shows `scanned` is `109`. `changed` may be `105` if the four smoke files were already changed.

- [ ] **Step 2: Audit all breadcrumb output**

Run:

```powershell
$node = "C:\Users\valla\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
& $node .\.breadcrumb-rollout\breadcrumbs.cjs --audit
```

Expected:

```json
{
  "ok": true,
  "scanned": 109,
  "failures": [],
  "missingHashes": [],
  "rootHasBreadcrumb": false
}
```

- [ ] **Step 3: Validate current inventory counts**

Run:

```powershell
$files = Get-ChildItem -Recurse -File -Filter *.html | Where-Object {
  $_.Name -ne 'index.html' -and
  $_.FullName -notmatch '\\.git\\' -and
  $_.FullName -notmatch '\\.worktrees\\'
}
if ($files.Count -ne 109) { throw "Expected 109 content HTML files, found $($files.Count)" }
$files | Group-Object { ($_.FullName.Substring((Get-Location).Path.Length + 1) -split '[\\/]')[0] } | Sort-Object Name | ForEach-Object { "$($_.Name): $($_.Count)" }
```

Expected:

```text
JFT-Mock: 7
JLPT-Mock: 1
Kanji: 2
Lessons: 61
Quiz: 8
Specialized-Lessons: 2
Targeted-Quiz: 3
Vocabulary: 25
```

- [ ] **Step 4: Confirm root index still owns category hashes and has no breadcrumb**

Run:

```powershell
$html = Get-Content -LiteralPath .\index.html -Raw
@('lessons','vocabulary','quiz','kanji','jft-mock','jlpt-mock','targeted-quiz','specialized-lessons') | ForEach-Object {
  $single = "id: '$_'"
  $double = "id: `"$_`""
  if (-not ($html.Contains($single) -or $html.Contains($double))) { throw "Missing index category id $_" }
}
if ($html -match 'Site Breadcrumb|site-breadcrumb') { throw 'Root index should not contain a breadcrumb' }
'root index category hashes ok'
```

Expected:

```text
root index category hashes ok
```

---

### Task 4: Run Static Safety Checks

**Files:**
- Read: all `Lessons/**/*.html`
- Read: all modified content HTML files

- [ ] **Step 1: Compile lesson scripts and decoded inline handlers**

Run:

```powershell
$node = "C:\Users\valla\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
@'
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const failures = [];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) out.push(full);
  }
  return out;
}

function decodeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

const files = walk(path.join(root, 'Lessons'));
for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
  scripts.forEach((match, index) => {
    try {
      new Function(match[1]);
    } catch (error) {
      failures.push(`${rel}: script ${index + 1}: ${error.message}`);
    }
  });

  const attrs = [...html.matchAll(/\son[a-z]+\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/gi)];
  attrs.forEach((match, index) => {
    const handler = decodeHtml(match[2] ?? match[3] ?? match[4] ?? '');
    try {
      new Function(handler);
    } catch (error) {
      failures.push(`${rel}: inline handler ${index + 1}: ${error.message}`);
    }
  });
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`lesson script and inline-handler static check ok: ${files.length} files`);
'@ | & $node -
```

Expected:

```text
lesson script and inline-handler static check ok: 61 files
```

- [ ] **Step 2: Confirm every content page has exactly one breadcrumb**

Run:

```powershell
$files = Get-ChildItem -Recurse -File -Filter *.html | Where-Object {
  $_.Name -ne 'index.html' -and
  $_.FullName -notmatch '\\.git\\' -and
  $_.FullName -notmatch '\\.worktrees\\'
}
$bad = foreach ($file in $files) {
  $html = Get-Content -LiteralPath $file.FullName -Raw
  $count = ([regex]::Matches($html, '<!-- Site Breadcrumb -->')).Count
  if ($count -ne 1) { "$($file.FullName.Substring((Get-Location).Path.Length + 1)): $count" }
}
if ($bad) { $bad; throw 'Breadcrumb count mismatch' }
'all content pages have one breadcrumb'
```

Expected:

```text
all content pages have one breadcrumb
```

- [ ] **Step 3: Run whitespace sanity check**

Run:

```powershell
git diff --check
```

Expected: no output and exit code 0.

---

### Task 5: Run Browser Smoke Checks On Representative Pages

**Files:**
- Read: `Lessons/N5-Lessons/Lesson_1.html`
- Read: `Vocabulary/vocabulary1.html`
- Read: `Kanji/Kanji_dictionary.html`
- Read: `JFT-Mock/Jimushitsu Set.html`
- Read: `Targeted-Quiz/Counters_Quiz.html`

- [ ] **Step 1: Verify breadcrumb visibility in desktop and mobile viewports**

Run:

```powershell
$node = "C:\Users\valla\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$env:PW_PATH = "C:\Users\valla\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\.pnpm\node_modules\playwright-core"
@'
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PW_PATH);

const root = process.cwd();
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const pages = [
  'Lessons/N5-Lessons/Lesson_1.html',
  'Vocabulary/vocabulary1.html',
  'Kanji/Kanji_dictionary.html',
  'JFT-Mock/Jimushitsu Set.html',
  'Targeted-Quiz/Counters_Quiz.html'
];
const viewports = [
  { width: 1366, height: 900, name: 'desktop' },
  { width: 390, height: 844, name: 'mobile' }
];

(async () => {
  const browser = await chromium.launch({ executablePath: chrome, headless: true });
  const failures = [];

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    for (const rel of pages) {
      await page.goto(pathToFileURL(path.join(root, rel)).href, { waitUntil: 'load' });
      const crumb = page.locator('.site-breadcrumb');
      const count = await crumb.count();
      if (count !== 1) {
        failures.push(`${rel} ${viewport.name}: breadcrumb count ${count}`);
        continue;
      }

      const box = await crumb.boundingBox();
      if (!box || box.width < 120 || box.height < 20) {
        failures.push(`${rel} ${viewport.name}: breadcrumb is not visibly sized`);
      }

      if (rel.startsWith('Lessons/')) {
        const progressBox = await page.locator('.progress-container').first().boundingBox();
        if (progressBox && box && box.y < progressBox.y + progressBox.height - 2) {
          failures.push(`${rel} ${viewport.name}: breadcrumb overlaps progress UI`);
        }
      }
    }
    await page.close();
  }

  await browser.close();

  if (failures.length) {
    console.error(failures.join('\n'));
    process.exit(1);
  }

  console.log(`breadcrumb browser smoke ok: ${pages.length} pages x ${viewports.length} viewports`);
})();
'@ | & $node -
```

Expected:

```text
breadcrumb browser smoke ok: 5 pages x 2 viewports
```

If Chrome or Playwright cannot run in the current environment, record the exact blocker in the final response and keep the static checks from Task 4 as the required pass/fail gate.

---

### Task 6: Commit The Breadcrumb Rollout

**Files:**
- Delete: `.breadcrumb-rollout/`
- Modify: all updated content HTML files

- [ ] **Step 1: Verify the temporary helper path before deletion**

Run:

```powershell
$helper = Resolve-Path .\.breadcrumb-rollout
if ($helper.Path -ne (Join-Path (Get-Location).Path '.breadcrumb-rollout')) {
  throw "Unexpected helper path: $($helper.Path)"
}
$helper.Path
```

Expected: prints the absolute `.breadcrumb-rollout` path inside `C:\Users\valla\Downloads\My-Japanese-Reviewers`.

- [ ] **Step 2: Delete the temporary helper**

Run:

```powershell
Remove-Item -LiteralPath .\.breadcrumb-rollout -Recurse -Force
```

Expected: `.breadcrumb-rollout/` no longer exists.

- [ ] **Step 3: Confirm no temporary files are staged or left untracked**

Run:

```powershell
git status --short
```

Expected: modified HTML files only under:

```text
JFT-Mock/
JLPT-Mock/
Kanji/
Lessons/
Quiz/
Specialized-Lessons/
Targeted-Quiz/
Vocabulary/
```

- [ ] **Step 4: Stage only the content HTML changes**

Run:

```powershell
git add -- JFT-Mock JLPT-Mock Kanji Lessons Quiz Specialized-Lessons Targeted-Quiz Vocabulary
```

Expected: only content HTML files are staged; `index.html` is not staged.

- [ ] **Step 5: Commit the breadcrumb rollout**

Run:

```powershell
git commit -m "Add site-wide breadcrumb navigation"
```

Expected: commit succeeds.

- [ ] **Step 6: Re-run final post-commit checks**

Run:

```powershell
$node = "C:\Users\valla\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
@'
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const categories = {
  'Lessons': 'lessons',
  'Vocabulary': 'vocabulary',
  'Quiz': 'quiz',
  'Kanji': 'kanji',
  'JFT-Mock': 'jft-mock',
  'JLPT-Mock': 'jlpt-mock',
  'Targeted-Quiz': 'targeted-quiz',
  'Specialized-Lessons': 'specialized-lessons'
};

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === '.worktrees') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) out.push(full);
  }
  return out;
}

const files = walk(root)
  .map(file => path.relative(root, file).replace(/\\/g, '/'))
  .filter(file => file !== 'index.html');

const failures = [];
for (const rel of files) {
  const html = fs.readFileSync(path.join(root, rel), 'utf8');
  const top = rel.split('/')[0];
  const hash = categories[top];
  const depth = path.posix.dirname(rel).split('/').filter(Boolean).length;
  const home = '../'.repeat(depth) + 'index.html';
  const markerCount = (html.match(/<!-- Site Breadcrumb -->/g) || []).length;

  if (markerCount !== 1) failures.push(`${rel}: breadcrumb marker count ${markerCount}`);
  if (!html.includes(`href="${home}"`)) failures.push(`${rel}: missing ${home}`);
  if (!html.includes(`href="${home}#${hash}"`)) failures.push(`${rel}: missing ${home}#${hash}`);
}

if (files.length !== 109) failures.push(`expected 109 content files, found ${files.length}`);
if (fs.readFileSync(path.join(root, 'index.html'), 'utf8').includes('site-breadcrumb')) {
  failures.push('index.html should not contain breadcrumb markup');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('post-commit breadcrumb validation ok: 109 content pages');
'@ | & $node -

git diff --check HEAD~1 HEAD
git status --short
```

Expected:

```text
post-commit breadcrumb validation ok: 109 content pages
```

`git diff --check HEAD~1 HEAD` should produce no output. `git status --short` should be clean or show only unrelated user changes.
