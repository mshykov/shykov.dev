/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('article SEO surface', () => {
  const postArticleSource = readProjectFile('src/pages/PostArticle.tsx');

  it('emits richer BlogPosting structured data for article discovery', () => {
    expect(postArticleSource).toContain('image:');
    expect(postArticleSource).toContain('author:');
    expect(postArticleSource).toContain('publisher:');
    expect(postArticleSource).toContain('Maksym Shykov');
    expect(postArticleSource).toContain('og-image-explore.png');
  });

  it('renders an author byline on article pages', () => {
    expect(postArticleSource).toContain("By{' '}");
    expect(postArticleSource).toContain('Maksym Shykov');
    expect(postArticleSource).toContain('Engineering Lead');
    expect(postArticleSource).toContain('to="/experience"');
  });
});
