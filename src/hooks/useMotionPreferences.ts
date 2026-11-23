import { useEffect, useState } from 'react';

export function useMotionPreferences(manualPaused = false) {
  const [osReducedMotion, setOsReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [isCoarsePointer, setIsCoarsePointer] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(pointer: coarse)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: coarse)');

    const onMotionChange = (e: MediaQueryListEvent) => setOsReducedMotion(e.matches);
    const onPointerChange = (e: MediaQueryListEvent) => setIsCoarsePointer(e.matches);

    motionQuery.addEventListener('change', onMotionChange);
    pointerQuery.addEventListener('change', onPointerChange);

    return () => {
      motionQuery.removeEventListener('change', onMotionChange);
      pointerQuery.removeEventListener('change', onPointerChange);
    };
  }, []);

  return {
    shouldReduceMotion: manualPaused || osReducedMotion,
    isCoarsePointer,
  };
}
