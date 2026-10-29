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

// Strategy share of the listed responsibilities, from the article's 68 job posts.
// Each bar is split at that share, and the split sits on the column divider.
const whoOwnsWhatRows = [
  { role: 'CTO', share: 45, line1: 'Bets, budget,', line2: 'org shape' },
  { role: 'Head', share: 32, line1: 'Plan, hiring,', line2: 'quality bar' },
  { role: 'EM', share: 23, line1: 'Team, priorities,', line2: 'delivery' },
  { role: 'Engineer', share: 14, line1: 'Build, ship,', line2: 'raise risks' },
] as const;

const whoOwnsWhatLabel =
  'CTO, Head of Engineering, Engineering Manager and engineer as bars split between strategy and tactics: 45, 32, 23 and 14 percent strategy. Decisions go down one level at a time; results, risks and ideas go back up.';

// Up arrows (results, risks, ideas) get their own colour, so the two flows
// read apart at a glance; both connect neighbouring levels only.
const realityStroke = 'stroke-amber-700 dark:stroke-amber-400';
const realityFill = 'fill-amber-700 dark:fill-amber-400';
const onAccentFill = 'fill-[var(--color-surface)] dark:fill-[var(--color-surface-dark)]';

const RealityDefs = ({ markerId }: { markerId: string }) => (
  <defs>
    <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" className={realityFill} />
    </marker>
  </defs>
);

const RealityArrow = ({ markerId, d }: { markerId: string; d: string }) => (
  <path d={d} className={realityStroke} strokeDasharray="5 4" markerEnd={`url(#${markerId})`} />
);

const ShareBar = ({ id, x, y, width, height, share }: { id: string; x: number; y: number; width: number; height: number; share: number }) => (
  <g>
    <clipPath id={id}>
      <rect x={x} y={y} width={width} height={height} rx="10" />
    </clipPath>
    <g clipPath={`url(#${id})`} fill="currentColor" stroke="none">
      <rect x={x} y={y} width={width} height={height} opacity="0.12" />
      <rect x={x} y={y} width={(width * share) / 100} height={height} />
    </g>
    <rect x={x} y={y} width={width} height={height} rx="10" />
  </g>
);

