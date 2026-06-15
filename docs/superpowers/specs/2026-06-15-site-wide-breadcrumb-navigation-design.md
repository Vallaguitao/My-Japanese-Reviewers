# Site-Wide Breadcrumb Navigation Design

Date: 2026-06-15
Status: Approved design direction
Target scope: Current site content HTML files; root `index.html` is the breadcrumb destination

## Goal

Add consistent breadcrumb navigation to the static study site so every content page can move back to the root directory and its category panel.

The final hierarchy is:

```text
Home > Category > Current Page
```

No new hub pages will be created. The existing root `index.html` remains the site home and category directory.

## Current Site Inventory

The current checkout contains 110 site HTML files outside `.git` and `.worktrees`:

- `index.html`: 1 root home page
- `Lessons`: 61 pages
- `Vocabulary`: 25 pages
- `Quiz`: 8 pages
- `JFT-Mock`: 7 pages
- `Targeted-Quiz`: 3 pages
- `Kanji`: 2 pages
- `Specialized-Lessons`: 2 pages
- `JLPT-Mock`: 1 page

The breadcrumb rollout applies to the 109 content pages. The root home page is the destination for breadcrumbs, not a page that needs its own breadcrumb. Generated worktree files are out of scope.

## Breadcrumb Hierarchy And Links

`Home` always links to the root `index.html` from the current file location.

`Category` always links to the matching category hash on the root `index.html`:

- `Lessons/*` -> `index.html#lessons`
- `Vocabulary/*` -> `index.html#vocabulary`
- `Quiz/*` -> `index.html#quiz`
- `Kanji/*` -> `index.html#kanji`
- `JFT-Mock/*` -> `index.html#jft-mock`
- `JLPT-Mock/*` -> `index.html#jlpt-mock`
- `Targeted-Quiz/*` -> `index.html#targeted-quiz`
- `Specialized-Lessons/*` -> `index.html#specialized-lessons`

The relative prefix changes by file depth. For example:

```html
<!-- Lessons/N5-Lessons/Lesson_1.html -->
<a href="../../index.html">Home</a>
<a href="../../index.html#lessons">Lessons</a>
<span>Lesson 1</span>
```

```html
<!-- Kanji/Kanji_flashcard.html -->
<a href="../index.html">Home</a>
<a href="../index.html#kanji">Kanji</a>
<span>N5 Kanji Reviewer</span>
```

## Visual Direction

Use Option A from the visual review: a quiet breadcrumb strip below existing top UI.

The breadcrumb should feel related to the root directory design:

- warm paper-toned background
- dark ink text
- muted red for the category/current accent
- simple separators
- Noto Sans JP and Outfit-compatible typography
- restrained border and radius

The breadcrumb should not become a fixed bar. It should sit in normal document flow so it does not compete with lesson progress bars or mobile quiz controls.

## Placement Rules

Lesson pages use fixed progress bars near the top. On those pages, the breadcrumb should appear below the fixed progress UI and above the lesson presentation content.

Non-lesson pages vary more by layout. On those pages, the breadcrumb should appear near the top of the body, before the main page header or primary app wrapper where practical.

The same canonical CSS and markup structure should be duplicated across files, with only these file-specific values changing:

- relative link prefix
- category label
- category hash
- current page label

## Canonical Snippet Requirements

Each content page should contain one breadcrumb block with:

- `nav` landmark
- `aria-label="Breadcrumb"`
- ordered or clearly sequenced crumbs
- accessible current-page text using `aria-current="page"` or an equivalent non-link final crumb
- no JavaScript dependency
- no external CSS dependency

The CSS should use class names unlikely to collide with lesson or quiz internals, such as `site-breadcrumb`, `site-breadcrumb__link`, and `site-breadcrumb__current`.

## Root Home Page

The root `index.html` is already the home/category directory. It does not need `Home > Home`.

Do not add a breadcrumb to the root page. Keeping the home page as the directory surface avoids redundant navigation and visual clutter.

## Validation

Before completion:

- Confirm every current content HTML file has exactly one breadcrumb.
- Confirm `index.html` still has all category hash targets.
- Confirm each `Home` link resolves from its file location.
- Confirm each `Category` link resolves to the expected root hash.
- Confirm there are no duplicate breadcrumb blocks in any file.
- Run a static inventory check excluding `.git` and `.worktrees`.
- Run the lesson self-check audit after edits, because inline HTML changes across lesson files should not break existing quiz behavior.
- Run `git diff --check`.

## Non-Goals

- Do not create `Lessons/index.html` or any other new hub page.
- Do not convert pages to a shared JavaScript breadcrumb renderer.
- Do not add a build step or framework.
- Do not redesign the individual lesson, quiz, vocabulary, kanji, or mock pages.
- Do not change the root directory information architecture beyond any small styling needed for breadcrumb consistency.
