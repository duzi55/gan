'use client';

import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';

/**
 * AuthorBio — 作者名片
 * 从 ProfileCard 抽离视觉模式，内容改为博客作者
 * 用于首页关于区 + 文章底部
 */
export function AuthorBio({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <GlassCard className="p-5">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900">
            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-zinc-100">
              杜
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-base font-medium text-zinc-100">杜子</h3>
            <p className="mt-0.5 text-xs text-zinc-400">设计师 · 写作者 · 茶人</p>
          </div>
          <Link
            href="/about"
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
          >
            关于
          </Link>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="flex flex-col items-center text-center">
        <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900">
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-zinc-100">
            杜
          </div>
        </div>
        <h3 className="mt-4 font-serif text-xl font-medium text-zinc-100">杜子</h3>
        <p className="mt-1 text-sm text-zinc-400">设计师 · 写作者 · 茶人</p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          在代码与茶汤之间寻找平衡。相信好的设计像好茶——
          不抢戏，但让体验完整。
        </p>
        <div className="mt-5 flex gap-6 text-center">
          <div>
            <div className="font-serif text-lg text-zinc-100">7</div>
            <div className="text-xs text-zinc-500">文章</div>
          </div>
          <div className="border-x border-white/10 px-6">
            <div className="font-serif text-lg text-zinc-100">2.1万</div>
            <div className="text-xs text-zinc-500">字数</div>
          </div>
          <div>
            <div className="font-serif text-lg text-zinc-100">2025</div>
            <div className="text-xs text-zinc-500">至今</div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
