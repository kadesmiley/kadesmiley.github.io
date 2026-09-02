# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Kade Smiley's personal site (`kadesmiley.github.io`) — a static, hand-written HTML/CSS site with no build step, no package manager, and no framework. It's served as-is via GitHub Pages: open any `.html` file directly in a browser to preview it.

## Development

There is no install, build, lint, or test command — there's no `package.json`. Edit the HTML/CSS files directly and open them in a browser (or use a local static file server) to check changes.

## Architecture

**Pages** (`index.html`, `research.html`, `outreach.html`, `essays.html`) share one hand-rolled layout, not a templating system — each page repeats the same `<nav>` and `<footer>` markup verbatim. When changing shared chrome (nav links, footer), update it in every page. `cv.html` and `contact.html` are linked from the nav but don't exist yet. `research.html` and `essays.html` link to detail pages under `projects/` and `essays/` that also don't exist yet — these are placeholders (`[Project Title]`, `[One or two lines...]`) for future content.

**Styling** lives in `assets/css/site.css`, the only stylesheet actually loaded by the pages. It's organized around CSS custom properties defined on `:root` (`--bg`, `--text`, `--nav-bg`, etc.), then reusable structural blocks in this order: nav, hero, split-row (two-column about/bio sections), card-grid (`.card` — image-on-top grid cards, used by `research.html`, currently 3 columns), article-list (`.article-card` — wide horizontal row cards with a left-hand image, used by `outreach.html` and `essays.html`; `.article-card-kicker` is an optional eyebrow line for outlet/venue + date, used in outreach but omitted in essays), footer, then a mobile breakpoint at 800px that overrides the above. When adding new page sections, prefer extending these existing block classes over inventing new ones.

**Dark mode** is a `data-theme="dark"` attribute on `<html>`, toggled by `assets/js/theme.js` and persisted to `localStorage`. Every page has two theme-related pieces that must both be present:
- An inline `<script>` in `<head>` that reads `localStorage` and sets `data-theme` *before* the page paints (avoids a flash of the wrong theme). `index.html`'s version only sets the attribute if a saved preference exists (defaults to light); the other pages default to `"dark"` when nothing is saved yet — match whichever pattern the page you're editing already uses.
- A `<button class="theme-toggle">` in the nav, and the `assets/js/theme.js` script tag before `</body>`.

Dark-mode colors are just a second set of values for the same custom property names under the `html[data-theme="dark"]` selector in `site.css` — never hardcode a color in a new rule; add/reuse a variable instead so both themes stay in sync.

The old HTML5 UP-based template's leftover files (`assets/css/main.css`, `noscript.css`, `fontawesome-all.min.css`, `home.css`, `assets/webfonts/`, `assets/sass/`) have been removed — they were never referenced by any current page. `site.css` is the only stylesheet that matters unless a page's `<head>` is changed to load something else.
