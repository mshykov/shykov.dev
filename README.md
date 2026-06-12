# Maksym Shykov — Personal Website & Blog

A single-page React app for Maksym Shykov's personal site and blog. It is served
as static files from Firebase Hosting and reads published posts from Firestore.
There is no custom backend — the only server-side surface is Firestore (security
rules in [`firestore.rules`](firestore.rules)).

## Stack

- **React 19** + **react-router-dom v7**, built with **Vite 7**
- **TypeScript** (strict)
- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin (single stylesheet, `src/index.css`)
- **Firebase** — Firestore (data), Auth, Analytics; Firebase Hosting (deploy)

## Commands

```bash
npm install        # install dependencies
npm run dev        # Vite dev server with HMR
npm run build      # tsc -b (typecheck) then vite build → dist/
npm run lint       # ESLint over the repo
npm run preview    # serve the production build locally
# Production deploys run via GitHub Actions → Cloudflare Pages (project: shykov-dev)
# on merge to master. Manual deploy: npx wrangler pages deploy dist --project-name=shykov-dev
# firebase deploy now only updates the legacy m-shykov.web.app 301 redirects + Firestore rules.
```

There is no test runner. `npm run build` is the gate — it runs `tsc -b`, so type
errors fail the build even though Vite alone would not catch them.

## Setup

Copy `.env.example` to `.env` and fill in the `VITE_FIREBASE_*` values (find them
in the Firebase console → Project settings). They are injected at build time by
Vite and consumed in [`src/firebase.ts`](src/firebase.ts). Missing vars don't fail
the build — they surface as Firebase runtime errors in the browser (and a console
warning naming the missing keys).

## Architecture

- **Routing** ([`src/App.tsx`](src/App.tsx)): all routes are `lazy()`-loaded under a
  single `Layout` route (`/` → Home, `/experience`, `/blog`), wrapped in `Suspense`.
  `ScrollToTop` resets scroll on navigation. Hosting rewrites all paths to
  `/index.html`, so deep links resolve as client-side routes.
- **Layout** ([`src/components/Layout.tsx`](src/components/Layout.tsx)): header/nav/
  footer around an `<Outlet/>`; owns dark-mode and cookie-consent state.
- **Data flow**: `Blog` → `PostList` → `PostCard`. `PostList` queries Firestore
  directly (`where('published','==',true)`, `limit(10)`). No global state library,
  no data-fetching cache — each component queries Firestore itself. The `Post`/`User`
  shapes live in [`src/types/index.ts`](src/types/index.ts) and mirror the documents.
- **Dark mode** is class-based (`.dark` on `<html>`), persisted in
  `localStorage.theme`. An inline script in `index.html` applies it before React
  mounts to prevent a flash of unstyled content.

For agent-oriented contributor guidance, see [`CLAUDE.md`](CLAUDE.md).
