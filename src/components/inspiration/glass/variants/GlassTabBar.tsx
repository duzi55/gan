'use client';

import { useState } from 'react';

/**
 * 玻璃标签栏 GlassTabBar —— GlassDock 衍生变体 V2（tabbar）
 * 2026-08-28 Claude·灵感系统 v2：
 *   - 衍化思路：桌面 Dock → 移动端底部标签栏；图标键升级为「图标 + 文字」，
 *     激活项以液态渐变胶囊高亮（复刻要点 ①②③④）；
 *   - 由 GlassMount 以键 `glass-dock:tabbar` 按需 dynamic 加载；
 *   - 双端适配：宽度 min(320px, 84vw)，触控目标 ≥ 44px。
 */

/** 标签定义（内联 path，避免图标库依赖） */
const TABS = [
  { key: 'home', label: '首页', d: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10' },
  { key: 'spark', label: '灵感', d: 'M13 2 4.5 13.5H11L9.5 22 19 10h-6.5z' },
  { key: 'heart', label: '收藏', d: 'M12 21C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4 8 4c1.6 0 3.1.8 4 2 .9-1.2 2.4-2 4-2 2.8 0 5 2.4 5 5.3 0 4-4 7.2-9 11.7z' },
  { key: 'me', label: '我的', d: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-3.9 3.6-6 8-6s8 2.1 8 6' },
];

export default function GlassTabBar() {
  const [active, setActive] = useState('home');

  return (
    <div
      className="lg-glass flex items-center justify-between px-3 py-2.5"
      style={{ width: 'min(320px, 84vw)', borderRadius: '1.75rem' }}
      data-component="glass-dock-tabbar"
    >
      <span className="lg-noise" style={{ borderRadius: '1.75rem' }} aria-hidden />
      {TABS.map((t) => {
        const on = active === t.key;
        return (
          <button
            key={t.key}
            aria-label={t.label}
            aria-pressed={on}
            onClick={() => setActive(t.key)}
            className={`relative flex min-w-[64px] flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-colors duration-300 ${
              on ? 'text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            {/* ② 激活项：液态渐变胶囊背景 */}
            {on && (
              <span
                className="lg-liquid absolute inset-0 rounded-2xl"
                style={{
                  boxShadow:
                    '0 6px 18px -6px rgba(167, 139, 250, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                }}
                aria-hidden
              />
            )}
            <svg
              className="relative h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={t.d} />
            </svg>
            <span className="relative text-[11px] font-medium">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
