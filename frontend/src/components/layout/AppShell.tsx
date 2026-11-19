import type { ReactNode } from 'react';
import { Toast } from '../common/Toast';
import { BottomNav } from './BottomNav';
import { TopHeader } from './TopHeader';

interface AppShellProps {
  title: string;
  showBack?: boolean;
  hideBottomNav?: boolean;
  linkProfile?: boolean;
  children: ReactNode;
}

export function AppShell({
  title,
  showBack = false,
  hideBottomNav = false,
  linkProfile = true,
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface font-body-md text-body-md text-on-surface">
      <TopHeader
        title={title}
        showBack={showBack}
        linkProfile={linkProfile}
      />
      <main
        className={`relative mx-auto flex min-h-screen w-full max-w-3xl flex-col bg-surface px-space-md pt-16 ${
          hideBottomNav ? 'pb-safe' : 'pb-24'
        }`}
      >
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
      <Toast />
    </div>
  );
}
