export interface BlogPost {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  excerpt: string;
  published: boolean;
  readingMinutes: number;
  content: string;
}

export type PostContentSegment =
  | { type: 'markdown'; value: string }
  | { type: 'figure'; value: string };

type FrontmatterValue = string | string[] | boolean;

const REQUIRED_FIELDS = [
  'title',
  'description',
  'slug',
  'publishedAt',
  'tags',
  'excerpt',
] as const;

const REQUIRED_STRING_FIELDS = [
  'title',
  'description',
  'slug',
  'publishedAt',
  'excerpt',
] as const;

const WORDS_PER_MINUTE = 220;

export const calculateReadingTime = (content: string): number => {
  const words = content
    .replace(/\{\{figure:[a-z0-9-]+\}\}/gi, ' ')
    .replace(/[#>*`_\-[\]()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
};

const parseFrontmatterValue = (value: string): FrontmatterValue => {
  const trimmed = value.trim();
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, ''))
      .filter(Boolean);
  }
  return trimmed.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
};

const parseFrontmatter = (source: string): Record<string, FrontmatterValue> => {
  return source.split('\n').reduce<Record<string, FrontmatterValue>>((fields, line) => {
    const separator = line.indexOf(':');
    if (separator === -1) return fields;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1);
    if (!key) return fields;

    return { ...fields, [key]: parseFrontmatterValue(value) };
  }, {});
};

const asString = (value: FrontmatterValue | undefined): string | undefined =>
  typeof value === 'string' ? value : undefined;

const asStringArray = (value: FrontmatterValue | undefined): string[] | undefined =>
  Array.isArray(value) ? value : undefined;

const asBoolean = (value: FrontmatterValue | undefined): boolean | undefined =>
  typeof value === 'boolean' ? value : undefined;

const validateFrontmatterTypes = (frontmatter: Record<string, FrontmatterValue>) => {
  const invalid: string[] = REQUIRED_STRING_FIELDS.filter(
    (field) => asString(frontmatter[field]) === undefined,
  );

  if (asStringArray(frontmatter.tags) === undefined) {
    invalid.push('tags');
  }

  if (frontmatter.updatedAt !== undefined && asString(frontmatter.updatedAt) === undefined) {
    invalid.push('updatedAt');
  }

  if (frontmatter.published !== undefined && asBoolean(frontmatter.published) === undefined) {
    invalid.push('published');
  }

  if (invalid.length > 0) {
    throw new Error(`Invalid post frontmatter types: ${invalid.join(', ')}`);
  }
};

export const parsePostSource = (source: string): BlogPost => {
  const normalizedSource = source.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const match = normalizedSource.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error('Post source must start with frontmatter');
  }

  const [, frontmatterSource, markdownSource] = match;
  const frontmatter = parseFrontmatter(frontmatterSource);
  const missing = REQUIRED_FIELDS.filter((field) => !frontmatter[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required post frontmatter: ${missing.join(', ')}`);
  }
  validateFrontmatterTypes(frontmatter);

  const content = markdownSource.trim();

  return {
    title: asString(frontmatter.title) ?? '',
    description: asString(frontmatter.description) ?? '',
    slug: asString(frontmatter.slug) ?? '',
    publishedAt: asString(frontmatter.publishedAt) ?? '',
    updatedAt: asString(frontmatter.updatedAt),
    tags: asStringArray(frontmatter.tags) ?? [],
    excerpt: asString(frontmatter.excerpt) ?? '',
    published: asBoolean(frontmatter.published) ?? true,
    readingMinutes: calculateReadingTime(content),
    content,
  };
};

export const createPostIndex = (posts: BlogPost[]): BlogPost[] =>
  posts
    .filter((post) => post.published)
    .slice()
    .sort((a: BlogPost, b: BlogPost) => b.publishedAt.localeCompare(a.publishedAt));

export const splitPostContent = (content: string): PostContentSegment[] => {
  const figurePattern = /\{\{figure:([a-z0-9-]+)\}\}/gi;
  const segments: PostContentSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = figurePattern.exec(content)) !== null) {
    const markdown = content.slice(lastIndex, match.index).trim();
    if (markdown) segments.push({ type: 'markdown', value: markdown });
    segments.push({ type: 'figure', value: match[1] });
    lastIndex = match.index + match[0].length;
  }

  const tail = content.slice(lastIndex).trim();
  if (tail) segments.push({ type: 'markdown', value: tail });

  return segments;
};
