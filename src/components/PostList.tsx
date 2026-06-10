import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import type { Post } from '../types';
import PostCard from './PostCard';

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Guard against StrictMode's double-mount (dev) and unmount-mid-fetch:
    // discard the response if the effect has already been cleaned up.
    let ignore = false;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Query for published posts, ordered by newest first
        const postsRef = collection(db, 'posts');
        const q = query(
          postsRef,
          where('published', '==', true),
          // orderBy('createdAt', 'desc'), // Note: Requires a composite index in Firestore if combined with 'where'
          limit(10)
        );

        const querySnapshot = await getDocs(q);
        const fetchedPosts: Post[] = [];

        querySnapshot.forEach((doc) => {
          // Spread first, then set id last so the document id always wins over
          // any stored field literally named `id`.
          fetchedPosts.push({ ...doc.data(), id: doc.id } as Post);
        });

        if (!ignore) setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        const message = err instanceof Error ? err.message : String(err);
        if (!ignore) setError(message || 'Failed to load posts.');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="loading-card">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-surface dark:bg-surface-dark rounded w-3/4 transition-colors"></div>
            <div className="space-y-2">
              <div className="h-4 bg-surface dark:bg-surface-dark rounded transition-colors"></div>
              <div className="h-4 bg-surface dark:bg-surface-dark rounded w-5/6 transition-colors"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-hairline dark:border-hairline-dark text-ink-secondary dark:text-ink-secondary-dark p-4 rounded-lg text-center transition-colors mt-6">
        <p>{error}</p>
        <p className="text-sm mt-2 text-ink-tertiary dark:text-ink-tertiary-dark">Check your Firestore security rules and configuration.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="empty-posts">
        <h3 className="text-lg font-semibold text-ink dark:text-ink-dark mb-2">No posts yet</h3>
        <p className="text-ink-secondary dark:text-ink-secondary-dark text-sm">Check back later for new content.</p>
      </div>
    );
  }

  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
