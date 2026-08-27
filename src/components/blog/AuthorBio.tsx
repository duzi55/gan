'use client';

import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';

/**
 * AuthorBio — 作者名片
 * 2026-08-27 Claude·视觉重设计「墨境」：
 * - 移除硬编码的假统计（7 篇 / 2.1 万字），改为调用方传入真实值，
 *   未传时该栏位显示 "—"，杜绝 mock 数据。
 * - 头像容器由冷灰渐变圆改为纸面方章（细线框 + 朱砂「记」印），
 *   「关于」按钮 hover 描边统一为朱砂 accent。
 */
export function AuthorBio({
  compact = false,
  postCount,
  totalWords,
}: {
  compact?: boolean;
  /** 真实文章数 */
  postCount?: number;
  /** 真实总字数 */
  totalWords?: number;
}) {
  if (compact) {
    return (
      <GlassCard className="p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-foreground/[0.04]">
            <span className="ink-seal">记</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-base font-medium text-foreground">杜子</h3>
            <p className="mt-0.5 text-xs text-muted">设计师 · 写作者 · 茶人</p>
          </div>
          <Link
            href="/about"
            className="rounded-full border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-accent/50 hover:text-foreground"
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
        {/* 朱砂印记头像：纸面方章 */}
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-foreground/[0.04]">
          <span className="ink-seal !h-9 !w-9 !rounded-md !text-xl">记</span>
        </div>
        <h3 className="ink-display mt-4 text-xl text-foreground">杜子</h3>
        <p className="mt-1 text-sm text-muted">设计师 · 写作者 · 茶人</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          在代码与茶汤之间寻找平衡。相信好的设计像好茶——
          不抢戏，但让体验完整。
        </p>
        <div className="mt-5 flex gap-6 text-center">
          <div>
            <div className="font-display text-lg text-foreground">
              {postCount ?? '—'}
            </div>
            <div className="text-xs text-muted">文章</div>
          </div>
          <div className="border-x border-border px-6">
            <div className="font-display text-lg text-foreground">
              {totalWords != null ? `${(totalWords / 10000).toFixed(1)}万` : '—'}
            </div>
            <div className="text-xs text-muted">字数</div>
          </div>
          <div>
            <div className="font-display text-lg text-foreground">
              {postCount ? new Date().getFullYear() : '—'}
            </div>
            <div className="text-xs text-muted">至今</div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
