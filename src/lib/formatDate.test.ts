import { describe, it, expect } from 'vitest';
import { formatPostDate } from './formatDate';

describe('formatPostDate', () => {
  it('formats a Firestore-style Timestamp (toDate)', () => {
    const ts = { toDate: () => new Date('2026-01-15T00:00:00Z') };
    const { display, iso } = formatPostDate(ts);
    expect(display).toBe('Jan 15, 2026');
    expect(iso).toBe('2026-01-15T00:00:00.000Z');
  });

  it('formats an ISO date string', () => {
    const { display, iso } = formatPostDate('2026-06-22T12:00:00Z');
    expect(display).toBe('Jun 22, 2026');
    expect(iso).toBe('2026-06-22T12:00:00.000Z');
  });

  it('supports custom display formatting', () => {
    const { display, iso } = formatPostDate('2026-06-22T12:00:00Z', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    expect(display).toBe('June 22, 2026');
    expect(iso).toBe('2026-06-22T12:00:00.000Z');
  });

  it('formats an epoch-millis number', () => {
    const { iso } = formatPostDate(Date.UTC(2026, 0, 1));
    expect(iso).toBe('2026-01-01T00:00:00.000Z');
  });

  it.each([null, undefined, '', 'not-a-date'])(
    'returns Unknown date / null iso for unparseable input (%s)',
    (input) => {
      const { display, iso } = formatPostDate(input as never);
      expect(display).toBe('Unknown date');
      expect(iso).toBeNull();
    },
  );
});
