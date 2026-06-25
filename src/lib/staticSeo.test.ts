/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

const getMetaContent = (html: string, selector: string) => {
  const pattern = new RegExp(`<meta\\s+${selector}\\s+content="([^"]+)"`, 'm');
  return html.match(pattern)?.[1] ?? '';
};

describe('static SEO metadata', () => {
  const indexHtml = readProjectFile('index.html');

  it('keeps home descriptions short enough for social previews', () => {
    const descriptions = [
      getMetaContent(indexHtml, 'name="description"'),
      getMetaContent(indexHtml, 'property="og:description"'),
      getMetaContent(indexHtml, 'name="twitter:description"'),
    ];

    expect(descriptions).toEqual([
      'Engineering leader and hands-on builder. I help teams ship AI products and share practical software leadership notes.',
      'Engineering leader and hands-on builder. I help teams ship AI products and share practical software leadership notes.',
      'Engineering leader and hands-on builder. I help teams ship AI products and share practical software leadership notes.',
    ]);
    descriptions.forEach((description) => expect(description.length).toBeLessThanOrEqual(125));
  });

  it('keeps the OG image source conversion-oriented', () => {
    const ogImageSource = readProjectFile('public/og-image.svg');

    expect(ogImageSource).toContain('Explore articles and projects');
    expect(ogImageSource).toContain('shykov.dev');
  });
});
