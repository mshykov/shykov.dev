import type { Post } from '../types';
import { formatPostDate } from '../lib/formatDate';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const { display: date, iso: isoDate } = formatPostDate(post.createdAt);

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
