import type { ReactNode } from 'react';

interface StarBorderProps {
  children: ReactNode;
  className?: string;
}

export function StarBorder({ children, className = '' }: StarBorderProps) {
  return (
    <div className={`star-border-shell ${className}`}>
      <div className="star-border-orbit" aria-hidden="true" />
      <div className="relative z-10 rounded-[calc(0.75rem-1px)] bg-[var(--bg-surface)]">
        {children}
      </div>
    </div>
  );
}
