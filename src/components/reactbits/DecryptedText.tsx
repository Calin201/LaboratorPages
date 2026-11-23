import { useEffect, useState } from 'react';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

interface DecryptedTextProps {
  text: string;
  className?: string;
  paused?: boolean;
  speedMs?: number;
}

const CHARSET = 'abcdefghijklmnopqrstuvwxyz0123456789-./:';

export function DecryptedText({
  text,
  className = '',
  paused = false,
  speedMs = 24,
}: DecryptedTextProps) {
  const { shouldReduceMotion } = useMotionPreferences(paused);
  const [displayed, setDisplayed] = useState(text);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayed(text);
      return;
    }

    let revealed = 0;
    let tick = 0;

    const timer = window.setInterval(() => {
      tick += 1;
      if (tick % 2 === 0) {
        revealed += 1;
      }

      const next = text
        .split('')
        .map((char, idx) => {
          if (idx < revealed || char === ' ') return char;
          return CHARSET[Math.floor(Math.random() * CHARSET.length)];
        })
        .join('');

      setDisplayed(next);

      if (revealed >= text.length) {
        setDisplayed(text);
        window.clearInterval(timer);
      }
    }, speedMs);

    return () => window.clearInterval(timer);
  }, [text, shouldReduceMotion, speedMs]);

  return <span className={className}>{displayed}</span>;
}
