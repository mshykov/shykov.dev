#!/usr/bin/env node
/**
 * Snapshot prerender — runs after `vite build`.
 *
 * Serves dist/ locally, renders every route listed in public/sitemap.xml in
 * headless Chrome (puppeteer-core, system Chrome — preinstalled locally and on
 * GitHub runners), and writes the rendered DOM back into dist/ as per-route
 * static HTML (blog/index.html, blog/<slug>/index.html, …).
 *
 * Why: the SPA shell alone ships zero content to non-JS consumers (search
 * render queues, AI crawlers, archival fetches). All content is build-time
 * static Markdown, so real HTML per route is free. React hydrates on top
 * (see src/main.tsx) and the site keeps SPA navigation afterwards.
 *
 * Invariants:
 * - Routes come from public/sitemap.xml — the existing "add a route → add it
 *   to the sitemap" convention now also controls prerendering. A route that is
 *   not in the sitemap has no prerendered file and answers 404 in production
 *   (public/_redirects has no SPA fallback), plus the extra /404 snapshot.
 * - Cookie consent is pre-seeded as 'declined' ONLY inside the snapshot
 *   browser so the banner never enters the captured DOM (it client-renders
 *   after a timer for real visitors — keeping snapshots equal to the initial
 *   client render avoids hydration mismatches). localStorage is not
 *   serialized into the HTML.
 * - Inline <script> text is preserved byte-for-byte by outerHTML
 *   serialization, so the CSP hashes in public/_headers stay valid.
 * - No snapshot may reference the snapshot server's own origin. Vite resolves
 *   lazily-injected modulepreload hints against it, so they are rewritten to
 *   root-relative paths and the run fails loudly if any slip through.
 * - Adjacent text nodes are re-separated with comment nodes before
 *   serialization. Snapshotting a live DOM loses the boundaries React needs to
 *   hydrate `{a}{b}` text; without them every such pair is a hydration
 *   mismatch. The app must also keep <Suspense> out of the tree — its
 *   boundaries are marked by SSR-only comments a DOM snapshot cannot carry.
 * - External requests are blocked during snapshotting (hermetic + fast); GA
 *   still loads normally for real visitors.
 */
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, extname, resolve } from 'node:path';
import puppeteer from 'puppeteer-core';

const DIST = resolve(process.cwd(), 'dist');
const PORT = 45173;
const ORIGIN = `http://localhost:${PORT}`;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.woff2': 'font/woff2',
};

const routesFromSitemap = async () => {
  const xml = await readFile('public/sitemap.xml', 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  if (locs.length === 0) throw new Error('prerender: no <loc> entries found in public/sitemap.xml');
  return locs;
};

// Minimal static server over dist/ with SPA fallback — mirrors production.
const serveDist = () =>
  new Promise((resolveServer) => {
    const server = createServer(async (req, res) => {
      const path = new URL(req.url, ORIGIN).pathname;
      let file = join(DIST, path);
      if (!extname(path)) file = join(DIST, 'index.html'); // SPA fallback
      try {
        const body = await readFile(file);
        res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
        res.end(body);
      } catch {
        res.writeHead(404).end('not found');
      }
    });
    server.listen(PORT, () => resolveServer(server));
  });

// `<route>.html` (not `<route>/index.html`): Cloudflare Pages serves
// `/blog` from `blog.html` at the exact URL, while a directory index would
// 308-redirect `/blog` → `/blog/`, contradicting the canonicals + sitemap
// (both slash-less).
const outputPathFor = (route) =>
  route === '/' ? join(DIST, 'index.html') : join(DIST, `${route.replace(/^\//, '')}.html`);

const main = async () => {
  if (!existsSync(join(DIST, 'index.html'))) {
    throw new Error('prerender: dist/index.html missing — run vite build first');
  }
  // '/404' is not in the sitemap but is snapshotted too: dist/404.html is what
  // Cloudflare Pages serves — with a real 404 status — for any path that has no
  // file. Without it, Pages falls back to SPA mode and answers 200 to every URL
  // (a soft 404 that Google reports under "Page indexing").
  const routes = [...(await routesFromSitemap()), '/404'];
  const server = await serveDist();
  const browser = await puppeteer.launch({ channel: 'chrome', headless: true });

  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const host = new URL(req.url()).hostname;
      if (host === 'localhost' || host === '127.0.0.1') req.continue();
      else req.abort(); // hermetic: no GA/external calls during snapshotting
    });
    await page.evaluateOnNewDocument(() => {
      // Keep the cookie banner out of the captured DOM (see header comment).
      window.localStorage.setItem('cookie-consent', 'declined');
    });

    const snapshots = new Map();
    for (const route of routes) {
      await page.goto(`${ORIGIN}${route}`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('#root > *', { timeout: 15000 });
      const html = await page.evaluate(
        (r, origin) => {
          // Vite's lazy-chunk loader injects <link rel="modulepreload"> whose
          // href it resolves against the *current* origin — here the snapshot
          // server. Serialized as-is they ship to production pointing at
          // http://localhost:<port>: dead resource hints that CSP then blocks
          // on every page load. Put them back on a root-relative path.
          for (const el of document.querySelectorAll('link[href], script[src]')) {
            const attr = el.hasAttribute('href') ? 'href' : 'src';
            const value = el.getAttribute(attr);
            if (value.startsWith(origin)) el.setAttribute(attr, value.slice(origin.length));
          }
          // React renders `{a}{b}` as two adjacent text nodes and, when it
          // server-renders, separates them with a comment so hydration can tell
          // where one ends. Serializing a live DOM concatenates them instead,
          // so `{mins}{' min read'}` reaches the client as one "12 min read"
          // node and hydration reports a text mismatch. Re-insert the
          // separators the serializer is about to erase.
          const root = document.getElementById('root');
          const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
          const needsSeparator = [];
          for (let n = walker.nextNode(); n; n = walker.nextNode()) {
            if (n.previousSibling && n.previousSibling.nodeType === Node.TEXT_NODE) {
              needsSeparator.push(n);
            }
          }
          for (const node of needsSeparator) {
            node.parentNode.insertBefore(document.createComment(''), node);
          }
          // Stamp the snapshot with its route: dist/index.html doubles as the
          // SPA fallback for unknown paths, so main.tsx must only hydrate when
          // the served snapshot actually matches location.pathname.
          document.getElementById('root').setAttribute('data-prerender-route', r);
          return '<!doctype html>\n' + document.documentElement.outerHTML;
        },
        route,
        ORIGIN,
      );
      const title = await page.title();
      if (!title || title === 'not found') throw new Error(`prerender: ${route} rendered without a title`);
      if (html.includes(ORIGIN)) throw new Error(`prerender: ${route} still references ${ORIGIN}`);
      snapshots.set(route, html);
      console.log(`prerendered ${route} (${(html.length / 1024).toFixed(0)} KB) — "${title}"`);
    }

    // Flush only after every route captured — overwriting dist/index.html
    // mid-run would change the SPA fallback the remaining routes render from.
    for (const [route, html] of snapshots) {
      const out = outputPathFor(route);
      await mkdir(dirname(out), { recursive: true });
      await writeFile(out, html);
    }
    console.log(`prerender: wrote ${snapshots.size} routes into dist/`);
  } finally {
    await browser.close();
    server.close();
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
