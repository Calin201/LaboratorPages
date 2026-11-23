import { motion } from 'motion/react';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

interface BlurTextProps {
  text: string;
  className?: string;
  delayStep?: number;
  paused?: boolean;
}

export function BlurText({
  text,
  className = '',
  delayStep = 0.045,
  paused = false,
}: BlurTextProps) {
  const { shouldReduceMotion } = useMotionPreferences(paused);
  const words = text.split(' ');

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {words.map((word, idx) => (
        <motion.span
          key={`${word}-${idx}`}
          initial={{ opacity: 0, filter: 'blur(8px)', y: 12 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            duration: 0.48,
            delay: idx * delayStep,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block will-change-[transform,opacity,filter]"
        >
          {word}
          {idx < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  );
}
