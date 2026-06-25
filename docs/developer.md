# Developer — shykov.dev

> Baseline: `MSH/docs/developer.md` (org common rules). Below: shykov.dev-specific rules.

## TypeScript & components

- **Strict TypeScript.** `tsconfig.app.json` enables `strict`, `noUnusedLocals`,
  `noUnusedParameters`, and `verbatimModuleSyntax`.
- `verbatimModuleSyntax` means type-only imports **must** use `import type`.
- **Functional components only.**

## Build gate

- `npm run build` runs **`tsc -b` then `vite build`** — type errors fail the build even
  though `vite build` alone would not catch them. This is the project's gate.
- **`npm test`** runs a minimal **Vitest** smoke suite over the pure helpers in
  `src/lib/` and the static post registry (consent state, post-date formatting,
  Markdown post parsing). It is intentionally small —
  component/integration tests are out of scope; `npm run build` stays the primary gate.
  Treat a clean `npm run build` + `npm test` as the bar before shipping.

## Commands

```bash
npm run dev        # Vite dev server with HMR
npm run build      # tsc -b (typecheck) then vite build → dist/
npm run lint       # ESLint over the repo
npm run preview    # serve the production build locally
npm test           # Vitest smoke suite over src/lib/ + static post registry
```

Production deploys run via GitHub Actions → Cloudflare Pages (project `shykov-dev`,
domain `shykov.dev`) on merge to master. `firebase deploy` now only maintains the
legacy `m-shykov.web.app` 301 redirects + Firestore rules.

## Blog content pipeline

- Public articles are static Markdown files in `src/content/posts/*.md`.
- `src/content/posts.ts` imports post files with Vite's `?raw` loader and parses
  frontmatter through `src/lib/postContent.ts`.
- `/blog` lists the parsed post index; `/blog/:slug` renders the article and injects
  route-specific SEO plus `BlogPosting` JSON-LD.
- Use `{{figure:<name>}}` shortcodes inside Markdown for curated SVG figures rendered by
  `src/components/PostFigures.tsx`.
- When adding a post, update `public/sitemap.xml` with the new canonical URL.

## Workflow & CI lessons

Durable rules distilled from past sessions (see [retro.md](retro.md) for the story):

- **Branch before the first edit.** Start every change on a feature branch off a
  freshly fetched `origin/master` — don't edit on `master` and move it later.
- **One PR per logical change; verify, then merge.** branch → `npm run build` + `npm test`
  → preview-verify → PR → watch the deploy → confirm live (`curl -sI https://shykov.dev/`).
- **Sync with `git fetch` + `git reset --hard origin/master`** after merges. A bare
  `git pull --ff-only` can report "Already up to date" on a stale ref and hide that
  master advanced.
- **Verify a version/identifier exists before pinning it.** `npm view <pkg> version`
  before pinning a CI action or dep; confirm an export still exists before a major bump
  (e.g. lucide v1 removed brand icons; `@lhci/cli@0.16` never existed).
- **Lighthouse CI runs against `dist/` on `http://localhost`**, where SEO (canonical →
  real domain) and best-practices (`is-on-https`) score artificially low and cold-Chrome
  perf is below the real-host number. Only **accessibility** is gated hard; the rest are
  warnings. Don't tighten those thresholds without accounting for the collection context.
- **For DOM/storage unit tests use happy-dom**, and install an explicit in-memory
  `localStorage` in `src/test-setup.ts` — Node's native gated `localStorage` global
  otherwise shadows the test environment's.
- **Don't fabricate data to satisfy a tool.** Optional structured-data fields like
  `aggregateRating` stay absent until real values exist — fake ratings violate Google's
  policy. A non-critical notice is fine.
