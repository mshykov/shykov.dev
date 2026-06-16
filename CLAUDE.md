# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Maksym Shykov's personal website/blog — a single-page React app served as static files from Firebase Hosting, reading published posts from Firestore. There is no custom backend; the only server-side surface is Firestore (security rules in `firestore.rules`).

## Docs

Project-specific docs (deltas over the org baselines) live in `docs/`:

- [docs/seo.md](docs/seo.md)
- [docs/design.md](docs/design.md)
- [docs/developer.md](docs/developer.md)
- [docs/security.md](docs/security.md)

The org common rules at `~/Projects/MSH/docs/` are the baseline; each file above
records only the shykov.dev-specific deltas. There is no `docs/testing.md` — this
project has no test suite; the `tsc -b` / `npm run build` step is the gate (see
[docs/developer.md](docs/developer.md)).

## Commands

```bash
npm run dev        # Vite dev server with HMR
npm run build      # tsc -b (typecheck all tsconfig projects) then vite build → dist/
npm run lint       # ESLint over the repo
npm run preview    # serve the production build locally
# Production hosting is Cloudflare Pages (project: shykov-dev, domain: shykov.dev),
# deployed by GitHub Actions on merge to master (.github/workflows/cloudflare-pages-merge.yml).
# firebase deploy now only updates the legacy m-shykov.web.app 301 redirects + Firestore rules.
```

There is no test runner configured. `npm run build` is the gate — it runs `tsc -b`, so type errors fail the build even though Vite alone would not catch them.

## Environment

Firebase config is read from `VITE_FIREBASE_*` env vars (see `.env.example`) and injected at build time via Vite. `src/firebase.ts` initializes the app and exports `db` (Firestore), `auth`, and `analytics`. Missing vars don't fail the build — they surface as Firebase runtime errors in the browser, but `src/firebase.ts` logs a `console.error` naming any missing required keys (`apiKey`, `projectId`, `appId`).

## Architecture

- **Routing** (`src/App.tsx`): `react-router-dom` v7 `BrowserRouter`. All routes are `lazy()`-loaded under a single `Layout` route (`/` → Home, `/experience`, `/blog`), wrapped in `Suspense`. `ScrollToTop` resets scroll on navigation. Because hosting rewrites all paths to `/index.html` (`firebase.json`), deep links work as client-side routes.
- **Layout** (`src/components/Layout.tsx`): renders header/nav/footer around an `<Outlet/>`, and owns dark-mode + cookie-banner state.
- **Data flow**: `Blog` → `PostList` → `PostCard`. `PostList` queries Firestore directly (`collection(db,'posts')`, `where('published','==',true)`, `limit(10)`) in a `useEffect`. There is no global state library, no data-fetching cache — each component that needs data queries Firestore itself. The `Post`/`User` shapes live in `src/types/index.ts` and mirror the Firestore documents.
- **Ordering caveat**: `orderBy('createdAt')` combined with the `where` filter is intentionally commented out in `PostList` because it requires a composite Firestore index (declared in `firestore.indexes.json`, currently empty). Adding sorted+filtered queries means adding the index there first.
- **Analytics is consent-gated.** Google Analytics (gtag in `index.html`) starts in Consent Mode v2 `analytics_storage: 'denied'`; Firebase Analytics (`initAnalytics()` in `src/firebase.ts`) is *not* called at import time. The cookie banner in `Layout` writes `localStorage['cookie-consent']` = `'accepted'|'declined'` and, on accept, calls `gtag('consent','update',…)` + `initAnalytics()`. This invariant spans four places — `index.html`, `Layout`'s accept/decline handlers, `firebase.ts`, and the `'cookie-consent'` key — keep them in sync when touching analytics or consent.

## Firestore data model

Documents mirror the interfaces in `src/types/index.ts`:

- **`posts`** — `title`, `content`, `author` (display name), `tags: string[]`, `published: boolean`, `createdAt` (Timestamp). The doc id is the post id.
- **`users`** — `displayName`, `role`.

Security rules (`firestore.rules`): published posts are world-readable; unpublished posts require auth; **all client writes are denied** (`allow write: if false`) because posts are authored out-of-band via the Firebase console / Admin SDK, which bypass rules. `users` docs are readable/writable only by their owner. For an unauthenticated `list` query, Firestore rejects the whole query unless it carries `where('published','==',true)` — keep that filter on every anonymous posts query.

## SEO

- **Per-route metadata**: the base `<head>` tags live statically in `index.html` (representing Home). Each page renders `<Seo title description path />` (`src/components/Seo.tsx`), whose effect updates `document.title`, the description, canonical, and og/twitter title/description/url on navigation — so each route has a unique, accurate title/description (Google renders JS). **When adding a route, render `<Seo>` in it** (use `noindex` for non-indexable pages like the 404).
- **Crawlability**: `public/robots.txt` (allows all + Sitemap line) and `public/sitemap.xml` (lists the routes) ship at the site root — Firebase serves them as static files before the SPA rewrite. The catch-all route (`*` → `NotFound`) renders `noindex` to avoid soft-404s.
- **Structured data**: a `WebSite` + `Person` JSON-LD `@graph` in `index.html` (static, sitewide). Update it if the role, employer, or social profiles change.
- **Limitation**: non-JS social scrapers only see `index.html`'s static (Home) OG tags; per-route social previews would require SSR/prerender, which this static SPA intentionally doesn't do.

## Styling & dark mode

- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin. There is no JS Tailwind config and no PostCSS config — content detection is automatic and theme customization goes in an `@theme` block in CSS. The single stylesheet is `src/index.css`, which `@import "tailwindcss"` and defines `@font-face` (Fixel Text), reusable component classes under `@layer components` (e.g. `layout-root`, `layout-header`, `posts-grid`, `theme-toggle`), and base styles. Prefer Tailwind utilities in JSX; reach for these component classes for repeated layout structures. Note: `animate-in`/`slide-in-from-*` plugin utilities are **not** available (no plugin installed) — use a hand-written `@keyframes` class instead (see `cookie-banner-enter`).
- **Dark mode is class-based, not media-query based.** The custom variant `@custom-variant dark (&:where(.dark, .dark *))` keys off a `.dark` class on `<html>`. State is persisted in `localStorage.theme` and toggled in `Layout`. An inline script in `index.html` applies the class before React mounts to prevent a flash of unstyled content (FOUC) — system preference is deliberately ignored. When touching theming, keep the `index.html` script, the `Layout` toggle, and `localStorage` in sync.

## Conventions

- Strict TypeScript (`tsconfig.app.json`: `strict`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`). Use `import type` for type-only imports.
- Functional components only; styling stays in Tailwind/`index.css` rather than inline styles or new CSS files.
- Static assets that ship as-is (icons, `manifest.json`, `og-image.png`, fonts) live in `public/` and are copied verbatim into `dist/` on build; imported assets live in `src/assets/`. The icon set in `public/` (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`) is generated from `favicon.svg` and wired into `index.html` + `manifest.json` per the icon/PWA checklist in the user's global `~/.claude/CLAUDE.md`.
