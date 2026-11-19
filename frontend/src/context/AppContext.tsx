import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  ApiError,
  authApi,
  dashboardApi,
  getStoredToken,
  setStoredToken,
  tasksApi,
} from '../services/api';
import type {
  DashboardSummary,
  TaskCategory,
  TaskItem,
  TaskPriority,
} from '../types/task';
import type { UserPreferences, UserProfile } from '../types/user';

export interface TaskInput {
  title: string;
  course: string;
  dueDate: string;
  dueTime: string;
  priority: TaskPriority;
  category: TaskCategory;
  notes?: string;
  smartReminder?: boolean;
}

interface AppContextValue {
  user: UserProfile | null;
  preferences: UserPreferences;
  tasks: TaskItem[];
  dashboardSummary: DashboardSummary | null;
  isAuthLoading: boolean;
  isTasksLoading: boolean;
  toastMessage: string | null;
  showToast: (message: string) => void;
  login: (payload: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => Promise<UserProfile>;
  register: (payload: {
    name: string;
    email: string;
    major: string;
    password: string;
    university?: string;
  }) => Promise<UserProfile>;
  logout: () => void;
  refreshWorkspace: () => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  addTask: (input: TaskInput) => Promise<TaskItem>;
  updateTask: (id: string, input: TaskInput) => Promise<TaskItem>;
  deleteTask: (id: string) => Promise<void>;
  updateUser: (
    partial: Partial<Omit<UserProfile, 'id' | 'email' | 'preferences'>>,
  ) => Promise<void>;
  togglePreference: (key: 'notifications' | 'weeklyDigest') => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  notifications: true,
  weeklyDigest: true,
  theme: 'dark',
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [dashboardSummary, setDashboardSummary] =
    useState<DashboardSummary | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(
    Boolean(getStoredToken()),
  );
  const [isTasksLoading, setIsTasksLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const preferences = user?.preferences ?? DEFAULT_PREFERENCES;

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2400);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [preferences.theme]);

  const logout = useCallback(() => {
    setStoredToken(null);
    setUser(null);
    setTasks([]);
    setDashboardSummary(null);
  }, []);

