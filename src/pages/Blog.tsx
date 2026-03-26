import PostList from '../components/PostList';

const Blog = () => {
  return (
    <div className="space-y-4">
      <section className="py-12 md:py-16 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Articles</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Thoughts, tutorials, and insights about software development and life.</p>
      </section>

      <section className="py-12 md:py-16">
        <PostList />
      </section>
    </div>
  );
};

export default Blog;
