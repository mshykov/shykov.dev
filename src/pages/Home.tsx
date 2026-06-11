import { ArrowRight, ArrowUpRight, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

// Highlights are drawn from the verifiable track record on /experience —
// keep the two in sync when updating either.
const highlights = [
  {
    metric: "EU's first alternative iOS app marketplace",
    context: 'Shipped Setapp Mobile at MacPaw under the Digital Markets Act window',
  },
  {
    metric: 'AI paywalls & ML-driven personalization',
    context: 'Released recommendation systems and pricing optimization for the Headway app',
  },
  {
    metric: '95% availability at 0.2s response time',
    context: 'AI Assistant and Smart Search for Setapp, from prototype to production',
  },
  {
    metric: '2.5× faster release cycle',
    context: 'Streamlined desktop and mobile release processes across two platforms',
  },
  {
    metric: '14 engineers across two cross-functional teams',
    context: 'Hired, built, and managed desktop and mobile orgs at MacPaw',
  },
];

// Things I've built and shipped myself — the "Builder." in the hero.
const apps = [
  {
    name: 'CoffeeSlack',
    url: 'https://www.coffeeslack.com/',
    label: 'Free',
    description:
      'Random coffee for Slack — pairs teammates for casual 1:1 chats with a /coffee command.',
  },
  {
    name: 'Alotno',
    url: 'https://alotno.app/',
    label: 'Free · Open source',
    description:
      'PNG-to-vector converter that runs entirely in your browser — SVG, PDF, EPS, DXF. No uploads, no accounts.',
  },
  {
    name: 'local-review',
    url: 'https://mshykov.github.io/local-review/',
    label: 'Free · Open source',
    description:
      'Privacy-first AI code reviews from your terminal with multi-LLM support, shipped as a single Go binary.',
  },
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
        title="Maksym Shykov | Engineering Lead"
        description="Maksym Shykov — Engineering Lead with 15 years in IT, focused on building high-performance teams, AI solutions, and engineering excellence."
        path="/"
      />

      {/* Hero — typography-led, no decoration */}
      <section className="pt-20 md:pt-28 pb-16 md:pb-20">
        <p className="section-label mb-5">Engineering Lead · Headway</p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink dark:text-ink-dark leading-[1.15] mb-6 text-balance">
          Leader. Mentor. Builder.
        </h1>
        <p className="text-lg text-ink-secondary dark:text-ink-secondary-dark leading-relaxed max-w-xl mb-10">
          I run engineering teams at Headway, mentor engineers, and build
          AI-powered products hands-on. Fifteen years in software — from QA
          engineer at Samsung to engineering management at MacPaw and Headway.
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link to="/experience" className="btn-ink">
            View experience <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#contact" className="text-link text-sm font-medium">
            Get in touch
          </a>
          <div className="flex items-center gap-1">
            <a href="https://github.com/mshykov" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 rounded-lg text-ink-tertiary dark:text-ink-tertiary-dark hover:text-ink dark:hover:text-ink-dark transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/maksym-shykov/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 rounded-lg text-ink-tertiary dark:text-ink-tertiary-dark hover:text-ink dark:hover:text-ink-dark transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://x.com/Shykov" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="p-2 rounded-lg text-ink-tertiary dark:text-ink-tertiary-dark hover:text-ink dark:hover:text-ink-dark transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
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

      {/* Apps — shipped solo, proof of the "Builder." */}
      <section className="py-14 border-t border-hairline dark:border-hairline-dark">
        <h2 className="section-label mb-8">Apps I've built</h2>
        <ul>
          {apps.map(({ name, url, label, description }) => (
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
          <Link to="/blog" className="text-link inline-flex items-center gap-1.5 font-medium">
            Read my writing <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </p>
      </section>
    </div>
  );
};

export default Home;
