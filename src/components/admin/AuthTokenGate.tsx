'use client';

/**
 * 登录门 —— /admin 后台的鉴权入口组件
 * 2026-08-27 Claude·静态博客在线后台：
 *   - OAuth 授权成功后 Worker 回跳到 /admin/#token=xxx；
 *     本组件负责在挂载时解析 hash、存入 localStorage 并立即清除
 *     URL 中的令牌（避免历史记录/截图泄露）。
 *   - 未持有令牌时渲染「GitHub 授权登录」按钮，跳转 Cloudflare Worker 的
 *     /auth 入口（见 src/lib/github.ts 的 OAUTH_ENTRY 常量）。
 * 职责边界：只管「取/存/清令牌」与引导登录，不掺业务视图。
 */

import { useEffect, useRef, useState } from 'react';
import { OAUTH_ENTRY } from '@/lib/github';

export const TOKEN_STORAGE_KEY = 'ink-admin-token'; // localStorage 键名，AdminApp 也用它读取

interface Props {
  /** 拿到有效令牌后回调给父容器（AdminApp 持有并下发） */
  onToken: (token: string) => void;
}

export function AuthTokenGate({ onToken }: Props) {
  const [hint, setHint] = useState('尚未授权。点击下方按钮前往 GitHub 授权。');
  // 只跑一次的防抖 ref：hash 解析严禁重复执行
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    // 1. 优先处理 OAuth 回跳带来的 #token=xxx
    if (window.location.hash.startsWith('#token=')) {
      const token = window.location.hash.slice('#token='.length);
      window.history.replaceState(null, '', window.location.pathname); // 立即抹掉 hash
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        onToken(token);
        return;
      }
    }

    // 2. 其次看是否已有历史会话令牌
    const saved = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (saved) {
      onToken(saved);
      return;
    }
    // 3. 都没有 → 停留在登录门界面等待用户点击
  }, [onToken]);

  /** 跳转 Cloudflare Worker 发起 GitHub OAuth */
  function startOAuth() {
    setHint('正在跳转 GitHub 授权页…');
    window.location.href = OAUTH_ENTRY;
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="ink-eyebrow">
        <span className="h-px w-8 bg-border" />
        Admin · 后台
      </p>
      <h1 className="ink-display mt-6 text-3xl text-foreground">纸上工坊管理室</h1>
      <p className="mt-4 font-serif text-sm leading-loose text-muted">{hint}</p>

      <button
        onClick={startOAuth}
        className="mt-8 rounded-sm border border-border bg-surface px-6 py-3 text-sm text-foreground transition-colors hover:border-accent/45 hover:text-accent"
      >
        GitHub 授权登录
      </button>

      <p className="mt-6 max-w-xs font-serif text-xs leading-relaxed text-muted">
        授权仅申请 public_repo 权限，令牌只保存在本机浏览器中，
        用于向仓库提交文章变更；提交后云端将自动构建发布。
      </p>
    </div>
  );
}
