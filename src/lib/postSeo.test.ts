/// <reference types="node" />

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAllPosts } from '../content/posts';
import type { BlogPost } from './postContent';
import { buildPostJsonLd, extractFaq, postOgImagePath } from './postSeo';

const post = (overrides: Partial<BlogPost> = {}): BlogPost => ({
  title: 'A Title',
  description: 'A description.',
  slug: 'a-title',
  publishedAt: '2026-09-29',
  tags: ['networking', 'remote work'],
  excerpt: 'The short answer.',
  published: true,
  readingMinutes: 3,
  content: '# A Title\n\nBody.',
  ...overrides,
});

type Graph = { '@graph': Record<string, unknown>[] };
const nodeOfType = (jsonLd: Graph, type: string) =>
  jsonLd['@graph'].find((node) => node['@type'] === type);

describe('extractFaq', () => {
  it('reads each ### question and the plain text under it', () => {
    const content = [
      '## Frequently asked questions',
      '',
      '### Should it be mandatory?',
      '',
      'No. Keep a **must-meet** list, see [the guide](/blog/x).',
      '',
      '### How long?',
      '',
      'Twenty to thirty',
      'minutes.',
    ].join('\n');
    expect(extractFaq(content)).toEqual([
      { question: 'Should it be mandatory?', answer: 'No. Keep a must-meet list, see the guide.' },
      { question: 'How long?', answer: 'Twenty to thirty minutes.' },
    ]);
  });

  it('stops at the next ## section', () => {
    const content = '## Frequently asked questions\n\n### Q?\n\nA.\n\n## Later\n\n### Not a question\n\nText.';
    expect(extractFaq(content)).toEqual([{ question: 'Q?', answer: 'A.' }]);
  });

  it('returns nothing for a post without an FAQ', () => {
    expect(extractFaq('## Intro\n\nText.')).toEqual([]);
  });
});

describe('buildPostJsonLd', () => {
  it('ties the BlogPosting to the site-wide Person and WebSite entities', () => {
    const article = nodeOfType(buildPostJsonLd(post()) as Graph, 'BlogPosting');
    expect(article).toMatchObject({
      headline: 'A Title',
      abstract: 'The short answer.',
      image: ['https://shykov.dev/og/a-title.png'],
      datePublished: '2026-09-29',
      dateModified: '2026-09-29',
      keywords: 'networking, remote work',
      author: { '@id': 'https://shykov.dev/#person' },
      publisher: { '@id': 'https://shykov.dev/#person' },
      isPartOf: { '@id': 'https://shykov.dev/#website' },
      url: 'https://shykov.dev/blog/a-title',
    });
  });

  it('uses updatedAt as dateModified when set', () => {
    const article = nodeOfType(buildPostJsonLd(post({ updatedAt: '2026-10-05' })) as Graph, 'BlogPosting');
    expect(article?.dateModified).toBe('2026-10-05');
  });

  it('adds a Home › Writing › post breadcrumb', () => {
    const crumbs = nodeOfType(buildPostJsonLd(post()) as Graph, 'BreadcrumbList');
    expect(crumbs?.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://shykov.dev/' },
      { '@type': 'ListItem', position: 2, name: 'Writing', item: 'https://shykov.dev/blog' },
      { '@type': 'ListItem', position: 3, name: 'A Title', item: 'https://shykov.dev/blog/a-title' },
    ]);
  });

  it('adds FAQPage only when the post has an FAQ', () => {
    expect(nodeOfType(buildPostJsonLd(post()) as Graph, 'FAQPage')).toBeUndefined();
    const withFaq = post({ content: '## Frequently asked questions\n\n### Q?\n\nA.' });
    expect(nodeOfType(buildPostJsonLd(withFaq) as Graph, 'FAQPage')).toBeDefined();
  });
});

describe('social cards', () => {
  // `npm run og` writes these; a published post without one would fall back to
  // a broken image link on LinkedIn and X.
  it('has a generated card for every published post', () => {
    for (const { slug } of getAllPosts()) {
      expect(existsSync(resolve(process.cwd(), `public${postOgImagePath(slug)}`)), slug).toBe(true);
    }
  });
});

describe('sitemap', () => {
  const sitemap = readFileSync(resolve(process.cwd(), 'public/sitemap.xml'), 'utf8');

  // The sitemap is also the prerender route list: a post missing from it ships
  // as an empty SPA shell. lastmod is what tells Bing and Google to recrawl.
  it('lists every published post with lastmod = updatedAt ?? publishedAt', () => {
    for (const { slug, publishedAt, updatedAt } of getAllPosts()) {
      expect(sitemap, slug).toContain(
        `<loc>https://shykov.dev/blog/${slug}</loc><lastmod>${updatedAt ?? publishedAt}</lastmod>`,
      );
    }
  });
});
