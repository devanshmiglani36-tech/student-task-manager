import { MaterialIcon } from '../common/MaterialIcon';

interface KpiGridProps {
  totalCount: number;
  pendingCount: number;
  completedCount: number;
  completionRate: number;
  dueTodayCount: number;
  streakDays: number;
}

export function KpiGrid({
  totalCount,
  pendingCount,
  completedCount,
  completionRate,
  dueTodayCount,
  streakDays,
}: KpiGridProps) {
  return (
    <div className="grid grid-cols-2 gap-space-sm sm:grid-cols-4">
      <div className="flex flex-col justify-between rounded-xl bg-surface-container p-space-md shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant">
            Total Tasks
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container/25 text-primary">
            <MaterialIcon name="assignment" filled className="text-[18px]" />
          </div>
        </div>
        <div className="mt-space-sm flex items-baseline gap-space-xs">
          <span className="font-headline-md text-headline-md text-on-surface">
            {totalCount}
          </span>
          <span className="font-label-sm text-label-sm text-tertiary">
            active sprint
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container p-space-md shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant">
            Pending Tasks
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-container/25 text-secondary">
            <MaterialIcon name="pending_actions" filled className="text-[18px]" />
          </div>
        </div>
        <div className="mt-space-sm flex items-baseline gap-space-xs">
          <span className="font-headline-md text-headline-md text-on-surface">
            {pendingCount}
          </span>
          <span className="font-label-sm text-label-sm text-secondary">
            {dueTodayCount} due today
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container p-space-md shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant">
            Completed
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-tertiary-container/30 text-tertiary">
            <MaterialIcon name="task_alt" filled className="text-[18px]" />
          </div>
        </div>
        <div className="mt-space-sm flex items-baseline gap-space-xs">
          <span className="font-headline-md text-headline-md text-on-surface">
            {completedCount}
          </span>
          <span className="font-label-sm text-label-sm text-tertiary">
            {completionRate}% rate
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-gradient-to-br from-surface-container to-primary-container/20 p-space-md shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant">
            Study Streak
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
            <MaterialIcon
              name="local_fire_department"
              filled
              className="text-[18px]"
            />
          </div>
        </div>
        <div className="mt-space-sm flex items-baseline gap-space-xs">
          <span className="font-headline-md text-headline-md text-on-surface">
            {streakDays} {streakDays === 1 ? 'Day' : 'Days'}
          </span>
          <span className="font-label-sm text-label-sm text-primary">
            On fire!
          </span>
        </div>
      </div>
    </div>
  );
}
