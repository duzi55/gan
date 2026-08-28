'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Reveal —— 灵感详情页「向下滚动依次显示」的显现容器
 * 2026-08-28 Claude·灵感系统 v2 新增（规则见 INSPIRATION_RULES.md）：
 *   - IntersectionObserver 单次触发，进入视口后渐显（CSS 过渡在
 *     liquid-glass.css 的 .lg-reveal，本组件只切 data 属性）；
 *   - 渐进增强：首帧不隐藏内容；effect 挂载后若目标尚在视口之外
 *     才置 data-armed 开始隐藏，故 SSR / 无 JS / reduced-motion 下
 *     内容始终直接可见，不丢内容、不闪白；
 *   - 与玻璃体系解耦：可用于任意块级内容的滚动显现。
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* reduced-motion：跳过动画，内容直接可见 */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    /* 已在视口内（首屏）则不隐藏，直接标记显现 */
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
      setShown(true);
      return;
    }
    /* 视口之外：先武装（隐藏），进入视口后显现并停止观察 */
    setArmed(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`lg-reveal ${className ?? ''}`} data-armed={armed} data-shown={shown}>
      {children}
    </div>
  );
}
