import Seo from '../components/Seo';

interface Role {
  role: string;
  company: string;
  /** The product worked on, where the company alone is not specific enough. */
  project?: string;
  companyUrl?: string;
  logoUrl?: string;
  period: string;
  description: string;
}

// Company identity repeated across several roles. Factored out so adding a
// role at the same employer does not mean restating its name, URL and logo.
const HEADWAY = {
  company: 'Headway Inc.',
  companyUrl: 'https://makeheadway.com',
  logoUrl: '/logos/headway.jpeg',
};

const MACPAW = {
  company: 'MacPaw',
  companyUrl: 'https://macpaw.com',
  logoUrl: '/logos/macpaw_logo.jpeg',
};

const Experience = () => {
  const experiences: Role[] = [
    {
      ...HEADWAY,
      role: 'Engineering Manager',
      project: 'Goodly',
      period: 'Apr 2026 – Sep 2026',
      description: 'One of three people on the product leadership team, owning every engineering decision. Authored 200+ merged changes across eight repositories in a quarter — web, iOS, Android, Go services, GCP infrastructure — and shipped the releases end to end. Replaced magic-link sign-in with email and a one-time code. Stood up thegoodly.com as a full mirror of the Shopify storefront, then made it the primary site. Built the product analytics from nothing, and set commit, release and review conventions across every repository.',
    },
    {
      ...HEADWAY,
      role: 'Engineering Manager',
      project: 'Headway app, Foundation team',
      period: 'Jan 2025 – Apr 2026',
      description: 'Led a cross-functional team of eight engineers behind the Headway app: three backend, two Android, one iOS and two ML. Raised iOS crash-free sessions from ~96% to 99.95% over two quarters. Guided three backend engineers through moving ~65% of a seven-year-old Cloud Functions backend onto a REST API. Shipped an ML recommendation system and an AI paywall MVP to production; the paywall picked the right price 65% of the time, above chance and short of our 85% bar. The model still runs in shadow mode on all traffic to keep learning, and the work was paused when the payback period came out too long. Ran one engineering team against three PM stakeholders from separate product teams.',
    },
    {
      ...MACPAW,
      role: 'Engineering Manager',
      project: 'Setapp and Setapp Mobile for iOS',
      period: 'Oct 2022 – Nov 2024',
      description: 'Released Setapp Mobile for iOS, the EU\'s first alternative app marketplace, hitting every release date; ran the proof of concept on site with Apple in Cork. MacPaw has since discontinued the product. Brought AI Assistant and Smart Search to Setapp Desktop: availability up from 80% to 95%, response time down from ~1s to 0.2s, feature adoption up from 65% to 80%. Hired, built, and managed cross-functional teams for Desktop (9 engineers) and Mobile (5 engineers).',
    },
    {
      ...MACPAW,
      role: 'Area Lead / Senior QA Engineer',
      project: 'Setapp',
      period: 'Apr 2020 – Oct 2022',
      description: 'From January 2021, line manager of five QA engineers, with transparent promotion processes and individual development plans. Led the interview stages behind seven hires. As an engineer, implemented integration testing that reduced bugs by ~30%, rebuilt the Setapp Desktop release process to cut release time 2.5× and make weekly releases routine, and created UI, functional, and backend tests in JavaScript and Kotlin.',
    },
    {
      ...MACPAW,
      role: 'QA Engineer',
      project: 'Setapp',
      period: 'Jul 2019 – Mar 2020',
      description: 'Responsible for testing and releases of the B2C web cabinet. Created and maintained UI and functional tests using JavaScript and WebdriverIO.',
    },
    {
      role: 'Test Automation Engineer',
      company: 'Revenue Grid',
      companyUrl: 'https://revenuegrid.com',
      logoUrl: '/logos/revenue_grid.jpeg',
      period: 'Apr 2013 – Jul 2019',
      description: 'Developed automated tests for web using Oracle Automation Test Suite (Java) and Windows desktop applications using TestComplete (JScript) and coded UI tests (C#). Tested MS Outlook add-ins for CRM data access.',
    },
    {
      role: 'QA Engineer',
      company: 'Samsung Ukraine R&D Center (SURC)',
      companyUrl: 'https://samsung.com',
      logoUrl: '/logos/samsung_electronics.jpeg',
      period: 'Jan 2012 – Apr 2013',
      description: 'Tested libraries and drivers for mobile devices based on ARMv7 architecture and Android applications.',
    },
    {
      role: 'QA Engineer',
      company: 'Alfa Bank Ukraine (Sense Bank)',
      companyUrl: 'https://sensebank.com.ua',
      logoUrl: '/logos/sensebank_logo.jpeg',
      period: 'Oct 2010 – Dec 2011',
      description: 'Tested the internal bank’s desktop-based scoring system. Assisted with the user acceptance testing (UAT).',
    },
    {
      role: 'QA Engineer',
      company: 'InformSAN',
      period: 'Mar 2010 – Oct 2010',
      description: 'Tested a fintech solution for the Ukrainian market. Written test documentation and developing performance testing using JMeter.',
    }
  ];

  const education = [
    {
      name: 'Master\'s in Metrology and Information Technology',
      issuer: 'National Technical University of Ukraine "Igor Sikorsky Kyiv Polytechnic Institute"',
      year: '2008 – 2010',
    },
    {
      name: 'Bachelor\'s in Metrology and Information Technology',
      issuer: 'National Technical University of Ukraine "Igor Sikorsky Kyiv Polytechnic Institute"',
      year: '2004 – 2008',
    }
  ];

  const courses = [
    {
      name: 'Engineering Manager',
      issuer: 'RobotDreams',
      year: '2024 – 2025',
    },
    {
      name: 'Leadership school “Hero Path”',
      issuer: 'Independent',
      year: '2024',
    },
    {
      name: 'Facilitator school',
      issuer: 'MacPaw L&D department',
      year: '2024',
    },
    {
      name: 'Leadership & People Management',
      issuer: 'Projector',
      year: '2023',
    }
  ];

  return (
    <div className="pb-8">
      <Seo
        title="Experience — Maksym Shykov"
        description="Maksym Shykov's career: Engineering Manager at Headway and MacPaw (Setapp), QA leadership, and 15 years building and scaling cross-functional engineering teams."
        path="/experience"
      />

      <section className="pt-20 md:pt-28 pb-14">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink dark:text-ink-dark mb-3">
          Experience
        </h1>
        <p className="text-ink-secondary dark:text-ink-secondary-dark max-w-xl leading-relaxed">
          Fifteen years across QA engineering, test automation, and engineering
          management — consumer products at scale, from banking systems to
          AI-powered mobile apps.
        </p>
      </section>

      <section className="border-t border-hairline dark:border-hairline-dark pt-10">
        <h2 className="section-label mb-2">Roles</h2>
        <div>
          {experiences.map((exp) => (
            <article key={`${exp.company}-${exp.period}`} className="experience-row md:grid md:grid-cols-[9rem_1fr] md:gap-8">
              <div className="text-xs font-medium text-ink-tertiary dark:text-ink-tertiary-dark pt-1 mb-2 md:mb-0 whitespace-nowrap">
                {exp.period}
              </div>
              <div>
                <div className="flex items-start gap-3 mb-3">
                  {exp.logoUrl && (
                    <span className="w-9 h-9 rounded-md border border-hairline dark:border-hairline-dark bg-white flex items-center justify-center overflow-hidden shrink-0 mt-0.5">
                      <img src={exp.logoUrl} alt={`${exp.company} logo`} className="w-6 h-6 object-contain" loading="lazy" />
                    </span>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-ink dark:text-ink-dark leading-tight">
                      {exp.role}
                    </h3>
                    <div className="text-sm mt-1">
                      {exp.companyUrl ? (
                        <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="text-link font-medium">
                          {exp.company}
                        </a>
                      ) : (
                        <span className="font-medium text-ink-secondary dark:text-ink-secondary-dark">{exp.company}</span>
                      )}
                      {exp.project && (
                        <span className="text-ink-tertiary dark:text-ink-tertiary-dark"> · {exp.project}</span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-ink-secondary dark:text-ink-secondary-dark leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-hairline dark:border-hairline-dark pt-10 mt-10">
        <h2 className="section-label mb-2">Education</h2>
        <div>
          {education.map((edu) => (
            <div key={edu.name} className="experience-row md:grid md:grid-cols-[9rem_1fr] md:gap-8">
              <div className="text-xs font-medium text-ink-tertiary dark:text-ink-tertiary-dark pt-1 mb-2 md:mb-0 whitespace-nowrap">
                {edu.year}
              </div>
              <div>
                <h3 className="font-semibold text-ink dark:text-ink-dark leading-snug">{edu.name}</h3>
                <div className="text-sm text-ink-secondary dark:text-ink-secondary-dark mt-1">{edu.issuer}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-hairline dark:border-hairline-dark pt-10 mt-10">
        <h2 className="section-label mb-2">Courses & certifications</h2>
        <div>
          {courses.map((cert) => (
            <div key={cert.name} className="experience-row md:grid md:grid-cols-[9rem_1fr] md:gap-8">
              <div className="text-xs font-medium text-ink-tertiary dark:text-ink-tertiary-dark pt-1 mb-2 md:mb-0 whitespace-nowrap">
                {cert.year}
              </div>
              <div>
                <h3 className="font-semibold text-ink dark:text-ink-dark leading-snug">{cert.name}</h3>
                <div className="text-sm text-ink-secondary dark:text-ink-secondary-dark mt-1">{cert.issuer}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Experience;
