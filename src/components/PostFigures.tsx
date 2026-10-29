import type { ReactNode } from 'react';

const FigureShell = ({ title, children }: { title: string; children: ReactNode }) => (
  <figure className="article-figure" aria-label={title}>
    {children}
    <figcaption>{title}</figcaption>
  </figure>
);

const Arrow = ({
  markerId,
  x1,
  y1,
  x2,
  y2,
}: {
  markerId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) => (
  <line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke="currentColor"
    strokeWidth="1.5"
    markerEnd={`url(#${markerId})`}
  />
);

const SvgDefs = ({ markerId }: { markerId: string }) => (
  <defs>
    <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
    </marker>
  </defs>
);

export const FridayTestFigure = () => (
  <FigureShell title="The Friday Test turns task intake into a short outcome check.">
    <svg viewBox="0 0 760 260" role="img">
      <SvgDefs markerId="friday-test-arrow" />
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="34" y="82" width="156" height="74" rx="10" />
        <rect x="302" y="62" width="156" height="114" rx="10" />
        <rect x="574" y="34" width="132" height="58" rx="10" />
        <rect x="574" y="104" width="132" height="58" rx="10" />
        <rect x="574" y="174" width="132" height="58" rx="10" />
        <Arrow markerId="friday-test-arrow" x1={190} y1={119} x2={294} y2={119} />
        <Arrow markerId="friday-test-arrow" x1={458} y1={96} x2={566} y2={66} />
        <Arrow markerId="friday-test-arrow" x1={458} y1={119} x2={566} y2={133} />
        <Arrow markerId="friday-test-arrow" x1={458} y1={142} x2={566} y2={203} />
      </g>
      <g fontFamily="var(--font-sans)" fill="currentColor">
        <text x="112" y="112" textAnchor="middle" fontSize="16" fontWeight="600">Task appears</text>
        <text x="112" y="134" textAnchor="middle" fontSize="13">request, idea, bug</text>
        <text x="380" y="103" textAnchor="middle" fontSize="16" fontWeight="600">Friday sentence?</text>
        <text x="380" y="128" textAnchor="middle" fontSize="13">Can I name the</text>
        <text x="380" y="146" textAnchor="middle" fontSize="13">outcome clearly?</text>
        <text x="640" y="69" textAnchor="middle" fontSize="15" fontWeight="600">Do it</text>
        <text x="640" y="139" textAnchor="middle" fontSize="15" fontWeight="600">Reframe it</text>
        <text x="640" y="209" textAnchor="middle" fontSize="15" fontWeight="600">Drop it</text>
      </g>
    </svg>
  </FigureShell>
);

export const WeeklyTemplateFigure = () => (
  <FigureShell title="A weekly entry captures impact, blockers, and learning while context is fresh.">
    <svg viewBox="0 0 760 300" role="img">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="54" y="34" width="652" height="232" rx="12" />
        <line x1="54" y1="88" x2="706" y2="88" />
        <line x1="380" y1="88" x2="380" y2="266" />
        <line x1="54" y1="177" x2="706" y2="177" />
      </g>
      <g fontFamily="var(--font-sans)" fill="currentColor">
        <text x="84" y="68" fontSize="16" fontWeight="700">Weekly changelog</text>
        <text x="84" y="126" fontSize="15" fontWeight="600">Highlights</text>
        <text x="84" y="151" fontSize="13">What shipped, improved, or was canceled?</text>
        <text x="410" y="126" fontSize="15" fontWeight="600">Impact</text>
        <text x="410" y="151" fontSize="13">Product, team, organization, community, self</text>
        <text x="84" y="215" fontSize="15" fontWeight="600">Blockers</text>
        <text x="84" y="240" fontSize="13">What needs help next week?</text>
        <text x="410" y="215" fontSize="15" fontWeight="600">Weekly mirror</text>
        <text x="410" y="240" fontSize="13">What worked, what changed, what to try?</text>
      </g>
    </svg>
  </FigureShell>
);

export const MonthlyReviewFigure = () => (
  <FigureShell title="Monthly review turns weekly evidence into growth opportunities.">
    <svg viewBox="0 0 760 260" role="img">
      <SvgDefs markerId="monthly-review-arrow" />
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="42" y="48" width="164" height="62" rx="10" />
        <rect x="42" y="150" width="164" height="62" rx="10" />
        <rect x="304" y="78" width="154" height="104" rx="10" />
        <rect x="566" y="48" width="150" height="62" rx="10" />
        <rect x="566" y="150" width="150" height="62" rx="10" />
        <Arrow markerId="monthly-review-arrow" x1={206} y1={79} x2={296} y2={107} />
        <Arrow markerId="monthly-review-arrow" x1={206} y1={181} x2={296} y2={153} />
        <Arrow markerId="monthly-review-arrow" x1={458} y1={107} x2={558} y2={79} />
        <Arrow markerId="monthly-review-arrow" x1={458} y1={153} x2={558} y2={181} />
      </g>
      <g fontFamily="var(--font-sans)" fill="currentColor">
        <text x="124" y="84" textAnchor="middle" fontSize="15" fontWeight="600">Week 1-2</text>
        <text x="124" y="186" textAnchor="middle" fontSize="15" fontWeight="600">Week 3-4</text>
        <text x="381" y="119" textAnchor="middle" fontSize="15" fontWeight="600">Evidence</text>
        <text x="381" y="143" textAnchor="middle" fontSize="13">patterns and gaps</text>
        <text x="641" y="84" textAnchor="middle" fontSize="15" fontWeight="600">Growth signal</text>
        <text x="641" y="186" textAnchor="middle" fontSize="15" fontWeight="600">Next work</text>
      </g>
    </svg>
  </FigureShell>
);

const whoOwnsWhatRows = [
  { role: 'CTO', line1: 'Bets, budget,', line2: 'org shape', cx: 249, cy: 115, x: 2 },
  { role: 'Head', line1: 'Plan, hiring,', line2: 'quality bar', cx: 294, cy: 205, x: 46 },
  { role: 'EM', line1: 'Team, priorities,', line2: 'delivery', cx: 507, cy: 295, x: 96 },
  { role: 'Engineer', line1: 'Build, ship,', line2: 'raise risks', cx: 614, cy: 385, x: 140 },
] as const;

const whoOwnsWhatLabel =
  'CTO, Head of Engineering, Engineering Manager and engineer on a staircase from strategy to tactics and tasks. Decisions go down one level at a time; results, risks and ideas go back up.';

// Two drawings of one diagram: the wide one shrinks below readable on a phone,
// so narrow screens get a vertical version with larger text.
export const WhoOwnsWhatFigure = () => (
  <FigureShell title="Decisions flow down, reality flows up: each level decides the what for the level below and brings results, risks and ideas to the level above.">
    <svg viewBox="0 0 360 455" className="sm:hidden">
      <title>{whoOwnsWhatLabel}</title>
      <SvgDefs markerId="who-owns-what-arrow-sm" />
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        {whoOwnsWhatRows.map(({ role, x }, index) => (
          <rect key={role} x={x} y={60 + index * 90} width="180" height="60" rx="12" />
        ))}
        <Arrow markerId="who-owns-what-arrow-sm" x1={120} y1={120} x2={120} y2={146} />
        <Arrow markerId="who-owns-what-arrow-sm" x1={170} y1={210} x2={170} y2={236} />
        <Arrow markerId="who-owns-what-arrow-sm" x1={220} y1={300} x2={220} y2={326} />
        <path d="M320 360 L346 360 L346 90 L186 90" strokeDasharray="6 6" markerEnd="url(#who-owns-what-arrow-sm)" />
        <line x1="2" y1="410" x2="36" y2="410" />
        <line x1="2" y1="438" x2="36" y2="438" strokeDasharray="6 6" />
      </g>
      <g fontFamily="var(--font-sans)" fill="currentColor">
        <text x="2" y="18" fontSize="11" fontWeight="700" letterSpacing="1.5">STRATEGY</text>
        <text x="2" y="36" fontSize="13" fontWeight="600">What to do</text>
        <text x="358" y="18" textAnchor="end" fontSize="11" fontWeight="700" letterSpacing="1.5">TACTICS · TASKS</text>
        <text x="358" y="36" textAnchor="end" fontSize="13" fontWeight="600">How to do it</text>
        {whoOwnsWhatRows.map(({ role, line1, line2, x }, index) => (
          <g key={role}>
            <text x={x + 90} y={84 + index * 90} textAnchor="middle" fontSize="15" fontWeight="700">{role}</text>
            <text x={x + 90} y={104 + index * 90} textAnchor="middle" fontSize="12">{`${line1} ${line2}`}</text>
          </g>
        ))}
        <text x="44" y="414" fontSize="12">Decisions: the what goes to the level below</text>
        <text x="44" y="442" fontSize="12">Reality: results, risks and ideas go up</text>
      </g>
    </svg>
    <svg viewBox="0 0 760 510" className="hidden sm:block">
      <title>{whoOwnsWhatLabel}</title>
      <SvgDefs markerId="who-owns-what-arrow" />
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="405" y1="64" x2="405" y2="430" strokeDasharray="4 6" opacity="0.5" />
        <path d="M130 64 L130 430 L716 430" />
        {whoOwnsWhatRows.map(({ role, cx, cy }) => (
          <rect key={role} x={cx - 80} y={cy - 28} width="160" height="56" rx="12" />
        ))}
        <Arrow markerId="who-owns-what-arrow" x1={270} y1={143} x2={270} y2={171} />
        <path d="M374 205 L490 205 L490 261" markerEnd="url(#who-owns-what-arrow)" />
        <Arrow markerId="who-owns-what-arrow" x1={560} y1={323} x2={560} y2={351} />
        <path d="M694 385 L736 385 L736 115 L337 115" strokeDasharray="6 6" markerEnd="url(#who-owns-what-arrow)" />
        <line x1="130" y1="465" x2="170" y2="465" />
        <line x1="130" y1="493" x2="170" y2="493" strokeDasharray="6 6" />
      </g>
      <g fontFamily="var(--font-sans)" fill="currentColor">
        <text x="267" y="28" textAnchor="middle" fontSize="12" fontWeight="700" letterSpacing="2">STRATEGY</text>
        <text x="267" y="50" textAnchor="middle" fontSize="16" fontWeight="600">What to do</text>
        <text x="562" y="28" textAnchor="middle" fontSize="12" fontWeight="700" letterSpacing="2">TACTICS · TASKS</text>
        <text x="562" y="50" textAnchor="middle" fontSize="16" fontWeight="600">How to do it</text>
        {whoOwnsWhatRows.map(({ role, line1, line2, cx, cy }) => (
          <g key={role}>
            <text x="116" y={cy + 6} textAnchor="end" fontSize="17" fontWeight="700">{role}</text>
            <text x={cx} y={cy - 4} textAnchor="middle" fontSize="13" fontWeight="600">{line1}</text>
            <text x={cx} y={cy + 14} textAnchor="middle" fontSize="13" fontWeight="600">{line2}</text>
          </g>
        ))}
        <text x="182" y="470" fontSize="13">Decisions: the what goes to the level below</text>
        <text x="182" y="498" fontSize="13">Reality: results, risks and ideas go to the level above</text>
      </g>
    </svg>
  </FigureShell>
);

const figures = {
  'friday-test': FridayTestFigure,
  'weekly-template': WeeklyTemplateFigure,
  'monthly-review': MonthlyReviewFigure,
  'who-owns-what': WhoOwnsWhatFigure,
} as const;

export const PostFigure = ({ name }: { name: string }) => {
  const Figure = figures[name as keyof typeof figures];
  return Figure ? <Figure /> : null;
};
