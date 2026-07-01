# Maksym Shykov — Personal Website & Blog

A single-page React app for Maksym Shykov's personal site and blog. It is served
as static files from Cloudflare Pages. Public articles are Markdown files committed
with the app; Firebase is retained only for consent-gated Analytics and legacy
redirect/rules deploy artifacts.

## Stack

- **React 19** + **react-router-dom v7**, built with **Vite 8**
- **TypeScript** (strict)
- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin (single stylesheet, `src/index.css`)
- **Cloudflare Pages** — static hosting/deploy for the Vite build
- **Firebase** — consent-gated Analytics, plus legacy Hosting redirects and Firestore rules/config

## Commands

```bash
npm install        # install dependencies
npm run dev        # Vite dev server with HMR
npm run build      # tsc -b (typecheck) then vite build → dist/
npm run lint       # ESLint over the repo
npm run preview    # serve the production build locally
npm test           # Vitest smoke suite over src/lib/ + static post registry
# Production deploys run via GitHub Actions → Cloudflare Pages (project: shykov-dev)
# on merge to master. Manual deploy: npx wrangler pages deploy dist --project-name=shykov-dev
# firebase deploy now only updates the legacy m-shykov.web.app 301 redirects + Firestore rules.
```

`npm run build` is the primary gate — it runs `tsc -b`, so type errors fail the
build even though Vite alone would not catch them. `npm test` runs a small Vitest
suite over the pure helpers in `src/lib/` and the static post registry.

## Setup

Copy `.env.example` to `.env` and fill in the `VITE_FIREBASE_*` values needed for
Analytics (find them in the Firebase console → Project settings). They are injected
at build time by Vite and consumed only after analytics consent. Missing required
vars don't fail the build — they surface as a browser console warning naming the keys.

## Project layout

```
src/
  components/    Reusable UI (Layout, SocialLinks, Seo, ScrollToTop, article figures)
  content/       Static Markdown posts + post registry
  pages/         Route views (Home, Experience, Blog, PostArticle, NotFound)
  lib/           Pure helpers + lazy analytics boundary + tests
  types/         Shared TypeScript interfaces (Post, User)
  firebase.ts    Analytics-only Firebase init, dynamically imported after consent
  index.css      Single stylesheet: @theme tokens, @font-face, component classes
  App.tsx        Router; main.tsx mounts it; test-setup.ts bootstraps Vitest
public/          Static assets copied verbatim (icons, fonts, logos, manifest,
                 robots.txt, sitemap.xml, _redirects)
docs/            Self-contained topic docs (seo, design, developer, security, retro)
.github/workflows/  cloudflare-pages-merge (deploy), lighthouse-ci (PR gate),
                    sonarcloud (static analysis, push + PR)
```

## Architecture

- **Routing** ([`src/App.tsx`](src/App.tsx)): all routes are `lazy()`-loaded under a
  single `Layout` route (`/` → Home, `/experience`, `/blog`), wrapped in `Suspense`.
  `ScrollToTop` resets scroll on navigation. Hosting rewrites all paths to
  `/index.html`, so deep links resolve as client-side routes.
- **Layout** ([`src/components/Layout.tsx`](src/components/Layout.tsx)): header/nav/
  footer around an `<Outlet/>`; owns dark-mode and cookie-consent state.
- **Blog content**: `src/content/posts/*.md` → `src/content/posts.ts` →
  `/blog` and `/blog/:slug`. Markdown is parsed at build time from frontmatter and
  rendered by the static article route with per-post SEO.
- **Dark mode** is class-based (`.dark` on `<html>`), persisted in
  `localStorage.theme`. An inline script in `index.html` applies it before React
  mounts to prevent a flash of unstyled content.

For agent-oriented contributor guidance, see [`CLAUDE.md`](CLAUDE.md).
