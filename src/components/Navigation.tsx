'use client';

import { useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Navigation — 站点导航（头部 + 页脚双形态）
 * 设计系统表面划分：
 *   - 深色表面（探索/浏览）：首页 / 文章归档 / 标签 / 关于
 *   - 浅色表面（沉浸阅读）：文章详情 / 画廊
 * 头部集成搜索入口，页脚作为全站统一 footer。
 */
export function Navigation({ showFooter = false }: { showFooter?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  // 深色表面集合（与各页面 bg 保持一致）
  const isDark =
    pathname === '/' ||
    pathname === '/posts' ||
    pathname === '/about' ||
    pathname.startsWith('/tags');

  const links = [
    { href: '/', label: '首页' },
    { href: '/posts', label: '文章' },
    { href: '/gallery', label: '画廊' },
    { href: '/about', label: '关于' },
  ];

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const q = (e.target as HTMLInputElement).value;
      if (q) router.push(`/posts/?q=${encodeURIComponent(q)}`);
    }
  };

  /* ─────────── Footer 形态 ─────────── */
  if (showFooter) {
    return (
      <footer
        className={`border-t ${
          isDark ? 'border-white/5 bg-zinc-950' : 'border-zinc-200/70 bg-[#fbfaf7]'
        }`}
      >
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col items-center gap-5 text-center">
            <p className={`font-serif text-sm ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
              &ldquo;好的设计不是做加法，而是做减法。&rdquo;
            </p>
            <div
              className={`flex gap-6 text-xs ${
                isDark ? 'text-zinc-500' : 'text-zinc-500'
              }`}
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    isDark ? 'hover:text-zinc-300' : 'hover:text-zinc-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className={`text-xs ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`}>
              © {new Date().getFullYear()} Notes · 设计、代码与界面的碎片
            </p>
          </div>
        </div>
      </footer>
    );
  }

  /* ─────────── Header 形态 ─────────── */
  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        isDark
          ? 'border-white/5 bg-zinc-950/70'
          : 'border-zinc-200/70 bg-[#fbfaf7]/80'
      }`}
    >
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className={`text-[15px] font-bold tracking-[0.2em] transition-colors ${
            isDark ? 'text-zinc-100 hover:text-white' : 'text-zinc-900 hover:text-zinc-500'
          }`}
        >
          NOTES
        </Link>

        {/* Nav Links */}
        <div
          className={`hidden items-center gap-7 text-sm md:flex ${
            isDark ? 'text-zinc-400' : 'text-zinc-500'
          }`}
        >
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  active
                    ? isDark
                      ? 'text-zinc-100'
                      : 'text-zinc-900'
                    : isDark
                      ? 'hover:text-zinc-100'
                      : 'hover:text-zinc-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* 搜索按钮 */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-all ${
              isDark
                ? 'border-white/10 text-zinc-500 hover:border-white/30 hover:text-zinc-300'
                : 'border-zinc-200 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600'
            }`}
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            搜索
          </button>
        </div>

        {/* 移动端搜索按钮 */}
        <div
          className={`flex items-center gap-4 text-sm md:hidden ${
            isDark ? 'text-zinc-400' : 'text-zinc-500'
          }`}
        >
          <button onClick={() => setSearchOpen(!searchOpen)} className="transition-colors">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        </div>
      </nav>

      {/* 搜索展开 */}
      {searchOpen && (
        <div
          className={`border-t px-6 py-4 ${
            isDark ? 'border-white/5 bg-zinc-950/95' : 'border-zinc-200/70 bg-[#fbfaf7]/95'
          }`}
        >
          <div className="mx-auto max-w-2xl">
            <input
              type="text"
              autoFocus
              placeholder="搜索文章…"
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${
                isDark
                  ? 'border-white/10 bg-white/5 text-zinc-200 placeholder:text-zinc-600 focus:border-white/30'
                  : 'border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400'
              }`}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
        </div>
      )}
    </header>
  );
}
