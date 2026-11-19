import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { formatDueLabel, formatTask } from '../utils/formatTask.js';

export async function listTasks(req, res, next) {
  try {
    const { status, priority, course, category, search } = req.query;
    const query = { userId: req.user._id };

    if (status === 'pending' || status === 'completed') {
      query.status = status;
    }
    if (priority === 'low' || priority === 'medium' || priority === 'high') {
      query.priority = priority;
    }
    if (typeof course === 'string' && course.trim()) {
      query.course = course.trim();
    }
    if (typeof category === 'string' && category.trim()) {
      query.category = category.trim();
    }
    if (typeof search === 'string' && search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      query.$or = [{ title: regex }, { course: regex }];
    }

    const docs = await Task.find(query).sort({ createdAt: -1 });
    const allUserTasks = await Task.find({ userId: req.user._id }).select(
      'status',
    );

    const total = allUserTasks.length;
    const completed = allUserTasks.filter((t) => t.status === 'completed').length;
    const pending = total - completed;

    return res.status(200).json({
      tasks: docs.map(formatTask),
      stats: {
        total,
        pending,
        completed,
        completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
      },
    });
  } catch (err) {
    return next(err);
  }
}

export async function getTask(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await Task.findOne({ _id: id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json({ task: formatTask(task) });
  } catch (err) {
    return next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const body = req.validatedBody;
    const isCompleted = body.status === 'completed';

    const task = await Task.create({
      userId: req.user._id,
      title: body.title,
      course: body.course,
      dueDate: body.dueDate,
      dueTime: body.dueTime,
      dueLabel:
        body.dueLabel ||
        (isCompleted
          ? 'Done Today'
          : formatDueLabel(body.dueDate, body.dueTime)),
      priority: body.priority,
      category: body.category,
      status: body.status,
      notes: body.notes,
      smartReminder: body.smartReminder,
      completedAt: isCompleted ? new Date() : null,
    });

    return res.status(201).json({ task: formatTask(task) });
  } catch (err) {
    return next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await Task.findOne({ _id: id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updates = req.validatedBody;
    const prevStatus = task.status;

    const editableFields = [
      'title',
      'course',
      'dueDate',
      'dueTime',
      'dueLabel',
      'priority',
      'category',
      'status',
      'notes',
      'smartReminder',
      'completedCheckStyle',
    ];

    for (const field of editableFields) {
      if (updates[field] !== undefined) {
        task[field] = updates[field];
      }
    }

    if (updates.status && updates.status !== prevStatus) {
      if (updates.status === 'completed') {
        task.completedAt = new Date();
        if (!updates.dueLabel) {
          task.dueLabel = 'Done Today';
        }
      } else {
        task.completedAt = null;
        if (!updates.dueLabel) {
          task.dueLabel = formatDueLabel(task.dueDate, task.dueTime);
        }
      }
    } else if (
      (updates.dueDate !== undefined || updates.dueTime !== undefined) &&
      task.status === 'pending' &&
      !updates.dueLabel
    ) {
      task.dueLabel = formatDueLabel(task.dueDate, task.dueTime);
    }

    await task.save();
    return res.status(200).json({ task: formatTask(task) });
  } catch (err) {
    return next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const deleted = await Task.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json({ message: 'Task deleted', id });
  } catch (err) {
    return next(err);
  }
}
