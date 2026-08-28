'use client';

import { useState } from 'react';

/**
 * 玻璃唱片机 GlassPlayer —— 液态玻璃复刻 01
 * 2026-08-28 Claude·灵感页组件：
 *   - 复刻要点：①半透明材质 ②液态渐变 ③柔软体积感 ④颗粒噪点；
 *   - 「播放」仅驱动 CSS 旋转动画（animation-play-state 切换），
 *     无音频资源、无定时器，零性能负担；
 *   - 由 GlassMount 按需 dynamic 加载，列表页不会执行本文件。
 */
export default function GlassPlayer() {
  const [playing, setPlaying] = useState(true);

  return (
    <div className="lg-glass w-[320px] p-6" data-component="glass-player">
      {/* ④ 颗粒噪点层（平铺 data-URI，零请求） */}
      <span className="lg-noise rounded-[2rem]" aria-hidden />
      {/* ② 液态渐变色晕：藏在玻璃内部，blur 后如液体漫开 */}
      <span className="lg-liquid pointer-events-none absolute -inset-8 opacity-40 blur-3xl" aria-hidden />

      <div className="relative">
        {/* 唱片：conic 黑胶纹 + 高光弧 + 液态渐变标签 */}
        <div className="flex flex-col items-center">
          <div
            className="lg-spin relative h-44 w-44 rounded-full shadow-2xl"
            data-playing={playing}
            style={{
              background:
                'conic-gradient(from 0deg, #0d0d16, #2b2b3f 12%, #0d0d16 25%, #23233a 40%, #0d0d16 55%, #2b2b3f 70%, #0d0d16 85%, #23233a 95%, #0d0d16)',
            }}
          >
            {/* 高光弧：模拟玻璃/胶面反光 */}
            <span
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'conic-gradient(from 210deg, transparent 0deg, rgba(255,255,255,0.18) 30deg, transparent 80deg)',
              }}
              aria-hidden
            />
            {/* ② 液态渐变中心标签 */}
            <span className="lg-liquid absolute inset-[34%] rounded-full border border-white/30" aria-hidden />
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#12101f]" aria-hidden />
          </div>

          {/* ⑥ 编辑式排版：大字题名 + mono 小字 */}
          <div className="mt-5 text-center">
            <p className="text-xl font-semibold tracking-wide text-white">Liquid Dreams</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
              Aurora Fields · 03:42
            </p>
          </div>
        </div>

        {/* 进度条：液态渐变填充 */}
        <div className="mt-5">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
            <div className="lg-liquid h-full w-[42%] rounded-full" />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[10px] text-white/40">
            <span>01:33</span>
            <span>03:42</span>
          </div>
        </div>

        {/* 操控面：玻璃圆钮 + 液态渐变播放键 */}
        <div className="mt-4 flex items-center justify-center gap-7 text-white">
          <button aria-label="上一首" className="transition-transform duration-300 hover:scale-110">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 5h2v14H6zM20 5v14L9.5 12z" />
            </svg>
          </button>
          <button
            aria-label={playing ? '暂停' : '播放'}
            onClick={() => setPlaying(!playing)}
            className="flex h-14 w-14 items-center justify-center rounded-full text-[#1b1430] shadow-lg transition-transform duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #a5f3fc, #c4b5fd 55%, #fda4af)',
              boxShadow: '0 10px 26px -8px rgba(167,139,250,0.7), inset 0 1px 0 rgba(255,255,255,0.6)',
            }}
          >
            {playing ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
              </svg>
            ) : (
              <svg className="ml-0.5 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button aria-label="下一首" className="transition-transform duration-300 hover:scale-110">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 5h2v14h-2zM4 5v14l10.5-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
