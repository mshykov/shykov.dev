# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Maksym Shykov's personal website/blog — a React SPA prerendered to static HTML per route at build time, served from Cloudflare Pages. Blog posts are Markdown files committed with the app (`src/content/posts/*.md`); there is no backend and no database. Firebase remains only for consent-gated Analytics, plus dormant Firestore rules (see "Legacy Firebase surface" below).

## Docs

Project-specific docs (self-contained) live in `docs/`:

- [docs/seo.md](docs/seo.md)
- [docs/design.md](docs/design.md)
- [docs/developer.md](docs/developer.md)
- [docs/security.md](docs/security.md)
- [docs/retro.md](docs/retro.md) — session retro + workflow lessons
- [docs/tech-debt.md](docs/tech-debt.md) — prioritized debt register + phased plan
- [docs/session-handoff.md](docs/session-handoff.md) — **start here in a new session**: current state, merge/Dependabot playbooks, open threads
- [docs/next-session-prompt.md](docs/next-session-prompt.md) — ready-to-paste prompts per thread

Each file above is self-contained. A minimal Vitest smoke suite (`npm test`) covers
the pure helpers in `src/lib/`, the static post registry, and the security-header
invariants; the primary gate remains `tsc -b` / `npm run build`
(see [docs/developer.md](docs/developer.md)).

## Commands

```bash
npm run dev        # Vite dev server with HMR
npm run build      # tsc -b (typecheck), vite build, then prerender (scripts/prerender.mjs, needs Chrome) → dist/
npm run lint       # ESLint over the repo
npm run preview    # serve the production build locally
npm test           # Vitest smoke suite over src/lib/ + static post registry
# Production hosting is Cloudflare Pages (project: shykov-dev, domain: shykov.dev),
# deployed by GitHub Actions on merge to main (.github/workflows/cloudflare-pages-merge.yml);
# docs/config-only merges skip the deploy (paths-ignore), manual run via workflow_dispatch.
# firebase deploy only pushes Firestore rules now — there is no Firebase Hosting surface.
```

`npm run build` is the primary gate — it runs `tsc -b`, so type errors fail the build even though Vite alone would not catch them, and the prerender step fails loudly if any sitemap route renders without a title. `npm test` runs a small Vitest suite over the pure helpers in `src/lib/`, the static post registry, and the CSP-hash/security-header invariants; component/integration tests are intentionally out of scope.

## Environment

Firebase config is read from `VITE_FIREBASE_*` env vars (see `.env.example`) and injected at build time via Vite — it powers **Analytics only**. `src/firebase.ts` is analytics-only (no Firestore, no Auth — enforced by `src/lib/publicPath.test.ts`) and is loaded via dynamic `import()` in `src/lib/analytics.ts` strictly after cookie consent. Missing vars don't fail the build — `src/firebase.ts` logs a `console.error` naming any missing required keys (`apiKey`, `projectId`, `appId`), and analytics simply stays off.

## Architecture

- **Routing** (`src/App.tsx`): `react-router-dom` v7 `BrowserRouter`. Routes are statically imported under a single `Layout` route (`/` → Home, `/experience`, `/blog`, `/blog/:slug`). **No `lazy()`, no `Suspense`** — React marks Suspense boundaries with SSR-only comment nodes that a DOM snapshot cannot carry, so a boundary anywhere in the tree fails hydration even when nothing suspends (`src/lib/hydration.test.ts` guards this). The route chunks were 1–10 kB each; bundling them costs ~2 kB gzip on a first visit and saves six requests. `ScrollToTop` resets scroll on navigation. Sitemap routes are served as prerendered static HTML; unknown paths fall back to the SPA shell via `public/_redirects` (`/* /index.html 200`) and hydrate to the `noindex` 404.
- **Layout** (`src/components/Layout.tsx`): renders header/nav/footer around an `<Outlet/>`, and owns dark-mode + cookie-banner state.
- **Blog content pipeline**: `src/content/posts/*.md` (frontmatter + Markdown) → imported with Vite's `?raw` loader and parsed by `src/lib/postContent.ts` → registered in `src/content/posts.ts` (`createPostIndex` filters `published: true` and sorts by `publishedAt` desc). `/blog` lists the index; `/blog/:slug` renders the article via `MarkdownContent` (builds React elements — no `dangerouslySetInnerHTML`) with `{{figure:<name>}}` shortcodes handled by `PostFigures.tsx`. Drafts are registered with `published: false` — parsed and validated by tests, invisible on the site. **Adding a post**: registry import + sitemap entry (which also makes it prerender).
- **Analytics is consent-gated.** Google Analytics (gtag in `index.html`) starts in Consent Mode v2 `analytics_storage: 'denied'`; Firebase Analytics (`initAnalytics()` in `src/firebase.ts`) is *not* called at import time. The cookie banner in `Layout` writes `localStorage['cookie-consent']` = `'accepted'|'declined'` and, on accept, calls `gtag('consent','update',…)` + `initAnalytics()`. This invariant spans four places — `index.html`, `Layout`'s accept/decline handlers, `firebase.ts`, and the `'cookie-consent'` key — keep them in sync when touching analytics or consent.

