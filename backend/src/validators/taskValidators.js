import { z } from 'zod';

const priorityEnum = z.enum(['low', 'medium', 'high']);
const categoryEnum = z.enum(['Assignment', 'Exam Prep', 'Lab', 'Project']);
const statusEnum = z.enum(['pending', 'completed']);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Task title is required').max(200),
  course: z.string().trim().min(1, 'Course is required').max(40),
  dueDate: z.string().trim().max(30).optional().default(''),
  dueTime: z.string().trim().max(20).optional().default('23:59'),
  dueLabel: z.string().trim().max(80).optional(),
  priority: priorityEnum.optional().default('medium'),
  category: categoryEnum.optional().default('Assignment'),
  status: statusEnum.optional().default('pending'),
  notes: z.string().trim().max(2000).optional().default(''),
  smartReminder: z.boolean().optional().default(true),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, 'Task title cannot be empty').max(200).optional(),
    course: z.string().trim().min(1, 'Course cannot be empty').max(40).optional(),
    dueDate: z.string().trim().max(30).optional(),
    dueTime: z.string().trim().max(20).optional(),
    dueLabel: z.string().trim().max(80).optional(),
    priority: priorityEnum.optional(),
    category: categoryEnum.optional(),
    status: statusEnum.optional(),
    notes: z.string().trim().max(2000).optional(),
    smartReminder: z.boolean().optional(),
    completedCheckStyle: z.enum(['primary', 'tertiary']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });
