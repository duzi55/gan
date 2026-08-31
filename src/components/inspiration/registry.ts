import type { ComponentType } from 'react';
import {
  MiniPlayer,
  MiniDock,
  MiniNotification,
  MiniSlider,
  MiniToggle,
  MiniWeather,
  MiniInvoice,
} from './minis';

/**
 * 灵感注册表 Inspiration Registry —— 全站唯一灵感条目数据源
 * 2026-08-28 Claude·数据模型重组（用户澄清：一次灵感 = 一个链接 = 列表一张卡）：
 *   - 两级结构：InspirationEntry（灵感，对应一次复刻来源 / 列表一张卡）
 *     → InspirationPrototype[]（该灵感下 1:1 复刻的多件原型）
 *     → 各原型的 InspirationVariant[]（衍生变体）；
 *   - 当前唯一灵感「液态玻璃」收纳同一来源下的 6 件原型 + 12 变体；
 *     以后每复刻一个新链接，在 INSPIRATIONS 新增一个 Entry 即自动
 *     多出一张卡（数据驱动，列表 / 详情页无需改动）；
 *   - 新增流程与展示规则见同目录《INSPIRATION_RULES.md》
 *     （内部功能规范，勿移入博客 / 对外文档）；
 *   - GlassMount 加载键：原型 `prototype.slug`，变体
 *     `${prototype.slug}:${variantId}`，与 Entry.slug 相互独立；
 *   - stage 为深空舞台底（②液态渐变 ⑤景深），仅允许出现在舞台容器内
 *     （详情 hero / 变体块 / 列表缩略窗），样式隔离见规则文件。
 */

/**
 * 灵感来源溯源信息
 * 2026-08-31 Claude·url 可选化（IN-02 柔性账单起）：允许登记「用户提供设计图」
 *   这类无公开原链接的来源——label/via 说明来源身份即可，详情页原文幕按
 *   url 是否存在条件渲染外跳链接；「不可溯源 = 不可上架」规则不变
 *   （规则见 INSPIRATION_RULES.md 第二节）。
 */
export interface InspirationSource {
  /** 来源平台与文章名（无公开链接时写来源身份，如「用户提供灵感图 · …」） */
  label: string;
  /** 原文链接（详情页「原文」区块展示并外跳；无公开原稿时省略） */
  url?: string;
  /** 原始设计方 / 被复刻对象 */
  via?: string;
  /** 相关图片资源（可选，public 相对路径或外链；当前条目以原文链接溯源） */
  image?: string;
}

/** 衍生变体登记（原型精确复刻在前，变体衍生在后——见规则文件生成流程） */
export interface InspirationVariant {
  /** 变体标识：GlassMount 加载键为 `${prototype.slug}:${id}`，与 variants/ 文件名对应 */
  id: string;
  /** 变体中文名 */
  title: string;
  /** mono 英文小字（编辑式排版元素） */
  titleEn: string;
  /** 一句话衍化思路 */
  desc: string;
}

/** 灵感下的一件 1:1 复刻原型（详情页独占一整屏视窗展示） */
export interface InspirationPrototype {
  /** 原型 slug：GlassMount 原型加载键，与灵感路由 slug 相互独立 */
  slug: string;
  /** 目录编号（LG-01 …），编辑式排版元素 */
  no: string;
  /** 中文名题 */
  title: string;
  /** 英文大字题（⑥ 编辑式排版） */
  titleEn: string;
  /** 一句话描述 */
  desc: string;
  /** 复刻要点标签（对应六要点子集） */
  points: string[];
  /** 深空舞台背景：虚焦光斑 + 深空底（纯 CSS，仅限舞台容器使用） */
  stage: string;
  /** 微缩图组件（纯 CSS 静态快照，零客户端 JS；首页 03 区块 / 列表缩略窗复用） */
  Mini: ComponentType;
  /** 该原型的衍生变体（≥2 个，详情页滚动依次显现，按需加载） */
  variants: InspirationVariant[];
}

/** 灵感条目 = 一次复刻来源 = 列表页一张卡片 */
export interface InspirationEntry {
  /** 灵感路由 slug：详情页 /inspiration/[slug] */
  slug: string;
  /** 灵感编号（IN-01 …），列表卡与详情页标注 */
  no: string;
  /** 灵感中文题 */
  title: string;
  /** 英文大字题 */
  titleEn: string;
  /** 一句话描述（列表卡信息栏 + 详情页原文卡复用） */
  desc: string;
  /** 收录日期（YYYY-MM-DD，列表卡与详情页标注） */
  date: string;
  /** 灵感来源（溯源必填，一个灵感一个来源） */
  source: InspirationSource;
  /** 列表卡缩略窗深空底（取代表原型 stage 或独立配置） */
  coverStage: string;
  /** 列表卡缩略窗微缩图（取代表原型 Mini） */
  coverMini: ComponentType;
  /**
   * 沉浸首屏开关（可选）
   * 2026-08-31 Claude·新增（用户口述规范）：immersive 为 true 时，详情页序幕
   *   只渲染「复刻本体 + 返回键」，灵感题头 / 编号 / 要点 chips / 英文水印 /
   *   原型标注 / desc / 步进按钮一律不出现，StageRail 屏点导航同时隐藏；
   *   返回键配色须按舞台明暗适配（浅色舞台用深色字）。缺省 false 走原序幕。
   */
  immersive?: boolean;
  /** 该灵感下的复刻原型（≥1 件，详情页每件独占一整屏） */
  prototypes: InspirationPrototype[];
}

