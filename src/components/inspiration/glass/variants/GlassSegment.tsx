'use client';

import { useState } from 'react';

/**
 * 玻璃分段控制器 GlassSegment —— GlassToggle 衍生变体 V2（segment）
 * 2026-08-28 Claude·灵感系统 v2：
 *   - 衍化思路：二元开关 → 三态分段控制器（日间 / 夜间 / 自动）；
 *     液态渐变胶囊以 left 过渡滑轨（复刻要点 ①②③，二元开合升级为多态切换）；
 *   - 由 GlassMount 以键 `glass-toggle:segment` 按需 dynamic 加载；
 *   - 双端适配：宽度 min(320px, 84vw)，触控目标充足。
 */

/** 分段选项（滑轨位置按索引计算，纯 transition 驱动） */
const MODES = [
  { key: 'day', label: '日间', desc: '晨雾白 · 高对比' },
  { key: 'night', label: '夜间', desc: '松烟墨 · 低亮度' },
  { key: 'auto', label: '自动', desc: '跟随日出日落' },
] as const;

export default function GlassSegment() {
  const [idx, setIdx] = useState(0);

  return (
    <div
      className="lg-glass p-6 text-center"
      style={{ width: 'min(320px, 84vw)' }}
      data-component="glass-toggle-segment"
    >
      <span className="lg-noise rounded-[2rem]" aria-hidden />

      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">Appearance</p>

        {/* 三分格滑轨 + 液态渐变滑块 */}
        <div className="relative mt-5 flex rounded-full border border-white/15 bg-white/10 p-1">
          <span
            aria-hidden
            className="lg-liquid absolute bottom-1 top-1 rounded-full transition-[left] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{
              left: `calc(${idx} * 33.333% + 0.25rem)`,
              width: 'calc(33.333% - 0.5rem)',
              boxShadow:
                '0 6px 18px -6px rgba(167, 139, 250, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.45)',
            }}
          />
          {MODES.map((m, i) => (
            <button
              key={m.key}
              onClick={() => setIdx(i)}
              aria-pressed={idx === i}
              className={`relative z-10 flex-1 rounded-full py-2 text-xs font-medium transition-colors duration-300 ${
                idx === i ? 'text-[#1b1430]' : 'text-white/60 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* 当前模式描述 */}
        <p className="mt-4 text-sm text-white/70">{MODES[idx].desc}</p>
      </div>
    </div>
  );
}
