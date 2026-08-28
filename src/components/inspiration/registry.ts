import type { ComponentType } from 'react';
import {
  MiniPlayer,
  MiniDock,
  MiniNotification,
  MiniSlider,
  MiniToggle,
  MiniWeather,
} from './minis';

/**
 * 灵感注册表 Inspiration Registry
 * 2026-08-28 Claude·灵感页（取缔画廊）新增：
 *   - 全站唯一的灵感条目数据源：列表页 / 详情页 / 首页预览区均从这里取数，
 *     新增组件只需：①在 glass/ 写完整组件 ②在 minis.tsx 加微缩图 ③在此登记；
 *   - Mini 为纯 CSS 静态微缩图（无客户端 JS）；完整组件本体由 GlassMount
 *     按 slug 用 next/dynamic 按需加载，两者通过 slug 字符串约定解耦；
 *   - stage 为微缩舞台的虚焦光斑底（②液态渐变 ⑤景深），每条目主色各异。
 */

export interface InspirationItem {
  /** 路由 slug（详情页 /inspiration/[slug]，同时是 GlassMount 加载键） */
  slug: string;
  /** 目录编号（LG-01 …），编辑式排版元素 */
  no: string;
  /** 中文名题 */
  title: string;
  /** 英文大字题（⑥ 编辑式排版） */
  titleEn: string;
  /** 一句话描述 */
  desc: string;
  /** 复刻要点标签（对应六要点） */
  points: string[];
  /** 微缩舞台背景：虚焦光斑 + 深空底（纯 CSS） */
  stage: string;
  /** 微缩图组件（纯 CSS 静态快照，零客户端 JS） */
  Mini: ComponentType;
}

export const INSPIRATIONS: InspirationItem[] = [
  {
    slug: 'glass-player',
    no: '01',
    title: '玻璃唱片机',
    titleEn: 'VINYL',
    desc: '黑胶旋转、液态标签与玻璃操控面，播放只驱动 CSS 动画。',
    points: ['半透明材质', '液态渐变', '颗粒噪点'],
    stage:
      'radial-gradient(85% 85% at 18% 12%, rgba(56,189,248,0.32), transparent 60%), radial-gradient(85% 85% at 85% 88%, rgba(251,113,133,0.26), transparent 62%), linear-gradient(165deg, #141126, #1c1735)',
    Mini: MiniPlayer,
  },
  {
    slug: 'glass-dock',
    no: '02',
    title: '液态玻璃 Dock',
    titleEn: 'DOCK',
    desc: 'macOS 式胶囊玻璃码头，hover 上浮放大，激活点跟随。',
    points: ['半透明材质', '柔软体积感'],
    stage:
      'radial-gradient(85% 85% at 82% 15%, rgba(167,139,250,0.32), transparent 60%), radial-gradient(85% 85% at 15% 88%, rgba(56,189,248,0.22), transparent 62%), linear-gradient(165deg, #141126, #1e1832)',
    Mini: MiniDock,
  },
  {
    slug: 'glass-notification',
    no: '03',
    title: '玻璃通知卡',
    titleEn: 'NOTIFY',
    desc: '液态渐变图标方块 + 果冻体积感，关闭后可一键复原。',
    points: ['液态渐变', '柔软体积感', '颗粒噪点'],
    stage:
      'radial-gradient(85% 85% at 80% 82%, rgba(251,113,133,0.3), transparent 60%), radial-gradient(85% 85% at 18% 15%, rgba(167,139,250,0.26), transparent 62%), linear-gradient(165deg, #151228, #221731)',
    Mini: MiniNotification,
  },
  {
    slug: 'glass-slider',
    no: '04',
    title: '玻璃音量滑块',
    titleEn: 'SLIDER',
    desc: '原生 range 自绘：液态渐变填充轨道 + 玻璃拇指。',
    points: ['半透明材质', '液态渐变'],
    stage:
      'radial-gradient(85% 85% at 20% 80%, rgba(56,189,248,0.3), transparent 60%), radial-gradient(85% 85% at 85% 18%, rgba(251,113,133,0.2), transparent 62%), linear-gradient(165deg, #131024, #1b1733)',
    Mini: MiniSlider,
  },
  {
    slug: 'glass-toggle',
    no: '05',
    title: '玻璃开关',
    titleEn: 'SWITCH',
    desc: '开启态轨道化作液态渐变，玻璃 knob 滑动带果冻阻尼。',
    points: ['液态渐变', '柔软体积感'],
    stage:
      'radial-gradient(85% 85% at 78% 20%, rgba(251,113,133,0.26), transparent 60%), radial-gradient(85% 85% at 16% 85%, rgba(167,139,250,0.28), transparent 62%), linear-gradient(165deg, #141126, #201a36)',
    Mini: MiniToggle,
  },
  {
    slug: 'glass-weather',
    no: '06',
    title: '玻璃天气卡',
    titleEn: 'WEATHER',
    desc: '液态天空透出玻璃，超大极细温度数字压住版面。',
    points: ['半透明材质', '虚焦景深', '编辑式排版'],
    stage:
      'radial-gradient(85% 85% at 82% 85%, rgba(56,189,248,0.3), transparent 60%), radial-gradient(85% 85% at 15% 12%, rgba(251,113,133,0.22), transparent 62%), linear-gradient(165deg, #12102a, #1a1838)',
    Mini: MiniWeather,
  },
];

/** 按 slug 取条目（详情页 / GlassMount 共用） */
export function getInspiration(slug: string): InspirationItem | undefined {
  return INSPIRATIONS.find((i) => i.slug === slug);
}
