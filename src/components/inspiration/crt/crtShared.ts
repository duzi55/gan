/**
 * crtShared —— IN-03「复古电视」原型与变体的共享数据 / 样式常量
 * 2026-08-31 Claude·新增（用户提供小红书笔记：复古 CRT 电视 + VHS 卡带播放器，
 *   一比一复刻其呈现的样式逻辑）：
 *   - CRTPlayer（原型：电视居中 + 卡带架 + 点击卡带插带换台）
 *     / CRTRemote（遥控换台）/ CRTHandheld（掌上电视）共用同一份卡带数据；
 *   - 改卡带 / 频道只动本文件，三件组件同步生效（解耦复用，同 invoiceShared 模式）；
 *   - 「视频播放」用本地入库静态画面 + 纯 CSS 动画模拟
 *     （扫描线 / 雪花 / ken-burns 缓动），严禁创建本地视频或 mock 数据；
 *   - 字体栈自包含系统无衬线 + mono（OSD 频道字符），不依赖全局 --font-*。
 */

/** CRT UI 字体栈（自包含，同 IN-02 模式） */
export const CRT_FONT =
  '-apple-system, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

/** OSD 等宽字体（频道字符 / 时间码，绿色荧光感） */
export const CRT_MONO =
  'ui-monospace, "SF Mono", "Cascadia Mono", Consolas, "Courier New", monospace';

/** 视觉常量（对照复古便携 CRT：奶油机身 / 深棕面板 / 荧光绿 OSD） */
export const CRT_COLOR = {
  shellFrom: '#f4ecd9', // 机身奶油（塑料高光）
  shellTo: '#e2d2b4', // 机身暗部
  shellEdge: '#b49a72', // 机身描边
  panelFrom: '#4a3b2c', // 前面板深棕
  panelTo: '#332718',
  screenFrame: '#1c1a17', // 屏幕外圈黑框
  osd: '#8dffb0', // OSD 荧光绿
  osdShadow: 'rgba(80,255,140,0.55)', // OSD 荧光辉光
  label: '#f6f1e4', // 卡带白标签
} as const;

/** 机身塑料渐变（三件组件共用，保证「同一台电视」跨形态一致） */
export const SHELL_GRADIENT =
  'linear-gradient(165deg, #f7f0df 0%, #efe4cd 46%, #e0cfae 100%)';

/** 面板深棕渐变 */
export const PANEL_GRADIENT = 'linear-gradient(170deg, #4a3b2c, #332718)';

/**
 * 卡带数据（四张，1:1 对应四个频道；不自创多余内容）：
 *   - shell 卡带壳色 / spine 标签条色；
 *   - channel 频道号（OSD 与卡带标签共用）；
 *   - title 节目标签（卡带白标签上手写风文案）；
 *   - art 频道画面（本地入库图 /gan/images/inspiration/crt/，
 *     2026-08-31 Claude·修复裂图：原为站方文生图 API 运行时直链，
 *     浏览器现场生成不稳定（抓到「生成中」占位图甚至超时裂图），
 *     已按站点「图在仓库里永不断链」规范预先生成入库，组件直接 <img src>）。
 */

export interface Tape {
  id: string;
  channel: string;
  title: string;
  shell: string;
  spine: string;
  art: string;
}

export const TAPES: Tape[] = [
  {
    id: 'sunset',
    channel: 'CH 01',
    title: 'Sunset Beach',
    shell: '#c96f4a', // 砖红壳
    spine: '#a44f2e',
    art: '/gan/images/inspiration/crt/tape-sunset.jpg',
  },
  {
    id: 'neon',
    channel: 'CH 02',
    title: 'Neon City',
    shell: '#3f6f8e', // 湖蓝壳
    spine: '#2c526c',
    art: '/gan/images/inspiration/crt/tape-neon.jpg',
  },
  {
    id: 'forest',
    channel: 'CH 03',
    title: 'Wild Forest',
    shell: '#5c7a4e', // 苔绿壳
    spine: '#445c3a',
    art: '/gan/images/inspiration/crt/tape-forest.jpg',
  },
  {
    id: 'space',
    channel: 'CH 04',
    title: 'Space Odyssey',
    shell: '#7b6394', // 紫灰壳
    spine: '#5d4975',
    art: '/gan/images/inspiration/crt/tape-space.jpg',
  },
];

/** 扫描线纹理（屏幕播放画面上的 CRT 扫描线，纯 CSS，三件组件共用） */
export const SCANLINES =
  'repeating-linear-gradient(180deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 3px)';

/** 雪花噪点纹理（换带瞬间的白噪声闪屏：feTurbulence SVG data URI） */
export const SNOW_FILL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * CRT 组件专用 keyframes（自包含 <style> 注入，类名一律 crt- 前缀隔离，无全局选择器）：
 *   - crt-snow：换带白噪声闪屏（steps 抖动）；
 *   - crt-show：频道画面延迟登场（雪花闪完再显，fill backwards 挡住首帧）；
 *   - crt-ken：画面 ken-burns 缓动（模拟「播放中」的镜头缓移）；
 *   - crt-tape-in：卡带插入进带窗（从上方落入）；
 *   - crt-osd：OSD 字符点亮闪烁；
 *   - crt-flicker：屏幕亮度微闪（CRT 通电感）。
 * 2026-08-31 Claude·抽到 shared 由三件组件共用同一份 <style> 字符串，避免重复。
 */
export const CRT_KEYFRAMES = `
@keyframes crt-snow { 0%,100% { opacity: 0 } 10%,60% { opacity: 1 } 70% { opacity: .2 } }
@keyframes crt-show { from { opacity: 0 } to { opacity: 1 } }
@keyframes crt-ken { 0% { transform: scale(1) translate(0,0) } 50% { transform: scale(1.09) translate(-1.5%,1%) } 100% { transform: scale(1) translate(0,0) } }
@keyframes crt-tape-in { from { transform: translateY(-140%) } to { transform: translateY(0) } }
@keyframes crt-osd { 0% { opacity: 0 } 55% { opacity: 0 } 70% { opacity: 1 } 82% { opacity: .35 } 100% { opacity: 1 } }
@keyframes crt-flicker { 0%,100% { opacity: 1 } 50% { opacity: .96 } }
`;
