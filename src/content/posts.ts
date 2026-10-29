import { createPostIndex, parsePostSource } from '../lib/postContent';
import type { BlogPost } from '../lib/postContent';
import engineerChangelogSource from './posts/the-engineer-changelog.md?raw';
import productEngineerSource from './posts/software-engineer-to-product-engineer.md?raw';
import networkingSource from './posts/how-to-build-your-network-at-work.md?raw';
import pdpSource from './posts/professional-development-plan-for-engineers.md?raw';
import techSkillsSource from './posts/technical-skills-engineering-manager.md?raw';
import atsCheckerSource from './posts/ats-resume-checker-in-the-browser.md?raw';
import growthSource from './posts/engineering-manager-engineer-growth.md?raw';
import jobSearchSource from './posts/engineering-manager-job-search-first-month.md?raw';
import whoOwnsWhatSource from './posts/cto-head-of-engineering-engineering-manager-who-owns-what.md?raw';

const posts = createPostIndex([
  parsePostSource(engineerChangelogSource),
  parsePostSource(productEngineerSource),
  parsePostSource(pdpSource),
  parsePostSource(networkingSource),
  parsePostSource(techSkillsSource),
  parsePostSource(growthSource),
  parsePostSource(atsCheckerSource),
  parsePostSource(jobSearchSource),
  parsePostSource(whoOwnsWhatSource),
]) as readonly BlogPost[];

export const getAllPosts = (): BlogPost[] => [...posts];

export const getPostBySlug = (slug: string): BlogPost | undefined =>
  posts.find((post) => post.slug === slug);
