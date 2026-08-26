'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';

/**
 * ArticleDeck — 文章卡片组
 * 从 PortfolioCarousel3D 抽离：3D 透视 + 渐变卡片 + hover 展开
 * 但去掉炫技动画，改为编辑式设计
 * 卡片直接使用文章的 gradient 作为封面
 */
export function ArticleDeck({ posts }: { posts: PostMeta[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setMouse({ x: 0, y: 0 }); setHovered(null); }}
      className="relative"
      style={{ perspective: '1200px' }}
    >
      <div
        className="flex gap-4 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          transform: `rotateY(${mouse.x * 2}deg) rotateX(${-mouse.y * 1.5}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.3s ease-out',
        }}
      >
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            onMouseEnter={() => setHovered(i)}
            className="group relative h-72 w-56 shrink-0 overflow-hidden rounded-2xl"
            style={{
              background: post.gradient,
              transform: hovered === i
                ? 'translateY(-8px) scale(1.03)'
                : `translateY(${Math.abs(i - (hovered ?? -1)) * -2}px)`,
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* 光泽层 */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* 内容 */}
            <div className="absolute inset-0 flex flex-col justify-between p-5">
              <div>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] text-white/70 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-serif text-base font-medium leading-snug text-white drop-shadow-lg">
                  {post.title}
                </h3>
                <p className="mt-2 text-xs text-white/60">{post.date}</p>
              </div>
            </div>

            {/* accent 色彩点缀 */}
            <div
              className="pointer-events-none absolute right-4 top-4 h-2 w-2 rounded-full"
              style={{ backgroundColor: post.accent, opacity: 0.8 }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
