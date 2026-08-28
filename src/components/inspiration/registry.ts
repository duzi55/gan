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
 * 灵感注册表 Inspiration Registry —— 全站唯一灵感条目数据源
 * 2026-08-28 Claude·灵感系统 v2（详情页内展示原文溯源 + 衍生变体）：
 *   - 新增灵感条目的完整流程与展示规则，见同目录《INSPIRATION_RULES.md》
 *     （内部功能规范，勿移入博客 / 对外文档）；
 *   - 展示架构：列表页 = 宣纸风瀑布流卡片墙（每条灵感一张卡：缩略图
 *     小窗 + 信息栏，纯 CSS 微缩图零客户端 JS；每复刻一个新增一张）；
 *     详情页 = 100svh 原型舞台 → 滚动显示原文溯源 → 依次显现衍生变体；
 *   - 变体本体与原型本体均由 GlassMount 按「slug / slug:variantId」
 *     用 next/dynamic 按需加载，两者通过字符串约定解耦；
 *   - stage 为深空微缩舞台底（②液态渐变 ⑤景深），仅出现在舞台容器内，
 *     不允许外溢到系统宣纸风页面背景（样式隔离，见规则文件）。
 */

/** 灵感来源溯源信息（规则：每个条目必须可溯源——原链接或图片资源至少其一） */
export interface InspirationSource {
  /** 来源平台与文章名 */
  label: string;
  /** 原文链接（详情页「原文」区块展示并外跳） */
  url: string;
  /** 原始设计方 / 被复刻对象 */
  via?: string;
  /** 相关图片资源（可选，public 相对路径或外链；当前条目以原文链接溯源） */
  image?: string;
}

/** 衍生变体登记（原型精确复刻在前，变体衍生在后——见规则文件生成流程） */
export interface InspirationVariant {
  /** 变体标识：GlassMount 加载键为 `${slug}:${id}`，与 variants/ 文件名对应 */
  id: string;
  /** 变体中文名 */
  title: string;
  /** mono 英文小字（编辑式排版元素） */
  titleEn: string;
  /** 一句话衍化思路 */
  desc: string;
}

export interface InspirationItem {
  /** 路由 slug（详情页 /inspiration/[slug]，同时是 GlassMount 原型加载键） */
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
  /** 深空舞台背景：虚焦光斑 + 深空底（纯 CSS，仅限舞台容器使用） */
  stage: string;
  /** 微缩图组件（纯 CSS 静态快照，零客户端 JS） */
  Mini: ComponentType;
  /** 灵感来源（溯源必填） */
  source: InspirationSource;
  /** 衍生变体列表（≥2 个，详情页滚动依次显现，按需加载） */
  variants: InspirationVariant[];
}

/** 本期灵感共同来源：小红书《液态玻璃 UI / Liquid Glass UI 灵感分享》 */
const XHS_SOURCE: InspirationSource = {
  label: '小红书 · 液态玻璃 UI / Liquid Glass UI 灵感分享',
  url: 'https://xhslink.cn/o/2jqa2rN8gS5',
  via: 'rondesignlab',
};

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
    source: XHS_SOURCE,
    variants: [
      { id: 'cassette', title: '磁带卡带机', titleEn: 'CASSETTE', desc: '把旋转黑胶换成透明带仓，双卷轴以液态渐变示带量。' },
      { id: 'radio', title: '调频电台', titleEn: 'RADIO', desc: '同一玻璃操控面，改为频率刻度 + 玻璃滑块调台。' },
    ],
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
    source: XHS_SOURCE,
    variants: [
      { id: 'side', title: '侧边竖排 Dock', titleEn: 'SIDE DOCK', desc: '码头竖起贴边，动效语言不变，适配窄屏工作区。' },
      { id: 'tabbar', title: '移动端 Tab Bar', titleEn: 'TAB BAR', desc: '码头落底变标签栏，激活项点亮液态渐变。' },
    ],
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
    source: XHS_SOURCE,
    variants: [
      { id: 'stack', title: '通知堆叠', titleEn: 'STACK', desc: '三卡错位叠压，逐条关闭、一键复位，景深层次化。' },
      { id: 'media', title: '媒体通知', titleEn: 'MEDIA', desc: '通知卡内嵌迷你播放器，小唱片随播放旋转。' },
    ],
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
    source: XHS_SOURCE,
    variants: [
      { id: 'brightness', title: '亮度调节', titleEn: 'BRIGHT', desc: '同一滑块语言换量化场景，大数字实时回显。' },
      { id: 'progress', title: '播放进度条', titleEn: 'PROGRESS', desc: '滑块化进时间轴，拖动即改写液态填充与时间码。' },
    ],
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
    source: XHS_SOURCE,
    variants: [
      { id: 'panel', title: '快捷开关面板', titleEn: 'PANEL', desc: '单开关复制成控制中心，图标 + 说明 + 状态成组。' },
      { id: 'segment', title: '分段控制器', titleEn: 'SEGMENT', desc: '开关横躺即分段选择，液态胶囊滑轨切换模式。' },
    ],
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
    source: XHS_SOURCE,
    variants: [
      { id: 'clock', title: '玻璃时钟', titleEn: 'CLOCK', desc: '超大极细数字易主时间，秒针以 1s 低频跳动。' },
      { id: 'air', title: '空气质量', titleEn: 'AIR', desc: '温度数字换成 AQI 环，液态渐变作环形进度。' },
    ],
  },
];

/** 按 slug 取条目（详情页 / GlassMount 共用） */
export function getInspiration(slug: string): InspirationItem | undefined {
  return INSPIRATIONS.find((i) => i.slug === slug);
}
