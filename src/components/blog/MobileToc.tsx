'use client';

import { useEffect, useState } from 'react';
import type { Heading } from '@/lib/posts';

/**
 * 移动端文章目录悬浮球（借鉴 4real.ltd 博客的 MobileToc）
 * 2026-08-27 Claude·新建：
 * - 仅 xl 以下视口显示，fixed 右下角圆形按钮；
 * - SVG 圆环实时渲染阅读进度（stroke-dashoffset，-90° 起点在顶部）；
 * - 点击弹出目录面板（底部抽屉），点击条目平滑滚动到锚点并收起；
 * - 无目录数据时不渲染。
 * 颜色全部走语义 token，深浅主题自适应。
 */

/** 圆环几何参数：r=23，周长 2πr ≈ 144.51 */
const RING_R = 23;
const RING_C = 2 * Math.PI * RING_R;
const ACTIVE_LINE_RATIO = 0.35;

export default function MobileToc({ headings }: { headings: Heading[] }) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSlug, setActiveSlug] = useState('');

  useEffect(() => {
    function onScroll() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0);

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

  /* 面板打开时锁定背景滚动 */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (headings.length === 0) return null;

  function jump(slug: string) {
    setOpen(false);
    /* state 更新异步，先手动解锁滚动再平滑滚动，避免锁定打断动画 */
    document.body.style.overflow = '';
    requestAnimationFrame(() => {
      document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  return (
    <>
      {/* 悬浮球：环形进度 + 列表图标 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? '收起目录' : '打开目录'}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background shadow-lg transition-colors duration-200 hover:border-accent/50 xl:hidden"
      >
        {/* 环形阅读进度 */}
        <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
          <circle cx="24" cy="24" r={RING_R} fill="none" stroke="currentColor" className="text-border" strokeWidth="2" />
          <circle
            cx="24"
            cy="24"
            r={RING_R}
            fill="none"
            stroke="currentColor"
            className="text-accent transition-all duration-300 ease-out"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C * (1 - progress)}
          />
        </svg>
        {/* 列表图标（三条横线） */}
        <svg viewBox="0 0 24 24" className="relative z-10 h-5 w-5 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      </button>

      {/* 目录抽屉：半透明遮罩 + 底部面板 */}
      {open && (
        <div className="fixed inset-0 z-[60] xl:hidden" role="dialog" aria-modal="true" aria-label="文章目录">
          {/* 遮罩：点击关闭 */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          {/* 面板 */}
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-border bg-background px-6 pb-8 pt-5 shadow-2xl">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" aria-hidden />
            <div className="mb-3 flex items-baseline justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">目录</p>
              <p className="font-mono text-[11px] text-faint">{Math.round(progress * 100)}%</p>
            </div>
            <nav className="flex max-h-[55vh] flex-col overflow-y-auto border-l border-border">
              {headings.map((h) => (
                <button
                  key={h.slug}
                  type="button"
                  onClick={() => jump(h.slug)}
                  className={[
                    'block py-2.5 pr-2 text-left text-sm leading-snug transition-colors',
                    h.depth === 3 ? 'pl-[26px]' : 'pl-[14px]',
                    activeSlug === h.slug ? 'text-accent' : 'text-muted',
                  ].join(' ')}
                >
                  {h.text}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
