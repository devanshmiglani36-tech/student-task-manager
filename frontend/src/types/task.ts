export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed';
export type TaskCategory = 'Assignment' | 'Exam Prep' | 'Lab' | 'Project';

export type CourseColor = 'primary' | 'secondary' | 'tertiary' | 'primary-fixed-dim';

export interface CourseOption {
  code: string;
  name: string;
  color: CourseColor;
}

export interface TaskItem {
  id: string;
  title: string;
  course: string;
  dueLabel: string;
  dueDate?: string;
  dueTime?: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  notes?: string;
  smartReminder?: boolean;
  completedAt?: string | null;
  completedCheckStyle?: 'primary' | 'tertiary';
}

export interface WeeklyBarPoint {
  day: string;
  count: number;
  height: number;
  active: boolean;
  highlightLabel: boolean;
}

export interface CourseBreakdownItem {
  course: string;
  total: number;
  completed: number;
  percent: number;
}

export interface DashboardKpis {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  completionRate: number;
  dueTodayCount: number;
  streakDays: number;
}

export interface DashboardSummary {
  kpis: DashboardKpis;
  weeklyProgress: WeeklyBarPoint[];
  courseBreakdown: CourseBreakdownItem[];
  pendingPreview: TaskItem[];
  completedPreview: TaskItem[];
}
