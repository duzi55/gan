'use client';

import { useState } from 'react';

/**
 * 液态玻璃 Dock GlassDock —— 液态玻璃复刻 02
 * 2026-08-28 Claude·灵感页组件：
 *   - 复刻要点：①半透明材质 ③柔软体积感 ④颗粒噪点；
 *   - macOS Dock 式 hover 放大上浮（纯 CSS transition）+ 激活指示点；
 *   - 图标为内联 SVG，无第三方图标库依赖；点击仅切换本地激活态。
 */

/** Dock 图标定义（内联 path，避免引入图标库） */
const ITEMS = [
  { key: 'home', label: '主页', d: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10' },
  { key: 'search', label: '搜索', d: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3' },
  { key: 'heart', label: '收藏', d: 'M12 21C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4 8 4c1.6 0 3.1.8 4 2 0.9-1.2 2.4-2 4-2 2.8 0 5 2.4 5 5.3 0 4-4 7.2-9 11.7z' },
  { key: 'bell', label: '通知', d: 'M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6M10.3 19a2 2 0 0 0 3.4 0' },
  { key: 'gear', label: '设置', d: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2z' },
];

export default function GlassDock() {
  const [active, setActive] = useState('home');

  return (
    <div className="lg-glass flex items-end gap-3 px-5 py-4" style={{ borderRadius: '999px' }}>
      <span className="lg-noise" style={{ borderRadius: '999px' }} aria-hidden />
      {ITEMS.map((item) => (
        <button key={item.key} aria-label={item.label} onClick={() => setActive(item.key)} className="group relative flex flex-col items-center">
          {/* 玻璃图标键：hover 上浮放大（CSS only） */}
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-2 group-hover:scale-110"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)' }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.d} />
            </svg>
          </span>
          {/* 激活指示点 */}
          <span
            aria-hidden
            className={`mt-1.5 h-1 w-1 rounded-full transition-opacity duration-300 ${
              active === item.key ? 'bg-white/90 opacity-100' : 'opacity-0'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
