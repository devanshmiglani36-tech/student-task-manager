import { useAppContext } from '../../context/AppContext';

export function Toast() {
  const { toastMessage } = useAppContext();

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-surface-container-highest px-space-md py-space-sm font-label-md text-label-md text-on-surface shadow-lg transition-all duration-200 ${
        toastMessage
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0'
      }`}
    >
      {toastMessage ?? ''}
    </div>
  );
}
