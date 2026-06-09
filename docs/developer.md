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
- **There is no test suite configured** (no `docs/testing.md`): the `tsc -b` / build
  step is the only automated gate. Treat a clean `npm run build` as the bar before
  shipping.

## Commands

```bash
npm run dev        # Vite dev server with HMR
npm run build      # tsc -b (typecheck) then vite build → dist/
npm run lint       # ESLint over the repo
npm run preview    # serve the production build locally
firebase deploy    # deploy to Firebase Hosting (project: m-shykov); serves dist/
```
