import { useRef, type MouseEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

interface TiltedCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  paused?: boolean;
}

export function TiltedCard({
  children,
  className = '',
  maxTilt = 6,
  paused = false,
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { shouldReduceMotion, isCoarsePointer } = useMotionPreferences(paused);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 240, damping: 24 });
  const springY = useSpring(y, { stiffness: 240, damping: 24 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const disabled = shouldReduceMotion || isCoarsePointer;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className="perspective-[1000px]" ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}
