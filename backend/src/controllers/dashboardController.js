import { Task } from '../models/Task.js';
import { formatTask } from '../utils/formatTask.js';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function buildWeeklyProgress(tasks) {
  const counts = [0, 0, 0, 0, 0, 0, 0];
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayOfWeek = (startOfToday.getDay() + 6) % 7; // Mon=0..Sun=6
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - dayOfWeek);

  for (const task of tasks) {
    if (task.status !== 'completed') continue;
    const refDate = task.completedAt || task.updatedAt || task.createdAt;
    if (!refDate) continue;
    const d = new Date(refDate);
    if (d >= startOfWeek) {
      const idx = (d.getDay() + 6) % 7;
      counts[idx] += 1;
    }
  }

  const maxCount = Math.max(1, ...counts);
  return DAY_LABELS.map((day, idx) => ({
    day,
    count: counts[idx],
    height: counts[idx] === 0 ? 16 : Math.max(24, Math.round((counts[idx] / maxCount) * 60)),
    active: counts[idx] > 0,
    highlightLabel: idx === dayOfWeek,
  }));
}

function buildCourseBreakdown(tasks) {
  const byCourse = new Map();
  for (const task of tasks) {
    const entry = byCourse.get(task.course) || { total: 0, completed: 0 };
    entry.total += 1;
    if (task.status === 'completed') entry.completed += 1;
    byCourse.set(task.course, entry);
  }

  return Array.from(byCourse.entries())
    .map(([course, data]) => ({
      course,
      total: data.total,
      completed: data.completed,
      percent: Math.round((data.completed / data.total) * 100),
    }))
    .slice(0, 4);
}

export async function getDashboardSummary(req, res, next) {
  try {
    const userTasks = await Task.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    const pendingTasks = userTasks.filter((t) => t.status === 'pending');
    const completedTasks = userTasks.filter((t) => t.status === 'completed');

    const totalTasks = req.user.historicalCompleted + userTasks.length;
    const completedCount = req.user.historicalCompleted + completedTasks.length;
    const completionRate =
      totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

    const todayIso = new Date().toISOString().slice(0, 10);
    const dueTodayCount = pendingTasks.filter(
      (t) =>
        t.dueDate === todayIso ||
        (t.dueLabel || '').toLowerCase().includes('today') ||
        (t.dueLabel || '').toLowerCase().includes('tonight'),
    ).length;

    return res.status(200).json({
      user: req.user.toPublicJSON(),
      kpis: {
        totalTasks,
        pendingTasks: pendingTasks.length,
        completedTasks: completedCount,
        completionRate,
        dueTodayCount,
        streakDays: req.user.streakDays,
      },
      weeklyProgress: buildWeeklyProgress(userTasks),
      courseBreakdown: buildCourseBreakdown(userTasks),
      pendingPreview: pendingTasks.slice(0, 3).map(formatTask),
      completedPreview: completedTasks.slice(0, 2).map(formatTask),
    });
  } catch (err) {
    return next(err);
  }
}
