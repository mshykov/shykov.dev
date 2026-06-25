import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { getAllPosts } from '../content/posts';

const Blog = () => {
  const posts = getAllPosts();

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
        <div className="posts-grid">
          {posts.map((post) => (
            <article key={post.slug} className="post-card">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-3">
                <h2 className="text-xl font-semibold text-ink dark:text-ink-dark leading-snug">
                  <Link to={`/blog/${post.slug}`} className="hover:underline underline-offset-4">
                    {post.title}
                  </Link>
                </h2>
                <time
                  dateTime={post.publishedAt}
                  className="text-xs text-ink-tertiary dark:text-ink-tertiary-dark whitespace-nowrap"
                >
                  {new Intl.DateTimeFormat('en', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }).format(new Date(`${post.publishedAt}T00:00:00Z`))}
                </time>
              </div>
              <p className="text-sm text-ink-secondary dark:text-ink-secondary-dark leading-relaxed mb-4">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink-tertiary dark:text-ink-tertiary-dark">
                <span>{post.readingMinutes} min read</span>
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;
