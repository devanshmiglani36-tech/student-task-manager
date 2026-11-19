import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MaterialIcon } from '../components/common/MaterialIcon';
import { ToggleSwitch } from '../components/common/ToggleSwitch';
import { AppShell } from '../components/layout/AppShell';
import { useAppContext } from '../context/AppContext';
import { COURSE_OPTIONS } from '../data/initialData';
import { tasksApi } from '../services/api';
import type { TaskCategory, TaskPriority } from '../types/task';

const PRIORITY_OPTIONS: {
  value: TaskPriority;
  label: string;
  dotClass: string;
  activeClass: string;
}[] = [
  {
    value: 'low',
    label: 'Low',
    dotClass: 'bg-tertiary',
    activeClass: 'bg-tertiary-container text-on-tertiary-container shadow-md',
  },
  {
    value: 'medium',
    label: 'Medium',
    dotClass: 'bg-secondary-fixed',
    activeClass: 'bg-secondary-container text-on-secondary-container shadow-md',
  },
  {
    value: 'high',
    label: 'High',
    dotClass: 'bg-error',
    activeClass: 'bg-error-container text-on-error-container shadow-md',
  },
];

const CATEGORY_OPTIONS: { value: TaskCategory; icon: string }[] = [
  { value: 'Assignment', icon: 'assignment' },
  { value: 'Exam Prep', icon: 'psychology' },
  { value: 'Lab', icon: 'science' },
  { value: 'Project', icon: 'rocket_launch' },
];

