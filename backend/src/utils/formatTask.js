export function formatDueLabel(dueDate, dueTime = '23:59') {
  if (!dueDate) return 'Upcoming';
  const parsed = new Date(`${dueDate}T${dueTime || '23:59'}`);
  if (Number.isNaN(parsed.getTime())) return dueDate;

  const datePart = parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const timePart = parsed.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${datePart}, ${timePart}`;
}

export function formatTask(doc) {
  return {
    id: String(doc._id),
    title: doc.title,
    course: doc.course,
    dueDate: doc.dueDate || '',
    dueTime: doc.dueTime || '23:59',
    dueLabel:
      doc.dueLabel ||
      (doc.status === 'completed'
        ? 'Done Today'
        : formatDueLabel(doc.dueDate, doc.dueTime)),
    priority: doc.priority,
    category: doc.category,
    status: doc.status,
    notes: doc.notes || '',
    smartReminder: Boolean(doc.smartReminder),
    completedAt: doc.completedAt || null,
    completedCheckStyle: doc.completedCheckStyle || 'tertiary',
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