/** 本期灵感共同来源：小红书《液态玻璃 UI / Liquid Glass UI 灵感分享》 */
const XHS_SOURCE: InspirationSource = {
  label: '小红书 · 液态玻璃 UI / Liquid Glass UI 灵感分享',
  url: 'https://xhslink.cn/o/2jqa2rN8gS5',
  via: 'rondesignlab',
};

/**
 * IN-02 柔性账单 · 舞台底：柔和粉彩渐变（薄荷 × 薰衣草，浅色舞台）
 * 2026-08-31 Claude·与深空系（liquid-glass）互斥的浅色舞台语言；
 *   coverStage 与原型 stage 复用同一份，保证列表卡缩略窗与详情页舞台一致。
 */
const SOFT_INVOICE_STAGE =
  'radial-gradient(80% 80% at 16% 12%, rgba(134,239,172,0.75), transparent 60%), ' +
  'radial-gradient(85% 85% at 86% 88%, rgba(196,181,253,0.7), transparent 62%), ' +
  'linear-gradient(160deg, #eaf6ef, #ece9fa)';

/**
 * IN-02 柔性账单来源：用户提供的设计图（无公开原稿链接，url 可选化的首个用例）
 * 2026-08-31 Claude·登记来源身份；若日后找到原稿，补 url 即自动出现外跳链接。
 */
const USER_IMAGE_SOURCE: InspirationSource = {
  label: '用户提供灵感图 · Invoice Dashboard 设计稿（粉彩柔性账单工作台）',
  via: '用户灵感截图（未找到公开原稿）',
};

export const INSPIRATIONS: InspirationEntry[] = [
  {
    slug: 'liquid-glass',
    no: '01',
    title: '液态玻璃',
    titleEn: 'LIQUID GLASS',
    desc: '同一套玻璃语言——半透明材质、液态渐变、颗粒噪点、虚焦景深——复刻六件原型并各衍生两件变体。',
    date: '2026-08-28',
    source: XHS_SOURCE,
    /* 缩略窗取首件原型（唱片机）作代表 */
    coverStage:
      'radial-gradient(85% 85% at 18% 12%, rgba(56,189,248,0.32), transparent 60%), radial-gradient(85% 85% at 85% 88%, rgba(251,113,133,0.26), transparent 62%), linear-gradient(165deg, #141126, #1c1735)',
    coverMini: MiniPlayer,
    prototypes: [
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
        variants: [
          { id: 'clock', title: '玻璃时钟', titleEn: 'CLOCK', desc: '超大极细数字易主时间，秒针以 1s 低频跳动。' },
          { id: 'air', title: '空气质量', titleEn: 'AIR', desc: '温度数字换成 AQI 环，液态渐变作环形进度。' },
        ],
      },
    ],
  },

  /**
   * IN-02 柔性账单 Soft Invoice
   * 2026-08-31 Claude·新增灵感（用户提供的 Invoice Dashboard 设计图复刻）：
   *   - immersive: true —— 详情页首屏净化（用户口述规范）：第一个视图只有
   *     复刻本体与返回键，题头 / 设计理念等元信息不进入首屏；
   *   - 粉彩浅色舞台（薄荷 × 薰衣草），与 IN-01 深空系形成对照；
   *   - 1 件原型（发票工作台）+ 2 变体（移动账单 / 支付回执），
   *     组件与共享数据见 invoice/ 目录（invoiceShared.ts 解耦复用）。
   */
  {
    slug: 'soft-invoice',
    no: '02',
    title: '柔性账单',
    titleEn: 'SOFT INVOICE',
    desc: '同一张发票的柔性语言——粉彩渐变、超大极细金额、胶囊与分段进度——复刻桌面工作台，并衍生移动账单与支付回执。',
    date: '2026-08-31',
    source: USER_IMAGE_SOURCE,
    immersive: true,
    coverStage: SOFT_INVOICE_STAGE,
    coverMini: MiniInvoice,
    prototypes: [
      {
        slug: 'invoice-dashboard',
        no: '01',
        title: '发票工作台',
        titleEn: 'DASHBOARD',
        desc: '金额海报区、Paid / Credits / Balance 胶囊与分段进度、Activity 事件流、六件商品行——整版复刻。',
        points: ['柔软体积感', '虚焦景深', '编辑式排版'],
        stage: SOFT_INVOICE_STAGE,
        Mini: MiniInvoice,
        variants: [
          { id: 'mobile', title: '移动账单', titleEn: 'MOBILE', desc: '同一张账单折进竖屏，金额海报与胶囊重排成单列动线。' },
          { id: 'receipt', title: '支付回执', titleEn: 'RECEIPT', desc: '结清时刻的凭证形态，余款化作对勾、明细与条码。' },
        ],
      },
    ],
  },
];

/** 按灵感 slug 取条目（详情页共用；GlassMount 不依赖本函数，走 LOADERS 键） */
export function getInspiration(slug: string): InspirationEntry | undefined {
  return INSPIRATIONS.find((i) => i.slug === slug);
}
