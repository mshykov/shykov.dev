import { Link, useParams } from 'react-router-dom';
import MarkdownContent from '../components/MarkdownContent';
import { PostFigure } from '../components/PostFigures';
import Seo from '../components/Seo';
import { getPostBySlug } from '../content/posts';
import { splitPostContent } from '../lib/postContent';

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00Z`));

const PostArticle = () => {
  const { slug = '' } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="py-24 md:py-32">
        <Seo
          title="Article not found — Maksym Shykov"
          description="The article you're looking for doesn't exist."
          path={`/blog/${slug}`}
          noindex
        />
        <p className="section-label mb-4">404</p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink dark:text-ink-dark mb-4">
          Article not found
        </h1>
        <Link to="/blog" className="btn-ink">Back to writing</Link>
      </div>
    );
  }

  const path = `/blog/${post.slug}`;

  return (
    <article className="py-16 md:py-24">
      <Seo
        title={`${post.title} — Maksym Shykov`}
        description={post.description}
        path={path}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt ?? post.publishedAt,
          author: {
            '@type': 'Person',
            name: 'Maksym Shykov',
            url: 'https://shykov.dev/',
          },
          mainEntityOfPage: `https://shykov.dev${path}`,
          url: `https://shykov.dev${path}`,
        }}
      />

      <header className="mb-12">
        <Link to="/blog" className="section-label text-link">Writing</Link>
        <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight text-ink dark:text-ink-dark leading-tight">
          {post.title}
        </h1>
        <p className="mt-5 text-lg text-ink-secondary dark:text-ink-secondary-dark leading-relaxed">
          {post.excerpt}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-tertiary dark:text-ink-tertiary-dark">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes} min read</span>
        </div>
      </header>

      {splitPostContent(post.content).map((segment, index) =>
        segment.type === 'figure' ? (
          <PostFigure key={`${segment.value}-${index}`} name={segment.value} />
        ) : (
          <MarkdownContent key={index} content={segment.value} />
        ),
      )}
    </article>
  );
};

export default PostArticle;
