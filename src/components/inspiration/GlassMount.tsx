'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/**
 * GlassMount —— 灵感详情组件按需挂载器
 * 2026-08-28 Claude·性能设计（应用户要求"按需加载，不能把所有组件都加载"）：
 *   - 每个完整组件经 next/dynamic 拆成独立 chunk：只有进入对应
 *     /inspiration/[slug]/ 详情页时，浏览器才下载该组件的 JS；
 *   - 列表页 / 首页微缩图不经过本组件（纯 CSS minis，零客户端 JS）；
 *   - ssr:false + 玻璃骨架占位：首帧不被组件逻辑阻塞，加载期不掉白。
 */

/** 加载期玻璃骨架：与真实组件同语言（玻璃体 + 微光） */
function Skeleton() {
  return (
    <div className="lg-glass h-56 w-[320px] animate-pulse" aria-label="组件加载中" />
  );
}

/** slug → 动态组件映射（与 registry.ts 的 slug 约定保持一致） */
const LOADERS: Record<string, ComponentType> = {
  'glass-player': dynamic(() => import('./glass/GlassPlayer'), { ssr: false, loading: () => <Skeleton /> }),
  'glass-dock': dynamic(() => import('./glass/GlassDock'), { ssr: false, loading: () => <Skeleton /> }),
  'glass-notification': dynamic(() => import('./glass/GlassNotification'), { ssr: false, loading: () => <Skeleton /> }),
  'glass-slider': dynamic(() => import('./glass/GlassSlider'), { ssr: false, loading: () => <Skeleton /> }),
  'glass-toggle': dynamic(() => import('./glass/GlassToggle'), { ssr: false, loading: () => <Skeleton /> }),
  'glass-weather': dynamic(() => import('./glass/GlassWeather'), { ssr: false, loading: () => <Skeleton /> }),
};

export function GlassMount({ slug }: { slug: string }) {
  const Cmp = LOADERS[slug];
  if (!Cmp) return null;
  return <Cmp />;
}
