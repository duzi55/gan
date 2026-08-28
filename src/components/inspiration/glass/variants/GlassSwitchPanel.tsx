'use client';

import { useState } from 'react';

/**
 * 玻璃快捷开关面板 GlassSwitchPanel —— GlassToggle 衍生变体 V1（panel）
 * 2026-08-28 Claude·灵感系统 v2：
 *   - 衍化思路：单行开关 → 多行快捷面板（Wi-Fi / 蓝牙 / 勿扰）；
 *     激活行图标套用液态渐变方块，开关沿用玻璃 knob 滑动（复刻要点 ①②③④）；
 *   - role="switch" + aria-checked 保证无障碍；
 *   - 由 GlassMount 以键 `glass-toggle:panel` 按需 dynamic 加载；
 *   - 双端适配：宽度 min(320px, 84vw)。
 */

/** 行定义（内联 path，避免图标库依赖） */
const ROWS = [
  { key: 'wifi', label: '无线网络', sub: 'InkField-5G', d: 'M2.5 8.5a15 15 0 0 1 19 0M5.5 12a11 11 0 0 1 13 0M8.5 15.5a7 7 0 0 1 7 0M12 19h.01' },
  { key: 'bt', label: '蓝牙', sub: '已连接 · 玻璃耳机', d: 'M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11' },
  { key: 'dnd', label: '勿扰模式', sub: '至明早 07:00', d: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 12h8' },
] as const;

export default function GlassSwitchPanel() {
  const [on, setOn] = useState<Record<string, boolean>>({ wifi: true, bt: true, dnd: false });

  return (
    <div
      className="lg-glass p-5"
      style={{ width: 'min(320px, 84vw)' }}
      data-component="glass-toggle-panel"
    >
      <span className="lg-noise rounded-[2rem]" aria-hidden />

      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
          Quick Controls
        </p>

        <div className="mt-2 divide-y divide-white/10">
          {ROWS.map((r) => {
            const active = !!on[r.key];
            return (
              <div key={r.key} className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  {/* 图标方块：激活时液态渐变 */}
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-300 ${
                      active ? 'lg-liquid text-white' : 'bg-white/10 text-white/50'
                    }`}
                    style={active ? { boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)' } : undefined}
                    aria-hidden
                  >
                    <svg
                      className="h-[18px] w-[18px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={r.d} />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{r.label}</p>
                    <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
                      {active ? r.sub : 'Off'}
                    </p>
                  </div>
                </div>

                {/* 开关：玻璃 knob 滑动（与原型 GlassToggle 同款动效） */}
                <button
                  role="switch"
                  aria-checked={active}
                  aria-label={r.label}
                  onClick={() => setOn({ ...on, [r.key]: !active })}
                  className="relative h-7 w-12 shrink-0 rounded-full border border-white/20 transition-colors duration-300"
                  style={{
                    background: active
                      ? 'linear-gradient(135deg, #67e8f9, #c4b5fd 55%, #fda4af)'
                      : 'rgba(255,255,255,0.12)',
                    boxShadow: active
                      ? '0 4px 14px -4px rgba(167, 139, 250, 0.6)'
                      : 'none',
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    style={{
                      left: active ? 'calc(100% - 1.5rem)' : '0.25rem',
                      background: 'linear-gradient(160deg, #ffffff, #e2e0f5)',
                      boxShadow:
                        '0 3px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 #ffffff',
                    }}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
