'use client';

import { useState, type CSSProperties } from 'react';

/**
 * 玻璃调频电台 GlassRadio —— GlassPlayer 衍生变体 V2（radio）
 * 2026-08-28 Claude·灵感系统 v2：
 *   - 衍化思路：唱片播放器 → 调频电台；以 lg-range 液态渐变滑杆调台，
 *     超大极细频率数字回显（复刻要点 ①②③⑥）；
 *   - 频率内部以 0.1MHz 整数存储（875–1080），避免浮点步进误差；
 *   - 由 GlassMount 以键 `glass-player:radio` 按需 dynamic 加载；
 *   - 双端适配：宽度 min(320px, 84vw)。
 */
export default function GlassRadio() {
  /* 内部存 0.1MHz 整数：875 = 87.5MHz，1080 = 108.0MHz */
  const [freq, setFreq] = useState(917);
  const display = (freq / 10).toFixed(1);
  const fill = ((freq - 875) / (1080 - 875)) * 100;

  return (
    <div
      className="lg-glass p-6"
      style={{ width: 'min(320px, 84vw)' }}
      data-component="glass-player-radio"
    >
      <span className="lg-noise rounded-[2rem]" aria-hidden />
      {/* ② 液态色晕：藏在玻璃内部 */}
      <span className="lg-liquid pointer-events-none absolute -inset-8 opacity-35 blur-3xl" aria-hidden />

      <div className="relative">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">FM Radio</p>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden /> Signal
          </span>
        </div>

        {/* ⑥ 超大极细频率数字（tabular-nums 防调台跳动） */}
        <p className="mt-2 text-[56px] font-extralight leading-none tracking-tight text-white tabular-nums">
          {display}
          <span className="ml-1.5 align-top text-base text-white/55">MHz</span>
        </p>

        {/* 调台滑杆：lg-range 液态渐变填充由 --fill 驱动 */}
        <input
          type="range"
          min={875}
          max={1080}
          step={1}
          value={freq}
          aria-label="调频"
          onChange={(e) => setFreq(Number(e.target.value))}
          className="lg-range mt-5 w-full"
          style={{ '--fill': `${fill}%` } as CSSProperties}
        />
        <div className="mt-2 flex justify-between font-mono text-[9px] text-white/30">
          <span>87.5</span>
          <span>97.7</span>
          <span>108.0</span>
        </div>

        {/* 当前电台 */}
        <p className="mt-4 border-t border-white/10 pt-3 text-sm text-white/70">
          正在收听 · <span className="text-white">星光广播 FM</span>
        </p>
      </div>
    </div>
  );
}
