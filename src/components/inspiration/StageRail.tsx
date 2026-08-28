'use client';

/**
 * StageRail —— 整屏舞台右侧屏点导航
 * 2026-08-28 Claude·新增：告知用户本灵感共有几屏、当前停在第几屏，点击直达，
 * 配合页面 scroll-snap 解决「滚轮/手指对不准 + 不知道还剩多少」。
 *
 * 行为：
 *   - 用视口中线判定当前屏（top ≤ 中线 < bottom），rAF 节流随滚动更新；
 *   - 当前屏高亮（长横线 + 编号），其余短横线，hover 预览编号；
 *   - 滚出舞台序列（进入变体/原文纸面区）整条淡出，不干扰纸面阅读；
 *   - 尊重 prefers-reduced-motion（reduce 时瞬时跳转）。
 *
 * 解耦说明：不感知页面结构，只认 data-snap-stage / data-snap-next 标记，可复用。
 */

import { useEffect, useRef, useState } from 'react';

export function StageRail() {
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [leftStages, setLeftStages] = useState(false); // true = 已滚入舞台后的纸面区
  const stagesRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const stages = Array.from(document.querySelectorAll<HTMLElement>('[data-snap-stage]'));
    stagesRef.current = stages;
    setTotal(stages.length);
    if (!stages.length) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let idx = 0;
      stages.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) idx = i;
      });
      setActive(idx);
      /* 舞台后的首个区块（data-snap-next）顶边进入视口上 1/4，判定已离开舞台序列 */
      const after = document.querySelector<HTMLElement>('[data-snap-next]');
      setLeftStages(!!after && after.getBoundingClientRect().top <= window.innerHeight * 0.25);
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

  const jump = (i: number) => {
    const target = stagesRef.current[i];
    if (!target) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  if (!total) return null;

  return (
    <nav
      aria-label="屏幕导航"
      className={`fixed right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col items-end gap-1 transition-opacity duration-500 md:right-5 ${
        leftStages ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => jump(i)}
          aria-label={`跳到第 ${i + 1} 屏`}
          aria-current={i === active}
          className="group flex cursor-pointer items-center justify-end gap-2 py-1.5"
        >
          {/* 编号默认隐没，hover 或激活时浮现（白色系，仅存在于深空舞台区） */}
          <span
            className={`font-mono text-[9px] tracking-[0.2em] transition-colors duration-300 ${
              i === active ? 'text-white' : 'text-transparent group-hover:text-white/60'
            }`}
          >
            {String(i + 1).padStart(2, '0')}
          </span>
          <span
            aria-hidden
            className={`block h-px transition-all duration-300 ${
              i === active
                ? 'w-6 bg-white'
                : 'w-3 bg-white/40 group-hover:w-5 group-hover:bg-white/70'
            }`}
          />
        </button>
      ))}
    </nav>
  );
}
