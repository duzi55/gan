'use client';

import { useState } from 'react';

/**
 * 玻璃开关 GlassToggle —— 液态玻璃复刻 05
 * 2026-08-28 Claude·灵感页组件：
 *   - 复刻要点：①半透明材质 ②液态渐变（开启态轨道）③柔软体积感（玻璃 knob）；
 *   - role="switch" + aria-checked 保证无障碍；
 *   - 由 GlassMount 按需 dynamic 加载。
 */
export default function GlassToggle() {
  const [on, setOn] = useState(true);

  return (
    /* 2026-08-28 Claude·双端适配：固定 300px 改 min() 钳制 */
    <div className="lg-glass flex items-center justify-between p-5" style={{ width: 'min(300px, 84vw)' }}>
      <span className="lg-noise rounded-[2rem]" aria-hidden />
      <div className="relative">
        <p className="text-sm font-semibold text-white">氛围光</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
          {on ? 'On · 液态渐变' : 'Off'}
        </p>
      </div>

      <button
        role="switch"
        aria-checked={on}
        aria-label="氛围光开关"
        onClick={() => setOn(!on)}
        className="relative h-9 w-16 shrink-0 rounded-full border border-white/20 transition-colors duration-300"
        style={{
          background: on
            ? 'linear-gradient(135deg, #67e8f9, #c4b5fd 55%, #fda4af)'
            : 'rgba(255,255,255,0.12)',
          boxShadow: on ? '0 6px 18px -6px rgba(167,139,250,0.65)' : 'none',
        }}
      >
        {/* ③ 玻璃 knob：内高光 + 外投影，左右滑动 */}
        <span
          aria-hidden
          className="absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{
            left: on ? 'calc(100% - 2rem)' : '0.25rem',
            background: 'linear-gradient(160deg, #ffffff, #e2e0f5)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3), inset 0 1px 0 #ffffff',
          }}
        />
      </button>
    </div>
  );
}
