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
  /** Absolute URL of the 1200×630 social card; defaults to the site-wide card. */
  image?: string;
  /** Alt text for `image`. */
  imageAlt?: string;
  /** Article dates and tags, emitted as article:* Open Graph tags on posts. */
  article?: { publishedTime: string; modifiedTime: string; tags: string[] };
}

const DEFAULT_IMAGE = `${SITE_URL}/og-image-explore.png`;
const DEFAULT_IMAGE_ALT = 'Maksym Shykov - Explore articles and projects';

const setContent = (selector: string, value: string) => {
  document.head.querySelector(selector)?.setAttribute('content', value);
};

// article:* tags exist only on post pages, so they are created per route and
// removed again on navigation rather than living in index.html.
const setArticleMeta = (article: SeoProps['article']) => {
  document.head.querySelectorAll('meta[data-route-article]').forEach((el) => el.remove());
  if (!article) return;
  const entries: [string, string][] = [
    ['article:published_time', article.publishedTime],
    ['article:modified_time', article.modifiedTime],
    ['article:author', `${SITE_URL}/experience`],
    ...article.tags.map((tag): [string, string] => ['article:tag', tag]),
  ];
  for (const [property, content] of entries) {
    const meta = document.createElement('meta');
    meta.setAttribute('property', property);
    meta.setAttribute('content', content);
    meta.dataset.routeArticle = 'true';
    document.head.appendChild(meta);
  }
};

/**
 * Per-route metadata for the single-page app. The base tags live statically in
 * index.html; this updates their content on navigation so each route has a
 * unique title/description/canonical/social card. scripts/prerender.mjs runs
 * this in headless Chrome and snapshots the whole document, so the per-route
 * values also reach non-JS readers such as LinkedIn's link unfurler.
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
  image = DEFAULT_IMAGE,
  imageAlt = DEFAULT_IMAGE_ALT,
  article,
}: SeoProps) => {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    document.title = title;
    setContent('meta[name="description"]', description);
    setContent('meta[property="og:title"]', title);
    setContent('meta[property="og:description"]', description);
    setContent('meta[property="og:url"]', url);
    setContent('meta[property="og:type"]', type);
    setContent('meta[property="og:image"]', image);
    setContent('meta[property="og:image:alt"]', imageAlt);
    setContent('meta[name="twitter:image"]', image);
    setContent('meta[name="twitter:image:alt"]', imageAlt);
    setArticleMeta(article);
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
  }, [title, description, path, noindex, type, jsonLd, image, imageAlt, article]);

  return null;
};

export default Seo;
