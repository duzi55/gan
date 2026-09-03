/**
 * 在意苹果共享数据（配色 / 文案 / 场景配置的单一数据源）
 * 2026-09-03 Kimi·新增（IN-05 在意苹果 · 复刻小红书 AlanGaller 的苹果树冠
 *   治愈视频 · 解耦铁律：数值文案与渲染分离）：
 *   - 配色复刻视频画面：正午蓝天三段渐变、阳光暖白、叶三阶绿、苹果红；
 *   - 小清新文案按视频气质撰写（主轮换 5 句 / 摘果 3 句 / 重结 1 句），
 *     首句为原视频标题（溯源句），渲染层只读不改；
 *   - 场景配置（苹果 / 枝叶 / 光斑数量与布局区间）集中于此，调版不动逻辑。
 */

/* ── 天空与光（复刻视频的正午仰角） ── */
export const SKY_TOP = '#2f7fd0';
export const SKY_MID = '#6bb8ee';
export const SKY_BOTTOM = '#cdeeff';
export const SUN_CORE = '#fffbe8';
export const RAY_COLOR = '#fffdf0';

/* ── 叶（远深 / 主绿 / 亮尖三阶） ── */
export const LEAF_DARK = '#256b34';
export const LEAF_MAIN = '#3f9b4f';
export const LEAF_LIGHT = '#7cc24a';
export const LEAF_VEIN = '#a5d6a7';

/* ── 苹果（高光 / 主红 / 暗部 / 果柄） ── */
export const APPLE_HI = '#ff8a66';
export const APPLE_MAIN = '#d53a2a';
export const APPLE_DARK = '#9c1f16';
export const APPLE_STEM = '#5d4037';

/* ── 枝干与云 ── */
export const BRANCH_MAIN = '#6d4c41';
export const BRANCH_DARK = '#4e342e';
export const CLOUD_WHITE = '#ffffff';

/**
 * 小清新轮换文案（视频气质；首句为原视频标题溯源句）
 * 2026-09-03 Kimi·按用户要求「设置视频风格的小清新文案」撰写
 */
export const LINES = [
  '幸福的秘诀是，拥有苹果时只在意苹果。',
  '云在天上，苹果在树上，你在此刻。',
  '风一吹，叶子把阳光摇碎了一地。',
  '不必着急，苹果熟的时候自己会红。',
  '抬头吧，夏天正挂在枝头。',
] as const;

/** 摘下苹果时的回赠句（随机其一） */
export const PICK_LINES = [
  '摘下这一颗，整个夏天都是你的。',
  '苹果落在掌心，日子落在心里。',
  '这一口甜，是阳光存了一个季节的。',
] as const;

/** 摘尽后重新结果的收束句 */
export const REGROW_LINE = '落果之后，枝头又结满了明天。';

/** 底部常驻操作提示（mono 小字，PC / 移动端同文案） */
export const TAP_HINT = 'Tap · 摘一颗苹果';

/** 组件容器 CSS 兜底天色（WebGL 失败时仍是完整蓝天） */
export const ORCHARD_BG = `linear-gradient(180deg, ${SKY_TOP} 0%, ${SKY_MID} 55%, ${SKY_BOTTOM} 100%)`;

/* ── 场景布局配置（调版只改这里；单位为场景半高 = 1 的正交坐标） ── */
/** 苹果悬挂点（枝组局部坐标）：三组枝的挂果位
 *  2026-09-03 Kimi·修正：挂点上提贴枝（原悬空无蒂似漂浮），
 *  y = 枝线高度 - 约 0.06（苹果自带果柄，贴枝即读作悬挂） */
export const APPLE_SPOTS = [
  // 左上枝（主果区，对应视频主体）
  { branch: 0, x: -0.52, y: 0.49, r: 0.085 },
  { branch: 0, x: -0.30, y: 0.41, r: 0.095 },
  { branch: 0, x: -0.08, y: 0.34, r: 0.08 },
  // 右上枝
  { branch: 1, x: 0.42, y: 0.51, r: 0.085 },
  { branch: 1, x: 0.60, y: 0.56, r: 0.075 },
  // 左下近景枝
  { branch: 2, x: -0.62, y: -0.60, r: 0.10 },
  { branch: 2, x: -0.38, y: -0.55, r: 0.09 },
] as const;

/** 光斑数量（阳光摇碎一地的 bokeh） */
export const DAPPLE_COUNT = 12;
