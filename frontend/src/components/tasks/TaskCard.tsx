import { COURSE_DOT_COLORS } from '../../data/initialData';
import type { CourseColor, TaskItem, TaskPriority } from '../../types/task';
import { MaterialIcon } from '../common/MaterialIcon';

const DOT_BG_MAP: Record<CourseColor, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary',
  'primary-fixed-dim': 'bg-primary-fixed-dim',
};

const COURSE_TEXT_MAP: Record<CourseColor, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  tertiary: 'text-tertiary',
  'primary-fixed-dim': 'text-primary-fixed-dim',
};

const PRIORITY_BADGE_DASHBOARD: Record<
  TaskPriority,
  { label: string; classes: string }
> = {
  high: { label: 'High', classes: 'bg-error-container/40 text-error' },
  medium: {
    label: 'Medium',
    classes: 'bg-secondary-container/30 text-secondary',
  },
  low: { label: 'Low', classes: 'bg-tertiary-container/30 text-tertiary' },
};

const PRIORITY_BADGE_TASKS: Record<
  TaskPriority,
  { label: string; classes: string }
> = {
  high: { label: 'High', classes: 'bg-error-container/50 text-error' },
  medium: {
    label: 'Medium',
    classes: 'bg-secondary-container/40 text-secondary',
  },
  low: {
    label: 'Low',
    classes: 'bg-surface-container-highest text-on-surface-variant',
  },
};

interface TaskCardProps {
  task: TaskItem;
  variant?: 'dashboard' | 'tasks';
  onToggle: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TaskCard({
  task,
  variant = 'tasks',
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const isCompleted = task.status === 'completed';
  const courseColor: CourseColor =
    COURSE_DOT_COLORS[task.course] ?? 'primary';
  const dotClass = DOT_BG_MAP[courseColor];
  const courseTextClass = COURSE_TEXT_MAP[courseColor];
  const priorityInfo =
    variant === 'dashboard'
      ? PRIORITY_BADGE_DASHBOARD[task.priority]
      : PRIORITY_BADGE_TASKS[task.priority];

  const completedCheckClasses =
    task.completedCheckStyle === 'primary' || variant === 'dashboard'
      ? 'bg-primary-container text-on-primary-container'
      : 'bg-tertiary-container text-on-tertiary-container';

  const cardContainerClasses = isCompleted
    ? 'bg-surface-container-low opacity-70'
    : 'bg-surface-container';

  return (
    <article
      className={`group flex items-start rounded-xl p-space-md shadow-sm transition-all duration-200 ${
        variant === 'dashboard' ? 'gap-space-sm' : 'gap-space-md'
      } ${cardContainerClasses}`}
    >
      <button
        type="button"
        aria-label={isCompleted ? 'Mark task pending' : 'Mark task complete'}
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors ${
          isCompleted
            ? completedCheckClasses
            : 'bg-surface-container-highest text-transparent hover:bg-primary-container/60'
        }`}
      >
        <MaterialIcon
          name="check"
          filled={isCompleted}
          className={variant === 'dashboard' ? 'text-[16px]' : 'text-[14px]'}
        />
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-space-xs">
        <div className="flex items-start justify-between gap-space-sm">
          <h3
            className={`font-title-md text-title-md ${
              variant === 'dashboard' ? 'truncate' : 'line-clamp-2'
            } ${
              isCompleted
                ? 'text-on-surface-variant line-through'
                : 'text-on-surface'
            }`}
          >
            {task.title}
          </h3>

          {variant === 'dashboard' ? (
            <span
              className={`shrink-0 rounded-lg px-space-sm py-0.5 font-label-sm text-label-sm ${
                isCompleted
                  ? 'bg-tertiary-container/30 text-tertiary'
                  : priorityInfo.classes
              }`}
            >
              {isCompleted ? 'Done' : priorityInfo.label}
            </span>
          ) : (
            <div className="flex shrink-0 items-center gap-1">
              {!isCompleted && onEdit && (
                <button
                  type="button"
                  aria-label={`Edit ${task.title}`}
                  onClick={() => onEdit(task.id)}
                  className="rounded p-1 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
                >
                  <MaterialIcon name="edit" className="text-[18px]" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  aria-label={`Delete ${task.title}`}
                  onClick={() => onDelete(task.id)}
                  className="rounded p-1 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-error"
                >
                  <MaterialIcon name="delete" className="text-[18px]" />
                </button>
              )}
            </div>
          )}
        </div>

        <div
          className={`flex flex-wrap items-center gap-space-sm ${
            variant === 'tasks' && !isCompleted ? 'mt-space-xs' : ''
          }`}
        >
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg px-space-sm py-0.5 font-label-sm text-label-sm ${
              variant === 'dashboard'
                ? `bg-surface-container-high ${courseTextClass}`
                : isCompleted
                  ? 'bg-surface-container text-on-surface-variant'
                  : 'bg-surface-container-high text-on-surface'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
            {task.course}
          </span>

          {isCompleted ? (
            <span
              className={`inline-flex items-center gap-1 font-body-sm text-body-sm ${
                variant === 'dashboard'
                  ? 'text-on-surface-variant'
                  : task.completedCheckStyle === 'primary'
                    ? 'text-primary'
                    : 'text-tertiary'
              }`}
            >
              {variant === 'tasks' && (
                <MaterialIcon name="check_circle" className="text-[14px]" />
              )}
              {task.dueLabel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
              <MaterialIcon
                name="schedule"
                className={`text-[14px] ${
                  variant === 'tasks' && task.priority === 'high' && task.dueLabel.includes('Tonight')
                    ? 'text-error'
                    : ''
                }`}
              />
              {task.dueLabel}
            </span>
          )}

          {variant === 'tasks' && !isCompleted && (
            <span
              className={`inline-flex items-center gap-1 rounded-lg px-space-sm py-0.5 font-label-sm text-label-sm ${priorityInfo.classes}`}
            >
              {priorityInfo.label}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
