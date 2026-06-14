# Index Compact Directory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `index.html` as a modern Japanese-accented compact directory that indexes every current HTML resource in the workspace.

**Architecture:** Keep the app as one static HTML file with embedded CSS and vanilla JavaScript. Store all resource metadata in one `RESOURCE_CATEGORIES` array, then render category navigation, grouped resource rows, search results, counts, and expand controls from that data.

**Tech Stack:** HTML, CSS, vanilla JavaScript, PowerShell validation commands, optional local browser check.

---

## Files

- Modify: `index.html`
- Read: `docs/superpowers/specs/2026-06-14-index-compact-directory-design.md`
- Do not modify: individual files under `Lessons/`, `Vocabulary/`, `Quiz/`, `Kanji/`, `JFT-Mock/`, `JLPT-Mock/`, `Targeted-Quiz/`, or `Specialized-Lessons/`
- Do not restore: `Quiz/Grammar-2_n5.html`, which is already deleted in the working tree before this redesign

## Target Resource Counts

The implementation must index 109 HTML resources, excluding `index.html`.

- `Lessons`: 61
- `Vocabulary`: 25
- `Quiz`: 8
- `JFT-Mock`: 7
- `Targeted-Quiz`: 3
- `Kanji`: 2
- `Specialized-Lessons`: 2
- `JLPT-Mock`: 1

---

### Task 1: Create The Inventory Guard

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Run the baseline resource inventory**

Run:

```powershell
$files = Get-ChildItem -Recurse -File -Filter *.html | Where-Object { $_.Name -ne 'index.html' -and $_.FullName -notmatch '\\.git\\' }
$files.Count
$files | Group-Object { ($_.FullName.Substring((Get-Location).Path.Length + 1) -split '[\\/]')[0] } | Sort-Object Name | ForEach-Object { "$($_.Name): $($_.Count)" }
```

Expected output:

```text
109
JFT-Mock: 7
JLPT-Mock: 1
Kanji: 2
Lessons: 61
Quiz: 8
Specialized-Lessons: 2
Targeted-Quiz: 3
Vocabulary: 25
```

- [ ] **Step 2: Run the failing new-architecture check**

Run:

```powershell
$html = Get-Content -LiteralPath .\index.html -Raw
if ($html -notmatch 'const\s+RESOURCE_CATEGORIES\s*=') { throw 'RESOURCE_CATEGORIES missing' }
```

Expected: FAIL with `RESOURCE_CATEGORIES missing`. This confirms the current page has not been rebuilt into the new data-driven directory yet.

- [ ] **Step 3: Commit checkpoint**

Do not commit in this task. No file has changed.

---

### Task 2: Replace `index.html` With The Static Shell

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace the document skeleton**

Replace the current `index.html` with a new static document using these required landmarks and ids:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Japanese Reviewers | Compact Study Directory</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    /* CSS is added in Task 5. */
  </style>
</head>
<body>
  <a class="skip-link" href="#directory-panel">Skip to resources</a>
  <div class="app-shell">
    <header class="site-header">
      <div class="brand-block">
        <span class="brand-mark" aria-hidden="true">日</span>
        <div>
          <p class="eyebrow">日本語レビュー</p>
          <h1>My Japanese Reviewers</h1>
        </div>
      </div>
      <label class="search-box">
        <span class="sr-only">Search resources</span>
        <input id="resource-search" type="search" autocomplete="off">
      </label>
    </header>

    <main class="directory-layout">
      <aside class="category-rail" aria-label="Resource categories">
        <div class="rail-heading">
          <span>目次</span>
          <strong>Categories</strong>
        </div>
        <nav id="category-nav" class="category-nav" aria-label="Category navigation"></nav>
      </aside>

      <section id="directory-panel" class="directory-panel" aria-live="polite">
        <noscript>
          <section class="noscript-panel">
            <h2>Lessons</h2>
            <p>JavaScript is disabled. Open the lesson folders directly from your file browser or GitHub Pages source view.</p>
          </section>
        </noscript>
      </section>
    </main>
  </div>

  <script>
    /* JavaScript is added in Tasks 3 and 4. */
  </script>
