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

const figures = {
  'friday-test': FridayTestFigure,
  'weekly-template': WeeklyTemplateFigure,
  'monthly-review': MonthlyReviewFigure,
} as const;

export const PostFigure = ({ name }: { name: string }) => {
  const Figure = figures[name as keyof typeof figures];
  return Figure ? <Figure /> : null;
};
