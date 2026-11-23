import { useEffect, useRef, useState } from 'react';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

interface CountUpProps {
  to: number;
  suffix?: string;
  durationMs?: number;
  paused?: boolean;
  className?: string;
}

export function CountUp({
  to,
  suffix = '',
  durationMs = 650,
  paused = false,
  className = '',
}: CountUpProps) {
  const { shouldReduceMotion } = useMotionPreferences(paused);
  const [value, setValue] = useState(shouldReduceMotion ? to : 0);
  const fromRef = useRef(value);

  useEffect(() => {
    if (shouldReduceMotion) {
      setValue(to);
      fromRef.current = to;
      return;
    }

    const startVal = fromRef.current;
    const startTime = performance.now();
    let rafId = 0;

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (to - startVal) * eased);
      setValue(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        fromRef.current = to;
      }
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [to, durationMs, shouldReduceMotion]);

  return (
    <span className={className}>
      {value}
      {suffix}
    </span>
  );
}
