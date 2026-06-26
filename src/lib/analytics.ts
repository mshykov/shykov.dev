import { getConsent } from './consent';

let analyticsPromise: Promise<unknown> | null = null;

export const initAnalytics = async (): Promise<unknown> => {
  if (typeof window === 'undefined' || getConsent() !== 'accepted') return null;

  analyticsPromise ??= import('../firebase').then(({ initAnalytics: initFirebaseAnalytics }) =>
    initFirebaseAnalytics(),
  );

  return analyticsPromise;
};
