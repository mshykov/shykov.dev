# SEO — shykov.dev

This site (Maksym Shykov's personal site/blog) is a React + Vite SPA, **prerendered to
static HTML per route at build time**, on Cloudflare Pages; routes are `/`,
`/experience`, `/blog`, and static article routes under `/blog/<slug>`. Canonical
domain: `https://shykov.dev`.

## SPA SEO checklist (the pattern this site follows)

- **Per-route metadata.** A single component sets a unique title, description, and
  `rel="canonical"` per route. Non-indexable routes (404) set `noindex`.
- **Prerendered HTML.** `scripts/prerender.mjs` (runs inside `npm run build`) snapshots
  every sitemap route in headless Chrome and writes real per-route HTML into `dist/` —
  content and per-route meta exist without JS. React hydrates on top (`src/main.tsx`).
- **Crawlability.** Ship static `robots.txt` (with a `Sitemap:` line) and
  `sitemap.xml`; never block CSS/JS. Adding a route → add it to the sitemap in the
  same change — **the sitemap is also the prerender route list.**
- **Structured data.** Keep JSON-LD (`WebSite` / `Person`) in the document head; update
  it when role/employer/social profiles change.
- **Verify post-deploy** with Search Console URL Inspection + the Rich Results Test.

## What's implemented

| Area | Where / status |
|------|----------------|
| Unique per-route titles & descriptions | `src/components/Seo.tsx`, rendered in every page |
| Canonical per route | set by `Seo.tsx`; static base in `index.html` |
| Crawlability | `public/robots.txt` (+ `Sitemap:` line), `public/sitemap.xml`; CSS/JS not blocked |
| Soft-404s | Unknown URL answers a real HTTP 404: `scripts/prerender.mjs` writes the top-level `dist/404.html`. The removed `/* /index.html 200` catch-all in `public/_redirects` rewrote every path to the home page with status 200. The `*` route → `src/pages/NotFound.tsx` stays as the client-side `noindex` view. A new page must be in `public/sitemap.xml` or it 404s in production |
| Structured data | `WebSite` + `Person` JSON-LD `@graph` in `index.html`; article routes add `BlogPosting` (tied to `#person`), `BreadcrumbList` and `FAQPage` from `src/lib/postSeo.ts`, plus `article:*` meta and a per-post card `public/og/<slug>.png` (`npm run og`) |
| Descriptive URLs | `/`, `/experience`, `/blog`, `/blog/<slug>` |
| Alt text | avatar + all company logos |
| Descriptive anchor text | yes; no "click here" |
| HTTPS / mobile / fast | Cloudflare Pages + Vite build |
| Prerendered per-route HTML | `scripts/prerender.mjs` in `npm run build`; routes from `public/sitemap.xml` |

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

## History note (why prerendering exists)

The site originally shipped as a pure SPA shell on the theory that "Google renders JS,
so per-route SEO is fully effective." **Empirically false for a new low-authority
domain**: after 5 weeks live, an exact-title search for a published article returned
nothing — the render queue never got to us, and non-JS consumers (AI crawlers, Bing,
archival fetches) saw an empty page. Snapshot prerendering (July 2026) fixed both
search indexing and per-route social previews. Don't regress to shell-only serving.

## Verify after deploy

- `site:shykov.dev` in Google.
- Search Console **URL Inspection** (rendered HTML + indexability) on `/`, `/experience`, `/blog`, and the latest article route.
- [Rich Results Test](https://search.google.com/test/rich-results) on the deployed URL for the JSON-LD.

## IndexNow (Bing, and through it ChatGPT search)

`public/<32-hex>.txt` is the IndexNow ownership key — public by design; the
engine fetches it and compares it with the key in the request.
`src/lib/indexnow.test.ts` fails if it goes missing or gets corrupted.

```bash
npm run indexnow -- --dry-run            # print the payload, send nothing
npm run indexnow                         # every URL in the LIVE sitemap
npm run indexnow -- https://shykov.dev/blog/<slug>   # just these
```

Run it **after** the deploy is live; the script refuses to send until the key
file is actually served. Submitting is an external write — it needs the
owner's go-ahead, and it is deliberately not wired into CI. Use it when a
post is published or materially updated.

## Visibility baseline — 2026-09-27

Measured by hand (Search Console, Bing Webmaster Tools, and the queries below
in Google, ChatGPT logged-out temporary chat, and Perplexity incognito). Re-run
the same queries to compare; add a new dated section rather than editing this
one.

**Search Console** (domain property — includes `cv.`, `moat.`, `local-review.`)

- Indexed: `/`, `/blog`, both articles, plus `moat.shykov.dev/` (+ one subpage)
  and `local-review.shykov.dev/`.
- **`/experience`: Discovered – currently not indexed** (never crawled).
- Last 3 months: 2 clicks, 48 impressions, avg. position 35.8. Generative AI
  features report: 1 impression (`/`).

**Bing Webmaster Tools**

- Sitemap submitted 2026-09-01, last read 2026-09-01, 5 URLs discovered.
- **Indexed: `/` only** (last crawl 2026-09-11). AI Performance: 0 citations.

**Queries**

| Query | Google | ChatGPT | Perplexity |
|---|---|---|---|
| `Maksym Shykov` | LinkedIn #1, **shykov.dev #2**, `/blog` #6 | answers from LinkedIn only | **cites shykov.dev** + LinkedIn |
| `shykov.dev` | all five routes + subdomains | **"couldn't find an indexed site at shykov.dev"** | **cites shykov.dev** |
| `weekly changelog template for engineers` | **#1** (logged-in search — may be personalised); not in AI Overview | not cited (gitmore.io) | not cited (gitmore.io) |
| `engineer brag document performance review changelog` | not in top 10 (pragmaticengineer, jvns.ca, bragbook.io) | not cited | — |
| `software engineer to product engineer` | not in top 10 | not cited | — |
| `how to become a product engineer` | not in top 10 (refactoring.fm, posthog, product.engineer) | not cited | — |

**Reading:** Google and Perplexity know the site; ChatGPT does not, because
its search runs on Bing's index and Bing holds only the homepage. IndexNow plus
URL submission in Bing Webmaster Tools is the direct fix; the article queries
need external links and mentions more than on-page work.
