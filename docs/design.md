# Design — shykov.dev

> Baseline: `MSH/docs/design.md` (org common rules). Below: shykov.dev-specific rules.

## Tailwind CSS v4

- Tailwind v4 is wired in via the **`@tailwindcss/vite` plugin** — there is **no JS
  Tailwind config** (`tailwind.config.js`) and **no PostCSS config**. Content detection
  is automatic.
- The single stylesheet is **`src/index.css`**, which `@import "tailwindcss"`.
- **Theme customization goes in the `@theme` block in CSS**, not in a JS config.
- Prefer Tailwind utilities in JSX; reach for component classes (below) only for
  repeated layout structures.

## Dark mode

- Dark mode is **class-based, not media-query based**: a `.dark` class on `<html>`,
  keyed by the custom variant `@custom-variant dark (&:where(.dark, .dark *))`.
- State is persisted in **`localStorage.theme`** and toggled in `Layout`.
- An **inline script in `index.html`** applies the class *before React mounts* to
  prevent a flash of unstyled content (FOUC).
- **System preference is deliberately ignored.** When touching theming, keep the
  `index.html` script, the `Layout` toggle, and `localStorage.theme` in sync.

## Animations

- The `animate-in` / `slide-in-from-*` plugin utilities are **NOT available** (no
  animation plugin is installed). Use a hand-written `@keyframes` class instead — see
  `cookie-banner-enter` in `src/index.css` for the pattern.

## Component classes

- Use `@layer components` classes in `src/index.css` for **repeated layout
  structures** (e.g. `layout-root`, `layout-header`, `posts-grid`, `theme-toggle`)
  rather than copying long utility chains across JSX.
