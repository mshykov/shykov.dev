import { Fragment } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { parseInline, parseMarkdownBlocks } from '../lib/markdown';
import type { Block, Inline } from '../lib/markdown';

interface MarkdownContentProps {
  content: string;
}

const renderLink = (href: string, children: ReactNode, key: number) =>
  href.startsWith('/') ? (
    <Link key={key} to={href} className="text-link">
      {children}
    </Link>
  ) : (
    <a key={key} href={href} className="text-link" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );

const renderNodes = (nodes: Inline[]): ReactNode[] =>
  nodes.map((node, key) => {
    switch (node.type) {
      case 'code':
        return <code key={key}>{node.value}</code>;
      case 'link':
        return renderLink(node.href, renderNodes(node.children), key);
      case 'strong':
        return <strong key={key}>{renderNodes(node.children)}</strong>;
      case 'em':
        return <em key={key}>{renderNodes(node.children)}</em>;
      case 'quote':
        return <q key={key}>{renderNodes(node.children)}</q>;
      default:
        return <Fragment key={key}>{node.value}</Fragment>;
    }
  });

const renderInline = (text: string) => renderNodes(parseInline(text));

const renderList = (block: Extract<Block, { type: 'list' }>, key: number) => {
  const items = block.items.map((item, index) => <li key={index}>{renderInline(item)}</li>);
  return block.ordered ? (
    <ol key={key} start={block.start === 1 ? undefined : block.start}>
      {items}
    </ol>
  ) : (
    <ul key={key}>{items}</ul>
  );
};

// Wide tables scroll inside their own box so the page never scrolls sideways.
const renderTable = (block: Extract<Block, { type: 'table' }>, key: number) => (
  <div key={key} className="article-table">
    <table>
      <thead>
        <tr>
          {block.header.map((cell, index) => (
            <th key={index}>{renderInline(cell)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {block.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, index) => (
              <td key={index}>{renderInline(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const renderBlock = (block: Block, key: number): ReactNode => {
  switch (block.type) {
    case 'heading':
      // The page renders the post title as its only <h1>.
      if (block.level === 1) return null;
      return block.level === 2 ? (
        <h2 key={key}>{renderInline(block.text)}</h2>
      ) : (
        <h3 key={key}>{renderInline(block.text)}</h3>
      );
    case 'blockquote':
      return <blockquote key={key}>{renderInline(block.text)}</blockquote>;
    case 'list':
      return renderList(block, key);
    case 'table':
      return renderTable(block, key);
    case 'code':
      return (
        <pre key={key}>
          <code>{block.value}</code>
        </pre>
      );
    default:
      return <p key={key}>{renderInline(block.text)}</p>;
  }
};

const MarkdownContent = ({ content }: MarkdownContentProps) => (
  <div className="article-prose">{parseMarkdownBlocks(content).map(renderBlock)}</div>
);

export default MarkdownContent;
