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
    /* 2026-08-27 Claude·性能修复：滚动卡顿治理
       1) 标题位置静态缓存：文章正文为静态 HTML，挂载/resize 时一次性
          测量各标题距文档顶部的偏移；滚动期间只做数值比较，不再逐帧
          getBoundingClientRect（强制同步 layout 是卡顿元凶）。
       2) rAF 节流：同一帧内的多次 scroll 事件合并为一次计算。
       3) 进度离散化：整数百分比未变化时跳过 setState，重渲染从
          每帧一次降到每滚过 1% 一次。 */
    let raf = 0;
    let tops: number[] = [];
    const measure = () => {
      tops = headings.map((h) => {
        const el = document.getElementById(h.slug);
        return el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
      });
    };
    measure();

    function onScroll() {
      if (raf) return; // 一帧内只计算一次
      raf = requestAnimationFrame(() => {
        raf = 0;
        const scrollY = window.scrollY;

        /* 阅读进度：与顶部细条同口径（滚动距离 / 可滚动高度） */
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
        setProgress((prev) =>
          Math.round(prev * 100) === Math.round(pct * 100) ? prev : pct
        );

        /* 滚动 spy：与缓存的文档偏移直接比较（激活线 = 视口 35%） */
        const line = scrollY + window.innerHeight * ACTIVE_LINE_RATIO;
        let current = '';
        for (let i = 0; i < headings.length; i++) {
          if (tops[i] <= line) current = headings[i].slug;
        }
        setActiveSlug(current);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    onScroll();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
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
