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
  `src/lib/` (consent state, post-date formatting). It is intentionally small —
  component/integration tests are out of scope; `npm run build` stays the primary gate.
  Treat a clean `npm run build` + `npm test` as the bar before shipping.

## Commands

```bash
npm run dev        # Vite dev server with HMR
npm run build      # tsc -b (typecheck) then vite build → dist/
npm run lint       # ESLint over the repo
npm run preview    # serve the production build locally
npm test           # Vitest smoke suite over src/lib/
```

Production deploys run via GitHub Actions → Cloudflare Pages (project `shykov-dev`,
domain `shykov.dev`) on merge to master. `firebase deploy` now only maintains the
legacy `m-shykov.web.app` 301 redirects + Firestore rules.
