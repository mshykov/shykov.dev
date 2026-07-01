# Developer — shykov.dev

## Operating rules (how to make changes)

- **Surgical changes only.** Touch only what the task requires — no drive-by
  formatting or "while I'm here" refactors. Spotted something worth fixing? Surface it
  separately rather than folding it in.
- **Read before you write.** Before changing a shared helper, contract, or
  user-visible string, grep all callers in the same pass — sibling code, doc comments,
  README, tests. Cross-file drift is the most common review finding.
- **Keep comments & doc strings current**; comment the **why**, not the **what**. A
  comment describing behavior you just changed is a bug — fix it in the same edit.
- **Fail loud, fail closed.** Refuse invalid input rather than silently passing it
  through; check error/exit codes explicitly.
- **Match the codebase's conventions** even where you'd choose differently;
  conformance beats taste.
- **Definition of done:** builds clean, no secrets committed, docs updated when
  behavior changes. If you skipped a check or made an assumption, say so.

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

## Static analysis (SonarCloud)

- `.github/workflows/sonarcloud.yml` runs `SonarSource/sonarqube-scan-action` on push
  to master and on every PR, using `sonar-project.properties` (org `mshykov`, project
  key `mshykov_shykov.dev`). It requires the `SONAR_TOKEN` repo secret.
- This is static analysis only (bugs, code smells, duplication) — no coverage is wired
  in, since `npm test` is an intentionally minimal smoke suite, not a coverage-driving
  suite.
- `sonar.tests`/`sonar.test.inclusions` route `*.test.ts` files to Sonar's test rule
  profile so they aren't flagged under main-code rules.

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
