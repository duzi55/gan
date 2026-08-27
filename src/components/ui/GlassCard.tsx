'use client';

import { type ReactNode } from 'react';

/**
 * GlassCard — 设计系统统一卡片容器(明暗自适应)。
 * 类名保留 liquid-glass-card（历史调用方兼容），实际视觉已在
 * globals.css 重构为「墨境」细线框纸卡。
 * 2026-08-27 Claude·视觉重设计：hover 描边由冷灰 zinc 换为朱砂 accent。
 */
export function GlassCard({
  children,
  className = '',
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  const hoverClass = hover
    ? 'transition-all duration-500 hover:-translate-y-0.5 hover:border-accent/45'
    : '';

  return (
    <div className={`liquid-glass-card ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}
