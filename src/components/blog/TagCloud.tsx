'use client';

import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { tagConfig } from '@/lib/tags';

/**
 * TagCloud — 标签导航
 * 从 ServiceCard 抽离视觉模式，标签作为导航入口
 */
export function TagCloud({ tags, activeTag }: { tags: string[]; activeTag?: string }) {
  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-sm font-medium text-zinc-100">标签</h3>
        <Link href="/posts" className="text-xs text-zinc-500 transition-colors hover:text-zinc-300">
          全部文章
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const config = tagConfig(tag);
          const active = activeTag === tag;
          return (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all ${
                active
                  ? 'border-zinc-100 bg-zinc-100 text-zinc-900'
                  : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-zinc-100'
              }`}
            >
              <span
                className={`font-serif text-sm ${
                  active ? 'text-zinc-600' : 'text-zinc-500 group-hover:text-zinc-300'
                }`}
              >
                {config.icon}
              </span>
              {tag}
            </Link>
          );
        })}
      </div>
    </GlassCard>
  );
}
