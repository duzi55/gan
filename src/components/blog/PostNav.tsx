import Link from 'next/link';

/**
 * 文末上一篇 / 下一篇导航（借鉴 4real.ltd 博客的双栏式页尾导航）
 * 2026-08-27 Claude·新建：
 * - 双栏 grid：左侧「← 上一篇」左对齐，右侧「下一篇 →」右对齐；
 * - mono 眉题 + 标题两行结构，hover 时标题染上 accent；
 * - 由文章页按日期序列计算相邻文章后传入，纯服务端组件零 JS。
 */

export interface PostNavItem {
  slug: string;
  title: string;
}

export default function PostNav({ prev, next }: { prev?: PostNavItem; next?: PostNavItem }) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-16 grid grid-cols-2 gap-6 border-t border-border pt-8">
      {/* 上一篇：左栏 */}
      {prev ? (
        <Link href={`/posts/${prev.slug}`} className="group flex flex-col items-start gap-2 text-left">
          <span className="font-mono text-[11px] tracking-[0.08em] text-faint">← 上一篇</span>
          <span className="text-[13.5px] font-medium leading-[1.4] text-foreground transition-colors group-hover:text-accent">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}

      {/* 下一篇：右栏 */}
      {next ? (
        <Link href={`/posts/${next.slug}`} className="group flex flex-col items-end gap-2 text-right">
          <span className="font-mono text-[11px] tracking-[0.08em] text-faint">下一篇 →</span>
          <span className="text-[13.5px] font-medium leading-[1.4] text-foreground transition-colors group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}
    </nav>
  );
}
