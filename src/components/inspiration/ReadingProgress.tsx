'use client';

/**
 * ReadingProgress —— 详情页顶部阅读进度条
 * 2026-08-28 Claude·新增：深空整屏舞台上原生滚动条不显眼，用户无法感知
 * 「内容还剩多少没滚」；用朱砂细条实时显示全文进度（深浅底均可见）。
 *
 * 实现：requestAnimationFrame 节流监听 window scroll / resize，
 * scaleX 变换驱动（不触发 layout，性能友好）；组件卸载时全部清理。
 * 解耦说明：不感知页面结构，任何长页可复用。
 */

import { useEffect, useRef } from 'react';

export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    /* 轨道半透明浅白：深空舞台上可见；进度用系统朱砂 accent 色 */
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 bg-white/10">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-accent"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
