# Retro — shykov.dev rebuild, migration & hardening (June 2026)

One extended session that took the site from a template-y starting point to a
production-grade personal brand: git cleanup → executive-minimal redesign → brand
assets (favicon/OG) → Firebase Hosting → Cloudflare Pages migration on the
`shykov.dev` domain → SEO/structured-data → accessibility → tech-debt
(dependencies, tests, CI). Shipped as ~15 small PRs, each verified and deployed.

The durable, actionable rules live in [developer.md](developer.md#workflow--ci-lessons);
this file is the narrative.

## What went well — keep doing

- **One PR per logical change, verified then merged.** Every change ran
  branch → build/lint/test → preview-verify → PR → watch the CI deploy →
  confirm live. Nothing shipped unverified, and each deploy was checked against
  production (`curl`), not just CI status.
- **Evidence over assumption.** Before treating the "critical" `npm audit`
  finding as urgent, we grepped the built bundle and confirmed the vulnerable
  gRPC/protobuf code wasn't even shipped to the browser. Contrast fixes used
  measured WCAG ratios, not eyeballing. The email swap was confirmed by grepping
  the deployed JS chunk.
- **Integrity over a green checkmark.** Declined to invent an `aggregateRating`
  to clear a Rich-Results notice (fake ratings violate Google policy), and held
  `lucide-react` at 0.x rather than force a major that removed the brand icons.
- **Honest scoping.** The tech-debt pass explicitly named what *not* to do
  (no component test suite, no abstracting the single Firestore query) so effort
  went to real risk, not busywork.

## What went wrong — learn from

- **Edited directly on `master` a few times before branching**, then had to move
  the changes onto a feature branch. → Branch *first*, before the first edit.
- **Pinned things that didn't exist.** `@lhci/cli@0.16.x` (latest was 0.15) and
  the assumption that lucide v1 kept brand icons — both became CI failures /
  broken builds. → Verify versions and exports before pinning or upgrading.
- **Lighthouse thresholds were wrong for the run context.** Asserting high SEO/perf
  against `dist/` on `http://localhost` false-failed (canonical → real domain,
  `is-on-https`, cold Chrome). → Gate only host-independent metrics hard; understand
  where a check runs before setting its bar.
- **Test-environment friction.** jsdom's `localStorage` was shadowed by Node 26's
  native gated global, costing a couple of cycles. → happy-dom + an explicit
  in-memory storage polyfill in setup.
- **Trusted `git pull --ff-only`**, which reported "Already up to date" on a stale
  fetch and hid that `master` had advanced. → `git fetch` + `git reset --hard
  origin/master` after merges.

## Carry-forward

- Keep the test-gated production deploy and Lighthouse-on-PR gate.
- **Outstanding:** external uptime monitor (Cloudflare Health Checks / UptimeRobot
  on `https://shykov.dev/`) — can't live in the repo.
- The remaining lever is off-platform: brand-consistent profile captions and
  inbound links to `shykov.dev`. In-repo, the site is in strong shape.