// Two drawings of one diagram: the wide one shrinks below readable on a phone,
// so narrow screens get a vertical version with larger text.
export const WhoOwnsWhatFigure = () => (
  <FigureShell title="Decisions flow down, reality flows up, one level at a time. Each bar is one level, split at its share of strategy in 68 job posts from Europe, autumn 2026.">
    <svg viewBox="0 0 360 462" className="sm:hidden">
      <title>{whoOwnsWhatLabel}</title>
      <SvgDefs markerId="who-owns-what-arrow-sm" />
      <RealityDefs markerId="who-owns-what-up-sm" />
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="145" y1="44" x2="145" y2="372" strokeDasharray="4 5" opacity="0.5" />
        {whoOwnsWhatRows.map(({ role, share }, index) => (
          <ShareBar key={role} id={`who-owns-what-bar-sm-${index}`} x={145 - (230 * share) / 100} y={62 + index * 86} width={230} height={48} share={share} />
        ))}
        {[0, 1, 2].map((index) => (
          <g key={index}>
            <Arrow markerId="who-owns-what-arrow-sm" x1={210} y1={113 + index * 86} x2={210} y2={141 + index * 86} />
            <RealityArrow markerId="who-owns-what-up-sm" d={`M240 ${145 + index * 86} L240 ${117 + index * 86}`} />
          </g>
        ))}
        <Arrow markerId="who-owns-what-arrow-sm" x1={8} y1={384} x2={8} y2={402} />
        <RealityArrow markerId="who-owns-what-up-sm" d="M8 428 L8 410" />
      </g>
      <g fontFamily="var(--font-sans)" fill="currentColor">
        <text x="72" y="16" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="1.5">STRATEGY</text>
        <text x="72" y="32" textAnchor="middle" fontSize="12" fontWeight="600">What to do</text>
        <text x="252" y="16" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="1.5">TACTICS · TASKS</text>
        <text x="252" y="32" textAnchor="middle" fontSize="12" fontWeight="600">How to do it</text>
        {whoOwnsWhatRows.map(({ role, share, line1, line2 }, index) => {
          const x = 145 - (230 * share) / 100;
          const y = 62 + index * 86;
          return (
            <g key={role}>
              <text x={x - 6} y={y + 29} textAnchor="end" fontSize="12" fontWeight="700">{role}</text>
              <text x={(x + 145) / 2} y={y + 29} textAnchor="middle" fontSize="13" fontWeight="700" className={onAccentFill}>{share}%</text>
              <text x={145 + (230 - (230 * share) / 100) / 2} y={y + 21} textAnchor="middle" fontSize="11" fontWeight="600">{line1}</text>
              <text x={145 + (230 - (230 * share) / 100) / 2} y={y + 35} textAnchor="middle" fontSize="11" fontWeight="600">{line2}</text>
            </g>
          );
        })}
        <text x="204" y="133" textAnchor="end" fontSize="10" fontWeight="600">the what</text>
        <text x="246" y="133" fontSize="10" fontWeight="600" className={realityFill}>results, risks, ideas</text>
        <text x="22" y="397" fontSize="11">Decisions: the what goes to the level below</text>
        <text x="22" y="423" fontSize="11" className={realityFill}>Reality: results, risks and ideas go up</text>
        <text x="2" y="452" fontSize="10" opacity="0.75">% = share of listed responsibilities that are strategy</text>
      </g>
    </svg>
    <svg viewBox="0 0 760 545" className="hidden sm:block">
      <title>{whoOwnsWhatLabel}</title>
      <SvgDefs markerId="who-owns-what-arrow" />
      <RealityDefs markerId="who-owns-what-up" />
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M130 64 L130 422 L740 422" />
        <line x1="400" y1="64" x2="400" y2="422" strokeDasharray="4 6" opacity="0.5" />
        {whoOwnsWhatRows.map(({ role, share }, index) => (
          <ShareBar key={role} id={`who-owns-what-bar-${index}`} x={400 - (380 * share) / 100} y={86 + index * 88} width={380} height={56} share={share} />
        ))}
        {[0, 1, 2].map((index) => (
          <g key={index}>
            <Arrow markerId="who-owns-what-arrow" x1={470} y1={145 + index * 88} x2={470} y2={169 + index * 88} />
            <RealityArrow markerId="who-owns-what-up" d={`M505 ${173 + index * 88} L505 ${149 + index * 88}`} />
          </g>
        ))}
        <Arrow markerId="who-owns-what-arrow" x1={140} y1={448} x2={140} y2={470} />
        <RealityArrow markerId="who-owns-what-up" d="M140 504 L140 482" />
      </g>
      <g fontFamily="var(--font-sans)" fill="currentColor">
        <text x="265" y="28" textAnchor="middle" fontSize="12" fontWeight="700" letterSpacing="2">STRATEGY</text>
        <text x="265" y="50" textAnchor="middle" fontSize="16" fontWeight="600">What to do</text>
        <text x="570" y="28" textAnchor="middle" fontSize="12" fontWeight="700" letterSpacing="2">TACTICS · TASKS</text>
        <text x="570" y="50" textAnchor="middle" fontSize="16" fontWeight="600">How to do it</text>
        {whoOwnsWhatRows.map(({ role, share, line1, line2 }, index) => {
          const x = 400 - (380 * share) / 100;
          const cy = 114 + index * 88;
          return (
            <g key={role}>
              <text x="116" y={cy + 6} textAnchor="end" fontSize="17" fontWeight="700">{role}</text>
              <text x={(x + 400) / 2} y={cy + 6} textAnchor="middle" fontSize="16" fontWeight="700" className={onAccentFill}>{share}%</text>
              <text x={400 + (380 - (380 * share) / 100) / 2} y={cy - 4} textAnchor="middle" fontSize="13" fontWeight="600">{line1}</text>
              <text x={400 + (380 - (380 * share) / 100) / 2} y={cy + 14} textAnchor="middle" fontSize="13" fontWeight="600">{line2}</text>
            </g>
          );
        })}
        <text x="462" y="162" textAnchor="end" fontSize="12" fontWeight="600">the what</text>
        <text x="513" y="162" fontSize="12" fontWeight="600" className={realityFill}>results, risks, ideas</text>
        <text x="160" y="464" fontSize="13">Decisions: the what goes to the level below</text>
        <text x="160" y="498" fontSize="13" className={realityFill}>Reality: results, risks and ideas go to the level above</text>
        <text x="130" y="534" fontSize="12" opacity="0.75">% = share of the listed responsibilities that are strategy, 68 job posts from Europe, autumn 2026</text>
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
