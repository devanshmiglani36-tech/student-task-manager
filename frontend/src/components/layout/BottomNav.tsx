import { NavLink } from 'react-router-dom';
import { MaterialIcon } from '../common/MaterialIcon';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/tasks', label: 'My Tasks', icon: 'task_alt' },
  { to: '/add-task', label: 'Add Task', icon: 'add_circle' },
  { to: '/profile', label: 'Profile', icon: 'person' },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface-container-low/90 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.25)]"
    >
      <div className="mx-auto flex h-20 w-full max-w-3xl items-center justify-around px-space-sm">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-space-sm transition-colors ${
                isActive
                  ? 'font-semibold text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`
            }
          >
            <MaterialIcon name={item.icon} />
            <span className="font-label-sm text-label-sm">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
