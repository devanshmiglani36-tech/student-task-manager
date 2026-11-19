import type { CSSProperties } from 'react';

interface MaterialIconProps {
  name: string;
  className?: string;
  filled?: boolean;
  weight?: number;
}

export function MaterialIcon({
  name,
  className = '',
  filled = false,
  weight,
}: MaterialIconProps) {
  const style: CSSProperties | undefined =
    filled || weight
      ? {
          fontVariationSettings: `'FILL' ${filled ? 1 : 0}${weight ? `, 'wght' ${weight}` : ''}`,
        }
      : undefined;

  return (
    <span className={`material-symbols-outlined ${className}`} style={style}>
      {name}
    </span>
  );
}
