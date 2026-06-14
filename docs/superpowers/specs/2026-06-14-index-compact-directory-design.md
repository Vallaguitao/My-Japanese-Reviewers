# Index Compact Directory Redesign

Date: 2026-06-14
Status: Approved design direction
Target file: `index.html`

## Goal

Redesign `index.html` from scratch as a modern Japanese study hub that indexes the entire workspace. The page should be clean, simple, easy to navigate, and polished without becoming a portfolio page or a generic file listing.

The finished page must let users reach every linked HTML resource from the homepage in two clicks or fewer.

## Current Workspace Inventory

Top-level content categories:

- `Lessons`: 61 HTML files, grouped into `N5-Lessons`, `N4-Lessons-Book-1`, and `N4-Lessons-Book 2`
- `Vocabulary`: 25 HTML files
- `Quiz`: 8 HTML files in the working tree inventory, with one pre-existing deleted file in git status
- `JFT-Mock`: 7 HTML files
- `Targeted-Quiz`: 3 HTML files
- `Kanji`: 2 HTML files
- `Specialized-Lessons`: 2 HTML files
- `JLPT-Mock`: 1 HTML file

`README.md` is not part of the navigable study-resource index unless explicitly added later.

## Information Architecture

Use the compact directory approach.

The page is split into:

- a persistent category rail
- a main selected-category panel
- a global search control

The category rail lists every top-level folder as a navigable category:

- Lessons
- Vocabulary
- Quiz
- Kanji
- JFT Mock
- JLPT Mock
- Targeted Quiz
- Specialized Lessons

`Lessons` remains one top-level category. Inside the main panel it is grouped into:

- N5 Lessons
- N4 Book 1
- N4 Book 2

Human-readable page titles should be the primary labels. Paths should appear as smaller secondary text for clarity and transparency.

## Layout

Desktop layout:

- Header across the top with the site name, Japanese subtitle, and search input.
- Left rail for category navigation.
- Right panel for the active category.
- Dense resource groups render as compact rows, not large cards.
- Each row has a title, path, and direct open link.

Mobile layout:

- Header stays compact.
- Category rail becomes a horizontal category strip.
- Main panel stacks below the category strip.
- Rows remain tap-friendly and must not overflow.

## Visual Direction

The design should feel like a refined Japanese study directory:

- warm off-white or paper-like base
- dark ink text
- restrained borders and shadows
- muted red for active navigation and primary actions
- soft indigo or ink tones for secondary states
- subtle sakura or washi-like tint only where useful

Japanese accents should be intentional and sparse:

- category marks such as `学`, `語`, `試`, and `漢`
- a low-contrast kanji watermark in the active content panel
- small Japanese subtitle text paired with English labels

Avoid:

- portfolio or developer-intro content
- large marketing hero sections
- decorative clutter
- one long flat list
- generic minimal styling with no Japanese study identity

Typography:

- Use `Noto Sans JP` for Japanese and mixed study titles.
- Use `Outfit` for concise English UI labels.
- Keep text sizes responsive through layout constraints, not viewport-width font scaling.

## Behavior

Category navigation:

- Clicking a category updates the active panel.
- The active category is visually clear.
- URL hashes must map to every category id: `#lessons`, `#vocabulary`, `#quiz`, `#kanji`, `#jft-mock`, `#jlpt-mock`, `#targeted-quiz`, and `#specialized-lessons`.

Search:

- Searches resource titles, category names, group names, and paths.
- Shows matching resources across all categories.
- Clearing search returns to the selected category.
- Empty search results should show a small, clear empty state.

Expand controls:

- Small categories can show all files immediately.
- Dense groups such as lesson tracks and vocabulary can show a clean initial set with a `Show all` control.
- Expanded state should preserve the two-click reachability requirement.

Links:

- Each listed resource opens its actual HTML file.
- Relative paths must work when opening `index.html` directly from disk and when served by GitHub Pages.
- Link text should be human-readable, based on page `<title>` values where available.

## Data Model

Keep the implementation in vanilla `index.html` with embedded CSS and JavaScript.

The resource data should be a plain JavaScript array of category objects. Each category contains:

- category id
- display name
- Japanese mark
- description or subtitle
- groups array; categories without natural subgroups use one default group
- resource entries with title, path, and optional tags

The rendering functions should derive counts, category views, search results, and dense-group previews from that data. Avoid hardcoding duplicate counts in the markup.

## Error Handling And Edge Cases

- If a resource has a missing or weak title, use a cleaned filename fallback.
- If search has no matches, show an empty state instead of leaving a blank panel.
- If an unknown hash is loaded, fall back to `Lessons`.
- If JavaScript is disabled, the static markup should still present the category rail and at least the default `Lessons` category links.

## Validation

Before considering implementation complete:

- Confirm every current HTML file except `index.html` appears in the resource data.
- Confirm each listed path exists.
- Confirm there are no duplicate resource paths.
- Confirm the page works when opened directly as a file.
- Confirm responsive behavior at desktop and mobile widths.
- Run a basic syntax check for the embedded JavaScript.
- Run a whitespace/diff sanity check before final delivery.

## Non-Goals

- Do not convert the project to a framework.
- Do not add a build step.
- Do not redesign the individual lesson, quiz, vocabulary, kanji, or mock pages.
- Do not add developer portfolio content to this project.
- Do not restore or remove unrelated working-tree changes.
