import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import mayaPortraitImg from '../assets/images/maya-portrait.png';
import { MaterialIcon } from '../components/common/MaterialIcon';
import { ProgressRing } from '../components/common/ProgressRing';
import { ToggleSwitch } from '../components/common/ToggleSwitch';
import { AppShell } from '../components/layout/AppShell';
import { useAppContext } from '../context/AppContext';

export function ProfilePage() {
  const navigate = useNavigate();
  const {
    tasks,
    user,
    preferences,
    updateUser,
    togglePreference,
    toggleTheme,
    logout,
    showToast,
  } = useAppContext();

  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(user?.name ?? '');
  const [draftUniversity, setDraftUniversity] = useState(
    user?.university ?? '',
  );
  const [draftMajor, setDraftMajor] = useState(user?.major ?? '');
  const [draftStatus, setDraftStatus] = useState(user?.statusBanner ?? '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  if (!user) return null;

  const completedInSession = tasks.filter((t) => t.status === 'completed').length;
  const totalCompletedLifetime = user.historicalCompleted + completedInSession;

  const openEditor = () => {
    setDraftName(user.name);
    setDraftUniversity(user.university);
    setDraftMajor(user.major);
    setDraftStatus(user.statusBanner);
    setIsEditing(true);
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateUser({
        name: draftName.trim() || user.name,
        university: draftUniversity.trim() || user.university,
        major: draftMajor.trim() || user.major,
        statusBanner: draftStatus.trim() || user.statusBanner,
      });
      setIsEditing(false);
      showToast('Profile updated');
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Unable to update profile',
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSignOut = () => {
    logout();
    showToast('Signed out of StudyFlow');
    navigate('/login');
  };

  return (
    <AppShell title="Profile Page">
      <div className="flex w-full flex-col gap-space-md pb-space-md">
        {/* Profile Header Card */}
        <section className="relative overflow-hidden rounded-xl bg-surface-container p-space-md shadow-md">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-container/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-tertiary/10 blur-2xl" />

          <div className="relative flex items-start justify-between gap-space-md">
            <div className="flex min-w-0 items-center gap-space-md">
              <div className="relative shrink-0">
                <img
                  src={mayaPortraitImg}
                  alt={user.name}
                  className="h-16 w-16 rounded-full object-cover shadow-md"
                />
                <span
                  title="Study Mode Active"
                  className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-tertiary text-on-tertiary shadow-sm"
                >
                  <MaterialIcon name="bolt" filled className="text-[14px]" />
                </span>
              </div>

              <div className="flex min-w-0 flex-col">
                <h1 className="truncate font-headline-md text-headline-md text-on-surface">
                  {user.name}
                </h1>
                <p className="truncate font-body-md text-body-md text-primary">
                  {user.university}
                </p>
                <p className="truncate font-body-sm text-body-sm text-on-surface-variant">
                  {user.major} • {user.year}
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-space-md flex items-center justify-between gap-space-sm rounded-lg bg-surface-container-low/80 px-space-md py-space-sm">
            <div className="flex min-w-0 items-center gap-space-sm">
              <MaterialIcon
                name="local_fire_department"
                filled
                className="text-[18px] text-tertiary"
              />
              <span className="truncate font-label-md text-label-md text-on-surface">
                {user.statusBanner}
              </span>
            </div>
            <button
              type="button"
              onClick={openEditor}
              className="shrink-0 rounded-lg bg-primary-container px-space-md py-space-xs font-label-lg text-label-lg text-on-primary-container shadow-sm transition-transform active:scale-95"
            >
              Edit Profile
            </button>
          </div>
        </section>

        {/* Inline Edit Profile Card */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="flex flex-col gap-space-sm rounded-xl bg-surface-container-high p-space-md shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                Edit Profile
              </h2>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <MaterialIcon name="close" className="text-lg" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Full name"
                className="rounded-lg bg-surface-container-lowest px-space-md py-space-sm font-body-md text-body-md text-on-surface focus:outline-none"
              />
              <input
                type="text"
                value={draftUniversity}
                onChange={(e) => setDraftUniversity(e.target.value)}
                placeholder="University"
                className="rounded-lg bg-surface-container-lowest px-space-md py-space-sm font-body-md text-body-md text-on-surface focus:outline-none"
              />
              <input
                type="text"
                value={draftMajor}
                onChange={(e) => setDraftMajor(e.target.value)}
                placeholder="Major"
                className="rounded-lg bg-surface-container-lowest px-space-md py-space-sm font-body-md text-body-md text-on-surface focus:outline-none"
              />
              <input
                type="text"
                value={draftStatus}
                onChange={(e) => setDraftStatus(e.target.value)}
                placeholder="Focus status"
                className="rounded-lg bg-surface-container-lowest px-space-md py-space-sm font-body-md text-body-md text-on-surface focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-space-sm pt-space-xs">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-lg bg-surface-container px-space-md py-space-xs font-label-md text-label-md text-on-surface-variant"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingProfile}
                className="rounded-lg bg-primary-container px-space-md py-space-xs font-label-md text-label-md text-on-primary-container disabled:opacity-70"
              >
                {isSavingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Academic Stats Bento Grid */}
        <section className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between px-space-xs">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Academic Pulse
            </h2>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              Fall Quarter
            </span>
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            <div className="flex flex-col justify-between rounded-xl bg-surface-container p-space-md shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container/20 text-primary">
                  <MaterialIcon name="task_alt" filled className="text-[18px]" />
                </span>
                <span className="rounded-full bg-tertiary-container/30 px-space-sm py-0.5 font-label-sm text-label-sm text-tertiary">
                  +12%
                </span>
              </div>
              <div className="mt-space-md">
                <p className="font-headline-md text-headline-md text-on-surface">
                  {totalCompletedLifetime}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Tasks Completed
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-xl bg-surface-container p-space-md shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-tertiary-container/30 text-tertiary">
                  <MaterialIcon
                    name="local_fire_department"
                    filled
                    className="text-[18px]"
                  />
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Best: {user.bestStreakDays}d
                </span>
              </div>
              <div className="mt-space-md">
                <p className="font-headline-md text-headline-md text-on-surface">
                  {user.streakDays} {user.streakDays === 1 ? 'Day' : 'Days'}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Current Streak
                </p>
              </div>
            </div>
          </div>

          {/* GPA Goal Full-Width Card */}
          <div className="flex items-center justify-between gap-space-md rounded-xl bg-surface-container p-space-md shadow-sm">
            <div className="flex min-w-0 items-center gap-space-md">
              <ProgressRing
                percent={user.gpaProgress}
                size={48}
                strokeWidth={4}
                trackColor="#222a3d"
                indicatorColor="#7c3aed"
              />
              <div className="flex min-w-0 flex-col">
                <p className="truncate font-title-md text-title-md text-on-surface">
                  GPA Goal: {user.gpaCurrent} / {user.gpaGoal}
                </p>
                <p className="truncate font-body-sm text-body-sm text-on-surface-variant">
                  On track • {user.honorsCount} honors courses
                </p>
              </div>
            </div>
            <MaterialIcon
              name="trending_up"
              className="shrink-0 text-primary"
            />
          </div>
        </section>

        {/* Account Settings & Preferences */}
        <section className="flex flex-col gap-space-sm">
          <h2 className="px-space-xs font-headline-sm text-headline-sm text-on-surface">
            Account Settings &amp; Preferences
          </h2>

          <div className="flex flex-col gap-space-xs rounded-xl bg-surface-container p-space-sm shadow-sm">
            {/* Notifications */}
            <div className="flex items-center justify-between rounded-lg px-space-sm py-space-sm transition-colors hover:bg-surface-container-high">
              <div className="flex min-w-0 items-center gap-space-md">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                  <MaterialIcon
                    name="notifications_active"
                    className="text-[20px]"
                  />
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-title-md text-title-md text-on-surface">
                    Notifications
                  </span>
                  <span className="truncate font-body-sm text-body-sm text-on-surface-variant">
                    Deadline alerts &amp; study nudges
                  </span>
                </div>
              </div>
              <ToggleSwitch
                checked={preferences.notifications}
                onToggle={() => togglePreference('notifications')}
                ariaLabel="Toggle notifications"
              />
            </div>

            {/* Theme Preference */}
            <div className="flex items-center justify-between rounded-lg px-space-sm py-space-sm transition-colors hover:bg-surface-container-high">
              <div className="flex min-w-0 items-center gap-space-md">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-secondary">
                  <MaterialIcon name="dark_mode" className="text-[20px]" />
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-title-md text-title-md text-on-surface">
                    Theme Preference
                  </span>
                  <span className="truncate font-body-sm text-body-sm text-on-surface-variant">
                    {preferences.theme === 'dark'
                      ? 'Dark Mode (Late-Night)'
                      : 'Light Mode (Daylight)'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="shrink-0 rounded-lg bg-surface-container-highest px-space-md py-space-xs font-label-md text-label-md text-on-surface transition-transform active:scale-95"
              >
                {preferences.theme === 'dark' ? 'Dark' : 'Light'}
              </button>
            </div>

            {/* Weekly Digest */}
            <div className="flex items-center justify-between rounded-lg px-space-sm py-space-sm transition-colors hover:bg-surface-container-high">
              <div className="flex min-w-0 items-center gap-space-md">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-tertiary">
                  <MaterialIcon name="mail" className="text-[20px]" />
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-title-md text-title-md text-on-surface">
                    Weekly Digest
                  </span>
                  <span className="truncate font-body-sm text-body-sm text-on-surface-variant">
                    Sunday evening progress recap
                  </span>
                </div>
              </div>
              <ToggleSwitch
                checked={preferences.weeklyDigest}
                onToggle={() => togglePreference('weeklyDigest')}
                ariaLabel="Toggle weekly digest"
              />
            </div>
          </div>
        </section>

        {/* Sign Out */}
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-space-xs flex w-full items-center justify-center gap-space-sm rounded-xl bg-error-container/30 py-space-md font-label-lg text-label-lg text-error shadow-sm transition-all active:scale-[0.98]"
        >
          <MaterialIcon name="logout" className="text-[20px]" />
          <span>Sign Out</span>
        </button>
      </div>
    </AppShell>
  );
}
