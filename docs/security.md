# Security — shykov.dev

> Baseline: `MSH/docs/security.md` (org common rules). Below: shykov.dev-specific rules.

## Consent-gated analytics

- Google Analytics (`gtag` in `index.html`) starts in **Consent Mode v2** with
  `analytics_storage: 'denied'`.
- Firebase Analytics `initAnalytics()` (`src/firebase.ts`) is **only called on cookie
  accept** — never at import time.
- The consent invariant spans **four places** — keep them in sync when touching
  analytics or consent:
  1. `index.html` (gtag bootstrap + default denied consent)
  2. `Layout`'s accept/decline handlers (consent update + `initAnalytics()`)
  3. `src/firebase.ts` (`initAnalytics()`)
  4. the `'cookie-consent'` `localStorage` key (`'accepted'` | `'declined'`)

## Firestore rules

- Published posts are **world-readable**; unpublished posts **require auth**.
- **All client writes are denied** (`allow write: if false`) — posts are authored
  out-of-band via the Firebase console / Admin SDK, which bypass rules.
- For an unauthenticated `list` query, Firestore **rejects the whole query** unless it
  carries `where('published','==',true)`. Keep that filter on **every** anonymous posts
  query.

## Firebase config / secrets

- Firebase config comes from **`VITE_FIREBASE_*` env vars** (see `.env.example`),
  injected at build time by Vite.
- **Missing vars do not fail the build** — they surface as runtime warnings
  (`console.error` naming missing required keys: `apiKey`, `projectId`, `appId`).
