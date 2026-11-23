import type { ReactNode } from 'react';

interface ShinyTextProps {
  children: ReactNode;
  className?: string;
}

export function ShinyText({ children, className = '' }: ShinyTextProps) {
  return <span className={`shiny-text ${className}`}>{children}</span>;
}
