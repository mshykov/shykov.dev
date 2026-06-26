/// <reference types="node" />

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readProjectFile = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');
const collectSourceFiles = (dir: string): string[] =>
  readdirSync(resolve(process.cwd(), dir)).flatMap((entry) => {
    const path = `${dir}/${entry}`;
    const stat = statSync(resolve(process.cwd(), path));
    if (stat.isDirectory()) return collectSourceFiles(path);
    return /\.(ts|tsx)$/.test(entry) ? [path] : [];
  });

describe('public route performance boundaries', () => {
  it('keeps Firebase out of the eagerly loaded layout path', () => {
    const layoutSource = readProjectFile('src/components/Layout.tsx');

    expect(layoutSource).not.toContain("../firebase");
    expect(layoutSource).not.toContain('"../firebase"');
  });

  it('does not keep static Firebase imports in route or component files', () => {
    const staticFirebaseImports = collectSourceFiles('src')
      .filter((path) => path !== 'src/firebase.ts')
      .filter((path) => /from ['"][^'"]*firebase['"]/.test(readProjectFile(path)));

    expect(staticFirebaseImports).toEqual([]);
  });

  it('keeps the Firebase module scoped to analytics only', () => {
    const firebaseSource = readProjectFile('src/firebase.ts');

    expect(firebaseSource).not.toContain('firebase/auth');
    expect(firebaseSource).not.toContain('firebase/firestore');
    expect(firebaseSource).not.toContain('getAuth');
    expect(firebaseSource).not.toContain('getFirestore');
  });
});
