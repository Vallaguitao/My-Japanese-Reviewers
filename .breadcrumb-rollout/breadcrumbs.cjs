const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const BREADCRUMB_START = '<!-- Site Breadcrumb -->';
const BREADCRUMB_END = '<!-- End Site Breadcrumb -->';
const CSS_START = '/* ========== Site Breadcrumb ========== */';
const CSS_END = '/* ========== End Site Breadcrumb ========== */';

const CATEGORY_MAP = {
  Lessons: { label: 'Lessons', hash: 'lessons' },
  Vocabulary: { label: 'Vocabulary', hash: 'vocabulary' },
  Quiz: { label: 'Quiz', hash: 'quiz' },
  Kanji: { label: 'Kanji', hash: 'kanji' },
  'JFT-Mock': { label: 'JFT Mock', hash: 'jft-mock' },
  'JLPT-Mock': { label: 'JLPT Mock', hash: 'jlpt-mock' },
  'Targeted-Quiz': { label: 'Targeted Quiz', hash: 'targeted-quiz' },
  'Specialized-Lessons': { label: 'Specialized Lessons', hash: 'specialized-lessons' }
};

const EXCLUDED_DIRS = new Set(['.git', '.worktrees', '.breadcrumb-rollout']);

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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function walkHtmlFiles(dir, root = dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && EXCLUDED_DIRS.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(fullPath, root, out);
      continue;
    }

    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.html')) {
      continue;
    }

    const rel = toPosix(path.relative(root, fullPath));
    if (rel !== 'index.html') {
      out.push(rel);
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
  const dirName = path.posix.dirname(toPosix(relPath));
  const depth = dirName === '.' ? 0 : dirName.split('/').filter(Boolean).length;
  return `${'../'.repeat(depth)}index.html`;
}

function numberFromName(relPath, prefix) {
  const match = path.posix.basename(toPosix(relPath)).match(new RegExp(`${escapeRegExp(prefix)}(\\d+)`, 'i'));
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
  const cssPattern = new RegExp(`\\n?\\s*${escapeRegExp(CSS_START)}[\\s\\S]*?${escapeRegExp(CSS_END)}\\n?`, 'g');
  const breadcrumbPattern = new RegExp(`\\n?\\s*${escapeRegExp(BREADCRUMB_START)}[\\s\\S]*?${escapeRegExp(BREADCRUMB_END)}\\n?`, 'g');
  return html.replace(cssPattern, '\n').replace(breadcrumbPattern, '');
}

function insertCss(html) {
  if (!/<\/style>/i.test(html)) {
    throw new Error('No </style> tag found');
  }

  return html.replace(/\s*<\/style>/i, `\n\n${breadcrumbCss()}\n    </style>`);
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

  return html.replace(/<body\b[^>]*>/i, match => `${match}\n\n${crumb}\n`);
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
  const breadcrumbMarkers = countNeedle(html, BREADCRUMB_START);
  const cssMarkers = countNeedle(html, CSS_START);

  if (breadcrumbMarkers !== 1) {
    problems.push(`expected exactly one breadcrumb marker, found ${breadcrumbMarkers}`);
  }

  if (cssMarkers !== 1) {
    problems.push(`expected exactly one breadcrumb CSS marker, found ${cssMarkers}`);
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
  if (!onlyArg) {
    return files;
  }

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

function indexHasHash(indexHtml, hash) {
  const quoted = [`id: '${hash}'`, `id: "${hash}"`, `id='${hash}'`, `id="${hash}"`];
  return quoted.some(needle => indexHtml.includes(needle));
}

function audit(root, onlyArg) {
  const files = selectedFiles(root, onlyArg);
  const failures = [];

  for (const rel of files) {
    const problems = auditFile(root, rel);
    if (problems.length) {
      failures.push({ file: rel, problems });
    }
  }

  const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const missingHashes = Object.values(CATEGORY_MAP)
    .map(category => category.hash)
    .filter(hash => !indexHasHash(indexHtml, hash));
  const rootHasBreadcrumb = indexHtml.includes(BREADCRUMB_START) || indexHtml.includes('site-breadcrumb');

  return {
    ok: failures.length === 0 && missingHashes.length === 0 && !rootHasBreadcrumb,
    scanned: files.length,
    failures,
    missingHashes,
    rootHasBreadcrumb
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
    if (!result.ok) {
      process.exitCode = 1;
    }
    return;
  }

  console.log('Usage: node .breadcrumb-rollout/breadcrumbs.cjs --audit|--apply [--only path1,path2]');
}

if (require.main === module) {
  main();
}

module.exports = {
  BREADCRUMB_END,
  BREADCRUMB_START,
  CATEGORY_MAP,
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
  stripExisting,
  transformHtml,
  walkHtmlFiles
};
