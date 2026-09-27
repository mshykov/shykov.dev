import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SocialLinks from '../components/SocialLinks';

// Highlights are drawn from the verifiable track record on /experience —
// keep the two in sync when updating either.
const highlights = [
  {
    metric: "EU's first alternative iOS app marketplace",
    context: 'Shipped Setapp Mobile at MacPaw under the Digital Markets Act window',
  },
  {
    metric: '99.95% crash-free sessions',
    context: 'Up from ~96% on the Headway app iOS client, as EM of the Foundation team',
  },
  {
    metric: 'AI paywall & ML recommendations in production',
    context: 'Shipped both on the Headway app; the paywall MVP picked the right price 65% of the time and still learns in shadow mode',
  },
  {
    metric: '95% availability at 0.2s response time',
    context: 'AI Assistant and Smart Search for Setapp, from prototype to production',
  },
  {
    metric: '2.5× faster release cycle',
    context: 'Rebuilt the Setapp Desktop release process, making weekly releases routine',
  },
  {
    metric: '20+ engineers hired and managed',
    context: 'Across MacPaw and Headway — desktop, mobile, and web teams',
  },
];

// The four flagship products, one for each group an engineering manager works
// with. Same order and wording as the CV and LinkedIn profile:
// change them together.
const projects = [
  {
    name: 'Aploma',
    url: 'https://aploma.dev/',
    label: 'For managers · Private preview',
    description:
      'Turns weekly 1:1 notes into the evidence behind reviews, development plans and salary decisions.',
  },
  {
    name: 'CoffeeSlack',
    url: 'https://www.coffeeslack.com/',
    label: 'For teams · Free',
    description:
      'Random coffee for Slack. Pairs teammates for 1:1 chats and reports whether they actually met.',
  },
  {
    name: 'local-review',
    url: 'https://local-review.shykov.dev/',
    label: 'For engineers · Free · Open source',
    description:
      'Privacy-first AI code review from your terminal with multi-LLM support, shipped as a single Go binary.',
  },
  {
    name: 'ATS Resume Toolkit',
    url: 'https://cv.shykov.dev/',
    label: 'For candidates · Free · Open source',
    description:
      'Resume checker and builder that runs entirely in your browser. No upload, no account.',
  },
];

// Smaller experiments, listed in one line under the flagships.
const moreProjects = [
  { name: 'Alotno', url: 'https://alotno.app/' },
  { name: 'Zero to Moat', url: 'https://moat.shykov.dev/' },
];

const focusAreas = [
  {
    area: 'Engineering leadership and mentoring',
    detail: 'Growth plans, transparent promotions, and hands-on coaching for engineers and leads',
  },
  {
    area: 'Building and scaling cross-functional teams',
    detail: 'Hiring and team structure for product orgs across iOS, Android, desktop, and web',
  },
  {
    area: 'AI product integration',
    detail: 'Search, personalization, and paywalls — taken from prototype to production-grade availability',
  },
  {
    area: 'Quality engineering and release management',
    detail: 'QA-bred discipline: test automation, integration testing, and releases that ship on time',
  },
];

const Home = () => {
  return (
    <div className="flex flex-col pb-8">
      <Seo
        title="Maksym Shykov | Engineering Manager"
        description="Engineering Manager who still ships. 15 years from QA to EM at MacPaw and Headway, and the builder of four side products."
        path="/"
      />

      {/* Hero — typography-led, no decoration */}
      <section className="pt-20 md:pt-28 pb-16 md:pb-20">
        <p className="section-label mb-5">Engineering Manager · Open to new roles, Lisbon or remote</p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink dark:text-ink-dark leading-[1.15] mb-6 text-balance">
          Engineering Manager who still ships.
        </h1>
        <p className="text-lg text-ink-secondary dark:text-ink-secondary-dark leading-relaxed max-w-xl mb-10">
          Fifteen years in software, from QA engineer at Samsung to
          Engineering Manager at MacPaw and Headway. I lead cross-functional
          teams, mentor engineers, and still write code: 200+ merged changes
          across eight repositories in my last quarter at Headway.
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link to="/experience" className="btn-ink">
            View experience <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#contact" className="text-link text-sm font-medium">
            Get in touch
          </a>
          <div className="flex items-center gap-1">
            <SocialLinks />
          </div>
        </div>
      </section>

      {/* Career highlights — facts, not adjectives */}
      <section className="py-14 border-t border-hairline dark:border-hairline-dark">
        <h2 className="section-label mb-8">Career highlights</h2>
        <ul>
          {highlights.map(({ metric, context }) => (
            <li
              key={metric}
              className="py-4 first:pt-0 last:pb-0 border-b border-hairline dark:border-hairline-dark last:border-b-0 md:grid md:grid-cols-[1fr_1.2fr] md:gap-8"
            >
              <span className="block font-semibold text-ink dark:text-ink-dark">
                {metric}
              </span>
              <span className="block text-sm text-ink-secondary dark:text-ink-secondary-dark mt-1 md:mt-0.5 leading-relaxed">
                {context}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Projects — shipped solo, proof of the "still ships" */}
      <section className="py-14 border-t border-hairline dark:border-hairline-dark">
        <h2 className="section-label mb-8">Projects</h2>
        <ul>
          {projects.map(({ name, url, label, description }) => (
            <li
              key={name}
              className="py-4 first:pt-0 last:pb-0 border-b border-hairline dark:border-hairline-dark last:border-b-0 md:grid md:grid-cols-[1fr_1.2fr] md:gap-8"
            >
              <span className="block">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ink dark:text-ink-dark hover:underline underline-offset-4 inline-flex items-center gap-1"
                >
                  {name}
                  <ArrowUpRight className="w-3.5 h-3.5 text-ink-tertiary dark:text-ink-tertiary-dark" />
                </a>
                <span className="block text-xs text-ink-tertiary dark:text-ink-tertiary-dark mt-0.5">
                  {label}
                </span>
              </span>
              <span className="block text-sm text-ink-secondary dark:text-ink-secondary-dark mt-1 md:mt-0.5 leading-relaxed">
                {description}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-ink-secondary dark:text-ink-secondary-dark">
          Also:{' '}
          {moreProjects.map(({ name, url }, index) => (
            <span key={name}>
              {index > 0 && ', '}
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-link">
                {name}
              </a>
            </span>
          ))}
          , and more on{' '}
          <a href="https://github.com/mshykov" target="_blank" rel="noopener noreferrer" className="text-link">
            GitHub
          </a>
          .
        </p>
      </section>

      {/* Focus */}
      <section className="py-14 border-t border-hairline dark:border-hairline-dark">
        <h2 className="section-label mb-8">Focus</h2>
        <ul>
          {focusAreas.map(({ area, detail }) => (
            <li
              key={area}
              className="py-4 first:pt-0 last:pb-0 border-b border-hairline dark:border-hairline-dark last:border-b-0 md:grid md:grid-cols-[1fr_1.2fr] md:gap-8"
            >
              <span className="block font-semibold text-ink dark:text-ink-dark">
                {area}
              </span>
              <span className="block text-sm text-ink-secondary dark:text-ink-secondary-dark mt-1 md:mt-0.5 leading-relaxed">
                {detail}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm">
          <Link
            to="/blog/the-engineer-changelog"
            className="text-link inline-flex items-center gap-1.5 font-medium"
          >
            Read my weekly changelog template for engineers <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </p>
      </section>
    </div>
  );
};

export default Home;
