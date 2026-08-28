'use client';

/**
 * 玻璃天气卡 GlassWeather —— 液态玻璃复刻 06
 * 2026-08-28 Claude·灵感页组件：
 *   - 复刻要点：①半透明材质 ②液态渐变（天空透出玻璃）⑤虚焦景深
 *     ⑥编辑式排版（超大温度数字）；
 *   - 数据为组件展示用静态样例（非站点业务数据），仅详情页按需加载；
 *   - 无动画循环、无定时器。
 */

/** 逐时预报展示样例（组件自包含，不接入任何业务接口） */
const HOURS = [
  { h: '14', t: 26 },
  { h: '15', t: 27 },
  { h: '16', t: 26 },
  { h: '17', t: 24 },
];

export default function GlassWeather() {
  return (
    /* 2026-08-28 Claude·双端适配：固定 320px 改 min() 钳制 */
    <div className="lg-glass p-6" style={{ width: 'min(320px, 84vw)' }}>
      <span className="lg-noise rounded-[2rem]" aria-hidden />
      {/* ② 液态天空：透过玻璃的渐变色晕（⑤ 虚焦） */}
      <span className="lg-liquid pointer-events-none absolute -inset-6 opacity-45 blur-2xl" aria-hidden />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">Shanghai · Now</p>
            {/* ⑥ 编辑式排版：超大极细温度数字 */}
            <p className="mt-2 text-[64px] font-extralight leading-none tracking-tight text-white">
              26<span className="align-top text-2xl text-white/70">°</span>
            </p>
            <p className="mt-1.5 text-sm text-white/70">多云转晴 · 体感 27°</p>
          </div>

          {/* 太阳：液态渐变圆 + 光晕 */}
          <span className="relative mt-1 flex h-12 w-12 items-center justify-center" aria-hidden>
            <span className="absolute inset-0 rounded-full opacity-60 blur-lg" style={{ background: 'radial-gradient(circle, #fde68a, transparent 70%)' }} />
            <span className="lg-liquid h-9 w-9 rounded-full" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)' }} />
          </span>
        </div>

        {/* 逐时预报：mono 时刻 + 渐变圆点 + 温度 */}
        <div className="mt-5 grid grid-cols-4 gap-2 border-t border-white/10 pt-4 text-center">
          {HOURS.map((it) => (
            <div key={it.h}>
              <p className="font-mono text-[10px] text-white/45">{it.h}:00</p>
              <span className="mx-auto mt-1.5 block h-1.5 w-1.5 rounded-full bg-white/60" aria-hidden />
              <p className="mt-1 text-xs text-white/80">{it.t}°</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
