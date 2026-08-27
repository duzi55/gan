'use client';

/**
 * 后台容器 —— /admin 路由的顶层状态机
 * 2026-08-27 Claude·静态博客在线后台：
 *   - 编排三件事：鉴权（AuthTokenGate）→ 列表（PostList）→ 编辑（PostEditor）；
 *   - 持有令牌与当前视图状态，向下通过 props 下发数据与回调，保持子组件纯展示；
 *   - 提供「退出登录」（清除 localStorage 令牌回到登录门）。
 */

import { useCallback, useState } from 'react';
import { listPosts, type PostFileEntry } from '@/lib/github';
import { AuthTokenGate, TOKEN_STORAGE_KEY } from './AuthTokenGate';
import { PostList } from './PostList';
import { PostEditor } from './PostEditor';

type View =
  | { name: 'list' }
  | { name: 'editor'; entry: PostFileEntry | null };

export function AdminApp() {
  const [token, setToken] = useState<string | null>(null);
  const [entries, setEntries] = useState<PostFileEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState<View>({ name: 'list' });

  /* ═══ 登录门拿到令牌后：立即拉取文章目录 ═══ */
  const handleToken = useCallback((t: string) => {
    setToken(t);
    void refresh(t);
  }, []);

  /** 拉取 content/posts 目录 */
  async function refresh(t: string) {
    setLoading(true);
    setError('');
    try {
      setEntries(await listPosts(t));
    } catch (e) {
      // 401 = 令牌失效/被撤销 → 清除并退回登录门重新授权
      if (e instanceof Error && e.message.includes('401')) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setView({ name: 'list' });
      }
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  /** 保存成功：刷新列表并回到列表视图 */
  function handleSaved() {
    void refresh(token!);
    setView({ name: 'list' });
  }

  /** 退出登录：清令牌、回登录门 */
  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setView({ name: 'list' });
  }

  /* ═══ 视图一：未登录 ═══ */
  if (!token) return <AuthTokenGate onToken={handleToken} />;

  return (
    <div className="mx-auto max-w-4xl px-6 pt-20 pb-24 md:pt-28">
      {/* 页眉 */}
      <div className="mb-10 flex items-end justify-between border-b border-border pb-5">
        <div>
          <p className="ink-eyebrow">
            <span className="h-px w-8 bg-border" />
            Ink Field · 管理室
          </p>
          <h1 className="ink-display mt-4 text-3xl text-foreground md:text-4xl">纸上工坊后台</h1>
        </div>
        <button onClick={logout}
          className="rounded-sm border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/45 hover:text-accent">
          退出登录
        </button>
      </div>

      {/* 内容区：列表或编辑器 */}
      {view.name === 'list' ? (
        <PostList
          entries={entries}
          loading={loading}
          error={error}
          onSelect={entry => setView({ name: 'editor', entry })}
          onNew={() => setView({ name: 'editor', entry: null })}
          onRefresh={() => void refresh(token)}
        />
      ) : (
        <PostEditor
          token={token}
          entry={view.entry}
          onSaved={handleSaved}
          onBack={() => { setView({ name: 'list' }); void refresh(token); }}
        />
      )}
    </div>
  );
}
