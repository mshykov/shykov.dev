import { Fragment } from 'react';

interface MarkdownContentProps {
  content: string;
}

interface MarkdownBlock {
  type: 'heading' | 'paragraph' | 'blockquote' | 'list' | 'code';
  value: string | string[];
  level?: number;
}

const flushParagraph = (lines: string[], blocks: MarkdownBlock[]) => {
  if (lines.length === 0) return;
  blocks.push({ type: 'paragraph', value: lines.join(' ') });
  lines.length = 0;
};

const parseMarkdownBlocks = (content: string): MarkdownBlock[] => {
  const blocks: MarkdownBlock[] = [];
  const paragraph: string[] = [];
  const lines = content.split('\n');
  let codeFence: string[] | null = null;

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (codeFence) {
        blocks.push({ type: 'code', value: codeFence.join('\n') });
        codeFence = null;
      } else {
        flushParagraph(paragraph, blocks);
        codeFence = [];
      }
      continue;
    }

    if (codeFence) {
      codeFence.push(line);
      continue;
    }

    if (line.trim() === '') {
      flushParagraph(paragraph, blocks);
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph(paragraph, blocks);
      blocks.push({ type: 'heading', level: heading[1].length, value: heading[2] });
      continue;
    }

    if (line.startsWith('> ')) {
      flushParagraph(paragraph, blocks);
      blocks.push({ type: 'blockquote', value: line.slice(2) });
      continue;
    }

    if (line.startsWith('- ')) {
      flushParagraph(paragraph, blocks);
      const last = blocks.at(-1);
      if (last?.type === 'list' && Array.isArray(last.value)) {
        last.value.push(line.slice(2));
      } else {
        blocks.push({ type: 'list', value: [line.slice(2)] });
      }
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph(paragraph, blocks);
  return blocks;
};

const renderInline = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*|"[^"]+")/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('"') && part.endsWith('"')) {
      return <q key={index}>{part.slice(1, -1)}</q>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
};

const MarkdownContent = ({ content }: MarkdownContentProps) => (
  <div className="article-prose">
    {parseMarkdownBlocks(content).map((block, index) => {
      if (block.type === 'heading') {
        if (block.level === 1) return null;
        const text = String(block.value);
        return block.level === 2 ? (
          <h2 key={index}>{renderInline(text)}</h2>
        ) : (
          <h3 key={index}>{renderInline(text)}</h3>
        );
      }
      if (block.type === 'blockquote') {
        return <blockquote key={index}>{renderInline(String(block.value))}</blockquote>;
      }
      if (block.type === 'list' && Array.isArray(block.value)) {
        return (
          <ul key={index}>
            {block.value.map((item, itemIndex) => (
              <li key={`${index}-${itemIndex}`}>{renderInline(item)}</li>
            ))}
          </ul>
        );
      }
      if (block.type === 'code') {
        return (
          <pre key={index}>
            <code>{String(block.value)}</code>
          </pre>
        );
      }
      return <p key={index}>{renderInline(String(block.value))}</p>;
    })}
  </div>
);

export default MarkdownContent;
