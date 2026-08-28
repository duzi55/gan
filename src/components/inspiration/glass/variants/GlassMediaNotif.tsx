'use client';

import { useState } from 'react';

/**
 * 玻璃媒体通知 GlassMediaNotif —— GlassNotification 衍生变体 V2（media）
 * 2026-08-28 Claude·灵感系统 v2：
 *   - 衍化思路：普通通知 → 媒体通知；内嵌迷你唱片（lg-spin 播放态旋转）
 *     与极简操控面，通知即播放器（复刻要点 ①②③④）；
 *   - 由 GlassMount 以键 `glass-notification:media` 按需 dynamic 加载；
 *   - 双端适配：宽度 min(320px, 84vw)。
 */
export default function GlassMediaNotif() {
  const [playing, setPlaying] = useState(true);

  return (
    <div
      className="lg-glass p-5"
      style={{ width: 'min(320px, 84vw)' }}
      data-component="glass-notification-media"
    >
      <span className="lg-noise rounded-[2rem]" aria-hidden />

      <div className="relative">
        <div className="flex items-center gap-3.5">
          {/* 迷你唱片：conic 黑胶纹 + 液态渐变标签，播放时 lg-spin 旋转 */}
          <span
            className="lg-spin relative h-12 w-12 shrink-0 rounded-full"
            data-playing={playing}
            style={{
              background:
                'conic-gradient(from 0deg, #0d0d16, #2b2b3f 25%, #0d0d16 50%, #23233a 75%, #0d0d16)',
            }}
            aria-hidden
          >
            <span className="lg-liquid absolute inset-[30%] rounded-full border border-white/25" />
            <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#12101f]" />
          </span>

          {/* 正文：媒体通知元信息 */}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="truncate text-sm font-semibold text-white">Glass Waves</p>
              <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                Media
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-white/55">Aurora Fields · 通知内嵌播放</p>
          </div>
        </div>

        {/* 细进度：液态渐变填充 */}
        <div className="mt-3.5 h-1 overflow-hidden rounded-full bg-white/15">
          <div className="lg-liquid h-full w-[58%] rounded-full" />
        </div>

        {/* 操控面 */}
        <div className="mt-3 flex items-center justify-center gap-7 text-white">
          <button aria-label="上一首" className="transition-transform duration-300 hover:scale-110">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 5h2v14H6zM20 5v14L9.5 12z" />
            </svg>
          </button>
          <button
            aria-label={playing ? '暂停' : '播放'}
            onClick={() => setPlaying(!playing)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#1b1430] transition-transform duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #a5f3fc, #c4b5fd 55%, #fda4af)',
              boxShadow:
                '0 8px 20px -8px rgba(167, 139, 250, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            }}
          >
            {playing ? (
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
              </svg>
            ) : (
              <svg className="ml-0.5 h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button aria-label="下一首" className="transition-transform duration-300 hover:scale-110">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 5h2v14h-2zM4 5v14l10.5-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
