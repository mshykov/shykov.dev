/**
 * Writes one 1200×630 social card per blog post to public/og/<slug>.png, in the
 * same style as the site-wide card (public/og-image-explore.svg) but carrying
 * the post title. PostArticle points og:image / twitter:image at it, so a post
 * shared on LinkedIn or X shows its own title instead of the generic card.
 *
 *   npm run og        # after adding a post or changing a title; commit the PNGs
 *
 * Uses the same system Chrome (puppeteer-core) as scripts/prerender.mjs.
 * src/lib/postSeo.test.ts fails if a published post has no card.
 */
import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const POSTS = join(ROOT, 'src/content/posts');
const OUT = join(ROOT, 'public/og');

const frontmatterField = (source, field) => {
  const match = source.match(new RegExp(`^${field}:\\s*"?(.*?)"?\\s*$`, 'm'));
  return match?.[1];
};

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Long titles step down in size so they stay within three lines.
const titleSize = (title) => (title.length > 70 ? 54 : title.length > 45 ? 62 : 72);

const card = (title) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; background: #f7f6f3; font-family: Inter, Arial, sans-serif; }
  .card { position: absolute; left: 64px; top: 64px; width: 1072px; height: 502px;
    background: #fff; border: 2px solid #e6e2dd; border-radius: 28px; padding: 56px 48px 0; }
  .label { color: #7a746d; font-size: 23px; font-weight: 700; letter-spacing: 6px; }
  h1 { margin-top: 28px; color: #1d1a17; font-size: ${titleSize(title)}px; font-weight: 800;
    line-height: 1.12; letter-spacing: -0.5px; max-height: 3.4em; overflow: hidden; }
  .footer { position: absolute; left: 48px; right: 48px; bottom: 30px; border-top: 2px solid #e6e2dd;
    padding-top: 22px; display: flex; align-items: center; gap: 18px; color: #5f5a54;
    font-size: 24px; font-weight: 700; }
  .mark { width: 44px; height: 44px; border-radius: 11px; background: #1d1a17; color: #fff;
    display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800; }
  .muted { color: #7a746d; font-weight: 600; }
</style></head><body>
  <div class="card">
    <div class="label">SHYKOV.DEV · WRITING</div>
    <h1>${escapeHtml(title)}</h1>
    <div class="footer"><div class="mark">M</div>
      <div>Maksym Shykov <span class="muted">· Engineering Manager who still ships</span></div></div>
  </div>
</body></html>`;

const posts = readdirSync(POSTS)
  .filter((file) => file.endsWith('.md'))
  .map((file) => {
    const source = readFileSync(join(POSTS, file), 'utf8');
    return { slug: frontmatterField(source, 'slug'), title: frontmatterField(source, 'title') };
  })
  .filter((post) => post.slug && post.title);

mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  for (const { slug, title } of posts) {
    await page.setContent(card(title));
    await page.screenshot({ path: join(OUT, `${slug}.png`), clip: { x: 0, y: 0, width: 1200, height: 630 } });
    console.log(`og: public/og/${slug}.png — "${title}"`);
  }
} finally {
  await browser.close();
}
