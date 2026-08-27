'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Heading } from '@/lib/posts';

/**
 * 桌面端文章目录侧栏（借鉴 4real.ltd 博客的阅读体验）
 * 2026-08-27 Claude·新建：
 * - 仅 xl 及以上视口显示，fixed 吸附在正文右侧；
 * - 滚动监听高亮当前章节：朱砂竖条指示器平滑跟随激活项；
 * - 底部显示实时阅读进度百分比 +「回到顶部」快捷操作；
 * - 无目录数据时不渲染。
 * 设计语言沿用「墨境」：mono 眉题 / 发丝线 / 朱砂 accent。
 */

/** 激活判定线：视口高度 35% 处，标题越过该线即视为「已读到」 */
const ACTIVE_LINE_RATIO = 0.35;

export default function TocAside({ headings }: { headings: Heading[] }) {
  const [activeSlug, setActiveSlug] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const navRef = useRef<HTMLElement>(null);

  /* 指示条位置：跟随激活项的 offsetTop / offsetHeight（同源站滑动竖条） */
  const indicator = useMemo(() => {
    const nav = navRef.current;
    if (!nav || !activeSlug) return { top: 0, height: 0, visible: false };
    const el = nav.querySelector<HTMLAnchorElement>(`a[href="#${CSS.escape(activeSlug)}"]`);
    if (!el) return { top: 0, height: 0, visible: false };
    return { top: el.offsetTop, height: el.offsetHeight, visible: true };
  }, [activeSlug]);

  useEffect(() => {
    function onScroll() {
      /* 阅读进度：与顶部细条同口径（滚动距离 / 可滚动高度） */
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0);

      /* 滚动 spy：取最后一条越过激活线的标题 */
      const line = window.innerHeight * ACTIVE_LINE_RATIO;
      let current = '';
      for (const h of headings) {
        const el = document.getElementById(h.slug);
        if (el && el.getBoundingClientRect().top <= line) current = h.slug;
      }
      setActiveSlug(current);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside
      className="fixed top-40 z-[5] hidden w-[200px] flex-col xl:flex"
      style={{ left: 'calc(50% + 360px)' }}
    >
      {/* 眉题 */}
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">目录</p>

      {/* 列表 + 滑动指示条 */}
      <nav ref={navRef} className="relative mt-4 flex flex-col border-l border-border">
        {/* 朱砂指示条：300ms 过渡平滑滑动到激活项 */}
        <span
          aria-hidden
          className="absolute left-[-1px] z-10 w-[2px] bg-accent transition-all duration-300 ease-out"
          style={{
            top: indicator.top,
            height: indicator.height,
            opacity: indicator.visible ? 1 : 0,
          }}
        />
        {headings.map((h) => (
          <a
            key={h.slug}
            href={`#${h.slug}`}
            className={[
              'block py-1.5 pr-2 text-[13px] leading-[1.45] transition-colors duration-200',
              h.depth === 3 ? 'pl-[26px]' : 'pl-[14px]',
              activeSlug === h.slug ? 'text-foreground' : 'text-faint hover:text-muted',
            ].join(' ')}
          >
            {h.text}
          </a>
        ))}
      </nav>

      {/* 底部：阅读进度 + 回到顶部 */}
      <div className="my-4 h-px bg-border" />
      <div className="flex items-center font-mono text-[11px] text-faint">
        <span>{Math.round(progress * 100)}%</span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="ml-auto transition-colors duration-200 hover:text-accent"
        >
          回到顶部
        </button>
      </div>
    </aside>
  );
}
