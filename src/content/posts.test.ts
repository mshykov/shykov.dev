import { describe, expect, it } from 'vitest';
import { getAllPosts, getPostBySlug } from './posts';

describe('post registry', () => {
  it('exposes the Engineer Changelog article by slug', () => {
    const post = getPostBySlug('the-engineer-changelog');

    expect(post?.title).toBe(
      'Weekly Changelog Template for Engineers: Prepare Better Performance Reviews',
    );
    expect(post?.description).toContain('weekly changelog template');
    expect(post?.content).toContain('{{figure:friday-test}}');
  });

  it('uses search-intent headings and FAQ copy in the article body', () => {
    const post = getPostBySlug('the-engineer-changelog');

    expect(post?.content).toContain('## Weekly self-review template for engineers');
    expect(post?.content).toContain('## Frequently asked questions');
    expect(post?.content).toContain('Can this replace a brag document?');
    expect(post?.tags).toContain('performance reviews');
  });

  it('includes the article in the public post index', () => {
    expect(getAllPosts().map((post) => post.slug)).toContain('the-engineer-changelog');
  });

  it('returns a defensive copy of the public post index', () => {
    const posts = getAllPosts();
    posts.length = 0;

    expect(getPostBySlug('the-engineer-changelog')).toBeDefined();
    expect(getAllPosts().map((post) => post.slug)).toContain('the-engineer-changelog');
  });
});
