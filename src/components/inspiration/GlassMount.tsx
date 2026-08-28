'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/**
 * GlassMount —— 灵感组件按需挂载器（原型 + 衍生变体统一入口）
 * 2026-08-28 Claude·灵感系统 v2 扩展（规则见 INSPIRATION_RULES.md）：
 *   - 加载键约定：原型为 slug，变体为 `${slug}:${variantId}`；
 *     每个组件经 next/dynamic 拆成独立 chunk，只有进入对应详情页
 *     并滚动到该舞台时才下载其 JS（变体常在视口外，天然延迟加载）；
 *   - 列表页 / 首页微缩图不经过本组件（纯 CSS minis，零客户端 JS）；
 *   - ssr:false + 玻璃骨架占位：首帧不被组件逻辑阻塞，加载期不掉白。
 */

/** 加载期玻璃骨架：与真实组件同语言（玻璃体 + 微光）；
 *  宽度用 min() 钳制，避免小屏（<360px）横向溢出 */
function Skeleton() {
  return (
    <div
      className='lg-glass h-56 animate-pulse'
      style={{ width: 'min(320px, 84vw)', borderRadius: '2rem' }}
      aria-label='组件加载中'
    />
  );
}

/**
 * slug[:variantId] → 动态组件映射
 * 键与 registry.ts 的 slug / variants[].id 约定保持一致；
 * 新增灵感组件时在此登记一条 dynamic 即可。
 */
const LOADERS: Record<string, ComponentType> = {
  /* ── 01 唱片机原型 + 变体 ── */
  'glass-player': dynamic(() => import('./glass/GlassPlayer'), { ssr: false, loading: () => <Skeleton /> }),
  'glass-player:cassette': dynamic(() => import('./glass/variants/GlassCassette'), { ssr: false, loading: () => <Skeleton /> }),
  'glass-player:radio': dynamic(() => import('./glass/variants/GlassRadio'), { ssr: false, loading: () => <Skeleton /> }),

  /* ── 02 Dock 原型 + 变体 ── */
  'glass-dock': dynamic(() => import('./glass/GlassDock'), { ssr: false, loading: () => <Skeleton /> }),
  'glass-dock:side': dynamic(() => import('./glass/variants/GlassSideDock'), { ssr: false, loading: () => <Skeleton /> }),
  'glass-dock:tabbar': dynamic(() => import('./glass/variants/GlassTabBar'), { ssr: false, loading: () => <Skeleton /> }),

  /* ── 03 通知卡原型 + 变体 ── */
  'glass-notification': dynamic(() => import('./glass/GlassNotification'), { ssr: false, loading: () => <Skeleton /> }),
  'glass-notification:stack': dynamic(() => import('./glass/variants/GlassNotifStack'), { ssr: false, loading: () => <Skeleton /> }),
  'glass-notification:media': dynamic(() => import('./glass/variants/GlassMediaNotif'), { ssr: false, loading: () => <Skeleton /> }),

  /* ── 04 滑块原型 + 变体 ── */
  'glass-slider': dynamic(() => import('./glass/GlassSlider'), { ssr: false, loading: () => <Skeleton /> }),
  'glass-slider:brightness': dynamic(() => import('./glass/variants/GlassBrightness'), { ssr: false, loading: () => <Skeleton /> }),
  'glass-slider:progress': dynamic(() => import('./glass/variants/GlassProgress'), { ssr: false, loading: () => <Skeleton /> }),

  /* ── 05 开关原型 + 变体 ── */
  'glass-toggle': dynamic(() => import('./glass/GlassToggle'), { ssr: false, loading: () => <Skeleton /> }),
  'glass-toggle:panel': dynamic(() => import('./glass/variants/GlassSwitchPanel'), { ssr: false, loading: () => <Skeleton /> }),
  'glass-toggle:segment': dynamic(() => import('./glass/variants/GlassSegment'), { ssr: false, loading: () => <Skeleton /> }),

  /* ── 06 天气卡原型 + 变体 ── */
  'glass-weather': dynamic(() => import('./glass/GlassWeather'), { ssr: false, loading: () => <Skeleton /> }),
  'glass-weather:clock': dynamic(() => import('./glass/variants/GlassClock'), { ssr: false, loading: () => <Skeleton /> }),
  'glass-weather:air': dynamic(() => import('./glass/variants/GlassAir'), { ssr: false, loading: () => <Skeleton /> }),
};

export function GlassMount({ slug, variant }: { slug: string; variant?: string }) {
  const Cmp = LOADERS[variant ? `${slug}:${variant}` : slug];
  if (!Cmp) return null;
  return <Cmp />;
}