</body>
</html>
```

- [ ] **Step 2: Run a static landmark check**

Run:

```powershell
$html = Get-Content -LiteralPath .\index.html -Raw
@('category-nav','directory-panel','resource-search','skip-link') | ForEach-Object {
  if ($html -notmatch $_) { throw "Missing $_" }
}
'shell landmarks present'
```

Expected output:

```text
shell landmarks present
```

- [ ] **Step 3: Commit shell**

Run:

```powershell
git add -- index.html
git commit -m "Rebuild index shell as compact directory"
```

Expected: commit succeeds and only `index.html` is included.

---

### Task 3: Add Resource Data

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Generate resource entries from current page titles**

Run this command to produce resource objects with human-readable titles:

```powershell
Get-ChildItem -Recurse -File -Filter *.html |
  Where-Object { $_.Name -ne 'index.html' -and $_.FullName -notmatch '\\.git\\' } |
  Sort-Object FullName |
  ForEach-Object {
    $rel = $_.FullName.Substring((Get-Location).Path.Length + 1).Replace('\','/')
    $raw = Get-Content -LiteralPath $_.FullName -Raw
    $title = if ($raw -match '<title>(.*?)</title>') {
      [System.Net.WebUtility]::HtmlDecode($Matches[1]).Trim()
    } else {
      [System.IO.Path]::GetFileNameWithoutExtension($_.Name).Replace('_',' ').Replace('-',' ')
    }
    [pscustomobject]@{ path = $rel; title = $title }
  } | ConvertTo-Json -Depth 3
```

Expected: JSON with 109 objects. Use it to populate the `items` arrays in the next step.

- [ ] **Step 2: Add the category data structure**

Inside the `<script>` tag, replace the script marker comment with this shape and populate each `items` array from Step 1:

```javascript
const DEFAULT_CATEGORY = 'lessons';
const PREVIEW_LIMIT = 8;

const RESOURCE_CATEGORIES = [
  {
    id: 'lessons',
    name: 'Lessons',
    jp: '学',
    subtitle: 'N5 and Irodori A2 lesson tracks',
    watermark: '学',
    groups: [
      { name: 'N5 Lessons', matchPath: 'Lessons/N5-Lessons/', items: [] },
      { name: 'N4 Book 1', matchPath: 'Lessons/N4-Lessons-Book-1/', items: [] },
      { name: 'N4 Book 2', matchPath: 'Lessons/N4-Lessons-Book 2/', items: [] }
    ]
  },
  {
    id: 'vocabulary',
    name: 'Vocabulary',
    jp: '語',
    subtitle: 'Minna no Nihongo vocabulary exams',
    watermark: '語',
    groups: [
      { name: 'Vocabulary Lessons', matchPath: 'Vocabulary/', items: [] }
    ]
  },
  {
    id: 'quiz',
    name: 'Quiz',
    jp: '試',
    subtitle: 'Grammar, reading, kanji, and mixed reviewers',
    watermark: '試',
    groups: [
      { name: 'Quiz Reviewers', matchPath: 'Quiz/', items: [] }
    ]
  },
  {
    id: 'kanji',
    name: 'Kanji',
    jp: '漢',
    subtitle: 'Flashcards and dictionary practice',
    watermark: '漢',
    groups: [
      { name: 'Kanji Tools', matchPath: 'Kanji/', items: [] }
    ]
  },
  {
    id: 'jft-mock',
    name: 'JFT Mock',
    jp: '実',
    subtitle: 'JFT mock exam sets',
    watermark: '実',
    groups: [
      { name: 'Mock Sets', matchPath: 'JFT-Mock/', items: [] }
    ]
  },
  {
    id: 'jlpt-mock',
    name: 'JLPT Mock',
    jp: '能',
    subtitle: 'JLPT grammar mock exam',
    watermark: '能',
    groups: [
      { name: 'Mock Exams', matchPath: 'JLPT-Mock/', items: [] }
    ]
  },
  {
    id: 'targeted-quiz',
    name: 'Targeted Quiz',
    jp: '問',
    subtitle: 'Focused grammar and conjugation drills',
    watermark: '問',
    groups: [
      { name: 'Focused Drills', matchPath: 'Targeted-Quiz/', items: [] }
    ]
  },
  {
    id: 'specialized-lessons',
    name: 'Specialized Lessons',
    jp: '専',
    subtitle: 'Focused lesson guides',
    watermark: '専',
    groups: [
      { name: 'Special Guides', matchPath: 'Specialized-Lessons/', items: [] }
    ]
  }
];
```

For each JSON object from Step 1, place it in the `items` array whose `matchPath` matches the start of its path. Each item must use this exact shape:

```javascript
{ title: 'Human-readable title', path: 'Folder/File.html' }
```

- [ ] **Step 3: Add sorting helpers**

Add these helpers after `RESOURCE_CATEGORIES`:

```javascript
function lessonNumber(path) {
  const match = path.match(/(?:Lesson_|vocabulary)(\d+)/i);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function sortItems(items) {
  return [...items].sort((a, b) => {
    const lessonDelta = lessonNumber(a.path) - lessonNumber(b.path);
    if (lessonDelta !== 0) return lessonDelta;
    return a.title.localeCompare(b.title, 'en');
  });
}

RESOURCE_CATEGORIES.forEach(category => {
  category.groups.forEach(group => {
    group.items = sortItems(group.items);
  });
});
```

- [ ] **Step 4: Run the data count check**

Run:

```powershell
$html = Get-Content -LiteralPath .\index.html -Raw
$paths = [regex]::Matches($html, "path:\s*'([^']+\.html)'") | ForEach-Object { $_.Groups[1].Value }
if ($paths.Count -ne 109) { throw "Expected 109 indexed resources, found $($paths.Count)" }
if (($paths | Sort-Object -Unique).Count -ne 109) { throw 'Duplicate resource path found' }
'resource data count ok'
```

Expected output:

```text
resource data count ok
```

- [ ] **Step 5: Commit resource data**

Run:

```powershell
git add -- index.html
git commit -m "Add complete resource data to index"
```

Expected: commit succeeds.

---

### Task 4: Add Rendering And Interaction Logic

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add state and utility functions**

Add this code after the sorting helpers:

```javascript
const state = {
  activeCategory: DEFAULT_CATEGORY,
  query: '',
  expandedGroups: new Set()
};

const nav = document.getElementById('category-nav');
const panel = document.getElementById('directory-panel');
const searchInput = document.getElementById('resource-search');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function allItems() {
  return RESOURCE_CATEGORIES.flatMap(category =>
    category.groups.flatMap(group =>
      group.items.map(item => ({
        ...item,
        categoryId: category.id,
        categoryName: category.name,
        groupName: group.name,
        jp: category.jp
      }))
    )
  );
}

function getCategory(id) {
  return RESOURCE_CATEGORIES.find(category => category.id === id) || RESOURCE_CATEGORIES.find(category => category.id === DEFAULT_CATEGORY);
}

function groupKey(categoryId, groupName) {
  return `${categoryId}:${groupName}`;
}
```

- [ ] **Step 2: Render category navigation**

Add this function:

```javascript
function renderNav() {
  nav.innerHTML = RESOURCE_CATEGORIES.map(category => {
    const count = category.groups.reduce((sum, group) => sum + group.items.length, 0);
    const active = category.id === state.activeCategory && !state.query;
    return `
      <a class="category-link${active ? ' active' : ''}" href="#${category.id}" data-category="${category.id}">
        <span class="category-mark" aria-hidden="true">${escapeHtml(category.jp)}</span>
        <span class="category-copy">
          <strong>${escapeHtml(category.name)}</strong>
          <small>${count} resources</small>
        </span>
      </a>
    `;
  }).join('');
}
```

- [ ] **Step 3: Render rows and groups**

Add these functions:

```javascript
function renderRows(items) {
  return items.map(item => `
    <li class="resource-row">
      <a class="resource-title" href="${escapeHtml(item.path)}">
        ${escapeHtml(item.title)}
      </a>
      <span class="resource-path">${escapeHtml(item.path)}</span>
      <a class="open-link" href="${escapeHtml(item.path)}" aria-label="Open ${escapeHtml(item.title)}">Open</a>
    </li>
  `).join('');
}

function renderGroup(category, group) {
  const key = groupKey(category.id, group.name);
  const isDense = group.items.length > PREVIEW_LIMIT;
  const isExpanded = state.expandedGroups.has(key);
  const visibleItems = isDense && !isExpanded ? group.items.slice(0, PREVIEW_LIMIT) : group.items;
  const hiddenCount = group.items.length - visibleItems.length;

  return `
    <section class="resource-group">
      <div class="group-heading">
        <div>
          <p>${escapeHtml(category.name)}</p>
          <h3>${escapeHtml(group.name)}</h3>
        </div>
        <span>${group.items.length} files</span>
      </div>
      <ul class="resource-list">
        ${renderRows(visibleItems)}
      </ul>
      ${hiddenCount > 0 ? `<button class="show-more" type="button" data-group="${escapeHtml(key)}">Show all ${group.items.length}</button>` : ''}
    </section>
  `;
}
```

- [ ] **Step 4: Render category and search views**

Add these functions:

```javascript
function renderCategory() {
  const category = getCategory(state.activeCategory);
  const count = category.groups.reduce((sum, group) => sum + group.items.length, 0);
  panel.innerHTML = `
    <div class="panel-heading" data-watermark="${escapeHtml(category.watermark)}">
      <div>
        <p class="eyebrow">${escapeHtml(category.jp)} ${escapeHtml(category.subtitle)}</p>
        <h2>${escapeHtml(category.name)}</h2>
      </div>
      <span class="count-pill">${count} resources</span>
    </div>
    <div class="group-stack">
      ${category.groups.map(group => renderGroup(category, group)).join('')}
    </div>
  `;
}

function renderSearch() {
  const query = state.query.toLowerCase();
  const results = allItems().filter(item => {
    return [item.title, item.path, item.categoryName, item.groupName]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });

  panel.innerHTML = `
    <div class="panel-heading" data-watermark="探">
      <div>
        <p class="eyebrow">検索 Search results</p>
        <h2>${results.length} match${results.length === 1 ? '' : 'es'}</h2>
      </div>
      <button class="clear-search" type="button">Clear</button>
    </div>
    ${results.length ? `<ul class="resource-list search-results">${renderRows(results)}</ul>` : '<p class="empty-state">No matching resources found.</p>'}
  `;
}

function render() {
  renderNav();
  if (state.query) {
    renderSearch();
  } else {
    renderCategory();
  }
}
```

- [ ] **Step 5: Add event handling and hash support**

Add this code:

```javascript
function setActiveCategory(categoryId, updateHash = true) {
  state.activeCategory = getCategory(categoryId).id;
  state.query = '';
  searchInput.value = '';
  if (updateHash) {
    history.replaceState(null, '', `#${state.activeCategory}`);
  }
  render();
}

function initializeFromHash() {
  const hash = window.location.hash.replace('#', '');
  state.activeCategory = getCategory(hash || DEFAULT_CATEGORY).id;
}

nav.addEventListener('click', event => {
  const link = event.target.closest('[data-category]');
  if (!link) return;
  event.preventDefault();
  setActiveCategory(link.dataset.category);
});

panel.addEventListener('click', event => {
  const expandButton = event.target.closest('[data-group]');
  if (expandButton) {
    state.expandedGroups.add(expandButton.dataset.group);
    render();
    return;
  }

  const clearButton = event.target.closest('.clear-search');
  if (clearButton) {
    state.query = '';
    searchInput.value = '';
    render();
  }
});

searchInput.addEventListener('input', event => {
  state.query = event.target.value.trim();
  render();
});

window.addEventListener('hashchange', () => {
  initializeFromHash();
  state.query = '';
  searchInput.value = '';
  render();
});

initializeFromHash();
render();
```

- [ ] **Step 6: Run interaction code checks**

Run:

```powershell
$html = Get-Content -LiteralPath .\index.html -Raw
@('renderNav','renderCategory','renderSearch','setActiveCategory','initializeFromHash','expandedGroups') | ForEach-Object {
  if ($html -notmatch $_) { throw "Missing $_" }
}
'rendering logic present'
```

Expected output:

```text
rendering logic present
```

- [ ] **Step 7: Commit rendering logic**

Run:

```powershell
git add -- index.html
git commit -m "Render compact directory interactions"
```

Expected: commit succeeds.

---

### Task 5: Add The Visual System And Responsive Layout

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace the CSS marker comment**

Replace `/* CSS is added in Task 5. */` with CSS that defines these exact selector groups:

```css
:root {
  --paper: #f8f3ea;
  --panel: #fffdf8;
  --panel-strong: #fff8ef;
  --ink: #18202f;
  --muted: #667085;
  --line: rgba(24, 32, 47, 0.12);
  --red: #a9342a;
  --red-soft: #f4ddd8;
  --indigo: #263a63;
  --shadow: 0 22px 70px rgba(24, 32, 47, 0.10);
  --radius: 8px;
}

*, *::before, *::after { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  min-height: 100vh;
  font-family: "Noto Sans JP", "Outfit", system-ui, sans-serif;
  color: var(--ink);
  background:
    linear-gradient(90deg, rgba(169, 52, 42, 0.06) 1px, transparent 1px),
    linear-gradient(180deg, rgba(38, 58, 99, 0.04), transparent 34rem),
    var(--paper);
  background-size: 44px 44px, auto, auto;
}

a { color: inherit; text-decoration: none; }
button, input { font: inherit; }

.sr-only,
.skip-link:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.skip-link:focus {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 20;
  padding: 0.75rem 1rem;
  background: var(--ink);
  color: white;
  border-radius: var(--radius);
}

.app-shell {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 28px 0;
}

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.brand-mark,
.category-mark {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  border: 1px solid var(--line);
  background: var(--panel);
  color: var(--red);
  font-weight: 800;
}

.eyebrow,
.rail-heading span,
.group-heading p {
  margin: 0;
  font-family: "Outfit", sans-serif;
  color: var(--red);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1, h2, h3, p { overflow-wrap: anywhere; }

h1 {
  margin: 0;
  font-family: "Outfit", sans-serif;
  font-size: 1.55rem;
  line-height: 1.1;
}

.search-box {
  flex: 0 1 390px;
}

.search-box input {
  width: 100%;
  min-height: 46px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 0 14px;
  background: var(--panel);
  color: var(--ink);
  box-shadow: 0 12px 40px rgba(24, 32, 47, 0.06);
}

.directory-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.category-rail,
.directory-panel {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: rgba(255, 253, 248, 0.92);
  box-shadow: var(--shadow);
}

.category-rail {
  position: sticky;
  top: 16px;
  padding: 16px;
}

.rail-heading {
  display: grid;
  gap: 4px;
  margin-bottom: 14px;
}

.category-nav {
  display: grid;
  gap: 8px;
}

.category-link {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 62px;
  padding: 9px;
  border: 1px solid transparent;
  border-radius: var(--radius);
}

.category-link:hover,
.category-link.active {
  border-color: rgba(169, 52, 42, 0.26);
  background: var(--red-soft);
}

.category-copy {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.category-copy strong {
  font-family: "Outfit", sans-serif;
  font-size: 0.96rem;
}

.category-copy small,
.resource-path,
.group-heading span {
  color: var(--muted);
  font-size: 0.84rem;
}

.directory-panel {
  position: relative;
  min-height: 620px;
  padding: 22px;
  overflow: hidden;
}

.panel-heading {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 18px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--line);
}

.panel-heading::after {
  content: attr(data-watermark);
  position: absolute;
  right: 10px;
  top: -40px;
  color: rgba(169, 52, 42, 0.07);
  font-size: 8rem;
  font-weight: 800;
  line-height: 1;
  pointer-events: none;
}

.panel-heading h2 {
  position: relative;
  z-index: 1;
  margin: 4px 0 0;
  font-family: "Outfit", sans-serif;
  font-size: 2rem;
  line-height: 1.1;
}

.count-pill,
.clear-search,
.show-more,
.open-link {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  border: 1px solid rgba(169, 52, 42, 0.28);
  border-radius: var(--radius);
  padding: 0 12px;
  background: var(--panel-strong);
  color: var(--red);
  font-family: "Outfit", sans-serif;
  font-weight: 700;
}

.clear-search,
.show-more {
  cursor: pointer;
}

.group-stack {
  display: grid;
  gap: 14px;
}

.resource-group {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.58);
  overflow: hidden;
}

.group-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  background: rgba(38, 58, 99, 0.04);
  border-bottom: 1px solid var(--line);
}

.group-heading h3 {
  margin: 4px 0 0;
  font-size: 1.02rem;
}

.resource-list {
  display: grid;
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0;
}

.resource-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(170px, 0.45fr) auto;
  gap: 12px;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--line);
}