export function AddTaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, addTask, updateTask, showToast } = useAppContext();

  const editingTask = id ? tasks.find((t) => t.id === id) : undefined;
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(editingTask?.title ?? '');
  const [course, setCourse] = useState(editingTask?.course ?? 'CS 301');
  const [dueDate, setDueDate] = useState(editingTask?.dueDate ?? '2025-10-24');
  const [dueTime, setDueTime] = useState(editingTask?.dueTime ?? '23:59');
  const [priority, setPriority] = useState<TaskPriority>(
    editingTask?.priority ?? 'medium',
  );
  const [category, setCategory] = useState<TaskCategory>(
    editingTask?.category ?? 'Assignment',
  );
  const [notes, setNotes] = useState(editingTask?.notes ?? '');
  const [smartReminder, setSmartReminder] = useState(
    editingTask?.smartReminder ?? true,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setCourse(editingTask.course);
      setDueDate(editingTask.dueDate ?? '2025-10-24');
      setDueTime(editingTask.dueTime ?? '23:59');
      setPriority(editingTask.priority);
      setCategory(editingTask.category);
      setNotes(editingTask.notes ?? '');
      setSmartReminder(editingTask.smartReminder ?? true);
      return;
    }

    if (id) {
      tasksApi
        .get(id)
        .then(({ task }) => {
          setTitle(task.title);
          setCourse(task.course);
          setDueDate(task.dueDate ?? '2025-10-24');
          setDueTime(task.dueTime ?? '23:59');
          setPriority(task.priority);
          setCategory(task.category);
          setNotes(task.notes ?? '');
          setSmartReminder(task.smartReminder ?? true);
        })
        .catch((err) => {
          setErrorMessage(
            err instanceof Error ? err.message : 'Unable to load task.',
          );
        });
    }
  }, [editingTask, id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      titleInputRef.current?.focus();
      setErrorMessage('Please enter a task title.');
      return;
    }

    setErrorMessage(null);
    setIsSaving(true);

    const payload = {
      title,
      course,
      dueDate,
      dueTime,
      priority,
      category,
      notes,
      smartReminder,
    };

    try {
      if (id) {
        await updateTask(id, payload);
        showToast('Task updated!');
      } else {
        await addTask(payload);
        showToast('Task added to your sprint!');
      }
      setSaved(true);
      window.setTimeout(() => {
        navigate('/tasks');
      }, 450);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to save task.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell
      title={id ? 'Edit Task' : 'Add Task Page'}
      showBack
      hideBottomNav
      linkProfile={false}
    >
      <div className="flex w-full flex-col gap-space-md pb-space-xl">
        {/* Top Motivation Strip */}
        <div className="flex items-center justify-between rounded-xl bg-surface-container-low px-space-md py-space-sm shadow-sm">
          <div className="flex min-w-0 items-center gap-space-sm">
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-tertiary" />
            <p className="truncate font-body-sm text-body-sm text-on-surface-variant">
              Lock in your next win — takes 15 seconds
            </p>
          </div>
          <span className="shrink-0 rounded-lg bg-primary-container/20 px-space-sm py-space-xs font-label-sm text-label-sm text-primary">
            Fall ’25
          </span>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-space-md rounded-xl bg-surface-container p-space-md shadow-xl"
        >
          <div className="flex flex-col gap-space-xs">
            <label
              htmlFor="taskTitle"
              className="flex items-center justify-between font-label-lg text-label-lg text-on-surface"
            >
              <span>Task Title</span>
              <span className="font-label-sm text-label-sm text-primary">
                Required
              </span>
            </label>
            <input
              ref={titleInputRef}
              id="taskTitle"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Implement Dijkstra's Algorithm"
              className="w-full rounded-lg bg-surface-container-lowest px-space-md py-space-sm font-body-lg text-body-lg text-on-surface placeholder:text-outline transition-colors focus:bg-surface-container-high focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-space-xs">
            <label
              htmlFor="courseSelect"
              className="font-label-lg text-label-lg text-on-surface"
            >
              Course / Subject
            </label>
            <div className="relative">
              <select
                id="courseSelect"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full appearance-none rounded-lg bg-surface-container-lowest px-space-md py-space-sm pr-10 font-body-md text-body-md text-on-surface transition-colors focus:bg-surface-container-high focus:outline-none"
              >
                {COURSE_OPTIONS.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.code} • {option.name}
                  </option>
                ))}
              </select>
              <MaterialIcon
                name="expand_more"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            <div className="flex min-w-0 flex-col gap-space-xs">
              <label
                htmlFor="dueDate"
                className="font-label-lg text-label-lg text-on-surface"
              >
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg bg-surface-container-lowest px-space-sm py-space-sm font-body-md text-body-md text-on-surface transition-colors [color-scheme:dark] focus:bg-surface-container-high focus:outline-none"
              />
            </div>

            <div className="flex min-w-0 flex-col gap-space-xs">
              <label
                htmlFor="dueTime"
                className="font-label-lg text-label-lg text-on-surface"
              >
                Due Time
              </label>
              <input
                id="dueTime"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full rounded-lg bg-surface-container-lowest px-space-sm py-space-sm font-body-md text-body-md text-on-surface transition-colors [color-scheme:dark] focus:bg-surface-container-high focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-space-xs">
            <span className="font-label-lg text-label-lg text-on-surface">
              Priority
            </span>
            <div className="grid grid-cols-3 gap-space-sm">
              {PRIORITY_OPTIONS.map((opt) => {
                const isActive = priority === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriority(opt.value)}
                    className={`flex items-center justify-center gap-space-xs rounded-lg px-space-sm py-space-sm font-label-md text-label-md transition-all ${
                      isActive
                        ? opt.activeClass
                        : 'bg-surface-container-lowest text-on-surface-variant'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${opt.dotClass}`} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-space-xs">
            <span className="font-label-lg text-label-lg text-on-surface">
              Category
            </span>
            <div className="flex flex-wrap gap-space-sm">
              {CATEGORY_OPTIONS.map((cat) => {
                const isActive = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`flex items-center gap-space-xs rounded-full px-space-md py-space-xs font-label-md text-label-md transition-all ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container shadow-sm'
                        : 'bg-surface-container-lowest text-on-surface-variant'
                    }`}
                  >
                    <MaterialIcon name={cat.icon} className="text-base" />
                    <span>{cat.value}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-space-xs">
            <label
              htmlFor="taskNotes"
              className="flex items-center justify-between font-label-lg text-label-lg text-on-surface"
            >
              <span>Description / Notes</span>
              <span className="font-body-sm text-body-sm text-outline">
                Optional
              </span>
            </label>
            <textarea
              id="taskNotes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add rubric links, chapter pages, or office hours notes..."
              className="w-full resize-none rounded-lg bg-surface-container-lowest px-space-md py-space-sm font-body-md text-body-md text-on-surface placeholder:text-outline transition-colors focus:bg-surface-container-high focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-space-md">
            <div className="flex min-w-0 items-center gap-space-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-container/20 text-primary">
                <MaterialIcon
                  name="notifications_active"
                  filled
                  className="text-xl"
                />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-title-md text-title-md text-on-surface">
                  Smart Reminder
                </span>
                <span className="truncate font-body-sm text-body-sm text-on-surface-variant">
                  {smartReminder
                    ? 'Nudge me 2 hours before due time'
                    : 'Reminders muted for this task'}
                </span>
              </div>
            </div>
            <ToggleSwitch
              checked={smartReminder}
              onToggle={() => setSmartReminder((prev) => !prev)}
              ariaLabel="Toggle smart reminder"
              size="md"
            />
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="rounded-lg bg-error-container px-space-md py-space-sm font-body-sm text-body-sm text-on-error-container"
            >
              {errorMessage}
            </div>
          )}

          <div className="flex items-center gap-space-sm pt-space-xs">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 rounded-lg bg-surface-container-high px-space-md py-3 font-label-lg text-label-lg text-on-surface transition-colors hover:bg-surface-bright"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`flex flex-[2] items-center justify-center gap-space-xs rounded-lg px-space-md py-3 font-label-lg text-label-lg shadow-lg transition-all active:scale-[0.98] disabled:opacity-80 ${
                saved
                  ? 'bg-tertiary-container text-on-tertiary-container'
                  : 'bg-gradient-to-r from-secondary-container to-primary-container text-on-primary-container'
              }`}
            >
              <MaterialIcon
                name={saved ? 'done_all' : 'check_circle'}
                className="text-xl"
              />
              <span>
                {isSaving
                  ? 'Saving...'
                  : saved
                    ? 'Task Saved!'
                    : id
                      ? 'Update Task'
                      : 'Save Task'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
