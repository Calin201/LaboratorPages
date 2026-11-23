import { useEffect, useRef } from 'react';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

interface ClickSparkProps {
  paused?: boolean;
}

const SPARK_COLORS = ['#B84A0A', '#1F1915'];

export function ClickSpark({ paused = false }: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const { shouldReduceMotion } = useMotionPreferences(paused);

  useEffect(() => {
    if (shouldReduceMotion) {
      sparksRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const spawnSparks = (e: PointerEvent) => {
      const count = 6;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
        const speed = 1.6 + Math.random() * 2.8;
        sparksRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2.2 + Math.random() * 1.8,
          life: 0,
          maxLife: 24 + Math.random() * 12,
          color: SPARK_COLORS[i % SPARK_COLORS.length],
        });
      }
      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const next: Spark[] = [];

      for (const s of sparksRef.current) {
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.94;
        s.vy *= 0.94;
        s.life += 1;

        if (s.life < s.maxLife) {
          const alpha = 1 - s.life / s.maxLife;
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = s.color;
          ctx.lineWidth = s.size * 0.7;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.vx * 2.6, s.y - s.vy * 2.6);
          ctx.stroke();
          next.push(s);
        }
      }

      ctx.globalAlpha = 1;
      sparksRef.current = next;

      if (next.length > 0) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = 0;
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointerdown', spawnSparks);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', spawnSparks);
      if (rafId) cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
}
