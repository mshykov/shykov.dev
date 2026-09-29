/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('article SEO surface', () => {
  const postArticleSource = readProjectFile('src/pages/PostArticle.tsx');

  // What the structured data contains is tested in src/lib/postSeo.test.ts;
  // this only guards that the page actually hands it to <Seo>.
  it('passes the post JSON-LD, social card and article dates to <Seo>', () => {
    expect(postArticleSource).toContain('jsonLd={buildPostJsonLd(post)}');
    expect(postArticleSource).toContain('postOgImagePath(post.slug)');
    expect(postArticleSource).toContain('publishedTime: post.publishedAt');
  });

  it('renders an author byline on article pages', () => {
    expect(postArticleSource).toContain("By{' '}");
    expect(postArticleSource).toContain('Maksym Shykov');
    expect(postArticleSource).toContain('Engineering Manager');
    expect(postArticleSource).toContain('to="/experience"');
  });
});
