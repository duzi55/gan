'use client';

import { useState, type CSSProperties } from 'react';

/**
 * 玻璃亮度调节 GlassBrightness —— GlassSlider 衍生变体 V1（brightness）
 * 2026-08-28 Claude·灵感系统 v2：
 *   - 衍化思路：音量滑块 → 亮度调节；太阳图标隐喻 + 大百分比回显，
 *     填充逻辑沿用 lg-range 的 --fill 内联变量（复刻要点 ①②③）；
 *   - 由 GlassMount 以键 `glass-slider:brightness` 按需 dynamic 加载；
 *   - 双端适配：宽度 min(320px, 84vw)。
 */
export default function GlassBrightness() {
  const [v, setV] = useState(72);
  const fill = ((v - 10) / 90) * 100;

  return (
    <div
      className="lg-glass p-6 text-center"
      style={{ width: 'min(320px, 84vw)' }}
      data-component="glass-slider-brightness"
    >
      <span className="lg-noise rounded-[2rem]" aria-hidden />

      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">Brightness</p>

        {/* 太阳图标：暖色液态渐变圆 + 外投影 */}
        <span
          className="mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-full"
          aria-hidden
          style={{
            background: 'linear-gradient(135deg, #fde68a, #fda4af)',
            boxShadow:
              '0 10px 26px -8px rgba(253, 224, 71, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          }}
        >
          <svg
            className="h-7 w-7 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        </span>

        {/* ⑥ 大百分比回显（tabular-nums 防拖动跳动） */}
        <p className="mt-3 text-[44px] font-extralight leading-none text-white tabular-nums">
          {v}
          <span className="ml-1 text-lg text-white/55">%</span>
        </p>

        {/* 亮度滑杆：lg-range 液态渐变填充 */}
        <input
          type="range"
          min={10}
          max={100}
          value={v}
          aria-label="亮度"
          onChange={(e) => setV(Number(e.target.value))}
          className="lg-range mt-4 w-full"
          style={{ '--fill': `${fill}%` } as CSSProperties}
        />
        <div className="mt-2 flex justify-between font-mono text-[9px] text-white/30">
          <span>10</span>
          <span>55</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
