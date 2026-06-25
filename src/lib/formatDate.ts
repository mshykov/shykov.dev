/**
 * Normalizes a post date — which may be a Firestore Timestamp (has a
 * `toDate()` method), a date string/number, or null — into a display string and
 * an ISO string for <time datetime>. Returns iso=null when the value is missing
 * or unparseable, so callers can render plain text without a <time> element.
 *
 * The Date constructor never throws on bad input (it yields an Invalid Date),
 * so unparseable values are detected via isNaN(getTime()), not try/catch.
 */
export interface FormattedDate {
  display: string;
  iso: string | null;
}

const hasToDate = (v: unknown): v is { toDate: () => Date } =>
  typeof v === 'object' &&
  v !== null &&
  'toDate' in v &&
  typeof (v as { toDate?: unknown }).toDate === 'function';

export const formatPostDate = (
  createdAt: { toDate?: () => Date } | string | number | null | undefined,
  formatOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' },
): FormattedDate => {
  let parsed: Date | null = null;

  if (hasToDate(createdAt)) {
    parsed = createdAt.toDate();
  } else if (createdAt !== null && createdAt !== undefined) {
    const d = new Date(createdAt as string | number);
    if (!Number.isNaN(d.getTime())) parsed = d;
  }

  if (!parsed || Number.isNaN(parsed.getTime())) {
    return { display: 'Unknown date', iso: null };
  }

  return {
    display: parsed.toLocaleDateString('en-US', formatOptions),
    iso: parsed.toISOString(),
  };
};
