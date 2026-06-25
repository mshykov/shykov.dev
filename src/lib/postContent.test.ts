import { describe, expect, it } from 'vitest';
import {
  calculateReadingTime,
  createPostIndex,
  parsePostSource,
  splitPostContent,
} from './postContent';

const samplePost = `---
title: "The Engineer Changelog"
description: "A weekly habit for better engineering reviews."
slug: "the-engineer-changelog"
publishedAt: "2026-06-25"
updatedAt: "2026-06-26"
tags: ["engineering leadership", "career growth"]
excerpt: "A weekly changelog helps engineers remember impact."
published: true
---

# The Engineer Changelog

Most engineers do more valuable work than they can remember.

{{figure:friday-test}}
`;

describe('post content pipeline', () => {
  it('parses frontmatter and markdown body from a post source', () => {
    const post = parsePostSource(samplePost);

    expect(post.slug).toBe('the-engineer-changelog');
    expect(post.title).toBe('The Engineer Changelog');
    expect(post.description).toBe('A weekly habit for better engineering reviews.');
    expect(post.publishedAt).toBe('2026-06-25');
    expect(post.updatedAt).toBe('2026-06-26');
    expect(post.tags).toEqual(['engineering leadership', 'career growth']);
    expect(post.excerpt).toBe('A weekly changelog helps engineers remember impact.');
    expect(post.published).toBe(true);
    expect(post.readingMinutes).toBe(1);
    expect(post.content).toContain('# The Engineer Changelog');
    expect(post.content).toContain('{{figure:friday-test}}');
  });

  it('calculates a minimum one-minute reading time', () => {
    expect(calculateReadingTime('Short post.')).toBe(1);
  });

  it('sorts published posts newest first and excludes drafts', () => {
    const older = parsePostSource(samplePost.replace('2026-06-25', '2026-04-01'));
    const newer = parsePostSource(
      samplePost
        .replace('the-engineer-changelog', 'another-post')
        .replace('2026-06-25', '2026-07-01'),
    );
    const draft = parsePostSource(
      samplePost
        .replace('the-engineer-changelog', 'draft-post')
        .replace('published: true', 'published: false'),
    );

    expect(createPostIndex([older, draft, newer]).map((post) => post.slug)).toEqual([
      'another-post',
      'the-engineer-changelog',
    ]);
  });

  it('throws a clear error when required frontmatter is missing', () => {
    expect(() => parsePostSource('---\ntitle: Missing slug\n---\n\nBody')).toThrow(
      'Missing required post frontmatter: description, slug, publishedAt, tags, excerpt',
    );
  });

  it('splits markdown content around figure shortcodes', () => {
    expect(splitPostContent('Intro\n\n{{figure:friday-test}}\n\nOutro')).toEqual([
      { type: 'markdown', value: 'Intro' },
      { type: 'figure', value: 'friday-test' },
      { type: 'markdown', value: 'Outro' },
    ]);
  });
});
