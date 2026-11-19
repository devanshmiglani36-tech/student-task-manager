export interface UserPreferences {
  notifications: boolean;
  weeklyDigest: boolean;
  theme: 'dark' | 'light';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  year: string;
  statusBanner: string;
  gpaGoal: string;
  gpaCurrent: string;
  gpaProgress: number;
  honorsCount: number;
  streakDays: number;
  bestStreakDays: number;
  historicalCompleted: number;
  preferences: UserPreferences;
}
