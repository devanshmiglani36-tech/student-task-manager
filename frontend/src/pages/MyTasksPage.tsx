import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../components/common/MaterialIcon';
import { ProgressRing } from '../components/common/ProgressRing';
import { AppShell } from '../components/layout/AppShell';
import { TaskCard } from '../components/tasks/TaskCard';
import { useAppContext } from '../context/AppContext';

type FilterMode = 'all' | 'pending' | 'completed' | 'high' | 'course';

export function MyTasksPage() {
  const navigate = useNavigate();
  const { tasks, isTasksLoading, toggleTaskStatus, deleteTask } = useAppContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterMode>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL');
  const [isCompletedCollapsed, setIsCompletedCollapsed] = useState(false);

  const courses = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.course))),
    [tasks],
  );

  const totalCount = tasks.length;
  const completedTotal = tasks.filter((t) => t.status === 'completed').length;
  const completionPercent =
    totalCount === 0 ? 0 : Math.round((completedTotal / totalCount) * 100);

  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesSearch =
        !q ||
        task.title.toLowerCase().includes(q) ||
        task.course.toLowerCase().includes(q);
      if (!matchesSearch) return false;

      if (activeFilter === 'pending') return task.status === 'pending';
      if (activeFilter === 'completed') return task.status === 'completed';
      if (activeFilter === 'high') return task.priority === 'high';
      if (activeFilter === 'course' && selectedCourse !== 'ALL') {
        return task.course === selectedCourse;
      }
      return true;
    });
  }, [tasks, searchQuery, activeFilter, selectedCourse]);

  const visiblePending = filteredTasks.filter((t) => t.status === 'pending');
  const visibleCompleted = filteredTasks.filter((t) => t.status === 'completed');

  const handleSelectFilter = (filter: FilterMode) => {
    setActiveFilter(filter);
    if (filter !== 'course') {
      setSelectedCourse('ALL');
    }
  };

  return (
    <AppShell title="My Tasks Page">
      <div className="flex w-full flex-col gap-space-md pb-space-lg">
        {/* Momentum & Quick Action Strip */}
        <div className="flex items-center justify-between gap-space-sm rounded-xl bg-surface-container p-space-md shadow-md">
          <div className="flex min-w-0 items-center gap-space-md">
            <ProgressRing
              percent={completionPercent}
              size={48}
              strokeWidth={4}
              trackColor="#2d3449"
              indicatorColor="#4edea3"
            />
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-title-md text-title-md text-on-surface">
                Late-Night Momentum
              </span>
              <span className="truncate font-body-sm text-body-sm text-on-surface-variant">
                {completedTotal} of {totalCount} tasks knocked out
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/add-task')}
            className="flex shrink-0 items-center gap-space-xs rounded-lg bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-sm transition-colors hover:bg-inverse-primary"
          >
            <MaterialIcon name="add" className="text-[18px]" />
            <span>New Task</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex w-full items-center rounded-xl bg-surface-container-low px-space-md py-space-sm shadow-sm">
          <MaterialIcon
            name="search"
            className="mr-space-sm shrink-0 text-[20px] text-on-surface-variant"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assignments, exams, or courses..."
            className="min-w-0 w-full bg-transparent font-body-md text-body-md text-on-surface placeholder-on-surface-variant focus:outline-none"
          />
          {searchQuery.length > 0 && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchQuery('')}
              className="ml-space-xs shrink-0 text-on-surface-variant hover:text-on-surface"
            >
              <MaterialIcon name="close" className="text-[18px]" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm overflow-x-auto pb-space-xs">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'pending', label: 'Pending' },
                { id: 'completed', label: 'Completed' },
              ] as const
            ).map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => handleSelectFilter(pill.id)}
                className={`shrink-0 rounded-full px-space-md py-space-xs font-label-md text-label-md transition-colors ${
                  activeFilter === pill.id
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {pill.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handleSelectFilter('high')}
              className={`flex shrink-0 items-center gap-1 rounded-full px-space-md py-space-xs font-label-md text-label-md transition-colors ${
                activeFilter === 'high'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-error" />
              <span>High Priority</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectFilter('course')}
              className={`flex shrink-0 items-center gap-1 rounded-full px-space-md py-space-xs font-label-md text-label-md transition-colors ${
                activeFilter === 'course'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <MaterialIcon name="school" className="text-[14px]" />
              <span>By Course</span>
            </button>
          </div>

          {activeFilter === 'course' && courses.length > 0 && (
            <div className="flex items-center gap-space-xs overflow-x-auto pb-space-xs">
              <button
                type="button"
                onClick={() => setSelectedCourse('ALL')}
                className={`shrink-0 rounded-lg px-space-sm py-1 font-label-sm text-label-sm transition-colors ${
                  selectedCourse === 'ALL'
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
              >
                All Courses
              </button>
              {courses.map((course) => (
                <button
                  key={course}
                  type="button"
                  onClick={() => setSelectedCourse(course)}
                  className={`shrink-0 rounded-lg px-space-sm py-1 font-label-sm text-label-sm transition-colors ${
                    selectedCourse === course
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pending Tasks Section */}
        {visiblePending.length > 0 && (
          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between px-space-xs">
              <div className="flex items-center gap-space-sm">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Pending Tasks
                </h2>
                <span className="rounded-full bg-primary-container/30 px-space-sm py-0.5 font-label-sm text-label-sm text-primary">
                  {visiblePending.length}
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Sorted by newest
              </span>
            </div>

            <div className="flex flex-col gap-space-sm">
              {visiblePending.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  variant="tasks"
                  onToggle={toggleTaskStatus}
                  onEdit={(id) => navigate(`/edit-task/${id}`)}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          </section>
        )}

        {/* Completed Tasks Section */}
        {visibleCompleted.length > 0 && (
          <section className="mt-space-xs flex flex-col gap-space-sm">
            <button
              type="button"
              onClick={() => setIsCompletedCollapsed((prev) => !prev)}
              className="group flex w-full items-center justify-between px-space-xs py-space-xs text-left"
            >
              <div className="flex items-center gap-space-sm">
                <h2 className="font-headline-sm text-headline-sm text-on-surface-variant transition-colors group-hover:text-on-surface">
                  Completed Tasks
                </h2>
                <span className="rounded-full bg-tertiary-container/40 px-space-sm py-0.5 font-label-sm text-label-sm text-tertiary">
                  {visibleCompleted.length}
                </span>
              </div>
              <MaterialIcon
                name="expand_more"
                className={`text-on-surface-variant transition-transform duration-200 ${
                  isCompletedCollapsed ? '-rotate-90' : 'rotate-0'
                }`}
              />
            </button>

            {!isCompletedCollapsed && (
              <div className="flex flex-col gap-space-sm">
                {visibleCompleted.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    variant="tasks"
                    onToggle={toggleTaskStatus}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Loading or Empty State */}
        {isTasksLoading && tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-space-sm rounded-xl bg-surface-container-low p-space-xl text-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary-container border-t-transparent" />
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Loading tasks from MongoDB...
            </p>
          </div>
        ) : (
          filteredTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-space-sm rounded-xl bg-surface-container-low p-space-xl text-center">
              <MaterialIcon name="task_alt" className="text-[40px] text-primary" />
              <p className="font-title-md text-title-md text-on-surface">
                {tasks.length === 0
                  ? 'No tasks yet'
                  : 'No matching tasks found'}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {tasks.length === 0
                  ? 'Tap "+ New Task" above to add your first assignment.'
                  : 'Try clearing your search or switching filter pills.'}
              </p>
            </div>
          )
        )}
      </div>
    </AppShell>
  );
}
