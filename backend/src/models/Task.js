import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    course: { type: String, required: true, trim: true, maxlength: 40 },
    dueDate: { type: String, trim: true, default: '' },
    dueTime: { type: String, trim: true, default: '23:59' },
    dueLabel: { type: String, trim: true, default: '' },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    category: {
      type: String,
      enum: ['Assignment', 'Exam Prep', 'Lab', 'Project'],
      default: 'Assignment',
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    notes: { type: String, trim: true, default: '', maxlength: 2000 },
    smartReminder: { type: Boolean, default: true },
    completedAt: { type: Date, default: null },
    completedCheckStyle: {
      type: String,
      enum: ['primary', 'tertiary'],
      default: 'tertiary',
    },
  },
  { timestamps: true },
);

taskSchema.index({ userId: 1, status: 1, createdAt: -1 });

export const Task = mongoose.model('Task', taskSchema);
