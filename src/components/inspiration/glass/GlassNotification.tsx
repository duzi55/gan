'use client';

import { useState } from 'react';

/**
 * 玻璃通知卡 GlassNotification —— 液态玻璃复刻 03
 * 2026-08-28 Claude·灵感页组件：
 *   - 复刻要点：①半透明材质 ②液态渐变 ③柔软体积感 ④颗粒噪点；
 *   - 关闭后淡出为「已恢复」玻璃胶囊，可一键复原（本地 state，无副作用）；
 *   - 由 GlassMount 按需 dynamic 加载。
 */
export default function GlassNotification() {
  const [dismissed, setDismissed] = useState(false);

  /* 关闭态：一条可复原的玻璃胶囊，保持舞台不空 */
  if (dismissed) {
    return (
      <button
        onClick={() => setDismissed(false)}
        className="lg-glass flex items-center gap-2.5 px-5 py-3 text-sm text-white/70 transition-transform duration-300 hover:scale-[1.03]"
        style={{ borderRadius: '999px' }}
      >
        <span className="lg-noise" style={{ borderRadius: '999px' }} aria-hidden />
        通知已关闭 · 点击恢复
      </button>
    );
  }

  return (
    <div className="lg-glass w-[340px] p-5">
      <span className="lg-noise rounded-[2rem]" aria-hidden />
      <div className="relative">
        <div className="flex gap-3.5">
          {/* ② 液态渐变图标方块 */}
          <span
            className="lg-liquid flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)' }}
            aria-hidden
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6M10.3 19a2 2 0 0 0 3.4 0" />
            </svg>
          </span>

          {/* 正文：⑥ 编辑式排版（强标题 + 弱正文 + mono 时间） */}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-white">灵感已同步</p>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">now</span>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">
              「液态玻璃」复刻组件已上架灵感页，点击卡片即可查看可交互版本。
            </p>
            <div className="mt-3.5 flex gap-2.5">
              <button
                onClick={() => setDismissed(true)}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs text-white transition-colors hover:bg-white/20"
              >
                查看
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="rounded-full px-4 py-1.5 text-xs text-white/55 transition-colors hover:text-white"
              >
                稍后
              </button>
            </div>
          </div>
        </div>

        {/* 关闭钮 */}
        <button
          aria-label="关闭通知"
          onClick={() => setDismissed(true)}
          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
