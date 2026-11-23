import { useEffect, useRef } from 'react';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

interface AuroraProps {
  paused?: boolean;
  className?: string;
}

/**
 * Whisper-light warm sunlit wash rendered on a lightweight canvas.
 * Uses strictly the 4-color warm palette (#FFFFFF, #FAF7F2, #B84A0A, #1F1915) and stops rAF when paused.
 */
export function Aurora({ paused = false, className = '' }: AuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { shouldReduceMotion } = useMotionPreferences(paused);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(parent.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(parent.clientHeight * dpr));
    };

    const drawFrame = (t: number) => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);

      const blobs = [
        {
          x: w * (0.24 + Math.sin(t * 0.45) * 0.08),
          y: h * (0.28 + Math.cos(t * 0.35) * 0.08),
          r: Math.max(w, h) * 0.52,
          color: 'rgba(184, 74, 10, 0.065)',
        },
        {
          x: w * (0.78 + Math.cos(t * 0.4) * 0.08),
          y: h * (0.36 + Math.sin(t * 0.3) * 0.08),
          r: Math.max(w, h) * 0.46,
          color: 'rgba(184, 74, 10, 0.04)',
        },
        {
          x: w * (0.52 + Math.sin(t * 0.28) * 0.07),
          y: h * (0.78 + Math.cos(t * 0.32) * 0.05),
          r: Math.max(w, h) * 0.42,
          color: 'rgba(31, 25, 21, 0.025)',
        },
      ];

      ctx.globalCompositeOperation = 'source-over';
      for (const blob of blobs) {
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, 'rgba(250, 247, 242, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    resize();
    drawFrame(time);

    const handleResize = () => {
      resize();
      drawFrame(time);
    };
    window.addEventListener('resize', handleResize);

    if (!shouldReduceMotion) {
      let lastTs = performance.now();
      const tick = (now: number) => {
        const dt = Math.min((now - lastTs) / 1000, 0.05);
        lastTs = now;
        time += dt * 0.65;
        drawFrame(time);
        animationFrameId = requestAnimationFrame(tick);
      };
      animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [shouldReduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
