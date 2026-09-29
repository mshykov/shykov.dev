import { describe, expect, it } from 'vitest';
import { parseInline, parseMarkdownBlocks } from './markdown';

describe('parseMarkdownBlocks', () => {
  it('parses headings, paragraphs and blockquotes', () => {
    expect(parseMarkdownBlocks('## Title\n\nOne line\ncontinued.\n\n> Quoted')).toEqual([
      { type: 'heading', level: 2, text: 'Title' },
      { type: 'paragraph', text: 'One line continued.' },
      { type: 'blockquote', text: 'Quoted' },
    ]);
  });

  it('parses unordered and ordered lists as separate blocks', () => {
    expect(parseMarkdownBlocks('- a\n- b\n\n1. one\n2. two')).toEqual([
      { type: 'list', ordered: false, start: 1, items: ['a', 'b'] },
      { type: 'list', ordered: true, start: 1, items: ['one', 'two'] },
    ]);
  });

  it('keeps an ordered list starting number', () => {
    expect(parseMarkdownBlocks('3. third')).toEqual([
      { type: 'list', ordered: true, start: 3, items: ['third'] },
    ]);
  });

  it('joins indented continuation lines into the list item above', () => {
    expect(parseMarkdownBlocks('1. **Pairs.** A script\n   emailed everyone.\n2. Next')).toEqual([
      { type: 'list', ordered: true, start: 1, items: ['**Pairs.** A script emailed everyone.', 'Next'] },
    ]);
  });

  it('does not treat an indented line after a paragraph as a list item', () => {
    expect(parseMarkdownBlocks('Text\n  more text')).toEqual([
      { type: 'paragraph', text: 'Text more text' },
    ]);
  });

  it('parses a pipe table with a separator row', () => {
    expect(parseMarkdownBlocks('| # | Goal |\n|---|------|\n| 1 | Ship it |')).toEqual([
      { type: 'table', header: ['#', 'Goal'], rows: [['1', 'Ship it']] },
    ]);
  });

  it('treats pipe lines without a separator row as text', () => {
    expect(parseMarkdownBlocks('| not a table |')).toEqual([
      { type: 'paragraph', text: '| not a table |' },
    ]);
  });

  it('keeps the lines of a fence that is never closed', () => {
    expect(parseMarkdownBlocks('Intro\n\n```\nconst a = 1;\nconst b = 2;')).toEqual([
      { type: 'paragraph', text: 'Intro' },
      { type: 'code', value: 'const a = 1;\nconst b = 2;' },
    ]);
  });

  it('keeps fenced code verbatim, including table and list syntax', () => {
    expect(parseMarkdownBlocks('```md\n| a | b |\n- item\n```')).toEqual([
      { type: 'code', value: '| a | b |\n- item' },
    ]);
  });
});

describe('parseInline', () => {
  it('returns plain text untouched', () => {
    expect(parseInline('plain')).toEqual([{ type: 'text', value: 'plain' }]);
  });

  it('parses internal and external links', () => {
    expect(parseInline('see [the post](/blog/x) and [site](https://a.dev)')).toEqual([
      { type: 'text', value: 'see ' },
      { type: 'link', href: '/blog/x', children: [{ type: 'text', value: 'the post' }] },
      { type: 'text', value: ' and ' },
      { type: 'link', href: 'https://a.dev', children: [{ type: 'text', value: 'site' }] },
    ]);
  });

  it('parses code, strong, em and quotes', () => {
    expect(parseInline('`/coffee` **bold** *em* _em_ "q"')).toEqual([
      { type: 'code', value: '/coffee' },
      { type: 'text', value: ' ' },
      { type: 'strong', children: [{ type: 'text', value: 'bold' }] },
      { type: 'text', value: ' ' },
      { type: 'em', children: [{ type: 'text', value: 'em' }] },
      { type: 'text', value: ' ' },
      { type: 'em', children: [{ type: 'text', value: 'em' }] },
      { type: 'text', value: ' ' },
      { type: 'quote', children: [{ type: 'text', value: 'q' }] },
    ]);
  });

  it('does not read markup inside code', () => {
    expect(parseInline('`**not bold**`')).toEqual([{ type: 'code', value: '**not bold**' }]);
  });

  it('leaves snake_case identifiers alone', () => {
    expect(parseInline('set snake_case_name here')).toEqual([
      { type: 'text', value: 'set snake_case_name here' },
    ]);
  });

  it('nests emphasis inside links', () => {
    expect(parseInline('[**Aploma**](https://aploma.dev)')).toEqual([
      {
        type: 'link',
        href: 'https://aploma.dev',
        children: [{ type: 'strong', children: [{ type: 'text', value: 'Aploma' }] }],
      },
    ]);
  });
});
