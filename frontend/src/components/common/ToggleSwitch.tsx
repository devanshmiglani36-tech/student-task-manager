interface ToggleSwitchProps {
  checked: boolean;
  onToggle: () => void;
  ariaLabel: string;
  size?: 'sm' | 'md';
}

export function ToggleSwitch({
  checked,
  onToggle,
  ariaLabel,
  size = 'sm',
}: ToggleSwitchProps) {
  const trackSize = size === 'md' ? 'w-12 h-7 p-1' : 'w-11 h-6 p-0.5';
  const knobSize = size === 'md' ? 'w-5 h-5' : 'w-5 h-5';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onToggle}
      className={`relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors ${trackSize} ${
        checked ? 'bg-primary-container' : 'bg-surface-container-highest'
      }`}
    >
      <span
        className={`block rounded-full bg-on-primary-container shadow-sm transition-transform ${knobSize} ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
