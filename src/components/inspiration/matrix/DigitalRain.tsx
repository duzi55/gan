'use client';

import { useEffect, useRef } from 'react';
import { MX, RAIN_GLYPHS } from './matrixShared';

/**
 * DigitalRain.tsx —— IN-08 代码雨画布（黑客帝国数字雨，桌面背景与屏保变体复用）
 * 2026-09-09 Claude·新增：
 *   - canvas 2D 列式下落字符：亮头 + destination-out 半透明擦除形成拖尾，
 *     画布保持透明（透出容器舞台底色，不污染宿主背景）；
 *   - 性能自持（规则第五条）：rAF 降帧至 ~24fps、document.hidden 时跳过绘制、
 *     resize 重排、卸载全清理（cancelAnimationFrame + 移除监听）；
 *   - prefers-reduced-motion：只绘一帧静态稀疏字符（规则第六条降级）；
 *   - 参数化复用：桌面背景走 dim + 小字号低透明；屏保变体走大字号高亮，
 *     同一组件两种参数（解耦铁律）。
 */

export interface DigitalRainProps {
  /** 字号（= 列宽，默认 16px） */
  fontSize?: number;
  /** 每帧下落行数基数（默认 1，配 0.6~1.4 随机浮动） */
  speed?: number;
  /** 拖尾强度 0~1：越小尾越长（默认 0.08） */
  trail?: number;
  /** 暗态：桌面背景用（低对比，不抢前景）；false 为屏保亮态 */
  dim?: boolean;
  /** 整体不透明度（桌面背景建议 0.55） */
  opacity?: number;
  className?: string;
}

export default function DigitalRain({
  fontSize = 16,
  speed = 1,
  trail = 0.08,
  dim = false,
  opacity = 1,
  className = '',
}: DigitalRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let disposed = false;
    let drops: number[] = [];
    let cols = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    /** 尺寸重排：按 dpr 缩放保证高清，列数与落点数组重建 */
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w < 10 || h < 10) return;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      cols = Math.ceil(w / fontSize);
      drops = Array.from({ length: cols }, () =>
        Math.floor((Math.random() * h) / fontSize),
      );
    };

    /** 单帧绘制：destination-out 擦出拖尾 → 每列画一个亮头字符 */
    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${trail})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
      ctx.font = `${fontSize}px ui-monospace, Consolas, monospace`;
      for (let i = 0; i < cols; i++) {
        const ch = RAIN_GLYPHS[(Math.random() * RAIN_GLYPHS.length) | 0];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        /* 亮头：屏保亮态用极亮绿 + 少量纯白闪；暗态整体压低 */
        ctx.fillStyle =
          dim
            ? Math.random() > 0.96
              ? 'rgba(187,247,208,0.5)'
              : 'rgba(74,222,128,0.34)'
            : Math.random() > 0.94
              ? '#e8fff2'
              : MX.greenBright;
        ctx.fillText(ch, x, y);
        drops[i] += speed * (0.6 + Math.random() * 0.8);
        if (y > h && Math.random() > 0.976) drops[i] = 0;
      }
    };

    /** 静态雨（reduced-motion）：随机撒一帧稀疏字符后不再动 */
    const drawStatic = () => {
      resize();
      ctx.font = `${fontSize}px ui-monospace, Consolas, monospace`;
      for (let i = 0; i < cols; i++) {
        for (let k = 0; k < 6; k++) {
          ctx.fillStyle = `rgba(74,222,128,${0.1 + Math.random() * 0.35})`;
          ctx.fillText(
            RAIN_GLYPHS[(Math.random() * RAIN_GLYPHS.length) | 0],
            i * fontSize,
            ((Math.random() * canvas.clientHeight) / fontSize) * fontSize,
          );
        }
      }
    };

    resize();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      drawStatic();
      return () => {
        disposed = true;
      };
    }

    /* rAF 降帧 ~24fps（42ms）：数字雨不需要 60fps，省电保命 */
    let last = 0;
    const loop = (t: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(loop);
      if (t - last < 42 || document.hidden) return;
      last = t;
      draw();
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('resize', resize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [fontSize, speed, trail, dim]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
