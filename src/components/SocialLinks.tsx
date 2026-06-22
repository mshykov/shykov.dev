import { Github, Linkedin, Twitter } from 'lucide-react';
import type { ComponentType } from 'react';

/**
 * The three social profile links, rendered as bare <a> elements so each caller
 * supplies its own wrapper (e.g. the footer's `.social-links` vs the hero's
 * flex row). Single source of truth for the profile URLs and link styling —
 * previously duplicated verbatim in Layout and Home.
 */
const links: { label: string; href: string; Icon: ComponentType<{ className?: string }> }[] = [
  { label: 'GitHub', href: 'https://github.com/mshykov', Icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/maksym-shykov/', Icon: Linkedin },
  { label: 'Twitter', href: 'https://x.com/Shykov', Icon: Twitter },
];

const SocialLinks = () => (
  <>
    {links.map(({ label, href, Icon }) => (
      <a
        key={label}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="p-2 rounded-lg text-ink-tertiary dark:text-ink-tertiary-dark hover:text-ink dark:hover:text-ink-dark transition-colors"
      >
        <Icon className="w-5 h-5" />
      </a>
    ))}
  </>
);

export default SocialLinks;
