/**
 * 灵感微缩图 Minis —— 组件简略版的纯 CSS 快照
 * 2026-08-28 Claude·性能设计（应用户要求"微缩图不能影响性能"）：
 *   - 每个微缩图是独立静态 JSX：无 hooks、无 'use client'、无图片、无动画循环，
 *     列表页/首页渲染它们不产生任何客户端 JS 与网络请求；
 *   - 结构与配色复刻自 glass/ 下对应完整组件（等比简化），点击卡片进入
 *     详情页后才按需加载真组件本体；
 *   - 仅使用 lg-glass / lg-liquid / lg-noise 三个 CSS 类（liquid-glass.css）。
 */

/** 01 · 玻璃唱片机微缩图 */
export function MiniPlayer() {
  return (
    <div className="lg-glass w-44 p-3.5" style={{ borderRadius: '1.2rem' }}>
      <div className="flex items-center gap-2.5">
        {/* 唱片：conic 黑胶纹 + 液态渐变标签 */}
        <span
          className="relative h-11 w-11 shrink-0 rounded-full"
          style={{ background: 'conic-gradient(#0d0d16, #2b2b3f 25%, #0d0d16 50%, #23233a 75%, #0d0d16)' }}
          aria-hidden
        >
          <span className="lg-liquid absolute inset-[32%] rounded-full border border-white/30" />
        </span>
        <span className="flex-1 space-y-1.5" aria-hidden>
          <span className="block h-1.5 w-4/5 rounded-full bg-white/70" />
          <span className="block h-1.5 w-1/2 rounded-full bg-white/30" />
        </span>
      </div>
      {/* 进度 + 控制点 */}
      <span className="mt-3 block h-1 rounded-full bg-white/20" aria-hidden>
        <span className="lg-liquid block h-full w-2/5 rounded-full" />
      </span>
      <span className="mt-2.5 flex items-center justify-center gap-3" aria-hidden>
        <i className="h-1 w-1 rounded-full bg-white/40" />
        <i className="h-3 w-3 rounded-full bg-white/90" />
        <i className="h-1 w-1 rounded-full bg-white/40" />
      </span>
    </div>
  );
}

/** 02 · 液态玻璃 Dock 微缩图 */
export function MiniDock() {
  const dots = ['#7dd3fc', '#c4b5fd', '#fda4af', '#fcd34d', '#86efac'];
  return (
    <div className="lg-glass flex items-center gap-2 px-3.5 py-2.5" style={{ borderRadius: '999px' }}>
      <span className="lg-noise" style={{ borderRadius: '999px' }} aria-hidden />
      {dots.map((c, i) => (
        <i
          key={c}
          className="block h-6 w-6 rounded-xl border border-white/20 bg-white/10"
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)', background: `linear-gradient(160deg, ${c}55, rgba(255,255,255,0.08))` }}
          aria-hidden
        >
          {/* 中间的键呈 hover 放大态，复刻 Dock 动势 */}
          {i === 2 && <span className="mx-auto mt-1 block h-1 w-1 rounded-full bg-white/90" />}
        </i>
      ))}
    </div>
  );
}

/** 03 · 玻璃通知卡微缩图 */
export function MiniNotification() {
  return (
    <div className="lg-glass w-48 p-3" style={{ borderRadius: '1.2rem' }}>
      <div className="flex gap-2.5">
        <span className="lg-liquid h-8 w-8 shrink-0 rounded-xl" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)' }} aria-hidden />
        <span className="flex-1 space-y-1.5 pt-0.5" aria-hidden>
          <span className="block h-1.5 w-3/4 rounded-full bg-white/75" />
          <span className="block h-1.5 w-full rounded-full bg-white/25" />
          <span className="block h-1.5 w-2/3 rounded-full bg-white/25" />
        </span>
      </div>
    </div>
  );
}

/** 04 · 玻璃音量滑块微缩图 */
export function MiniSlider() {
  return (
    <div className="lg-glass w-44 px-4 py-3.5" style={{ borderRadius: '1.2rem' }}>
      <span className="mb-2.5 block h-1.5 w-8 rounded-full bg-white/40" aria-hidden />
      <span className="relative block h-2 rounded-full border border-white/15 bg-white/10" aria-hidden>
        <span className="lg-liquid absolute inset-y-0 left-0 w-3/5 rounded-full" />
        {/* 玻璃拇指 */}
        <span
          className="absolute left-[58%] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-white/80"
          style={{ background: 'linear-gradient(160deg, #ffffff, #dcd8f8)', boxShadow: '0 3px 8px rgba(0,0,0,0.35)' }}
        />
      </span>
    </div>
  );
}

/** 05 · 玻璃开关微缩图（开启态） */
export function MiniToggle() {
  return (
    <div className="lg-glass flex items-center gap-3 px-4 py-3" style={{ borderRadius: '1.2rem' }}>
      <span className="flex-1 space-y-1.5" aria-hidden>
        <span className="block h-1.5 w-12 rounded-full bg-white/75" />
        <span className="block h-1 w-8 rounded-full bg-white/30" />
      </span>
      {/* 开关：液态渐变轨道 + 玻璃 knob */}
      <span
        className="relative block h-6 w-11 shrink-0 rounded-full border border-white/20"
        style={{ background: 'linear-gradient(135deg, #67e8f9, #c4b5fd 55%, #fda4af)' }}
        aria-hidden
      >
        <span
          className="absolute right-0.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-white/80"
          style={{ background: 'linear-gradient(160deg, #ffffff, #e2e0f5)', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
        />
      </span>
    </div>
  );
}

/** 06 · 玻璃天气卡微缩图（⑥ 编辑式超大数字） */
export function MiniWeather() {
  return (
    <div className="lg-glass w-44 p-3.5" style={{ borderRadius: '1.2rem' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl font-extralight leading-none text-white" aria-hidden>
            26<span className="align-top text-xs text-white/70">°</span>
          </p>
          <span className="mt-1.5 block h-1 w-14 rounded-full bg-white/30" aria-hidden />
        </div>
        <span className="relative mt-0.5 block h-7 w-7" aria-hidden>
          <span className="lg-liquid absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)' }} />
        </span>
      </div>
      <span className="mt-2.5 flex justify-between border-t border-white/10 pt-2" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <i key={i} className="h-1 w-4 rounded-full bg-white/25" />
        ))}
      </span>
    </div>
  );
}
