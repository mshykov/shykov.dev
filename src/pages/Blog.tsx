import PostList from '../components/PostList';
import Seo from '../components/Seo';

const Blog = () => {
  return (
    <div className="pb-8">
      <Seo
        title="Writing — Maksym Shykov"
        description="Articles by Maksym Shykov on software development, engineering leadership, AI, and lessons from building and scaling teams."
        path="/blog"
      />
      <section className="pt-20 md:pt-28 pb-14">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink dark:text-ink-dark mb-3">
          Writing
        </h1>
        <p className="text-ink-secondary dark:text-ink-secondary-dark max-w-xl leading-relaxed">
          Notes on engineering leadership, AI products, and lessons from
          building teams.
        </p>
      </section>

      <section className="border-t border-hairline dark:border-hairline-dark">
        <PostList />
      </section>
    </div>
  );
};

export default Blog;
