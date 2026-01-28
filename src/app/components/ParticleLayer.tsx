"use client";

import { useEffect, useRef } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vrot: number;
  life: number;
  born: number;
  glyph: string;
};

const GLYPHS = ["✖"];

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export default function ParticleLayer({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const idRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resizeToViewport = () => {
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.width = Math.floor(window.innerWidth * (window.devicePixelRatio || 1));
      canvas.height = Math.floor(window.innerHeight * (window.devicePixelRatio || 1));
      ctx.setTransform((window.devicePixelRatio || 1), 0, 0, (window.devicePixelRatio || 1), 0, 0);
    };

    resizeToViewport();
    window.addEventListener("resize", resizeToViewport);

    const spawn = (x: number, y: number) => {
      const born = performance.now();
      const count = 1;

      for (let i = 0; i < count; i++) {
        const speed = rand(120, 420);
        const ang = rand(-Math.PI * 0.9, -Math.PI * 0.1);
        particlesRef.current.push({
          id: idRef.current++,
          x,
          y,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          size: rand(10, 20),
          rot: rand(0, Math.PI * 2),
          vrot: rand(-6, 6),
          life: rand(0.7, 1.3),
          born,
          glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        });
      }

      if (particlesRef.current.length > 400) {
        particlesRef.current.splice(0, particlesRef.current.length - 400);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (Math.random() < 0.18) spawn(e.clientX, e.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    const tick = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const next: Particle[] = [];
      for (const p of particlesRef.current) {
        const age = (now - p.born) / 1000;
        if (age > p.life) continue;

        const dt = 1 / 60;
        p.vy += 40 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vrot * dt;

        const t = age / p.life;
        const alpha = Math.max(0, 1 - t);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.font = `${p.size * 2}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,0.25)";
        ctx.shadowBlur = 6;
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(0,0,0,0.9)";
        ctx.fillStyle = "rgba(255,255,255,0.98)";
        ctx.strokeText(p.glyph, 0, 0);
        ctx.fillText(p.glyph, 0, 0);
        ctx.restore();

        next.push(p);
      }

      particlesRef.current = next;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resizeToViewport);
      window.removeEventListener("pointermove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