  const refreshWorkspace = useCallback(async () => {
    if (!getStoredToken()) return;
    setIsTasksLoading(true);
    try {
      const [tasksRes, summaryRes] = await Promise.all([
        tasksApi.list(),
        dashboardApi.getSummary(),
      ]);
      setTasks(tasksRes.tasks);
      setUser(summaryRes.user);
      setDashboardSummary({
        kpis: summaryRes.kpis,
        weeklyProgress: summaryRes.weeklyProgress,
        courseBreakdown: summaryRes.courseBreakdown,
        pendingPreview: summaryRes.pendingPreview,
        completedPreview: summaryRes.completedPreview,
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
      } else if (err instanceof Error) {
        showToast(err.message);
      }
    } finally {
      setIsTasksLoading(false);
    }
  }, [logout, showToast]);

  useEffect(() => {
    let active = true;
    async function hydrateSession() {
      const token = getStoredToken();
      if (!token) {
        setIsAuthLoading(false);
        return;
      }
      try {
        const meRes = await authApi.getMe();
        if (!active) return;
        setUser(meRes.user);
        await refreshWorkspace();
      } catch (err) {
        if (!active) return;
        if (err instanceof ApiError && err.status === 401) {
          logout();
        }
      } finally {
        if (active) setIsAuthLoading(false);
      }
    }
    hydrateSession();
    return () => {
      active = false;
    };
  }, [logout, refreshWorkspace]);

  const login = useCallback(
    async (payload: {
      email: string;
      password: string;
      rememberMe?: boolean;
    }) => {
      const res = await authApi.login(payload);
      setStoredToken(res.token);
      setUser(res.user);
      await refreshWorkspace();
      return res.user;
    },
    [refreshWorkspace],
  );

  const register = useCallback(
    async (payload: {
      name: string;
      email: string;
      major: string;
      password: string;
      university?: string;
    }) => {
      const res = await authApi.register(payload);
      setStoredToken(res.token);
      setUser(res.user);
      await refreshWorkspace();
      return res.user;
    },
    [refreshWorkspace],
  );

  const toggleTaskStatus = useCallback(
    async (id: string) => {
      const current = tasks.find((t) => t.id === id);
      if (!current) return;
      const nextStatus = current.status === 'completed' ? 'pending' : 'completed';

      try {
        const { task: updated } = await tasksApi.update(id, {
          status: nextStatus,
        });
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        const summaryRes = await dashboardApi.getSummary();
        setDashboardSummary({
          kpis: summaryRes.kpis,
          weeklyProgress: summaryRes.weeklyProgress,
          courseBreakdown: summaryRes.courseBreakdown,
          pendingPreview: summaryRes.pendingPreview,
          completedPreview: summaryRes.completedPreview,
        });
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Could not update task');
      }
    },
    [tasks, showToast],
  );

  const addTask = useCallback(
    async (input: TaskInput): Promise<TaskItem> => {
      const { task: created } = await tasksApi.create({
        title: input.title.trim(),
        course: input.course,
        dueDate: input.dueDate,
        dueTime: input.dueTime,
        priority: input.priority,
        category: input.category,
        notes: input.notes?.trim() || '',
        smartReminder: input.smartReminder ?? true,
      });
      setTasks((prev) => [created, ...prev]);
      const summaryRes = await dashboardApi.getSummary();
      setDashboardSummary({
        kpis: summaryRes.kpis,
        weeklyProgress: summaryRes.weeklyProgress,
        courseBreakdown: summaryRes.courseBreakdown,
        pendingPreview: summaryRes.pendingPreview,
        completedPreview: summaryRes.completedPreview,
      });
      return created;
    },
    [],
  );

  const updateTask = useCallback(
    async (id: string, input: TaskInput): Promise<TaskItem> => {
      const { task: updated } = await tasksApi.update(id, {
        title: input.title.trim(),
        course: input.course,
        dueDate: input.dueDate,
        dueTime: input.dueTime,
        priority: input.priority,
        category: input.category,
        notes: input.notes?.trim() || '',
        smartReminder: input.smartReminder ?? true,
      });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      const summaryRes = await dashboardApi.getSummary();
      setDashboardSummary({
        kpis: summaryRes.kpis,
        weeklyProgress: summaryRes.weeklyProgress,
        courseBreakdown: summaryRes.courseBreakdown,
        pendingPreview: summaryRes.pendingPreview,
        completedPreview: summaryRes.completedPreview,
      });
      return updated;
    },
    [],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      try {
        await tasksApi.remove(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
        showToast('Task removed');
        const summaryRes = await dashboardApi.getSummary();
        setDashboardSummary({
          kpis: summaryRes.kpis,
          weeklyProgress: summaryRes.weeklyProgress,
          courseBreakdown: summaryRes.courseBreakdown,
          pendingPreview: summaryRes.pendingPreview,
          completedPreview: summaryRes.completedPreview,
        });
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Could not delete task');
      }
    },
    [showToast],
  );

  const updateUser = useCallback(
    async (
      partial: Partial<Omit<UserProfile, 'id' | 'email' | 'preferences'>>,
    ) => {
      const { user: updated } = await authApi.updateMe(partial);
      setUser(updated);
    },
    [],
  );

  const togglePreference = useCallback(
    async (key: 'notifications' | 'weeklyDigest') => {
      if (!user) return;
      const nextVal = !user.preferences[key];
      const label = key === 'notifications' ? 'Notifications' : 'Weekly Digest';
      try {
        const { user: updated } = await authApi.updateMe({
          preferences: { [key]: nextVal },
        });
        setUser(updated);
        showToast(`${label} ${nextVal ? 'enabled' : 'paused'}`);
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : 'Could not save preference',
        );
      }
    },
    [user, showToast],
  );

  const toggleTheme = useCallback(async () => {
    if (!user) return;
    const nextTheme = user.preferences.theme === 'dark' ? 'light' : 'dark';
    try {
      const { user: updated } = await authApi.updateMe({
        preferences: { theme: nextTheme },
      });
      setUser(updated);
      showToast(`Theme set to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not save theme');
    }
  }, [user, showToast]);

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      preferences,
      tasks,
      dashboardSummary,
      isAuthLoading,
      isTasksLoading,
      toastMessage,
      showToast,
      login,
      register,
      logout,
      refreshWorkspace,
      toggleTaskStatus,
      addTask,
      updateTask,
      deleteTask,
      updateUser,
      togglePreference,
      toggleTheme,
    }),
    [
      user,
      preferences,
      tasks,
      dashboardSummary,
      isAuthLoading,
      isTasksLoading,
      toastMessage,
      showToast,
      login,
      register,
      logout,
      refreshWorkspace,
      toggleTaskStatus,
      addTask,
      updateTask,
      deleteTask,
      updateUser,
      togglePreference,
      toggleTheme,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return ctx;
}
