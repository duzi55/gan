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

  const chipClass = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs transition-all ${
      active
        ? 'border-zinc-100 bg-zinc-100 text-zinc-900'
        : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-zinc-100'
    }`;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ═══ 头部 ═══ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-12 md:pt-28">
          <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-zinc-600">
            <span className="h-px w-8 bg-zinc-700" />
            <span>Archive · {new Date().getFullYear()}</span>
          </div>
          <h1 className="font-serif text-3xl font-bold leading-[1.15] tracking-wide text-zinc-50 md:text-5xl">
            全部文章
          </h1>
          <p className="mt-4 max-w-lg font-serif text-sm leading-relaxed text-zinc-500">
            {posts.length} 篇笔记，关于设计美学、前端工程与极简界面。
          </p>
        </div>
      </section>

      {/* ═══ 搜索 + 标签筛选 ═══ */}
      <section className="mx-auto max-w-6xl px-6 pb-10">
        <GlassCard className="p-5 md:p-6">
          <div className="flex items-center gap-3">
            <svg
              className="h-4 w-4 shrink-0 text-zinc-600"
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
              className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => updateUrl('', tag)}
                className="shrink-0 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
              >
                清除
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-4">
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
          <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
            <p className="font-serif text-zinc-500">没有找到匹配的文章</p>
            <button
              onClick={() => updateUrl('', '')}
              className="mt-4 text-xs text-zinc-400 underline-offset-4 hover:underline"
            >
              清除筛选条件
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post, i) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="group grid items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 transition-all hover:border-white/10 hover:bg-white/5 md:grid-cols-[auto_1fr_auto]"
              >
                <span className="hidden w-10 font-serif text-sm text-zinc-600 md:block">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate font-serif text-base font-medium text-zinc-100 transition-colors group-hover:text-white">
                    {post.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                    <span>{post.date}</span>
                    <span className="h-px w-3 bg-zinc-700" />
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="text-zinc-600 transition-colors group-hover:text-zinc-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="hidden text-zinc-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-zinc-300 md:block">
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
