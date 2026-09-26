# Tech Debt — shykov.dev

Register from the audit on **2026-08-10** (master `334966a`). Scoring:
`Priority = (Impact + Risk) × (6 − Effort)`, each 1–5.

The codebase is in good shape overall — most remaining items are
*silent-failure* shaped (things that break without telling you), which is why
they outrank cosmetic cleanups.

## Register

| # | Item | Category | I | R | E | **P** | Status |
|---|------|----------|---|---|---|-------|--------|
| 1 | Markdown renderer has no unit tests | Test | 3 | 3 | 1 | **30** | open |
| 2 | Legacy `m-shykov.web.app` redirects unwatched + hand-deployed | Infra | 2 | 3 | 1 | **25** | retired |
| 3 | Prerender asserts titles but not body content | Test | 3 | 4 | 3 | **21** | open |
| 4 | Double analytics pipeline (gtag + Firebase Analytics) | Architecture | 3 | 2 | 2 | **20** | open |
| 5 | Lighthouse CI audits only the home page | Test | 2 | 2 | 1 | **20** | open |
| 6 | Satellite subdomains not in uptime monitoring | Infra | 2 | 2 | 1 | **20** | open |
| 7 | `redesign/micrographics-portfolio` decision debt | Decision | 2 | 2 | 2 | **16** | open |
| 8 | `lucide-react` pinned to 0.x | Dependency | 2 | 2 | 2 | **16** | held |
| 9 | No RSS/Atom feed | Content | 2 | 1 | 1 | **15** | open |
| 10 | Headless Chrome in the build path | Architecture | 2 | 3 | 4 | 10 | accepted |

## Detail

**1 — Markdown renderer has no unit tests.**
`src/components/MarkdownContent.tsx` is a hand-rolled parser (code fences,
lists, headings, blockquotes, inline `**bold**` / `"quotes"`) that every article
depends on. It was already refactored once (July, to cut cognitive complexity
below Sonar's 15) and verified only by eyeballing the rendered page in a
browser. A regression garbles article bodies with a green build. Fix:
table-driven tests over `parseMarkdownBlocks` covering each block type plus the
figure-shortcode split in `splitPostContent`.

**2 — Legacy redirect surface is unwatched and manual.** *Retired 2026-08-30.*
The debt was real: `m-shykov.web.app` 301s lived in `firebase.json` and shipped
only when someone ran `firebase deploy --only hosting` from a laptop, and the
bare-root case silently served a stale copy of the whole site for weeks before
an audit caught it. Resolved by removing the surface rather than monitoring it —
the Hosting site is down and the `hosting` block is gone from `firebase.json`.
The planned uptime cron is moot; old inbound links now 404 by choice.

**3 — Prerender output is only title-checked.**
`scripts/prerender.mjs` throws if a route renders without a `<title>`, which
catches a hard failure but not a *partial* one (Seo effect ran, article body
never resolved). Fix: after writing snapshots, assert each output file contains
a known substring — e.g. every `/blog/<slug>.html` contains its own title text,
`blog.html` lists each published post title.

**4 — Two analytics pipelines for probably one property.**
`index.html` boots gtag (`G-WS43P0R63F`) and, on consent accept,
`src/lib/analytics.ts` dynamically imports Firebase to call `getAnalytics()` —
which is GA4 underneath. If `VITE_FIREBASE_MEASUREMENT_ID` is the same
property, the site is instrumented twice and pays for a ~42 KB firebase chunk,
seven build-time env vars, and the extra supply-chain surface to do it. Fix:
compare the IDs; if they match, delete the Firebase analytics path and keep
gtag alone (the consent invariant shrinks from five places to three).
**Do not** touch this without re-reading the consent invariant in
[security.md](security.md).

**5 — Lighthouse CI only sees `/index.html`.**
Article routes are now real prerendered documents with their own layout, prose
styles, and JSON-LD; none of it is gated. Fix: add an article URL (and
`/blog`) to `lighthouserc.json`'s `collect.url`. Keep the existing threshold
context in mind — only accessibility is gated hard, and for good reason
(see [developer.md](developer.md)).

**6 — Only the apex domain is monitored.**
The UptimeRobot keyword monitor covers `https://shykov.dev/`. The portfolio
links `cv.`, `moat.`, and `local-review.` from the home page; any of them can
go dark unnoticed. Fix: three more keyword monitors (dashboard work, not repo
work).

**7 — Stale redesign branch.**
`redesign/micrographics-portfolio` (1 commit, 18 files, +1091/−476) has been
open since 2026-06-24. Master has since gained prerendering, two posts, and a
security-header layer, so the rebase cost grows with every merge. This needs a
ship / kill / restart-from-main decision, not engineering.

**8 — `lucide-react` held at 0.x.**
v1 removed the brand glyphs used in `SocialLinks.tsx` (`Github`, `Linkedin`,
`Twitter`), so the monthly dependency sweep keeps it on 0.x. They are not
coming back upstream. The durable fix is inlining three self-hosted SVGs and
then taking the major.

**9 — No feed.**
With a static post registry, generating `feed.xml` at build time (alongside the
prerender step) is straightforward, and it gives readers/aggregators a
subscribe path.

**10 — Chrome in the build path (accepted).**
Snapshot prerendering needs system Chrome. It works locally and on GitHub
runners, and its failure mode is a loud build error, not silent breakage.
Replacing it with true SSG (`react-dom/server`) would remove the dependency at
the cost of SSR-safe refactors and duplicated meta logic. **Accepted as-is** —
revisit only if CI images stop shipping Chrome.

## Also tracked (no action available)

- **TypeScript held at 6.x.** `typescript@7` conflicts with
  `typescript-eslint`'s peer range (checked 2026-08-10: latest is 8.66.0,
  still `<6.1.0`), so `npm ci` fails with ERESOLVE. Ignore rule is in
  `.github/dependabot.yml`; re-check the peer range before unlocking.

## Phased plan

**Phase 1 — the silent-failure batch.** Items 1, 3, 5, 2 fit one PR
(parser tests, prerender content assertions, Lighthouse URLs, redirect-check
cron). Item 6 is ~10 minutes in the UptimeRobot dashboard. Highest
value-per-hour of anything here.

**Phase 2 — consolidation.** Item 4 (verify the double-instrumentation
hypothesis, then remove or document) and item 9 (RSS at build time).

**Phase 3 — decisions, no deadline.** Item 7 (redesign branch) and item 8
(inline SVG icons → unlock lucide).
