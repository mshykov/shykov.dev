/**
 * Cookie-consent state — the single source of truth for the consent key and
 * the gtag Consent Mode update. The consent invariant otherwise spans four
 * places (index.html's inline gtag default, this module, firebase.ts's
 * initAnalytics gate, and Layout's banner); centralizing the key + the
 * localStorage/gtag writes here keeps them from drifting.
 *
 * Note: index.html's pre-bundle inline script can't import this module (it runs
 * before the bundle loads), so it still hardcodes 'cookie-consent' and the
 * Consent Mode default — keep CONSENT_KEY below in sync with it.
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const CONSENT_KEY = 'cookie-consent';

export type ConsentValue = 'accepted' | 'declined';

/** Current stored choice, or null if the visitor hasn't chosen yet. */
export const getConsent = (): ConsentValue | null => {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'accepted' || v === 'declined' ? v : null;
  } catch {
    return null;
  }
};

/** Persist the choice and propagate it to Google Consent Mode. */
export const setConsent = (value: ConsentValue): void => {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // localStorage may be unavailable (e.g. private mode) — gtag update still runs.
  }
  window.gtag?.('consent', 'update', {
    analytics_storage: value === 'accepted' ? 'granted' : 'denied',
  });
};
