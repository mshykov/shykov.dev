import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CONSENT_KEY, getConsent, setConsent } from './consent';

describe('consent', () => {
  beforeEach(() => {
    localStorage.clear();
    window.gtag = vi.fn();
  });

  it('returns null when no choice is stored', () => {
    expect(getConsent()).toBeNull();
  });

  it('reads a stored "accepted" / "declined" value', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    expect(getConsent()).toBe('accepted');
    localStorage.setItem(CONSENT_KEY, 'declined');
    expect(getConsent()).toBe('declined');
  });

  it('treats an unrecognized stored value as null', () => {
    localStorage.setItem(CONSENT_KEY, 'maybe');
    expect(getConsent()).toBeNull();
  });

  it('setConsent persists and grants analytics on accept', () => {
    setConsent('accepted');
    expect(localStorage.getItem(CONSENT_KEY)).toBe('accepted');
    expect(window.gtag).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: 'granted',
    });
  });

  it('setConsent persists and denies analytics on decline', () => {
    setConsent('declined');
    expect(localStorage.getItem(CONSENT_KEY)).toBe('declined');
    expect(window.gtag).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: 'denied',
    });
  });
});
