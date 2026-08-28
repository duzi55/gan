'use client';

import { useEffect, useState } from 'react';

/**
 * 玻璃时钟 GlassClock —— GlassWeather 衍生变体 V1（clock）
 * 2026-08-28 Claude·灵感系统 v2：
 *   - 衍化思路：天气卡 → 玻璃时钟；沿用「超大极细数字」编辑式排版，
 *     液态色晕透出玻璃（复刻要点 ①②⑤⑥）；
 *   - 低频定时器：1s setInterval 仅更新本组件 state，卸载即清理；
 *     经 GlassMount dynamic(ssr:false) 加载，无 SSR 水合错位问题；
 *   - 由 GlassMount 以键 `glass-weather:clock` 按需 dynamic 加载；
 *   - 双端适配：宽度 min(320px, 84vw)，字号 52px 保证 HH:MM:SS 不溢出。
 */

/** 两位补零 */
const pad = (n: number) => String(n).padStart(2, '0');

/** 星期显示（组件自包含） */
const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export default function GlassClock() {
  const [now, setNow] = useState<Date | null>(null);

  /* 挂载后再取时，避免任何水合不一致；卸载清理定时器 */
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="lg-glass p-6 text-center"
      style={{ width: 'min(320px, 84vw)' }}
      data-component="glass-weather-clock"
    >
      <span className="lg-noise rounded-[2rem]" aria-hidden />
      {/* ② 液态色晕：透过玻璃的微光 */}
      <span className="lg-liquid pointer-events-none absolute -inset-8 opacity-35 blur-3xl" aria-hidden />

      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">Local Time</p>

        {/* ⑥ 超大极细时标（tabular-nums 防秒跳抖动） */}
        <p className="mt-3 text-[52px] font-extralight leading-none tracking-tight text-white tabular-nums">
          {now
            ? `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
            : '--:--:--'}
        </p>

        {/* 日期行 */}
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
          {now
            ? `${now.getFullYear()} · ${pad(now.getMonth() + 1)} · ${pad(now.getDate())} ${WEEKDAYS[now.getDay()]}`
            : 'Loading'}
        </p>
      </div>
    </div>
  );
}
