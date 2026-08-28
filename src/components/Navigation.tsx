'use client';

import { useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

/**
 * Navigation — 站点导航（头部 + 页脚双形态）
 * 全站统一明暗自适应：文字/描边跟随主题变量，不再按路径切表面。
 *
 * 2026-08-27 Claude·视觉重设计「墨境」：
 *   - Logo 改为「朱砂印章 记 + 衬线字标」，弱化加粗大写字；
 *   - hover 描边统一为朱砂 accent 细线；搜索框 focus 同步；
 *   - 页脚引言前置印章元素，收束整体文人手记气质。
 */
export function Navigation({ showFooter = false }: { showFooter?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  const links = [
    { href: '/', label: '首页' },
    { href: '/posts', label: '文章' },
    // 2026-08-28 Claude·画廊由「灵感」页取缔（液态玻璃 UI 复刻）
    { href: '/inspiration', label: '灵感' },
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
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col items-center gap-6 text-center">
            {/* 朱砂印章：站点身份落款 */}
            <span className="ink-seal !h-9 !w-9 !rounded-md !text-base" aria-hidden>记</span>
            <p className="max-w-xs font-serif text-sm leading-loose text-faint">
              &ldquo;好的设计不是做加法，而是做减法。&rdquo;
            </p>
            <div className="flex gap-7 text-xs text-muted">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {/* 2026-08-27 Claude·页脚落款改为站主 duzi55（应用户要求） */}
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
              © {new Date().getFullYear()} duzi55 · Notes
            </p>
          </div>
        </div>
      </footer>
    );
  }

  /* ─────────── Header 形态 ─────────── */
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        {/* Logo：印章 + 衬线字标 */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="ink-seal transition-transform duration-300 group-hover:-rotate-6">记</span>
          <span className="font-display text-lg tracking-[0.35em] text-foreground">Notes</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden items-center gap-7 text-sm text-muted md:flex">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative transition-colors ${
                  active ? 'text-foreground' : 'hover:text-foreground'
                }`}
              >
                {link.label}
                {/* 当前项下缘朱砂短线 */}
                {active && (
                  <span aria-hidden className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-accent" />
                )}
              </Link>
            );
          })}

          <ThemeToggle />

          {/* 搜索按钮 */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted transition-all hover:border-accent/50 hover:text-foreground"
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

        {/* 移动端:主题切换 + 搜索 */}
        <div className="flex items-center gap-4 text-sm text-muted md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="transition-colors hover:text-foreground"
          >
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
        <div className="border-t border-border bg-background/95 px-6 py-4">
          <div className="mx-auto max-w-2xl">
            <input
              type="text"
              autoFocus
              placeholder="搜索文章…"
              className="w-full rounded-xl border border-border bg-foreground/5 px-4 py-3 text-sm text-foreground outline-none placeholder:text-faint focus:border-accent/50"
              onKeyDown={handleSearchKeyDown}
            />
          </div>
        </div>
      )}
    </header>
  );
}
