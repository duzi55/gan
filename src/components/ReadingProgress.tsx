'use client';

import { useEffect, useState } from 'react';

/**
 * Fixed reading progress bar at the top of the viewport.
 * Uses transform: scaleX for GPU-friendly animation.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    /* 2026-08-27 Claude·性能修复：rAF 节流 + 进度按 0.5% 步进离散化。
       此前每个滚动事件都 setState 触发 React 重渲染（每帧一次），
       与 TocAside / MobileToc 的监听叠加后成为滚动卡顿来源之一；
       现在一帧内最多计算一次，且进度变化不足 0.5% 时跳过更新。 */
    let raf = 0;

    function onScroll() {
      if (raf) return; // 一帧内只计算一次
      raf = requestAnimationFrame(() => {
        raf = 0;
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? scrollTop / docHeight : 0;
        setProgress((prev) =>
          Math.abs(prev - Math.min(pct, 1)) < 0.005 ? prev : Math.min(pct, 1)
        );
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-[2px] bg-transparent">
      <div
        className="h-full origin-left bg-foreground/60 transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
