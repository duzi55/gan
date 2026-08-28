'use client';

import { useState, type CSSProperties } from 'react';

/**
 * 玻璃音量滑块 GlassSlider —— 液态玻璃复刻 04
 * 2026-08-28 Claude·灵感页组件：
 *   - 复刻要点：①半透明材质 ②液态渐变 ③柔软体积感；
 *   - 原生 <input type=range> 自绘（.lg-range）：液态渐变填充由
 *     内联变量 --fill 驱动（CSS 背景 size，无逐帧重排）；
 *   - 由 GlassMount 按需 dynamic 加载。
 */
export default function GlassSlider() {
  const [value, setValue] = useState(64);

  return (
    <div className="lg-glass w-[320px] p-6">
      <span className="lg-noise rounded-[2rem]" aria-hidden />
      <div className="relative">
        {/* 标题行：mono 小字 + 大数值（⑥ 编辑式排版） */}
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">Volume</p>
          <p className="text-2xl font-light text-white">
            {value}
            <span className="ml-0.5 text-xs text-white/50">%</span>
          </p>
        </div>

        {/* 滑块本体 */}
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          aria-label="音量"
          onChange={(e) => setValue(Number(e.target.value))}
          className="lg-range mt-5 w-full"
          style={{ '--fill': `${value}%` } as CSSProperties}
        />

        {/* 刻度 */}
        <div className="mt-2 flex justify-between font-mono text-[9px] text-white/30">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
