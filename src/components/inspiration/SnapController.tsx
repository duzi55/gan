'use client';

/**
 * SnapController —— 整屏舞台「20% 阈值吸附」控制器（v3，替代 CSS scroll-snap）
 * 2026-08-28 Claude·演进记录：
 *   v1 proximity：桌面 Chrome 滚轮下几乎不触发，用户实测无吸附感；
 *   v2 mandatory：一格一屏对齐精准，但会把停在两屏之间的用户强制拽回，
 *      且末屏吸附点在视口内仍“可见”时 Chrome 会把用户卡在衍生区之前滚不下去；
 *   v3 本方案：滚动停止后按阈值判定——
 *      - 已行进 ≥80%（残留 ≤20%）→ 平滑吸附到下一屏顶部；
 *      - 距当前屏顶部 ≤20% → 回吸附当前屏顶部（方向对称，双阈值可调）；
 *      - 中间地带 → 完全不动，停留权 100% 归用户；
 *      - 已滚入衍生/原文纸面区（越过末屏）→ 永不干预，不会倒吸回舞台。
 *
 * 实现：优先 scrollend 事件（滚动真正结束），不支持的环境（旧 Safari）用
 * 150ms 防抖兜底；每次判定实时读取舞台位置（免维护缓存，resize 天然正确）；
 * 平滑吸附期间用时间锁防自触发；尊重 prefers-reduced-motion。
 * 解耦说明：只认 data-snap-stage 标记，不感知页面结构，可复用。
 */

import { useEffect } from 'react';

const SNAP_THRESHOLD = 0.2; // 2026-08-28 Claude·吸附阈值：残留 20%（可按手感调整）

export function SnapController() {
  useEffect(() => {
    const reduceMotion = () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lockUntil = 0; // 自身平滑滚动期间不重复判定
    let timer = 0;

    const settle = () => {
      if (Date.now() < lockUntil) return;
      const stages = Array.from(document.querySelectorAll<HTMLElement>('[data-snap-stage]'));
      if (!stages.length) return;

      const y = window.scrollY;
      const tops = stages.map((s) => s.getBoundingClientRect().top + y);

      /* 当前所处分段 = 顶部线在 y 之上（含重合）的最后一块舞台 */
      let i = -1;
      tops.forEach((t, idx) => {
        if (y >= t - 1) i = idx;
      });
      if (i < 0) return;

      const h = stages[i].offsetHeight || window.innerHeight;
      const t = (y - tops[i]) / h; // 在本段中的行进比例 0..1
      if (t >= 1) return; // 已越过末屏进入衍生/原文区 —— 永不打扰纸面阅读

      let targetTop: number | null = null;
      if (t >= 1 - SNAP_THRESHOLD && i + 1 < tops.length) {
        targetTop = tops[i + 1]; // 残留 ≤20% → 吸附下一屏
      } else if (t <= SNAP_THRESHOLD && Math.abs(y - tops[i]) > 2) {
        targetTop = tops[i]; // 距顶 ≤20% → 回正当前屏（已在顶则跳过）
      }
      if (targetTop === null) return; // 中间地带 → 停留权归用户

      lockUntil = Date.now() + 700;
      window.scrollTo({ top: targetTop, behavior: reduceMotion() ? 'auto' : 'smooth' });
    };

    if ('onscrollend' in window) {
      window.addEventListener('scrollend', settle);
      return () => window.removeEventListener('scrollend', settle);
    }
    /* 兜底：不支持 scrollend 的环境用防抖模拟“滚动停止” */
    const debounced = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 150);
    };
    window.addEventListener('scroll', debounced, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', debounced);
    };
  }, []);

  return null; // 纯行为控制器，不渲染任何 DOM
}
