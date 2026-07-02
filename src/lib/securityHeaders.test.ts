/// <reference types="node" />

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

// Executable inline scripts only — <script> with no attributes. The JSON-LD
// block (type="application/ld+json") never executes, so CSP needs no hash for it.
const inlineScripts = (html: string): string[] =>
  [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);

const cspHash = (script: string) =>
  `'sha256-${createHash('sha256').update(script).digest('base64')}'`;

describe('security headers', () => {
  const headers = readProjectFile('public/_headers');
  const indexHtml = readProjectFile('index.html');

  it('declares the core security headers', () => {
    expect(headers).toContain('Strict-Transport-Security:');
    expect(headers).toContain('X-Frame-Options: DENY');
    expect(headers).toContain('Permissions-Policy:');
    expect(headers).toContain('Content-Security-Policy:');
    expect(headers).toContain("frame-ancestors 'none'");
    expect(headers).toContain("object-src 'none'");
  });

  it('keeps CSP script hashes in sync with the inline scripts in index.html', () => {
    // Vite copies inline scripts into dist/index.html verbatim, so hashes
    // computed from the source file hold in production. If this fails after
    // editing an inline script, paste the printed hash into public/_headers.
    const scripts = inlineScripts(indexHtml);
    expect(scripts.length).toBeGreaterThan(0);

    for (const script of scripts) {
      const hash = cspHash(script);
      expect(headers, `CSP is missing ${hash} for inline script:\n${script.slice(0, 80)}…`).toContain(
        hash,
      );
    }
  });

  it('does not allow unsafe-inline scripts', () => {
    const csp = headers.split('\n').find((line) => line.includes('Content-Security-Policy:')) ?? '';
    const scriptSrc = csp.split(';').find((d) => d.includes('script-src')) ?? '';
    expect(scriptSrc).not.toContain("'unsafe-inline'");
  });
});
