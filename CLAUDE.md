# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Kade Smiley's personal site (`kadesmiley.github.io`) — a static, hand-written HTML/CSS site with no build step, no package manager, and no framework. It's served as-is via GitHub Pages: open any `.html` file directly in a browser to preview it.

## Development

There is no install, build, lint, or test command — there's no `package.json`. Edit the HTML/CSS files directly and open them in a browser (or use a local static file server) to check changes.

## Architecture

**Pages** (`index.html`, `research.html`, `outreach.html`, `essays.html`) share one hand-rolled layout, not a templating system — each page repeats the same `<nav>` and `<footer>` markup verbatim. When changing shared chrome (nav links, footer), update it in every page. `cv.html` and `contact.html` are linked from the nav but don't exist yet. `research.html` links to detail pages under `projects/`, and `essays.html` to detail pages under `essays/`, that also don't exist yet — the cards linking to them are placeholders (`[Project Title]`, `[Essay Title]`, etc.) for future content.

**Styling** lives in `assets/css/site.css`, the only stylesheet actually loaded by the pages. It's organized around CSS custom properties (design tokens) defined on `:root`, then reusable structural blocks in this order: nav, hero, split-row (two-column about/bio sections), card-grid, article-list, footer, then a single mobile breakpoint at 800px that overrides all of the above. When adding new page sections, prefer extending these existing block classes over inventing new ones — see "Extending the design system" below before reaching for a new class.

**Dark mode** is a `data-theme="dark"` attribute on `<html>`, toggled by `assets/js/theme.js` and persisted to `localStorage`. Every page has two theme-related pieces that must both be present:
- An inline `<script>` in `<head>` that reads `localStorage` and sets `data-theme` *before* the page paints (avoids a flash of the wrong theme). `index.html`'s version only sets the attribute if a saved preference exists (defaults to light); the other pages default to `"dark"` when nothing is saved yet — match whichever pattern the page you're editing already uses.
- A `<button class="theme-toggle">` in the nav, and the `assets/js/theme.js` script tag before `</body>`.

Dark-mode colors are just a second set of values for the same custom property names under the `html[data-theme="dark"]` selector in `site.css` — never hardcode a color in a new rule; add/reuse a variable instead so both themes stay in sync.

The old HTML5 UP-based template's leftover files (`assets/css/main.css`, `noscript.css`, `fontawesome-all.min.css`, `home.css`, `assets/webfonts/`, `assets/sass/`) have been removed — they were never referenced by any current page. `site.css` is the only stylesheet that matters unless a page's `<head>` is changed to load something else.

## Card system

There are two distinct card components, both built on the same surface tokens (`--card-bg`, `--card-shadow`, `--card-shadow-hover`) so they read as one family, but laid out differently:

- **`.card-grid` / `.card`** — image on top, title and text below, arranged in a grid (currently `repeat(3, 1fr)`, one column on mobile). Used by `research.html` only. Hovering fades the image slightly via `--card-bg-hover`.
- **`.article-list` / `.article-card`** — wide horizontal rows: a fixed-size image on the left, title + description on the right, stacked full-width. Used by `outreach.html` and `essays.html`. `.article-card-kicker` is an optional small colored eyebrow line (outlet/venue + date) — include the `<span>` for it (as outreach does) or omit it (as essays does).

**Important, learned the hard way this session:** `.article-card` is a fixed `height: 175px`, not `min-height`, and `.article-card img` is `height: 100%` rather than left to `auto`. The first version used `min-height` + auto image height, and cards rendered at *different* heights because each row's placeholder image had different native pixel dimensions (e.g. 368×256 vs 175×139) — with `align-items: stretch` and no explicit image height, the browser factors an image's own aspect ratio into how tall the row becomes. The fix was to stop letting content (image shape *or* text length) drive the row's size at all: fix the card height, make the image fill it, and clamp the title/description to 1/2 lines (`line-clamp`) so future real content can't stretch a row taller than its siblings. **Any new fixed-size card component should follow the same rule** — give images an explicit height or `aspect-ratio`, never rely on their natural file dimensions inside a flex/grid layout you want uniform.

The width side of this had the same bug, one layer more hidden: `.article-card img` used `flex: 0 0 220px` for its width, which sets the flex item's *flex-basis*, not its `width` property. For a replaced element (an `<img>`) with both a definite height (`height: 100%`, from the rule above) and an intrinsic aspect ratio, the browser computes the actual rendered width from that ratio × the height instead of from the flex-basis, unless `width` is also set explicitly. Placeholder images that happened to share a 220:175-ish ratio (175×139) rendered correctly by coincidence; one with a different ratio (368×256) rendered ~30px wider than its siblings. Fixed by adding `width: 220px` alongside `flex: 0 0 220px`. **Lesson: `flex: 0 0 <length>` is not a substitute for setting `width` explicitly on a replaced element — set both when a fixed-size image must not vary with its source file's aspect ratio.**

