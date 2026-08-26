'use client';

import { type ReactNode } from 'react';

/**
 * GlassCard — 设计系统统一的液态玻璃容器
 * - tone="dark"  深色玻璃，用于深色表面（首页 / 归档 / 关于 / 文章收尾区）
 * - tone="light" 明亮玻璃，用于浅色表面
 */
export function GlassCard({
  children,
  className = '',
  hover = false,
  tone = 'dark',
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  tone?: 'light' | 'dark';
}) {
  const glassClass = tone === 'dark' ? 'liquid-glass-card-dark' : 'liquid-glass-card';
  const hoverClass = hover
    ? tone === 'dark'
      ? 'transition-all duration-500 hover:-translate-y-0.5 hover:border-white/25'
      : 'transition-all duration-500 hover:-translate-y-0.5 hover:border-white/40'
    : '';

  return (
    <div className={`${glassClass} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}
