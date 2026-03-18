import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import type { Post } from '../types';
import PostCard from './PostCard';

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
          fetchedPosts.push({ id: doc.id, ...doc.data() } as Post);
        });

        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        const message = err instanceof Error ? err.message : String(err);
        setError(message || 'Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="loading-card">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 transition-colors"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded transition-colors"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 transition-colors"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-center transition-colors">
        <p>{error}</p>
        <p className="text-sm mt-2">Check your Firestore security rules and configuration.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="empty-posts">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Check back later for new content!</p>
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
