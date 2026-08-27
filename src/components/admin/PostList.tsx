'use client';

/**
 * 文章列表 —— /admin 后台的文章目录视图
 * 2026-08-27 Claude·静态博客在线后台：
 *   - 通过 GitHub Contents API 拉取 content/posts 目录（数据由 AdminApp 下发）；
 *   - 职责边界：只负责展示与发出选择事件，不做任何 API 调用。
 */

import type { PostFileEntry } from '@/lib/github';

interface Props {
  entries: PostFileEntry[];
  loading: boolean;
  error: string;
  /** 点击某篇文章 → 进入编辑器 */
  onSelect: (entry: PostFileEntry) => void;
  /** 新建文章 */
  onNew: () => void;
  /** 刷新列表（重新拉取目录） */
  onRefresh: () => void;
}

export function PostList({ entries, loading, error, onSelect, onNew, onRefresh }: Props) {
  return (
    <div>
      {/* ═══ 工具条 ═══ */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <p className="text-sm text-muted">
          {loading ? '正在读取文章目录…' : `共 ${entries.length} 篇`}
        </p>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="rounded-sm border border-border bg-surface px-4 py-2 text-sm text-muted transition-colors hover:border-accent/45 hover:text-accent disabled:opacity-50"
          >
            刷新
          </button>
          <button
            onClick={onNew}
            disabled={loading}
            className="rounded-sm border border-accent/45 bg-surface px-4 py-2 text-sm text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
          >
            新建文章
          </button>
        </div>
      </div>

      {/* ═══ 错误提示 ═══ */}
      {error && (
        <p className="mt-4 rounded-sm border border-red-900/40 bg-red-950/20 px-4 py-3 font-serif text-sm text-red-300">
          {error}
        </p>
      )}

      {/* ═══ 列表 ═══ */}
      <ul className="mt-2 divide-y divide-border">
        {entries.map(entry => (
          <li key={entry.path}>
            <button
              onClick={() => onSelect(entry)}
              className="group flex w-full items-center justify-between py-4 text-left transition-colors hover:bg-surface/60"
            >
              <span className="font-serif text-[15px] text-foreground group-hover:text-accent">
                {entry.name.replace(/\.md$/, '')}
              </span>
              <span className="font-serif text-xs text-muted">{entry.path}</span>
            </button>
          </li>
        ))}
      </ul>

      {!loading && !error && entries.length === 0 && (
        <p className="mt-8 text-center font-serif text-sm text-muted">
          还没有文章，点右上角「新建文章」开始写作。
        </p>
      )}
    </div>
  );
}
