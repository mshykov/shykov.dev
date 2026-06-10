import { ArrowRight, Github, Linkedin, Twitter } from 'lucide-react';
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

const focusAreas = [
  'Engineering leadership and mentoring',
  'Building and scaling cross-functional teams',
  'AI product integration — search, personalization, paywalls',
  'Quality engineering and release management',
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
          Building engineering teams that ship AI-powered products.
        </h1>
        <p className="text-lg text-ink-secondary dark:text-ink-secondary-dark leading-relaxed max-w-xl mb-10">
          Fifteen years in software — from QA engineer at Samsung to leading
          cross-functional teams at MacPaw and Headway. I care about
          engineering excellence that compounds into business value.
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link to="/experience" className="btn-ink">
            View experience <ArrowRight className="w-4 h-4" />
          </Link>
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

      {/* Focus */}
      <section className="py-14 border-t border-hairline dark:border-hairline-dark">
        <h2 className="section-label mb-8">Focus</h2>
        <ul className="space-y-3 max-w-xl">
          {focusAreas.map((area) => (
            <li
              key={area}
              className="text-ink-secondary dark:text-ink-secondary-dark leading-relaxed"
            >
              {area}
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
