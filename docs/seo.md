# SEO — shykov.dev

> Baseline: `MSH/docs/seo.md` (org common rules). Below: shykov.dev-specific rules.

This site (Maksym Shykov's personal site/blog) is a client-rendered React + Vite SPA on
Firebase Hosting; routes are `/`, `/experience`, `/blog`. Canonical domain:
`https://m-shykov.web.app`.

## What's implemented

| Area | Where / status |
|------|----------------|
| Unique per-route titles & descriptions | `src/components/Seo.tsx`, rendered in every page |
| Canonical per route | set by `Seo.tsx`; static base in `index.html` |
| Crawlability | `public/robots.txt` (+ `Sitemap:` line), `public/sitemap.xml`; CSS/JS not blocked |
| Soft-404s | `*` route → `src/pages/NotFound.tsx` renders `noindex` |
| Structured data | `WebSite` + `Person` JSON-LD `@graph` in `index.html` |
| Descriptive URLs | `/`, `/experience`, `/blog` |
| Alt text | avatar + all company logos |
| Descriptive anchor text | yes; no "click here" |
| HTTPS / mobile / fast | Firebase Hosting + Vite build |

## Conventions to keep

- **Every route must render `<Seo title description path />`** (`src/components/Seo.tsx`)
  so each page gets a unique title/description/canonical. Use the `noindex` prop for
  non-indexable pages (e.g. the 404).
- The base `<head>` tags in `index.html` represent the **Home** route; `Seo` overwrites
  them per route at runtime.
- If the role, employer, or social profiles change, update the **JSON-LD** `@graph` in
  `index.html` too.
- When adding a route, also add it to `public/sitemap.xml`.

## Known limitation

No SSR/prerender: **non-JS social scrapers only see `index.html`'s static (Home) OG
tags**, so per-route social previews fall back to Home. Google itself renders JS, so
per-route SEO is fully effective. Fixing social previews would require prerendering/SSR.

## Verify after deploy

- `site:m-shykov.web.app` in Google.
- Search Console **URL Inspection** (rendered HTML + indexability) on `/`, `/experience`, `/blog`.
- [Rich Results Test](https://search.google.com/test/rich-results) on the deployed URL for the JSON-LD.
