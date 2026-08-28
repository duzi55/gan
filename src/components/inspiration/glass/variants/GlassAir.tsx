'use client';

/**
 * 玻璃空气质量卡 GlassAir —— GlassWeather 衍生变体 V2（air）
 * 2026-08-28 Claude·灵感系统 v2：
 *   - 衍化思路：天气卡 → 空气质量卡；SVG 环形进度以液态渐变描边
 *     （linearGradient 取同一青蓝→粉紫色系），中心大数字回显 AQI
 *     （复刻要点 ①②③⑥）；
 *   - AQI 与分项为组件自包含展示样例（非站点业务数据），无定时器；
 *   - 由 GlassMount 以键 `glass-weather:air` 按需 dynamic 加载；
 *   - 双端适配：宽度 min(320px, 84vw)。
 */

/** 展示样例：AQI 42 = 优（以 150 为环形满量程） */
const AQI = 42;
const R = 52;
const CIRC = 2 * Math.PI * R;
const OFFSET = CIRC * (1 - Math.min(AQI, 150) / 150);

/** 分项指标样例 */
const STATS = [
  { k: 'PM2.5', v: '11' },
  { k: 'PM10', v: '23' },
  { k: 'O₃', v: '68' },
];

export default function GlassAir() {
  return (
    <div
      className="lg-glass p-6"
      style={{ width: 'min(320px, 84vw)' }}
      data-component="glass-weather-air"
    >
      <span className="lg-noise rounded-[2rem]" aria-hidden />

      <div className="relative">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
            Air Quality
          </p>
          <p className="font-mono text-[10px] text-white/40">Shanghai</p>
        </div>

        {/* AQI 环形：液态渐变描边 + 中心大数字 */}
        <div className="relative mx-auto mt-3 h-32 w-32">
          <svg
            className="h-full w-full -rotate-90"
            viewBox="0 0 120 120"
            role="img"
            aria-label={`空气质量指数 ${AQI}，等级优`}
          >
            <defs>
              <linearGradient id="lg-air-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="55%" stopColor="#c4b5fd" />
                <stop offset="100%" stopColor="#fda4af" />
              </linearGradient>
            </defs>
            {/* 底环 */}
            <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9" />
            {/* 液态渐变进度环 */}
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="url(#lg-air-grad)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={OFFSET}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-4xl font-extralight leading-none text-white tabular-nums">{AQI}</p>
            <p className="mt-1 text-xs text-emerald-300">优</p>
          </div>
        </div>

        {/* 分项指标 */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
          {STATS.map((s) => (
            <div key={s.k}>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">{s.k}</p>
              <p className="mt-1 text-sm text-white/80 tabular-nums">{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
