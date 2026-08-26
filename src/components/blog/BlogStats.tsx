'use client';

import { useSyncExternalStore } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

// 空订阅：仅用于区分服务端渲染与客户端挂载
const subscribe = () => () => {};

/**
 * BlogStats — 博客统计
 * 从 StatsCard 抽离视觉模式，数据改为博客元信息
 * 用于首页侧栏
 */
export function BlogStats({
  articleCount = 7,
  totalWords = 21000,
  lastUpdate = '2025-08-26',
}: {
  articleCount?: number;
  totalWords?: number;
  lastUpdate?: string;
}) {
  // 客户端挂载后为 true（服务端渲染为 false），避免 hydration 不一致
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  // 简单的发布活跃度条形图（按月）
  const monthlyData = [
    { month: '6月', count: 1 },
    { month: '7月', count: 2 },
    { month: '8月', count: 4 },
  ];
  const maxCount = Math.max(...monthlyData.map((d) => d.count));

  return (
    <GlassCard className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-serif text-sm font-medium text-zinc-100">博客统计</h3>
        <span className="text-xs text-zinc-500">实时</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="font-serif text-2xl text-zinc-100">{articleCount}</div>
          <div className="mt-1 text-xs text-zinc-500">文章</div>
        </div>
        <div className="border-x border-white/5 px-4">
          <div className="font-serif text-2xl text-zinc-100">
            {(totalWords / 10000).toFixed(1)}<span className="text-sm text-zinc-500">万</span>
          </div>
          <div className="mt-1 text-xs text-zinc-500">字数</div>
        </div>
        <div>
          <div className="font-serif text-2xl text-zinc-100">
            {mounted ? lastUpdate.slice(5) : '—'}
          </div>
          <div className="mt-1 text-xs text-zinc-500">最后更新</div>
        </div>
      </div>

      {/* 发布活跃度迷你图 */}
      <div className="mt-6">
        <div className="mb-2 text-xs text-zinc-500">发布活跃度</div>
        <div className="flex items-end gap-3 h-16">
          {monthlyData.map((d) => (
            <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-gradient-to-t from-zinc-700 to-zinc-500 transition-all duration-700"
                style={{
                  height: mounted ? `${(d.count / maxCount) * 100}%` : '0%',
                  minHeight: mounted ? '4px' : '0',
                }}
              />
              <span className="text-[10px] text-zinc-600">{d.month}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
