import { useEffect } from 'react';

export const SITE_URL = 'https://shykov.dev';

interface SeoProps {
  /** Unique, accurate page title (rendered as <title> and og/twitter title). */
  title: string;
  /** 1–2 sentence summary unique to this page. */
  description: string;
  /** Route path beginning with '/', used for canonical + og:url. */
  path: string;
  /** When true, emit <meta name="robots" content="noindex,follow"> (e.g. the 404 page). */
  noindex?: boolean;
  /** Open Graph type. Article pages should use "article"; default is "website". */
  type?: 'website' | 'article';
  /** Optional JSON-LD object rendered into the route-level structured data script. */
  jsonLd?: Record<string, unknown>;
}

const setContent = (selector: string, value: string) => {
  document.head.querySelector(selector)?.setAttribute('content', value);
};

/**
 * Per-route metadata for the single-page app. The base tags live statically in
 * index.html; this updates their content on navigation so each route has a
 * unique title/description/canonical (Google renders JS and reads the result).
 *
 * Note: non-JS scrapers (some social link unfurlers) only see index.html's
 * static tags, i.e. the Home values. Per-route social previews would require
 * prerendering/SSR — out of scope for this static SPA.
 */
const ensureJsonLdScript = () => {
  const existing = document.head.querySelector<HTMLScriptElement>('script[data-route-json-ld]');
  if (existing) return existing;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.routeJsonLd = 'true';
  document.head.appendChild(script);
  return script;
};

const Seo = ({
  title,
  description,
  path,
  noindex = false,
  type = 'website',
  jsonLd,
}: SeoProps) => {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    document.title = title;
    setContent('meta[name="description"]', description);
    setContent('meta[property="og:title"]', title);
    setContent('meta[property="og:description"]', description);
    setContent('meta[property="og:url"]', url);
    setContent('meta[property="og:type"]', type);
    setContent('meta[name="twitter:title"]', title);
    setContent('meta[name="twitter:description"]', description);
    setContent('meta[name="robots"]', noindex ? 'noindex, follow' : 'index, follow');
    document.head.querySelector('link[rel="canonical"]')?.setAttribute('href', url);

    const routeJsonLd = document.head.querySelector<HTMLScriptElement>('script[data-route-json-ld]');
    if (jsonLd) {
      ensureJsonLdScript().textContent = JSON.stringify(jsonLd);
    } else if (routeJsonLd) {
      routeJsonLd.remove();
    }
  }, [title, description, path, noindex, type, jsonLd]);

  return null;
};

export default Seo;
