const Experience = () => {
  const experiences = [
    {
      role: 'Engineering Manager',
      company: 'Headway Inc.',
      project: 'Headway app',
      companyUrl: 'https://makeheadway.com',
      logoUrl: '/logos/headway.jpeg',
      period: 'Feb 2025 – Present',
      description: 'Led a cross-functional team of eight engineers at Foundation, enhancing iOS and Android clients. Implemented a machine learning recommendation system to personalize interactions. Released AI paywalls for optimal pricing suggestions. Led initiatives to improve user experience and reduce technical debt.',
    },
    {
      role: 'Engineering Manager',
      company: 'MacPaw',
      project: 'Setapp and Setapp Mobile for iOS',
      companyUrl: 'https://macpaw.com',
      logoUrl: '/logos/macpaw_logo.jpeg',
      period: 'Oct 2022 – Nov 2024',
      description: 'Released Setapp Mobile for iOS, the EU\'s first alternative app marketplace. Ensured 100% of releases matched the deadlines. Improved AI Assistance and Smart Search feature availability to 95% and optimized response time to 0.2 sec. Hired, built, and managed cross-functional teams for Desktop (9 engineers) and Mobile (5 engineers). Streamlined release processes, reducing time by 2.5x.',
    },
    {
      role: 'Area Lead / Senior QA Engineer',
      company: 'MacPaw',
      project: 'Setapp',
      companyUrl: 'https://macpaw.com',
      logoUrl: '/logos/macpaw_logo.jpeg',
      period: 'Apr 2020 – Oct 2022',
      description: 'Managed a team of five QA engineers, ensuring transparent promotion processes and creating development plans. As an engineer, implemented integration testing reducing bugs by ~30%, and created comprehensive UI, functional, and backend tests in JavaScript and Kotlin.',
    },
    {
      role: 'QA Engineer',
      company: 'MacPaw',
      project: 'Setapp',
      companyUrl: 'https://macpaw.com',
      logoUrl: '/logos/macpaw_logo.jpeg',
      period: 'Jul 2019 – Mar 2020',
      description: 'Responsible for testing and releases of the B2C web cabinet. Created and maintained UI and functional tests using JavaScript and WebdriverIO.',
    },
    {
      role: 'Automation Test Engineer',
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
      issuer: 'National Technical University of Ukraine "KPI"',
      year: '2008 – 2010',
    },
    {
      name: 'Bachelor\'s in Metrology and Information Technology',
      issuer: 'National Technical University of Ukraine "KPI"',
      year: '2004 – 2008',
    }
  ];

  const courses = [
    {
      name: 'Engineering Manager',
      issuer: 'RobotDreams',
      year: '2024 - 2025',
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
    <div className="space-y-4">
      <section className="experience-section py-12 md:py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 transition-colors">Working Experience</h2>
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-8 md:pl-0">
              <div className="md:hidden absolute left-0 top-2 w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
              <div className="hidden md:block absolute left-[10.5rem] top-2 w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full z-10"></div>
              <div className="hidden md:block absolute left-[10.8rem] top-0 bottom-[-2rem] w-px bg-gray-200 dark:bg-gray-700 transition-colors"></div>
              
              <div className="md:grid md:grid-cols-[10rem_1fr] md:gap-8 items-start">
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 md:mb-0 md:text-right pt-1 transition-colors whitespace-nowrap">
                  {exp.period}
                </div>
                <div className="experience-card">
                  <div className="flex items-start gap-4 mb-4">
                    {exp.logoUrl && (
                      exp.companyUrl ? (
                        <a 
                          href={exp.companyUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-12 h-12 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden shrink-0 mt-1 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                          aria-label={`Visit ${exp.company} website`}
                        >
                          <img src={exp.logoUrl} alt={`${exp.company} logo`} className="w-8 h-8 object-contain" />
                        </a>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden shrink-0 mt-1">
                          <img src={exp.logoUrl} alt={`${exp.company} logo`} className="w-8 h-8 object-contain" />
                        </div>
                      )
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white leading-tight">{exp.role}</h3>
                      <div className="text-blue-600 dark:text-blue-400 font-medium mt-1.5">{exp.company}</div>
                      {exp.project && (
                        <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-0.5">{exp.project}</div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 md:py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 transition-colors">Education</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {education.map((edu, index) => (
            <div key={index} className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col h-full transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/80">
              <div className="text-3xl mb-4">🎓</div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{edu.name}</h3>
              <div className="mt-auto">
                <div className="text-gray-600 dark:text-gray-400 text-sm">{edu.issuer}</div>
                <div className="text-gray-400 dark:text-gray-500 text-sm font-medium mt-1">{edu.year}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 md:py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 transition-colors">Courses & Certifications</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((cert, index) => (
            <div key={index} className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col h-full transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/80">
              <div className="text-3xl mb-4">📜</div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{cert.name}</h3>
              <div className="mt-auto">
                <div className="text-gray-600 dark:text-gray-400 text-sm">{cert.issuer}</div>
                <div className="text-gray-400 dark:text-gray-500 text-sm font-medium mt-1">{cert.year}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Experience;
