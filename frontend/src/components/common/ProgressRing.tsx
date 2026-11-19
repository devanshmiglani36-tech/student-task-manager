interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  indicatorColor?: string;
  label?: string;
  labelClassName?: string;
}

export function ProgressRing({
  percent,
  size = 48,
  strokeWidth = 4,
  trackColor = '#2d3449',
  indicatorColor = '#7c3aed',
  label,
  labelClassName = 'font-label-sm text-label-sm text-on-surface',
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        className="-rotate-90"
        style={{ width: size, height: size }}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={indicatorColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span className={`absolute ${labelClassName}`}>
        {label ?? `${clamped}%`}
      </span>
    </div>
  );
}
