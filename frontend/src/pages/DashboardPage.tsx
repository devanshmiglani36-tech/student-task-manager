import { Link } from 'react-router-dom';
import studyWorkspaceImg from '../assets/images/study-workspace.png';
import { MaterialIcon } from '../components/common/MaterialIcon';
import { CourseworkRingCard } from '../components/dashboard/CourseworkRingCard';
import { KpiGrid } from '../components/dashboard/KpiGrid';
import { WeeklyBarChart } from '../components/dashboard/WeeklyBarChart';
import { AppShell } from '../components/layout/AppShell';
import { TaskCard } from '../components/tasks/TaskCard';
import { useAppContext } from '../context/AppContext';

export function DashboardPage() {
  const { tasks, user, dashboardSummary, isTasksLoading, toggleTaskStatus } =
    useAppContext();

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const kpis = dashboardSummary?.kpis ?? {
    totalTasks: (user?.historicalCompleted ?? 0) + tasks.length,
    pendingTasks: pendingTasks.length,
    completedTasks: (user?.historicalCompleted ?? 0) + completedTasks.length,
    completionRate:
      tasks.length === 0
        ? 0
        : Math.round((completedTasks.length / tasks.length) * 100),
    dueTodayCount: 0,
    streakDays: user?.streakDays ?? 1,
  };

  const firstName = user?.name.split(' ')[0] || 'Scholar';

  return (
    <AppShell title="Dashboard">
      <div className="flex w-full flex-col gap-space-md pb-space-lg">
        {/* Hero Welcome Banner */}
        <section className="relative overflow-hidden rounded-xl bg-surface-container p-space-md shadow-md">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-container/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-secondary-container/20 blur-xl" />

          <div className="relative flex items-center justify-between gap-space-sm">
            <div className="flex min-w-0 flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-container/30 px-space-sm py-0.5 font-label-sm text-label-sm text-primary">
                  <MaterialIcon
                    name="auto_awesome"
                    filled
                    className="text-[14px]"
                  />
                  Late-Night Focus
                </span>
              </div>
              <h1 className="truncate font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                Welcome back, {firstName}!
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {kpis.totalTasks === 0
                  ? 'Add your first assignment to kick off this week’s sprint.'
                  : `You’ve crushed ${kpis.completionRate}% of this week’s goals. Keep the momentum going.`}
              </p>
            </div>

            <img
              src={studyWorkspaceImg}
              alt="Study workspace"
              className="h-16 w-16 shrink-0 rounded-xl object-cover shadow-sm"
            />
          </div>
        </section>

        {/* KPI Cards */}
        <KpiGrid
          totalCount={kpis.totalTasks}
          pendingCount={kpis.pendingTasks}
          completedCount={kpis.completedTasks}
          completionRate={kpis.completionRate}
          dueTodayCount={kpis.dueTodayCount}
          streakDays={kpis.streakDays}
        />

        {/* Task Progress Section */}
        <section className="flex flex-col gap-space-sm rounded-xl bg-surface-container p-space-md shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                Task Progress
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Weekly completion &amp; course load
              </p>
            </div>
            <span className="rounded-full bg-surface-container-high px-space-sm py-1 font-label-sm text-label-sm text-secondary">
              This Week
            </span>
          </div>

          <div className="grid grid-cols-1 gap-space-md pt-space-xs md:grid-cols-2">
            <WeeklyBarChart
              bars={dashboardSummary?.weeklyProgress}
              completedTotal={kpis.completedTasks}
            />
            <CourseworkRingCard
              percent={kpis.completionRate}
              courses={dashboardSummary?.courseBreakdown ?? []}
            />
          </div>
        </section>

        {/* Pending Tasks Preview */}
        <section className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Pending Tasks
            </h2>
            <Link
              to="/tasks"
              className="font-label-md text-label-md text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="flex flex-col gap-space-sm">
            {isTasksLoading && tasks.length === 0 ? (
              <div className="rounded-xl bg-surface-container-low p-space-md text-center font-body-sm text-body-sm text-on-surface-variant">
                Loading your tasks...
              </div>
            ) : pendingTasks.length > 0 ? (
              pendingTasks.slice(0, 3).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  variant="dashboard"
                  onToggle={toggleTaskStatus}
                />
              ))
            ) : (
              <div className="rounded-xl bg-surface-container-low p-space-md text-center font-body-sm text-body-sm text-on-surface-variant">
                No pending tasks right now — add one below to start your sprint!
              </div>
            )}
          </div>
        </section>

        {/* Completed Tasks Preview */}
        {completedTasks.length > 0 && (
          <section className="flex flex-col gap-space-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Completed Tasks
            </h2>
            <div className="flex flex-col gap-space-sm">
              {completedTasks.slice(0, 2).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  variant="dashboard"
                  onToggle={toggleTaskStatus}
                />
              ))}
            </div>
          </section>
        )}

        {/* Primary Add CTA */}
        <Link
          to="/add-task"
          className="mt-space-xs flex w-full items-center justify-center gap-space-sm rounded-xl bg-primary-container py-space-md font-label-lg text-label-lg text-on-primary-container shadow-lg transition-transform active:scale-95"
        >
          <MaterialIcon name="add" className="text-[20px]" />
          <span>Add New Task</span>
        </Link>
      </div>
    </AppShell>
  );
}
