import type { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // Format the date if it's a Firebase Timestamp or a serializable date
  let date = 'Unknown date';
  const createdAt = post.createdAt;

  const hasToDate = (v: unknown): v is { toDate: () => Date } => {
    return typeof v === 'object' && v !== null && 'toDate' in (v as object) && typeof (v as { toDate?: unknown }).toDate === 'function';
  };

  if (hasToDate(createdAt)) {
    date = createdAt.toDate().toLocaleDateString();
  } else if (createdAt) {
    try {
      date = new Date(createdAt as string | number).toLocaleDateString();
    } catch {
      // ignore invalid date formats
    }
  }

  return (
    <article className="post-card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{post.title}</h3>
        {!post.published && (
          <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs px-2 py-1 rounded-full font-medium transition-colors">
            Draft
          </span>
        )}
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">{post.content}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags?.map((tag) => (
          <span key={tag} className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-md font-medium transition-colors">
            #{tag}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-50 dark:border-gray-700 pt-4 transition-colors">
        <span>By {post.author || 'Anonymous'}</span>
        <time>{date}</time>
      </div>
    </article>
  );
};

export default PostCard;
