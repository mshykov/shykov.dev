/// <reference types="node" />

import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// IndexNow proves ownership by fetching /<key>.txt and comparing it with the
// key in the request. Losing or corrupting the file makes every submission 403.
describe('IndexNow key file', () => {
  const publicDir = resolve(process.cwd(), 'public');
  const keyFiles = readdirSync(publicDir).filter((name) => /^[0-9a-f]{32}\.txt$/.test(name));

  it('ships exactly one key file', () => {
    expect(keyFiles).toHaveLength(1);
  });

  it('contains its own key', () => {
    const [file] = keyFiles;
    expect(readFileSync(resolve(publicDir, file), 'utf8').trim()).toBe(file.slice(0, 32));
  });
});
