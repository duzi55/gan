'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * MobileNav — 移动端底部导航
 * 从 BottomNavigation 抽离视觉模式，固定底部，仅移动端显示
 */
export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { href: '/', label: '首页', icon: 'M3 12l9-9 9 9M5 10v10h4v-6h6v6h4V10' },
    { href: '/posts', label: '文章', icon: 'M4 4h16v4H4zM4 12h16v8H4zM4 12h8' },
    { href: '/gallery', label: '画廊', icon: 'M4 4h16v16H4zM4 9h16M9 4v16' },
    { href: '/about', label: '关于', icon: 'M12 2a5 5 0 015 5v3a5 5 0 01-10 0V7a5 5 0 015-5zM2 22a10 10 0 0120 0' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/85 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2 transition-colors ${
                active ? 'text-foreground' : 'text-muted'
              }`}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={item.icon} />
              </svg>
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
