'use client';

import { GlassCard } from '@/components/ui/GlassCard';

/**
 * WeatherMood — 文章氛围
 * 从 WeatherCard 抽离视觉模式，作为文章详情页侧栏
 * 天气呼应文章的情绪基调
 */
export function WeatherMood({
  gradient,
  accent,
  mood = '深夜',
}: {
  gradient: string;
  accent: string;
  mood?: string;
}) {
  return (
    <GlassCard className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-sm font-medium text-zinc-100">氛围</h3>
        <span className="text-xs text-zinc-500">{mood}</span>
      </div>

      {/* 迷你天气场景 */}
      <div
        className="relative h-32 overflow-hidden rounded-xl"
        style={{ background: gradient }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-12 w-12 rounded-full blur-sm"
            style={{ backgroundColor: accent, opacity: 0.6 }}
          />
        </div>
        {/* 静态雨/雪/星点 */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-px w-4 bg-white/20"
              style={{
                top: `${15 + i * 10}%`,
                left: `${(i * 23) % 90}%`,
                transform: `rotate(15deg)`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-white/5 p-3">
          <div className="font-serif text-lg text-zinc-100">
            {accent}
          </div>
          <div className="mt-0.5 text-xs text-zinc-500">主色调</div>
        </div>
        <div className="rounded-lg bg-white/5 p-3">
          <div className="font-serif text-lg text-zinc-100">
            {mood}
          </div>
          <div className="mt-0.5 text-xs text-zinc-500">情绪</div>
        </div>
      </div>
    </GlassCard>
  );
}