.resource-row:last-child {
  border-bottom: 0;
}

.resource-title {
  font-weight: 700;
  line-height: 1.4;
}

.resource-title:hover {
  color: var(--red);
}

.show-more {
  margin: 12px 16px 16px;
}

.empty-state {
  padding: 18px;
  border: 1px dashed var(--line);
  border-radius: var(--radius);
  color: var(--muted);
  background: rgba(255, 255, 255, 0.5);
}

.noscript-panel {
  padding: 20px;
}

@media (max-width: 820px) {
  .app-shell {
    width: min(100% - 20px, 680px);
    padding: 18px 0;
  }

  .site-header {
    align-items: stretch;
    flex-direction: column;
  }

  .search-box {
    flex-basis: auto;
  }

  .directory-layout {
    grid-template-columns: 1fr;
  }

  .category-rail {
    position: static;
    overflow-x: auto;
  }

  .category-nav {
    grid-auto-flow: column;
    grid-auto-columns: minmax(188px, 1fr);
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .directory-panel {
    min-height: 520px;
    padding: 16px;
  }

  .panel-heading,
  .group-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .panel-heading::after {
    top: -16px;
    font-size: 5.5rem;
  }

  .resource-row {
    grid-template-columns: minmax(0, 1fr);
    gap: 7px;
  }

  .open-link {
    justify-self: start;
  }
}
```

- [ ] **Step 2: Run the CSS selector check**

Run:

```powershell
$html = Get-Content -LiteralPath .\index.html -Raw
@('.directory-layout','.category-rail','.directory-panel','.resource-row','@media (max-width: 820px)') | ForEach-Object {
  if ($html -notmatch [regex]::Escape($_)) { throw "Missing CSS selector $_" }
}
'visual system present'
```

Expected output:

```text
visual system present
```

- [ ] **Step 3: Commit styling**

Run:

```powershell
git add -- index.html
git commit -m "Style index as Japanese compact directory"
```

Expected: commit succeeds.

---

### Task 6: Add Final Static Validation

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Validate all indexed paths exist**

Run:

```powershell
$html = Get-Content -LiteralPath .\index.html -Raw
$paths = [regex]::Matches($html, "path:\s*'([^']+\.html)'") | ForEach-Object { $_.Groups[1].Value }
$missing = $paths | Where-Object { -not (Test-Path -LiteralPath $_) }
if ($missing) { $missing; throw 'Missing indexed file path' }
'all indexed paths exist'
```

Expected output:

```text
all indexed paths exist
```

- [ ] **Step 2: Validate every current HTML file is indexed**

Run:

```powershell
$html = Get-Content -LiteralPath .\index.html -Raw
$indexed = [regex]::Matches($html, "path:\s*'([^']+\.html)'") | ForEach-Object { $_.Groups[1].Value } | Sort-Object
$actual = Get-ChildItem -Recurse -File -Filter *.html |
  Where-Object { $_.Name -ne 'index.html' -and $_.FullName -notmatch '\\.git\\' } |
  ForEach-Object { $_.FullName.Substring((Get-Location).Path.Length + 1).Replace('\','/') } |
  Sort-Object
$missingFromIndex = Compare-Object -ReferenceObject $actual -DifferenceObject $indexed | Where-Object SideIndicator -eq '<='
$extraInIndex = Compare-Object -ReferenceObject $actual -DifferenceObject $indexed | Where-Object SideIndicator -eq '=>'
if ($missingFromIndex -or $extraInIndex) {
  $missingFromIndex
  $extraInIndex
  throw 'Index inventory mismatch'
}
'index inventory matches filesystem'
```

Expected output:

```text
index inventory matches filesystem
```

- [ ] **Step 3: Validate category hashes and counts**

Run:

```powershell
$html = Get-Content -LiteralPath .\index.html -Raw
@('#lessons','#vocabulary','#quiz','#kanji','#jft-mock','#jlpt-mock','#targeted-quiz','#specialized-lessons') | ForEach-Object {
  $id = $_.TrimStart('#')
  if ($html -notmatch "id:\s*'$id'") { throw "Missing category id $id" }
}
$paths = [regex]::Matches($html, "path:\s*'([^']+\.html)'") | ForEach-Object { $_.Groups[1].Value }
if (($paths | Where-Object { $_ -like 'Lessons/*' }).Count -ne 61) { throw 'Lessons count mismatch' }
if (($paths | Where-Object { $_ -like 'Vocabulary/*' }).Count -ne 25) { throw 'Vocabulary count mismatch' }
if (($paths | Where-Object { $_ -like 'Quiz/*' }).Count -ne 8) { throw 'Quiz count mismatch' }
if (($paths | Where-Object { $_ -like 'JFT-Mock/*' }).Count -ne 7) { throw 'JFT-Mock count mismatch' }
if (($paths | Where-Object { $_ -like 'Targeted-Quiz/*' }).Count -ne 3) { throw 'Targeted-Quiz count mismatch' }
if (($paths | Where-Object { $_ -like 'Kanji/*' }).Count -ne 2) { throw 'Kanji count mismatch' }
if (($paths | Where-Object { $_ -like 'Specialized-Lessons/*' }).Count -ne 2) { throw 'Specialized-Lessons count mismatch' }
if (($paths | Where-Object { $_ -like 'JLPT-Mock/*' }).Count -ne 1) { throw 'JLPT-Mock count mismatch' }
'category hashes and counts ok'
```

Expected output:

```text
category hashes and counts ok
```

- [ ] **Step 4: Run whitespace sanity check**

Run:

```powershell
git diff --check
```

Expected: no output and exit code 0.

- [ ] **Step 5: Commit validation-ready page**

Run:

```powershell
git add -- index.html
git commit -m "Validate index resource coverage"
```

Expected: commit succeeds if Task 6 required any fixes. If no file changed after Task 5, skip this commit.

---

### Task 7: Browser And Responsive Verification

**Files:**
- Modify: none unless verification exposes a defect

- [ ] **Step 1: Open the page directly**

Open `C:\Users\valla\Downloads\My-Japanese-Reviewers\index.html` in a browser.

Expected:

```text
The page loads without a build step.
The default active category is Lessons.
The left rail shows all eight categories.
The Lessons panel shows N5 Lessons, N4 Book 1, and N4 Book 2.
```

- [ ] **Step 2: Verify navigation**

Click each category:

```text
Lessons
Vocabulary
Quiz
Kanji
JFT Mock
JLPT Mock
Targeted Quiz
Specialized Lessons
```

Expected:

```text
The active nav state moves to the clicked category.
The content panel updates.
The hash changes to the clicked category id.
Every visible Open link points to a real relative HTML file.
```

- [ ] **Step 3: Verify search**

Search these strings:

```text
kanji
Lesson 18
JFT
conjugation
not-a-resource-name
```

Expected:

```text
Real terms show matching resource rows across categories.
The fake term shows the empty state.
Clearing search restores the selected category.
```

- [ ] **Step 4: Verify expand controls**

Click `Show all` in dense groups.

Expected:

```text
Collapsed groups show no more than 8 rows.
Expanded groups show every file in that group.
The expanded state does not break row spacing or overlap text.
```

- [ ] **Step 5: Verify mobile layout**

Resize browser width below 820px.

Expected:

```text
The category rail becomes a horizontal strip.
The resource panel stacks below it.
Rows are readable and tap-friendly.
No text overlaps or escapes its container.
```

- [ ] **Step 6: Fix any verification defects**

If a defect appears, make the smallest `index.html` edit that fixes it, then rerun the relevant check from Tasks 6 and 7.

- [ ] **Step 7: Commit browser fixes**

Run this only if Step 6 changed `index.html`:

```powershell
git add -- index.html
git commit -m "Fix compact directory verification issues"
```

Expected: commit succeeds if there were browser fixes.

---

### Task 8: Final Handoff Check

**Files:**
- Modify: none

- [ ] **Step 1: Confirm working tree state**

Run:

```powershell
git status --short
```

Expected:

```text
 D Quiz/Grammar-2_n5.html
```

The deleted quiz file is pre-existing user state and must remain untouched unless the user asks otherwise.

- [ ] **Step 2: Record final verification commands**

Run the three Task 6 validation commands again and record their successful outputs in the final response:

```text
all indexed paths exist
index inventory matches filesystem
category hashes and counts ok
```

- [ ] **Step 3: Summarize delivery**

Final response must include:

```text
Implemented compact directory redesign in index.html.
Every current HTML resource except index.html is indexed: 109 resources.
Validation commands passed.
Browser/mobile verification result.
Pre-existing deletion left untouched: Quiz/Grammar-2_n5.html.
```
