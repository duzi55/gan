'use client';

import { useEffect, useRef } from 'react';

interface ArticleCanvasProps {
  accent: string;
}

/**
 * Ambient canvas animation — drifting gradient blobs.
 * Zero network requests, GPU-friendly (transform + opacity only).
 */
export default function ArticleCanvas({ accent }: ArticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const parent = canvas?.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx!.scale(dpr, dpr);
    }

    // Parse accent color to RGB
    const hex = accent.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Drifting blobs
    const blobs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      radius: 120 + Math.random() * 180,
      alpha: 0.04 + Math.random() * 0.06,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    function draw() {
      t += 0.008;
      ctx!.clearRect(0, 0, w, h);

      blobs.forEach((blob, i) => {
        blob.x += blob.vx;
        blob.y += blob.vy;
        // Bounce
        if (blob.x < 0 || blob.x > 1) blob.vx *= -1;
        if (blob.y < 0 || blob.y > 1) blob.vy *= -1;

        const cx = blob.x * w + Math.sin(t + blob.phase) * 30;
        const cy = blob.y * h + Math.cos(t + blob.phase) * 30;
        const radius = blob.radius;

        const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, `rgba(${r},${g},${b},${blob.alpha})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx!.fill();
      });

      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [accent]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
