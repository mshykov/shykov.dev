// The subset of Markdown the blog posts use, parsed into plain data so the
// renderer (src/components/MarkdownContent.tsx) builds React elements and never
// injects HTML. Pure functions only: src/lib/markdown.test.ts covers each block
// and inline type.
//
// Blocks: ## / ### headings, paragraphs, > blockquotes, - and 1. lists (a line
// indented by two or more spaces continues the previous item), ``` fences,
// and | pipe | tables | with a --- separator row.
// Inline: `code`, [text](url), **strong**, *em* / _em_, and "quotes".

export type Inline =
  | { type: 'text'; value: string }
  | { type: 'code'; value: string }
  | { type: 'link'; href: string; children: Inline[] }
  | { type: 'strong'; children: Inline[] }
  | { type: 'em'; children: Inline[] }
  | { type: 'quote'; children: Inline[] };

export type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'blockquote'; text: string }
  | { type: 'list'; ordered: boolean; start: number; items: string[] }
  | { type: 'code'; value: string }
  | { type: 'table'; header: string[]; rows: string[][] };

interface ParseState {
  blocks: Block[];
  paragraph: string[];
  table: string[];
}

const ORDERED_ITEM = /^(\d+)\.\s+(.*)$/;
const CONTINUATION = /^\s{2,}\S/;
const TABLE_SEPARATOR = /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?$/;

const flushParagraph = (state: ParseState) => {
  if (state.paragraph.length === 0) return;
  state.blocks.push({ type: 'paragraph', text: state.paragraph.join(' ') });
  state.paragraph.length = 0;
};

const splitRow = (line: string): string[] =>
  line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());

// A run of |-lines is a table only when its second line is the --- separator;
// anything else was ordinary text that happened to start with a pipe.
const flushTable = (state: ParseState) => {
  if (state.table.length === 0) return;
  const [head, separator, ...rest] = state.table;
  if (separator !== undefined && TABLE_SEPARATOR.test(separator.trim())) {
    state.blocks.push({ type: 'table', header: splitRow(head), rows: rest.map(splitRow) });
  } else {
    state.paragraph.push(...state.table.map((line) => line.trim()));
  }
  state.table.length = 0;
};

const appendListItem = (state: ParseState, item: string, ordered: boolean, start: number) => {
  const last = state.blocks.at(-1);
  if (last?.type === 'list' && last.ordered === ordered) {
    last.items.push(item);
  } else {
    state.blocks.push({ type: 'list', ordered, start, items: [item] });
  }
};

// An indented line straight after a list item (no blank line, no paragraph in
// between) belongs to that item.
const continueListItem = (state: ParseState, line: string): boolean => {
  const last = state.blocks.at(-1);
  if (state.paragraph.length > 0 || last?.type !== 'list' || !CONTINUATION.test(line)) {
    return false;
  }
  last.items[last.items.length - 1] += ` ${line.trim()}`;
  return true;
};

const parseListLine = (state: ParseState, line: string): boolean => {
  if (line.startsWith('- ') || line.startsWith('* ')) {
    flushParagraph(state);
    appendListItem(state, line.slice(2), false, 1);
    return true;
  }
  const ordered = line.match(ORDERED_ITEM);
  if (ordered) {
    flushParagraph(state);
    appendListItem(state, ordered[2], true, Number(ordered[1]));
    return true;
  }
  return false;
};

const parseBlockLine = (state: ParseState, line: string) => {
  if (line.trim().startsWith('|')) {
    flushParagraph(state);
    state.table.push(line);
    return;
  }
  flushTable(state);

  if (line.trim() === '') {
    flushParagraph(state);
    return;
  }
  const heading = line.match(/^(#{1,3})\s+(.+)$/);
  if (heading) {
    flushParagraph(state);
    state.blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
    return;
  }
  if (line.startsWith('> ')) {
    flushParagraph(state);
    state.blocks.push({ type: 'blockquote', text: line.slice(2) });
    return;
  }
  if (continueListItem(state, line) || parseListLine(state, line)) return;
  state.paragraph.push(line.trim());
};

export const parseMarkdownBlocks = (content: string): Block[] => {
  const state: ParseState = { blocks: [], paragraph: [], table: [] };
  let codeFence: string[] | null = null;

  for (const line of content.split('\n')) {
    if (line.startsWith('```')) {
      if (codeFence) {
        state.blocks.push({ type: 'code', value: codeFence.join('\n') });
        codeFence = null;
      } else {
        flushTable(state);
        flushParagraph(state);
        codeFence = [];
      }
    } else if (codeFence) {
      codeFence.push(line);
    } else {
      parseBlockLine(state, line);
    }
  }

  // An unclosed fence keeps its lines rather than dropping the rest of the post.
  if (codeFence) state.blocks.push({ type: 'code', value: codeFence.join('\n') });
  flushTable(state);
  flushParagraph(state);
  return state.blocks;
};

// Order matters: code first so nothing inside backticks is interpreted, then
// links, then ** before * so bold is never read as two italics. Underscore
// emphasis needs a non-word character on both sides, so snake_case survives.
const INLINE =
  /`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|(?<![\w*])\*([^*\s][^*]*?)\*(?![\w*])|(?<!\w)_([^_\s][^_]*?)_(?!\w)|"([^"]+)"/g;

const toInline = (match: RegExpExecArray): Inline => {
  const [, code, linkText, href, strong, starEm, underscoreEm, quote] = match;
  if (code !== undefined) return { type: 'code', value: code };
  if (linkText !== undefined) return { type: 'link', href, children: parseInline(linkText) };
  if (strong !== undefined) return { type: 'strong', children: parseInline(strong) };
  const em = starEm ?? underscoreEm;
  if (em !== undefined) return { type: 'em', children: parseInline(em) };
  return { type: 'quote', children: parseInline(quote) };
};

export function parseInline(text: string): Inline[] {
  const result: Inline[] = [];
  let cursor = 0;
  for (const match of text.matchAll(INLINE)) {
    if (match.index > cursor) result.push({ type: 'text', value: text.slice(cursor, match.index) });
    result.push(toInline(match as RegExpExecArray));
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) result.push({ type: 'text', value: text.slice(cursor) });
  return result;
}
