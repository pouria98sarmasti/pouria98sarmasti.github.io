import { useReveal } from '../hooks/useReveal';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
}

/** Wraps content that fades/slides in when scrolled into view. */
export function Reveal({ children, className = '' }: RevealProps) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
