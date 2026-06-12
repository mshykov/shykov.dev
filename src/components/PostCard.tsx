import type { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  // Format the date if it's a Firebase Timestamp or a serializable date
  let date = 'Unknown date';
  let isoDate: string | null = null;
  const createdAt = post.createdAt;

  const hasToDate = (v: unknown): v is { toDate: () => Date } => {
    return typeof v === 'object' && v !== null && 'toDate' in (v as object) && typeof (v as { toDate?: unknown }).toDate === 'function';
  };

  // The Date constructor never throws on bad input — it returns an Invalid Date —
  // so detect unparseable values with isNaN(getTime()) rather than try/catch.
  let parsed: Date | null = null;
  if (hasToDate(createdAt)) {
    parsed = createdAt.toDate();
  } else if (createdAt) {
    const d = new Date(createdAt as string | number);
    if (!Number.isNaN(d.getTime())) parsed = d;
  }
  if (parsed) {
    date = parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    isoDate = parsed.toISOString();
  }

  return (
    <article className="post-card">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <h3 className="text-lg font-semibold text-ink dark:text-ink-dark leading-snug">
          {post.title}
        </h3>
        <span className="text-xs text-ink-tertiary dark:text-ink-tertiary-dark whitespace-nowrap">
          {isoDate ? <time dateTime={isoDate}>{date}</time> : date}
        </span>
      </div>

      {!post.published && (
        <span className="inline-block text-xs font-medium text-ink-tertiary dark:text-ink-tertiary-dark border border-hairline dark:border-hairline-dark rounded px-1.5 py-0.5 mb-2">
          Draft
        </span>
      )}

      <p className="text-sm text-ink-secondary dark:text-ink-secondary-dark leading-relaxed line-clamp-3 mb-3">
        {post.content}
      </p>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-tertiary dark:text-ink-tertiary-dark">
          {post.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      )}
    </article>
  );
};

export default PostCard;
