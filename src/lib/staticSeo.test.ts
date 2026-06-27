/// <reference types="node" />

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');
const projectFileExists = (path: string) => existsSync(resolve(process.cwd(), path));

const getMetaContent = (html: string, selector: string) => {
  const pattern = new RegExp(`<meta\\s+${selector}\\s+content="([^"]+)"`, 'm');
  return html.match(pattern)?.[1] ?? '';
};

describe('static SEO metadata', () => {
  const indexHtml = readProjectFile('index.html');
  const socialImageUrl = 'https://shykov.dev/og-image-explore.png';

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
    const ogImageSource = readProjectFile('public/og-image-explore.svg');

    expect(projectFileExists('public/og-image-explore.png')).toBe(true);
    expect(ogImageSource).toContain('Explore articles and projects');
    expect(ogImageSource).toContain('shykov.dev');
    expect(getMetaContent(indexHtml, 'property="og:image"')).toBe(socialImageUrl);
    expect(getMetaContent(indexHtml, 'name="twitter:image"')).toBe(socialImageUrl);
    expect(getMetaContent(indexHtml, 'property="og:image:alt"')).toBe(
      'Maksym Shykov - Explore articles and projects',
    );
    expect(getMetaContent(indexHtml, 'name="twitter:image:alt"')).toBe(
      'Maksym Shykov - Explore articles and projects',
    );
    expect(indexHtml).toContain(`"image": "${socialImageUrl}"`);
  });

  it('links the homepage to the Engineer Changelog article with descriptive text', () => {
    const homeSource = readProjectFile('src/pages/Home.tsx');

    expect(homeSource).toContain('to="/blog/the-engineer-changelog"');
    expect(homeSource).toContain('weekly changelog template for engineers');
  });

  it('links the homepage to all public projects', () => {
    const homeSource = readProjectFile('src/pages/Home.tsx');
    const projectUrls = [
      'https://cv.shykov.dev/',
      'https://moat.shykov.dev/',
      'https://local-review.shykov.dev/',
      'https://alotno.app/',
      'https://www.coffeeslack.com/',
    ];

    expect(homeSource).toContain('Projects');
    projectUrls.forEach((url) => expect(homeSource).toContain(`url: '${url}'`));
  });

  it('publishes a real security.txt file for vulnerability reporting', () => {
    const securityTxt = readProjectFile('public/.well-known/security.txt');

    expect(securityTxt).toContain('Contact: mailto:security@shykov.dev');
    expect(securityTxt).toContain('Expires: 2027-06-26T00:00:00Z');
    expect(securityTxt).toContain('Canonical: https://shykov.dev/.well-known/security.txt');
    expect(securityTxt).not.toContain('<!doctype html>');
  });
});
