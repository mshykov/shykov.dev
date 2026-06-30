# Security — shykov.dev

## Secrets & credentials

- **Never commit secrets.** No real tokens, API keys, passwords, private keys, or
  connection strings — not in source, config, comments, fixtures, or docs.
- Keep secrets in `.env` / `_do-not-commit/` locally (both gitignored), and in the
  deployment platform's secret store in production — never in git. Only `.env.example`
  is committed.
- No real PII (IPs, hostnames, emails, names) in the repo, even in tests — use neutral
  placeholders (`example.com`, `test@example.com`).
- A missing optional secret should degrade gracefully (feature off), not crash boot.
- Don't log sensitive auth data; validate untrusted input at the boundary; HTTPS
  everywhere.

## Consent-gated analytics

- Google Analytics (`gtag` in `index.html`) starts in **Consent Mode v2** with
  `analytics_storage: 'denied'`.
- `src/lib/analytics.ts` lazy-loads Firebase Analytics only after cookie accept; the
  public layout must not statically import `src/firebase.ts`.
- The consent invariant spans **four places** — keep them in sync when touching
  analytics or consent:
  1. `index.html` (gtag bootstrap + default denied consent)
  2. `Layout`'s accept/decline handlers (consent update + `initAnalytics()`)
  3. `src/lib/analytics.ts` (lazy import boundary)
  4. `src/firebase.ts` (Analytics-only Firebase init)
  5. the `'cookie-consent'` `localStorage` key (`'accepted'` | `'declined'`)

## Public vulnerability contact

- Publish the vulnerability disclosure contact at `public/.well-known/security.txt`.
  This must be a real static file, not the SPA HTML fallback.
- `security.txt` currently points to `security@shykov.dev`. In Cloudflare Email
  Routing, keep a custom route from `security@shykov.dev` to the personal inbox so
  security reports are actually received.
- The `Expires` field is intentionally dated. Refresh it before `2027-06-26`.

## Email anti-spoofing

- `shykov.dev` uses Cloudflare Email Routing MX records. Keep an SPF TXT record on
  the root domain authorizing Cloudflare's mail routing infrastructure:
  `v=spf1 include:_spf.mx.cloudflare.net ~all`.
- Add a DMARC TXT record at `_dmarc.shykov.dev`:
  `v=DMARC1; p=none; rua=mailto:security@shykov.dev; adkim=r; aspf=r`.
- Start with `p=none` so reports can reveal any legitimate senders. If no legitimate
  `@shykov.dev` mail is being sent, or after all senders pass SPF/DKIM alignment,
  tighten later to `p=quarantine`, then `p=reject`.

## Legacy Firestore rules

- The live blog uses static Markdown in `src/content/posts/*.md`; the public app should
  not import Firestore or Auth.
- `firestore.rules` and `firestore.indexes.json` remain only for the legacy Firebase
  project/deploy surface. Keep client writes denied unless Firestore usage is
  intentionally reintroduced.

## Firebase config / secrets

- Firebase Analytics config comes from **`VITE_FIREBASE_*` env vars** (see
  `.env.example`), injected at build time by Vite.
- **Missing vars do not fail the build** — they surface as runtime warnings
  (`console.error` naming missing required keys: `apiKey`, `projectId`, `appId`).
