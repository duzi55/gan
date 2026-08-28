'use client';

import { useState } from 'react';

/**
 * 玻璃卡带机 GlassCassette —— GlassPlayer 衍生变体 V1（cassette）
 * 2026-08-28 Claude·灵感系统 v2：
 *   - 衍化思路：黑胶唱片机 → 复古卡带机；透明带仓内置双液态渐变卷轴，
 *     播放时以 lg-spin 旋转指示走带，左右内径差表示磁带余量
 *     （复刻要点 ①半透明材质 ②液态渐变 ④颗粒噪点 ⑥编辑式排版）；
 *   - 由 GlassMount 以键 `glass-player:cassette` 按需 dynamic 加载，列表页不执行本文件；
 *   - 双端适配：宽度 min(320px, 84vw)，小屏不溢出。
 */
export default function GlassCassette() {
  const [playing, setPlaying] = useState(true);

  return (
    <div
      className="lg-glass p-6"
      style={{ width: 'min(320px, 84vw)' }}
      data-component="glass-player-cassette"
    >
      {/* ④ 颗粒噪点层（平铺 data-URI，零请求） */}
      <span className="lg-noise rounded-[2rem]" aria-hidden />

      <div className="relative">
        {/* 标签条：⑥ mono 小字 + 曲名 */}
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">Side A</p>
          <p className="font-mono text-[10px] text-white/40">C-60</p>
        </div>
        <p className="mt-1 text-lg font-semibold tracking-wide text-white">Midnight Tape</p>

        {/* 透明带仓：内凹深色窗，玻璃与深空的分层 */}
        <div
          className="mt-5 rounded-2xl border border-white/15 bg-[#0f0d1c]/70 p-4"
          style={{ boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5)' }}
        >
          <div className="flex items-center justify-between px-3">
            {/* 双卷轴：内径差示带量；lg-spin 仅在播放时旋转（CSS only） */}
            {[0, 1].map((i) => (
              <span
                key={i}
                className="lg-spin relative block h-16 w-16 rounded-full"
                data-playing={playing}
                style={{
                  background:
                    'conic-gradient(from 0deg, rgba(255,255,255,0.16) 0 9deg, transparent 9deg 60deg)',
                }}
                aria-hidden
              >
                {/* ② 液态渐变带盘：左盘带量多（内径小）、右盘带量少（内径大） */}
                <span
                  className="lg-liquid absolute rounded-full border border-white/25"
                  style={{ inset: i === 0 ? '16%' : '34%' }}
                />
                <span className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0f0d1c]" />
              </span>
            ))}
          </div>
          {/* 走带细线：连接两卷轴 */}
          <div className="mx-3 mt-1 h-px bg-white/20" aria-hidden />
          <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.35em] text-white/35">
            {playing ? 'Now Playing' : 'Paused'}
          </p>
        </div>

        {/* 操控面：倒带 / 播放 / 快进 */}
        <div className="mt-4 flex items-center justify-center gap-7 text-white">
          <button aria-label="倒带" className="transition-transform duration-300 hover:scale-110">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 12 20 6v12zM4 6h2v12H4z" />
            </svg>
          </button>
          <button
            aria-label={playing ? '暂停' : '播放'}
            onClick={() => setPlaying(!playing)}
            className="flex h-12 w-12 items-center justify-center rounded-full text-[#1b1430] shadow-lg transition-transform duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #a5f3fc, #c4b5fd 55%, #fda4af)',
              boxShadow:
                '0 10px 26px -8px rgba(167, 139, 250, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            }}
          >
            {playing ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
              </svg>
            ) : (
              <svg className="ml-0.5 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button aria-label="快进" className="transition-transform duration-300 hover:scale-110">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 12 4 18V6zM18 6h2v12h-2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
