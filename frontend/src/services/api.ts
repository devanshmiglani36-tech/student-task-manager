import type { DashboardSummary, TaskCategory, TaskItem, TaskPriority, TaskStatus } from '../types/task';
import type { UserPreferences, UserProfile } from '../types/user';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:5000/api';

const TOKEN_STORAGE_KEY = 'studyflow_auth_token';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getStoredToken(): string | null {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError(
      0,
      'Unable to reach the StudyFlow API server. Please ensure the backend is running.',
    );
  }

  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
  } & T;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.error || `Request failed with status ${response.status}`,
    );
  }

  return data;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface TaskPayload {
  title: string;
  course: string;
  dueDate?: string;
  dueTime?: string;
  dueLabel?: string;
  priority?: TaskPriority;
  category?: TaskCategory;
  status?: TaskStatus;
  notes?: string;
  smartReminder?: boolean;
}

export const authApi = {
  register(payload: {
    name: string;
    email: string;
    major: string;
    password: string;
    university?: string;
  }) {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login(payload: { email: string; password: string; rememberMe?: boolean }) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getMe() {
    return request<{ user: UserProfile }>('/auth/me');
  },

  updateMe(
    payload: Partial<Omit<UserProfile, 'id' | 'email' | 'preferences'>> & {
      preferences?: Partial<UserPreferences>;
    },
  ) {
    return request<{ user: UserProfile }>('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};

export const tasksApi = {
  list(params?: {
    status?: TaskStatus;
    priority?: TaskPriority;
    course?: string;
    search?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.priority) query.set('priority', params.priority);
    if (params?.course) query.set('course', params.course);
    if (params?.search) query.set('search', params.search);
    const suffix = query.toString() ? `?${query.toString()}` : '';
    return request<{
      tasks: TaskItem[];
      stats: {
        total: number;
        pending: number;
        completed: number;
        completionRate: number;
      };
    }>(`/tasks${suffix}`);
  },

  get(id: string) {
    return request<{ task: TaskItem }>(`/tasks/${id}`);
  },

  create(payload: TaskPayload) {
    return request<{ task: TaskItem }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: Partial<TaskPayload>) {
    return request<{ task: TaskItem }>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  remove(id: string) {
    return request<{ message: string; id: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

export const dashboardApi = {
  getSummary() {
    return request<{ user: UserProfile } & DashboardSummary>(
      '/dashboard/summary',
    );
  },
};
