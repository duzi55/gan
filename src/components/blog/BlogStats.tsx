'use client';

import { useSyncExternalStore } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

// 空订阅：仅用于区分服务端渲染与客户端挂载
const subscribe = () => () => {};

/**
 * BlogStats — 博客统计
 * 2026-08-27 Claude·视觉重设计「墨境」：
 * - 移除内部硬编码的 mock 数据（totalWords=21000、monthlyData 假图表），
 *   全部统计改由服务端页面传入真实值（见 lib/posts.ts 的 words/getMonthlyCounts）。
 * - 视觉从液态玻璃调整为纸卡风格（样式由 globals.css 统一控制）。
 */

interface MonthlyDatum {
  month: string;
  count: number;
}

export function BlogStats({
  articleCount,
  totalWords,
  lastUpdate,
  monthlyData,
}: {
  /** 真实文章总数 */
  articleCount: number;
  /** 真实总字数 */
  totalWords: number;
  /** 最新一篇文章的发布日期（YYYY-MM-DD） */
  lastUpdate: string;
  /** 近几个自然月的真实发布量（旧→新） */
  monthlyData: MonthlyDatum[];
}) {
  // 客户端挂载后为 true（服务端渲染为 false），避免 hydration 不一致
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const maxCount = Math.max(1, ...monthlyData.map((d) => d.count));

  return (
    <GlassCard className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-serif text-sm font-medium text-foreground">博客统计</h3>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-faint">
          archive
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="font-display text-2xl text-foreground">{articleCount}</div>
          <div className="mt-1 text-xs text-muted">文章</div>
        </div>
        <div className="border-x border-border px-4">
          <div className="font-display text-2xl text-foreground">
            {(totalWords / 10000).toFixed(1)}<span className="text-sm text-muted">万</span>
          </div>
          <div className="mt-1 text-xs text-muted">字数</div>
        </div>
        <div>
          <div className="font-display text-2xl text-foreground">
            {mounted ? lastUpdate.slice(5) : '—'}
          </div>
          <div className="mt-1 text-xs text-muted">最后更新</div>
        </div>
      </div>

      {/* 发布活跃度：按真实日期聚合的迷你柱图 */}
      <div className="mt-6">
        <div className="mb-2 text-xs text-muted">发布活跃度</div>
        <div className="flex h-16 items-end gap-3">
          {monthlyData.map((d) => (
            <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-accent/70 transition-all duration-700"
                style={{
                  height: mounted ? `${Math.max((d.count / maxCount) * 100, d.count > 0 ? 8 : 2)}%` : '0%',
                  minHeight: '2px',
                }}
              />
              <span className="text-[10px] text-faint">{d.month}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
