import PostList from '../components/PostList';
import Seo from '../components/Seo';

const Blog = () => {
  return (
    <div className="space-y-4">
      <Seo
        title="Blog — Maksym Shykov"
        description="Articles by Maksym Shykov on software development, engineering leadership, AI, and lessons from building and scaling teams."
        path="/blog"
      />
      <section className="py-12 md:py-16 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Articles</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Thoughts, tutorials, and insights about software development and life.</p>
      </section>

      <section className="py-12 md:py-16">
        <PostList />
      </section>
    </div>
  );
};

export default Blog;
