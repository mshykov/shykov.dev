# SEO — shykov.dev

This site (Maksym Shykov's personal site/blog) is a client-rendered React + Vite SPA on
Cloudflare Pages; routes are `/`, `/experience`, `/blog`, and static article routes
under `/blog/<slug>`. Canonical domain: `https://shykov.dev`.

## SPA SEO checklist (the pattern this site follows)

- **Per-route metadata.** A single component sets a unique title, description, and
  `rel="canonical"` per route. Non-indexable routes (404) set `noindex`.
- **Crawlability.** Ship static `robots.txt` (with a `Sitemap:` line) and
  `sitemap.xml`; never block CSS/JS. Adding a route → add it to the sitemap in the
  same change.
- **Structured data.** Keep JSON-LD (`WebSite` / `Person`) in the document head; update
  it when role/employer/social profiles change.
- **SPA social-preview caveat.** Google renders JS, but non-JS social unfurlers read
  only the static initial HTML. Without SSR/prerender, per-route OG previews fall back
  to the home page's tags — see the limitation below.
- **Verify post-deploy** with Search Console URL Inspection + the Rich Results Test.

## What's implemented

| Area | Where / status |
|------|----------------|
| Unique per-route titles & descriptions | `src/components/Seo.tsx`, rendered in every page |
| Canonical per route | set by `Seo.tsx`; static base in `index.html` |
| Crawlability | `public/robots.txt` (+ `Sitemap:` line), `public/sitemap.xml`; CSS/JS not blocked |
| Soft-404s | `*` route → `src/pages/NotFound.tsx` renders `noindex` |
| Structured data | `WebSite` + `Person` JSON-LD `@graph` in `index.html`; article routes add `BlogPosting` JSON-LD via `Seo` |
| Descriptive URLs | `/`, `/experience`, `/blog`, `/blog/<slug>` |
| Alt text | avatar + all company logos |
| Descriptive anchor text | yes; no "click here" |
| HTTPS / mobile / fast | Cloudflare Pages + Vite build |

## Conventions to keep

- **Every route must render `<Seo title description path />`** (`src/components/Seo.tsx`)
  so each page gets a unique title/description/canonical. Use the `noindex` prop for
  non-indexable pages (e.g. the 404). Article routes should also pass
  `type="article"` and `BlogPosting` JSON-LD.
- The base `<head>` tags in `index.html` represent the **Home** route; `Seo` overwrites
  them per route at runtime.
- Blog posts live in `src/content/posts/*.md` with frontmatter consumed by
  `src/content/posts.ts`. When adding a post, include a unique `slug`, `title`,
  `description`, `excerpt`, `publishedAt`, `updatedAt`, `tags`, and `published: true`.
- If the role, employer, or social profiles change, update the **JSON-LD** `@graph` in
  `index.html` too.
- When adding a route or post, also add it to `public/sitemap.xml`.

## Known limitation

No SSR/prerender: **non-JS social scrapers only see `index.html`'s static (Home) OG
tags**, so per-route social previews fall back to Home. Google itself renders JS, so
per-route SEO is fully effective. Fixing social previews would require prerendering/SSR.

## Verify after deploy

- `site:shykov.dev` in Google.
- Search Console **URL Inspection** (rendered HTML + indexability) on `/`, `/experience`, `/blog`, and the latest article route.
- [Rich Results Test](https://search.google.com/test/rich-results) on the deployed URL for the JSON-LD.
