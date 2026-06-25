import { describe, expect, it } from 'vitest';
import { getAllPosts, getPostBySlug } from './posts';

describe('post registry', () => {
  it('exposes the Engineer Changelog article by slug', () => {
    const post = getPostBySlug('the-engineer-changelog');

    expect(post?.title).toBe('The Engineer Changelog: A Weekly Habit for Better Reviews');
    expect(post?.description).toContain('weekly reflection habit');
    expect(post?.content).toContain('{{figure:friday-test}}');
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
