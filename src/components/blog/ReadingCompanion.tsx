'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

/**
 * ReadingCompanion — 阅读伴侣
 * 从 MusicPlayer 抽离视觉模式，置于文章详情页
 * 提供阅读时的环境音
 */
export function ReadingCompanion() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const tracks = [
    { title: '雨夜书房', duration: '45:00', ambient: '雨声' },
    { title: '深夜电台', duration: '38:00', ambient: 'Lo-fi' },
    { title: '茶室晨光', duration: '52:00', ambient: '自然' },
  ];

  const track = tracks[currentTrack];

  return (
    <GlassCard className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-sm font-medium text-foreground">阅读伴侣</h3>
        <span className="text-xs text-muted">{track.ambient}</span>
      </div>

      {/* 进度条 + 封面 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105"
        >
          {isPlaying ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg className="h-5 w-5 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
          {/* 播放波纹 */}
          {isPlaying && (
            <span className="absolute inset-0 animate-ping rounded-full border border-foreground/40 opacity-30" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="truncate font-serif text-sm text-foreground">{track.title}</div>
          <div className="mt-1 text-xs text-muted">{track.duration}</div>
        </div>
      </div>

      {/* 曲目列表 */}
      <div className="mt-4 space-y-1">
        {tracks.map((t, i) => (
          <button
            key={t.title}
            onClick={() => setCurrentTrack(i)}
            className={`flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
              i === currentTrack
                ? 'bg-foreground/5 text-foreground'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <span className="font-serif text-faint">{String(i + 1).padStart(2, '0')}</span>
            <span className="flex-1 truncate">{t.title}</span>
            <span className="text-faint">{t.duration}</span>
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
