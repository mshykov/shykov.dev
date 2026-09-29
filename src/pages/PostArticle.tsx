import { Link, useParams } from 'react-router-dom';
import MarkdownContent from '../components/MarkdownContent';
import { PostFigure } from '../components/PostFigures';
import Seo, { SITE_URL } from '../components/Seo';
import { getPostBySlug } from '../content/posts';
import { formatPostDate } from '../lib/formatDate';
import { splitPostContent } from '../lib/postContent';
import { buildPostJsonLd, postOgImagePath } from '../lib/postSeo';

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

  const publishedDate = formatPostDate(post.publishedAt, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="py-16 md:py-24">
      <Seo
        title={`${post.title} — Maksym Shykov`}
        description={post.description}
        path={`/blog/${post.slug}`}
        type="article"
        image={`${SITE_URL}${postOgImagePath(post.slug)}`}
        imageAlt={`${post.title} — an article by Maksym Shykov`}
        article={{
          publishedTime: post.publishedAt,
          modifiedTime: post.updatedAt ?? post.publishedAt,
          tags: post.tags,
        }}
        jsonLd={buildPostJsonLd(post)}
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
          <span>
            By{' '}
            <Link to="/experience" className="text-link">
              Maksym Shykov
            </Link>
            , Engineering Manager
          </span>
          <span aria-hidden="true">·</span>
          <time dateTime={publishedDate.iso ?? post.publishedAt}>{publishedDate.display}</time>
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
