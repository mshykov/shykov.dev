# Session handoff — 2026-08-10

Written to hand this project to a fresh assistant session with no prior
context. Durable engineering rules live in the other `docs/` files; this file is
**state + playbooks + open threads**. Delete or rewrite it once the threads
below are closed.

Ready-to-paste starting prompts: [next-session-prompt.md](next-session-prompt.md).

## State snapshot

| | |
|---|---|
| Branch | `master` @ `334966a`, synced with origin, working tree clean |
| Live | `https://shykov.dev` — 200, prerendered per route |
| Open PRs | **7, all Dependabot** (#55, #56, #58, #59, #64, #66, #68) |
| Local branches | `master` + `redesign/micrographics-portfolio` (6-week-old WIP) |
| Published posts | `the-engineer-changelog`, `software-engineer-to-product-engineer` |
| Staged draft | `professional-development-plan-for-engineers` (`published: false`, 4 TODOs) |
| SonarCloud | quality gate green, 0 open issues |
| Monitoring | UptimeRobot keyword monitor on the apex domain only |

## What shipped recently (PRs #37–#67)

Grouped by theme — each was branch → gate → preview-verify → PR → CI → merge →
verify live.

- **Static analysis:** SonarCloud integrated (#37), High findings fixed (#43),
  coverage condition made not-applicable (#44), Dependabot token guard (#53).
- **Security hardening (#38):** `public/_headers` with HSTS, enforced CSP
  (hash-allowlisted inline scripts), `X-Frame-Options: DENY`,
  `Permissions-Policy`; SHA-pinned CI actions; Dependabot enabled; the
  `m-shykov.web.app` bare-root redirect bug fixed.
- **DNS / edge (dashboard work):** DNSSEC active, CAA records, `www` → apex
  301 via a proxied record + redirect rule, `local-review` CNAME switched to
  proxied.
- **Crawler/SEO (#48, #65):** `llms.txt`, richer JSON-LD, `<noscript>`
  fallback — then **build-time prerendering of every route**, which was the
  big one (see below).
- **Content:** product-engineering article drafted (#45), filled with real
  stories (#47), published (#61); PDP article drafted (#62).
- **Hygiene:** `.firebase/` and `.wrangler/` untracked/ignored (#49),
  non-Claude AI artifacts gitignored, docs made self-contained, `CLAUDE.md`
  aligned with the post-Firestore architecture and dead `src/types/` deleted
  (#67).

### The prerendering change is the one to understand first

The site used to serve one SPA shell for every URL. The old assumption —
"Google renders JS, so per-route SEO works" — turned out to be **false in
practice**: five weeks after publishing, an exact-title search returned nothing
and `site:shykov.dev` was empty. `scripts/prerender.mjs` now snapshots every
sitemap route in headless Chrome during `npm run build` and writes real
per-route HTML. Full reasoning is in [seo.md](seo.md) — read it before touching
anything in the build or hosting path.

## Merge mechanics (learned the hard way)

`master` protection is deliberately strict. Consequences worth knowing *before*
you try to merge:

- **Required checks:** `lighthouse` and `sonarcloud`. Other checks (CodeQL,
  CodeRabbit, Cloudflare Pages, SonarCloud Code Analysis) run but are not
  required.
- **"Require branches up to date" is ON** (`strict=true`) and the user wants it
  kept. Every merge knocks other open PRs out of date, so a queue of PRs means
  a rebase between each merge. Merge one, rebase the next, repeat — don't
  batch.
- **"Require conversation resolution" is ON.** An unresolved CodeRabbit review
  thread blocks the merge even with every check green. Symptom:
  `mergeStateStatus: BLOCKED` while all checks pass. Fix the finding (or reply
  and resolve the thread), don't fight the setting — it caught a real
  hydration bug in #65.
- **Auto-merge is disabled repo-wide** — `gh pr merge --auto` errors. Wait for
  checks, then merge.
- Merges are **squash + delete branch**. Squash-merged branches need
  `git branch -D` locally (git can't see them as merged).

## Dependabot playbook

Weekly npm (minor+patch grouped) + github-actions updates. Seven PRs are open
right now; the triage that worked:

1. **Read the build result, not the version bump.** Anything whose
   `lighthouse` check fails is breaking — investigate before assuming.
2. **Majors get scrutiny.** Two are permanently held via `ignore` rules in
   `.github/dependabot.yml`, both for real reasons documented there:
   `lucide-react` (v1 removed brand glyphs → `TS2305`) and `typescript`
   (v7 vs `typescript-eslint` peer range → `npm ci` ERESOLVE). Confirm an
   incompatibility from the CI log before giving up on an update — a stale
   branch or a fixable repo-side issue is more common. Once confirmed, close
   the PR *and* add an ignore rule, or it comes back every week.
3. **On Dependabot PRs the `sonarcloud` job passes without scanning.**
   GitHub withholds repo secrets from Dependabot runs, so `SONAR_TOKEN` is
   empty; the workflow's `if: env.SONAR_TOKEN != ''` guard skips the scan and
   an explicit skip step keeps the required job green (master is re-scanned on
   the post-merge push). So a *failing* `sonarcloud` job on a Dependabot PR
   means something other than the missing token — read the log. Don't remove
   the guard.
4. Merge one, `@dependabot rebase` the next (see strict-mode note above).

## Releasing a post

The draft convention: a post is registered in `src/content/posts.ts` with
`published: false`, which means its frontmatter is validated by `npm test`
while it stays invisible on the site (not on `/blog`, its slug 404s with
`noindex`, absent from the sitemap). To release:

1. Fill any `_[TODO: …]_` blocks in the Markdown.
2. Set `published: true` and a real `publishedAt`.
3. Add the route to `public/sitemap.xml` with `<lastmod>` = `updatedAt ??
   publishedAt` — **this is also what makes it prerender**. Run `npm run og`
   and commit `public/og/<slug>.png`, the post's LinkedIn/X card. Tests fail
   if either is missing.
4. Remove the "Draft" comment above its import in `src/content/posts.ts`
   (a stale comment is a bug in this repo).
5. `npm run build && npm test`, verify in the Pages preview, PR, merge.
6. **Production deploys itself**: merging to `master` triggers
   `.github/workflows/cloudflare-pages-merge.yml`, which builds and deploys to
   Cloudflare Pages (project `shykov-dev`, domain `shykov.dev`). Watch that run,
   then `curl` the live URL to confirm. **`firebase deploy` is not the
   production path** — it only pushes Firestore rules now, by hand; the legacy
   `m-shykov.web.app` hosting site is retired.
7. After deploy: `npm run indexnow -- <post URL> https://shykov.dev/blog`
   (Bing, and through it ChatGPT/Copilot), then Search Console URL Inspection →
   Request indexing for the post. If the link was already shared on LinkedIn,
   refresh the card with LinkedIn's Post Inspector.

## Open threads

**1. PDP article needs four stories (blocked on the author).**
`src/content/posts/professional-development-plan-for-engineers.md` is complete
except for four `_[TODO]_` blocks the author has to supply: a PDP goal
completed per plan, a plan that died as paper (and why), patterns across
reports' PDPs, and optionally a real AI-agent tracking setup. Everything else —
structure, template, junior/middle/senior example tables, the Changelog
interlock, the manager coda, FAQ — is written.

**2. Seven open Dependabot PRs.** Use the playbook above.

**3. Tech debt Phase 1.** See [tech-debt.md](tech-debt.md). Items 1, 3, 5, 2
are one coherent PR: Markdown-parser tests, prerender content assertions,
Lighthouse article URLs, a weekly redirect-check cron.

**4. `redesign/micrographics-portfolio` needs a decision.** 6 weeks stale,
diverging further with each merge. Ship, kill, or restart from master.

**5. Author-side follow-ups (not code).** Request Search Console indexing for
both published articles; add UptimeRobot monitors for the satellite subdomains;
optionally test that the uptime alert actually reaches the inbox (never
verified).

## Notes for whoever picks this up

- **This repo is public.** No secrets, tokens, real IPs, or unblurred internal
  employer metrics in commits or docs. The published articles deliberately keep
  company names but blur exact figures — preserve that when editing them.
- **Verify, don't assume.** Two of this session's biggest findings (the
  unindexed articles, the stale legacy-domain copy) were things the docs
  claimed were fine. `curl` the live site; read the CI log rather than the
  check name.
- The user runs one PR per logical change and expects the full gate
  (`npm run build` + `npm test`) plus a preview verification before every PR.
  Full workflow rules: [developer.md](developer.md).
