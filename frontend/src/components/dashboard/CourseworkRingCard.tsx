import { COURSE_DOT_COLORS } from '../../data/initialData';
import type { CourseBreakdownItem, CourseColor } from '../../types/task';
import { ProgressRing } from '../common/ProgressRing';

const TEXT_COLOR_MAP: Record<CourseColor, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  tertiary: 'text-tertiary',
  'primary-fixed-dim': 'text-primary-fixed-dim',
};

const DOT_COLOR_MAP: Record<CourseColor, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary',
  'primary-fixed-dim': 'bg-primary-fixed-dim',
};

interface CourseworkRingCardProps {
  percent: number;
  courses: CourseBreakdownItem[];
}

export function CourseworkRingCard({
  percent,
  courses,
}: CourseworkRingCardProps) {
  return (
    <div className="flex items-center justify-between gap-space-md rounded-xl bg-surface-container-low p-space-sm">
      <ProgressRing
        percent={percent}
        size={80}
        strokeWidth={8}
        trackColor="#2d3449"
        indicatorColor="#7c3aed"
        labelClassName="font-title-md text-title-md text-on-surface"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-space-xs">
        <span className="font-title-md text-title-md text-on-surface">
          Semester Coursework
        </span>
        {courses.length > 0 ? (
          <div className="flex flex-wrap gap-space-xs">
            {courses.map((item) => {
              const color = COURSE_DOT_COLORS[item.course] ?? 'primary';
              return (
                <span
                  key={item.course}
                  className={`inline-flex items-center gap-1 rounded-full bg-surface-container-high px-space-sm py-0.5 font-label-sm text-label-sm ${TEXT_COLOR_MAP[color]}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${DOT_COLOR_MAP[color]}`}
                  />
                  {item.course} • {item.percent}%
                </span>
              );
            })}
          </div>
        ) : (
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Add tasks to track per-course progress.
          </p>
        )}
      </div>
    </div>
  );
}
