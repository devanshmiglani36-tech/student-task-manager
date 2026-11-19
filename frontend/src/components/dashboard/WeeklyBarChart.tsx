import type { WeeklyBarPoint } from '../../types/task';

const EMPTY_WEEK: WeeklyBarPoint[] = [
  { day: 'Mon', count: 0, height: 16, active: false, highlightLabel: false },
  { day: 'Tue', count: 0, height: 16, active: false, highlightLabel: false },
  { day: 'Wed', count: 0, height: 16, active: false, highlightLabel: false },
  { day: 'Thu', count: 0, height: 16, active: false, highlightLabel: false },
  { day: 'Fri', count: 0, height: 16, active: false, highlightLabel: false },
  { day: 'Sat', count: 0, height: 16, active: false, highlightLabel: false },
  { day: 'Sun', count: 0, height: 16, active: false, highlightLabel: false },
];

interface WeeklyBarChartProps {
  bars?: WeeklyBarPoint[];
  completedTotal: number;
}

export function WeeklyBarChart({
  bars = EMPTY_WEEK,
  completedTotal,
}: WeeklyBarChartProps) {
  const displayBars = bars.length === 7 ? bars : EMPTY_WEEK;

  return (
    <div className="flex flex-col gap-space-xs rounded-xl bg-surface-container-low p-space-sm">
      <div className="flex items-center justify-between px-space-xs">
        <span className="font-label-md text-label-md text-on-surface-variant">
          Daily Tasks Completed
        </span>
        <span className="font-label-sm text-label-sm text-primary">
          {completedTotal} total
        </span>
      </div>

      <svg
        aria-label="Weekly task completion bar chart"
        className="h-24 w-full overflow-visible"
        viewBox="0 0 280 96"
      >
        <defs>
          <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#d2bbff" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        {displayBars.map((bar, idx) => {
          const x = 12 + idx * 38;
          const y = 76 - bar.height;
          return (
            <g key={bar.day}>
              <rect
                x={x}
                y={y}
                width={20}
                height={bar.height}
                rx={4}
                fill={bar.active ? 'url(#barGrad)' : '#2d3449'}
              />
              <text
                x={x + 10}
                y={90}
                fill={bar.highlightLabel ? '#dae2fd' : '#958da1'}
                fontFamily="Geist, sans-serif"
                fontSize={10}
                fontWeight={bar.highlightLabel ? 600 : 400}
                textAnchor="middle"
              >
                {bar.day}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
