import { createPostIndex, parsePostSource } from '../lib/postContent';
import type { BlogPost } from '../lib/postContent';
import engineerChangelogSource from './posts/the-engineer-changelog.md?raw';
// Draft (published: false) — parsed and validated here, filtered from the
// public index until the flag flips. To publish: set published: true, set the
// real publishedAt, and add the route to public/sitemap.xml.
import productEngineerSource from './posts/software-engineer-to-product-engineer.md?raw';

const posts = createPostIndex([
  parsePostSource(engineerChangelogSource),
  parsePostSource(productEngineerSource),
]) as readonly BlogPost[];

export const getAllPosts = (): BlogPost[] => [...posts];

export const getPostBySlug = (slug: string): BlogPost | undefined =>
  posts.find((post) => post.slug === slug);
