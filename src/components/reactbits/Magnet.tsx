import { useRef, type MouseEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

interface MagnetProps {
  children: ReactNode;
  strength?: number;
  className?: string;
  paused?: boolean;
}

export function Magnet({
  children,
  strength = 0.24,
  className = '',
  paused = false,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { shouldReduceMotion, isCoarsePointer } = useMotionPreferences(paused);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 22 });
  const springY = useSpring(y, { stiffness: 320, damping: 22 });

  const disabled = shouldReduceMotion || isCoarsePointer;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (disabled) {
    return <div className={`inline-block ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
