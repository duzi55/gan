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
        <h3 className="font-serif text-sm font-medium text-foreground">标签</h3>
        <Link href="/posts" className="text-xs text-muted transition-colors hover:text-foreground">
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
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted hover:border-accent/50 hover:text-foreground'
              }`}
            >
              <span
                className={`font-serif text-sm ${
                  active ? 'text-background' : 'text-faint'
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
