'use client';

import { useState, type CSSProperties } from 'react';

/**
 * 玻璃播放进度 GlassProgress —— GlassSlider 衍生变体 V2（progress）
 * 2026-08-28 Claude·灵感系统 v2：
 *   - 衍化思路：音量滑块 → 播放进度条；时间码 mm:ss 回显 + 可拖拽跳转，
 *     填充沿用 lg-range 的 --fill 驱动（复刻要点 ①②⑥）；
 *   - 时长为展示样例 222s（对应原型 GlassPlayer 的 03:42），非站点业务数据；
 *   - 由 GlassMount 以键 `glass-slider:progress` 按需 dynamic 加载；
 *   - 双端适配：宽度 min(320px, 84vw)。
 */

/** 秒数 → mm:ss */
const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function GlassProgress() {
  const TOTAL = 222;
  const [sec, setSec] = useState(93);
  const fill = (sec / TOTAL) * 100;

  return (
    <div
      className="lg-glass p-6"
      style={{ width: 'min(320px, 84vw)' }}
      data-component="glass-slider-progress"
    >
      <span className="lg-noise rounded-[2rem]" aria-hidden />

      <div className="relative">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            Liquid Dreams
          </p>
          <p className="font-mono text-[10px] text-white/40">Aurora Fields</p>
        </div>

        {/* ⑥ 大时间码回显（tabular-nums 防跳动） */}
        <p className="mt-3 text-[44px] font-extralight leading-none text-white tabular-nums">
          {fmt(sec)}
          <span className="ml-2 text-base text-white/45">/ {fmt(TOTAL)}</span>
        </p>

        {/* 进度滑杆：可拖拽跳转 */}
        <input
          type="range"
          min={0}
          max={TOTAL}
          step={1}
          value={sec}
          aria-label="播放进度"
          onChange={(e) => setSec(Number(e.target.value))}
          className="lg-range mt-5 w-full"
          style={{ '--fill': `${fill}%` } as CSSProperties}
        />
        <div className="mt-2 flex justify-between font-mono text-[9px] text-white/30">
          <span>00:00</span>
          <span>{fmt(Math.floor(TOTAL / 2))}</span>
          <span>{fmt(TOTAL)}</span>
        </div>
      </div>
    </div>
  );
}
