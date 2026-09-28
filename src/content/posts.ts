import { createPostIndex, parsePostSource } from '../lib/postContent';
import type { BlogPost } from '../lib/postContent';
import engineerChangelogSource from './posts/the-engineer-changelog.md?raw';
import productEngineerSource from './posts/software-engineer-to-product-engineer.md?raw';
import pdpSource from './posts/professional-development-plan-for-engineers.md?raw';

const posts = createPostIndex([
  parsePostSource(engineerChangelogSource),
  parsePostSource(productEngineerSource),
  parsePostSource(pdpSource),
]) as readonly BlogPost[];

export const getAllPosts = (): BlogPost[] => [...posts];

export const getPostBySlug = (slug: string): BlogPost | undefined =>
  posts.find((post) => post.slug === slug);