## Design tokens

All defined once in `:root` in `site.css`, overridden for dark mode in the `html[data-theme="dark"]` block just below it (a token not overridden there — like `--accent`, `--nav-height`, and `--card-bg-hover` — is intentionally the same in both themes):

| Token | Purpose |
|---|---|
| `--nav-height` | Height reserved at the top of `.split-row` sections so fixed nav doesn't overlap content |
| `--bg` / `--bg-alt` | Page background / alternate section background (used to alternate section stripes down a page) |
| `--text` / `--text-muted` | Primary text / secondary (captions, descriptions) text |
| `--nav-bg` / `--nav-text` | Nav bar background (semi-transparent, so page content shows through slightly when scrolling under it) and text |
| `--rule-color` | Color of thin `<hr class="section-rule">` dividers |
| `--card-bg` | Card surface color — deliberately a shade off the page background so cards read as raised objects |
| `--card-shadow` / `--card-shadow-hover` | Drop shadow at rest / on hover (hover shadow is larger + darker, paired with a `translateY` lift) |
| `--card-bg-hover` | Not a color — an *opacity* value used to fade `.card` images on hover |
| `--accent` | Small accent color for the article-card kicker line; matches the footer's blue, kept constant across themes for now |

When you add new UI, reuse these before adding a new token, and add a new token (not a hardcoded value) if none fits.

## How these pieces work (brief notes for learning)

- **CSS custom properties as a theme system**: `--name: value` on `:root` defines a variable; `var(--name)` reads it anywhere. Because `html[data-theme="dark"] { --bg: ...; }` redefines the *same names* on a more specific selector, everything that already uses `var(--bg)` automatically repaints for dark mode — no rule anywhere needs an `if (dark) {...}` branch.
- **Avoiding a flash of the wrong theme**: the inline `<script>` in `<head>` runs *before* the browser paints anything, so it can set `data-theme` from `localStorage` before the first frame. If that script were moved to the bottom of `<body>` instead, you'd briefly see the light page flash before it switched to dark.
- **Flexbox for the row cards**: `.article-card` is `display: flex` (a row). The image gets `flex: 0 0 220px` (don't grow, don't shrink, start at 220px — i.e. a fixed-width column), and the text body gets `flex: 1 1 auto` (grow to fill whatever space is left). `align-items: stretch` (the default) makes both children fill the row's full height.
- **`object-fit: cover`**: tells a differently-shaped image to fill its box by cropping, instead of squishing or leaving gaps — like a phone camera's "fill" crop mode.
- **`aspect-ratio`**: reserves a shape (e.g. `4 / 3`) for an element before its content loads, so the page doesn't jump around as images finish loading in.
- **`box-shadow` for depth**: two soft, semi-transparent shadows (rest + a bigger one on hover) plus a small `translateY` on hover is the whole "card lifts off the page" effect — no image or extra markup needed.
- **`line-clamp`**: truncates text to a fixed number of lines with a trailing ellipsis, so a card's text column can't grow taller than its siblings even if the real content ends up longer than the placeholder.
- **CSS Grid `repeat()`**: `grid-template-columns: repeat(3, 1fr)` means "3 equal-width columns" — change the `3` to change the column count anywhere a `.card-grid` is used.
- **The single mobile breakpoint**: rather than a rule per component, one `@media (max-width: 800px) { ... }` block near the bottom of `site.css` collects every mobile override in one place — check there (and add to it) when a new component needs different small-screen behavior.

## Extending the design system

Kade may want to add more visual polish/interactivity later — some notes to keep additions consistent rather than one-off:
- Reach for the existing tokens and card components first; a genuinely new pattern should still be built as a token-driven, theme-aware block like the ones above (light values in `:root`, dark overrides in `html[data-theme="dark"]`), not a page-specific inline style.
- Any hover/entrance animation should respect `prefers-reduced-motion` (not currently handled anywhere in `site.css` — worth adding a blanket `@media (prefers-reduced-motion: reduce)` rule that disables transitions/animations if motion design gets added).
- If more accent/brand colors get introduced beyond `--accent`, decide deliberately whether each should shift between light/dark or stay constant (like the footer blue currently does), rather than leaving it undefined in one theme by accident.
- `projects/*.html` and `essays/*.html` detail pages, plus `cv.html` and `contact.html`, are still unbuilt — when they are, they should reuse `.hero`/`.card-section`/`.split-row` rather than introducing a parallel layout system.