## Legacy Firebase surface

The blog no longer uses Firestore — posts are static Markdown (see the content
pipeline above).

The `m-shykov.web.app` Firebase Hosting site is **retired**: it was taken down
and its `hosting` block removed from `firebase.json`. Every path there returns
404 instead of a 301 to `shykov.dev` (verified 2026-08-30) — deliberate, not a
regression to chase. Don't revive it; re-point any inbound link that still
matters.

`firestore.rules` and `firestore.indexes.json` remain so
`firebase deploy --only firestore:rules` can keep all Firestore client writes
denied should the project ever be probed. The public app must never import
`firebase/firestore` or `firebase/auth` — `src/lib/publicPath.test.ts` fails if
it does.

## SEO

- **Per-route metadata**: the base `<head>` tags live statically in `index.html` (representing Home). Each page renders `<Seo title description path />` (`src/components/Seo.tsx`), whose effect updates `document.title`, the description, canonical, and og/twitter title/description/url on navigation — so each route has a unique, accurate title/description (Google renders JS). **When adding a route, render `<Seo>` in it** (use `noindex` for non-indexable pages like the 404).
- **Crawlability**: `public/robots.txt` (allows all + Sitemap line), `public/sitemap.xml` (lists the routes), and `public/llms.txt` (AI-crawler guide) ship at the site root — Cloudflare Pages serves static assets before the SPA rewrite. The catch-all route (`*` → `NotFound`) renders `noindex` to avoid soft-404s.
- **Structured data**: a `WebSite` + `Person` JSON-LD `@graph` in `index.html` (static, sitewide). Update it if the role, employer, or social profiles change.
- **Prerendering**: `scripts/prerender.mjs` runs inside `npm run build` — it snapshots every route in `public/sitemap.xml` with headless Chrome (system Chrome via puppeteer-core) and writes per-route static HTML into `dist/` (`blog.html`, `blog/<slug>.html`; flat `.html` files, not directory indexes, so Cloudflare Pages serves the exact slash-less URLs without 308s). Non-JS crawlers get full content + per-route meta. Each snapshot is stamped with `data-prerender-route`; `src/main.tsx` hydrates only when the stamp matches `location.pathname` (the Home snapshot doubles as the SPA fallback, so unknown paths clear it and client-render to the 404). The sitemap is the prerender route list — adding a route to it is what makes it prerender.
- **Hydrating a DOM snapshot has constraints React's own SSR output does not.** Serializing a live DOM loses two things React needs: the comment separators between adjacent text nodes (`{a}{b}` comes back as one node), which the prerender script reinserts, and Suspense boundary markers, which it cannot — hence the no-`Suspense` rule above. Markup must also never be derived from `localStorage` during render: the snapshot is taken in a fresh browser, so a returning visitor renders something different (this cost us the theme toggle, now driven by the `.dark` class via CSS). All three are covered by `src/lib/hydration.test.ts`; a mismatch is not cosmetic — React discards the entire snapshot and client-renders, flashing on the way.

## Styling & dark mode

- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin. There is no JS Tailwind config and no PostCSS config — content detection is automatic and theme customization goes in an `@theme` block in CSS. The single stylesheet is `src/index.css`, which `@import "tailwindcss"` and defines `@font-face` (Fixel Text), reusable component classes under `@layer components` (e.g. `layout-root`, `layout-header`, `posts-grid`, `theme-toggle`), and base styles. Prefer Tailwind utilities in JSX; reach for these component classes for repeated layout structures. Note: `animate-in`/`slide-in-from-*` plugin utilities are **not** available (no plugin installed) — use a hand-written `@keyframes` class instead (see `cookie-banner-enter`).
- **Dark mode is class-based, not media-query based.** The custom variant `@custom-variant dark (&:where(.dark, .dark *))` keys off a `.dark` class on `<html>`. State is persisted in `localStorage.theme` and toggled in `Layout`. An inline script in `index.html` applies the class before React mounts to prevent a flash of unstyled content (FOUC) — system preference is deliberately ignored. When touching theming, keep the `index.html` script, the `Layout` toggle, and `localStorage` in sync.

## Conventions

- Strict TypeScript (`tsconfig.app.json`: `strict`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`). Use `import type` for type-only imports.
- Functional components only; styling stays in Tailwind/`index.css` rather than inline styles or new CSS files.
- Static assets that ship as-is (icons, `manifest.json`, `og-image.png`, fonts) live in `public/` and are copied verbatim into `dist/` on build; imported assets live in `src/assets/`. The icon set in `public/` (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`) is generated from `favicon.svg` and wired into `index.html` + `manifest.json` per the icon/PWA checklist in the user's global `~/.claude/CLAUDE.md`.
