'use client';

import { useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { tagConfig, collectTags } from '@/lib/tags';
import type { PostMeta } from '@/lib/posts';

/**
 * PostsArchive — 文章归档
 * 以 window.location.search 为唯一数据源（useSyncExternalStore 订阅）：
 * ?q=（搜索）、?tag=（标签）。数据由服务端父页面传入（避免在客户端引入 fs）。
 *
 * 2026-08-27 Claude·视觉重设计「墨境」：
 *   - 移除紫/青光晕装饰，头部改用 ink-eyebrow / ink-display 体系；
 *   - 序号统一为朱砂等宽 ink-index；行 hover 描边由冷灰 zinc 换为朱砂 accent；
 *   - 搜索面板沿用细线框纸卡（liquid-glass-card 已在 globals.css 重构）。
 */

// 订阅 URL 变化：popstate 与本组件手动派发的 notes:urlchange
const subscribeToUrl = (callback: () => void) => {
  window.addEventListener('popstate', callback);
  window.addEventListener('notes:urlchange', callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener('notes:urlchange', callback);
  };
};

function useUrlParam(name: string): string {
  return useSyncExternalStore(
    subscribeToUrl,
    () => new URLSearchParams(window.location.search).get(name) ?? '',
    // 服务端渲染快照：始终为空
    () => ''
  );
}

export function PostsArchive({ posts }: { posts: PostMeta[] }) {
  const query = useUrlParam('q');
  const tag = useUrlParam('tag');
  // 客户端挂载后为 true，用于控制空状态渲染
  const isHydrated = useSyncExternalStore(subscribeToUrl, () => true, () => false);

  const allTags = useMemo(() => collectTags(posts), [posts]);

  // 写回 URL 并通知订阅者重新读取
  const updateUrl = (nextQuery: string, nextTag: string) => {
    const params = new URLSearchParams();
    if (nextQuery) params.set('q', nextQuery);
    if (nextTag) params.set('tag', nextTag);
    const qs = params.toString();
    const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
    window.history.replaceState(null, '', `${base}/posts/${qs ? `?${qs}` : ''}`);
    window.dispatchEvent(new Event('notes:urlchange'));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (tag && !p.tags.includes(tag)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, query, tag]);

  /* 标签筛选 chip：选中=墨底纸字，未选中=纸底细线框 + 朱砂 hover */
  const chipClass = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs transition-all ${
      active
        ? 'border-foreground bg-foreground text-background'
        : 'border-border text-muted hover:border-accent/50 hover:text-foreground'
    }`;

  /* 归档列表行：编号目录式，跨页（tags/[tag]）保持同一视觉语言 */
  const rowClass =
    'group grid items-center gap-4 rounded-xl border border-transparent px-5 py-4 transition-all hover:border-accent/30 hover:bg-foreground/[0.03] md:grid-cols-[auto_1fr_auto]';

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ═══ 头部 ═══ */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 md:pt-28">
        <p className="ink-eyebrow">
          <span className="h-px w-8 bg-border" />
          Archive · 全部手记
        </p>
        <h1 className="ink-display mt-6 text-4xl leading-[1.15] text-foreground md:text-6xl">
          文章总目
        </h1>
        <p className="mt-4 max-w-lg font-serif text-sm leading-loose text-muted md:text-base">
          {posts.length} 篇笔记，关于设计美学、前端工程与极简界面。
        </p>
      </section>

      {/* ═══ 搜索 + 标签筛选 ═══ */}
      <section className="mx-auto max-w-6xl px-6 pb-10">
        <GlassCard className="p-5 md:p-6">
          <div className="flex items-center gap-3">
            <svg
              className="h-4 w-4 shrink-0 text-faint"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => updateUrl(e.target.value, tag)}
              placeholder="搜索标题、摘要或标签…"
              className="w-full bg-transparent text-sm text-foreground placeholder:text-faint focus:outline-none"
            />
            {query && (
              <button
                onClick={() => updateUrl('', tag)}
                className="shrink-0 text-xs text-muted transition-colors hover:text-foreground"
              >
                清除
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
            <button
              onClick={() => updateUrl(query, '')}
              className={chipClass(!tag)}
            >
              全部
            </button>
            {allTags.map((t) => {
              const active = tag === t;
              return (
                <button
                  key={t}
                  onClick={() => updateUrl(query, active ? '' : t)}
                  className={`${chipClass(active)} flex items-center gap-1.5`}
                >
                  <span className="font-serif text-sm">{tagConfig(t).icon}</span>
                  {t}
                </button>
              );
            })}
          </div>
        </GlassCard>
      </section>

      {/* ═══ 文章列表 ═══ */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        {isHydrated && filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-20 text-center">
            <p className="font-serif text-muted">没有找到匹配的文章</p>
            <button
              onClick={() => updateUrl('', '')}
              className="mt-4 text-xs text-muted underline-offset-4 hover:underline"
            >
              清除筛选条件
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((post, i) => (
              <Link key={post.slug} href={`/posts/${post.slug}`} className={rowClass}>
                <span className="ink-index hidden md:block">{String(i + 1).padStart(2, '0')}</span>
                <div className="min-w-0">
                  <h3 className="font-serif text-base font-medium leading-snug text-foreground">
                    <span className="ink-underline">{post.title}</span>
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                    <span>{post.date}</span>
                    <span className="h-px w-3 bg-border" />
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="text-faint transition-colors group-hover:text-muted"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="hidden text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent md:block">
                  →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
