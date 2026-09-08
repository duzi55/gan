/**
 * hilosShared.ts —— IN-07 人群登录：共享数据与布局算法（单一数据源）
 * 2026-09-08 Claude·新增（hilos.sh 登录页复刻）：
 *   - 动物花名册（12 种，引用 animals.tsx 手绘 SVG 库）；
 *   - 人群布局算法 buildCrowdLayout：复刻原站 Crowd Controls 的参数逻辑
 *     （Size / 负 X·Y gap 重叠 / 顶部探出 / 交错行），纯函数、确定性伪随机
 *     （同尺寸输出一致，无 hydration 风险）；
 *   - 小调五声音阶表（A minor pentatonic，同原站 Scale: minorPentatonic）：
 *     每只动物按 (行·列) 分配一个音级，鼠标划过时自然连成旋律；
 *   - 被 CrowdField / CrowdLogin / variants 复用（解耦铁律）。
 */

import type { ComponentType } from 'react';
import {
  DogIcon, CatIcon, RabbitIcon, BearIcon, PigIcon, PandaIcon,
  PenguinIcon, AlligatorIcon, OwlIcon, CowIcon, FoxIcon, RobotIcon,
} from './animals';

/** 人群动物花名册：label 供 aria / 签到墙称呼 */
export const ANIMALS: { id: string; label: string; Icon: ComponentType<{ className?: string }> }[] = [
  { id: 'dog', label: '小狗', Icon: DogIcon },
  { id: 'cat', label: '小猫', Icon: CatIcon },
  { id: 'rabbit', label: '兔子', Icon: RabbitIcon },
  { id: 'bear', label: '小熊', Icon: BearIcon },
  { id: 'pig', label: '小猪', Icon: PigIcon },
  { id: 'panda', label: '熊猫', Icon: PandaIcon },
  { id: 'penguin', label: '企鹅', Icon: PenguinIcon },
  { id: 'gator', label: '鳄鱼', Icon: AlligatorIcon },
  { id: 'owl', label: '猫头鹰', Icon: OwlIcon },
  { id: 'cow', label: '奶牛', Icon: CowIcon },
  { id: 'fox', label: '狐狸', Icon: FoxIcon },
  { id: 'robot', label: '机器人', Icon: RobotIcon },
];

/**
 * 小调五声音阶（A3 为基）：半音偏移表
 * 原站 crowd controls 同款 Scale: minorPentatonic——
 * 任意连续几个音随机组合都成旋律，怎么划都好听。
 */
export const PENTA_SEMITONES = [0, 3, 5, 7, 10] as const;
export const PENTA_BASE_FREQ = 220; // A3

/** 音级 → 频率（octave 为八度偏移，±1） */
export function pentaFreq(noteIndex: number, octave = 0): number {
  const semis = PENTA_SEMITONES[noteIndex % PENTA_SEMITONES.length] + 12 * octave;
  return PENTA_BASE_FREQ * Math.pow(2, semis / 12);
}

/**
 * 人群可调配置（2026-09-08 Claude·用户点单「边框太粗，提供配置项」）：
 * 默认值经原站比对校准；CrowdLogin 右下角「人群调参」面板实时改写，
 * 经 CSS 变量 --hl-sw（描边）/ --hl-hop（跳跃）与布局参数 sizeDivisor 生效。
 */
export interface CrowdConfig {
  /** 动物描边粗细（SVG stroke-width，viewBox=100 坐标系；原写死 4.5 偏粗，默认 3.2） */
  strokeWidth: number;
  /** 人群尺寸因子：动物边长 ≈ 容器宽 ÷ sizeDivisor（越小越大只），结果钳 64~150px */
  sizeDivisor: number;
  /** hover 跳起高度 px（原站 Lift=18；默认 14 配果冻动画更 Q 弹） */
  hopHeight: number;
}
export const CROWD_CONFIG_DEFAULT: CrowdConfig = { strokeWidth: 3.2, sizeDivisor: 10, hopHeight: 14 };

/** 人群中的一只动物（布局输出） */
export interface CrowdAnimal {
  key: string;
  animalIndex: number; // ANIMALS 下标
  noteIndex: number; // 五声音阶级（0-4）
  octave: number;
  x: number; // px，相对人群容器左上
  y: number;
  size: number; // px
  flip: boolean; // 水平镜像（人群朝向更自然）
  rot: number; // 微旋转 deg（手绘松弛感）
  col: number; // 列号（波浪动画按列延迟）
  /** 是否前景层（2026-09-08 Claude·U 形前景：底部横带 + 卡片左右骑缘列，压卡片前） */
  front: boolean;
}

/**
 * 确定性伪随机（同输入同输出，避免布局抖动）：
 * 返回 [0,1) 浮点；seed 由行列组合。
 */
function hash01(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * 人群铺满布局（复刻原站参数：Size 146 / X gap -66 / Y gap -62 / Top -18）
 * 2026-09-08 Claude·按容器宽高自适应：有效间距约为 size 的 55%~60%
 *   （负 gap = 动物相互叠肩），奇数行横向错半格，顶部探出容器上沿；
 *   size 随容器宽 clamp（桌面≈144，移动≈64），间距比对齐原站（0.55/0.575）。
 */
export function buildCrowdLayout(width: number, height: number, sizeDivisor: number = CROWD_CONFIG_DEFAULT.sizeDivisor): CrowdAnimal[] {
  if (width < 40 || height < 40) return [];
  /* 2026-09-08 Claude·密度校准：size≈width/sizeDivisor（默认 10，原站 Size 146px /
     pitchX 80px 的 1.83 重叠比），1440px 屏横向约 18 列与原站一致；移动端向下钳 64px */
  const size = Math.min(150, Math.max(64, width / sizeDivisor));
  const pitchX = size * 0.55;
  const pitchY = size * 0.575;
  /* 移动端卡片侧边避让（2026-09-08 Claude·用户点单移动端适配）：
     卡片两侧缝隙不足一只动物时（375px 屏卡宽 92vw 两侧仅 15px），「骑卡片
     左右缘」的后景动物只露出几像素细条——直接跳过不渲染，缝隙透出舞台
     底色；桌面缝隙大（cardLeft > size）自动不触发；底部前景带动物不避让
     （压卡片下缘是前景遮挡特性，见 CrowdField frontY） */
  const cardW = Math.min(430, width * 0.92);
  const cardH = Math.min(500, height * 0.8);
  const cardLeft = (width - cardW) / 2;
  const cardRight = cardLeft + cardW;
  const cardTop = (height - cardH) / 2;
  const cardBottom = cardTop + cardH;
  const frontBandY = height * 0.72;
  const sideAvoid = cardLeft < size;
  const cols = Math.ceil(width / pitchX) + 1;
  const rows = Math.ceil(height / pitchY) + 1;
  const out: CrowdAnimal[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const seed = row * 97 + col * 31;
      const stagger = row % 2 === 1 ? pitchX * 0.5 : 0;
      const jx = (hash01(seed + 1) - 0.5) * size * 0.22;
      const jy = (hash01(seed + 2) - 0.5) * size * 0.18;
      let x = col * pitchX - size * 0.24 + stagger + jx;
      const y = row * pitchY - size * 0.2 + jy;
      /* 侧边避让：窄缝下「骑卡片左右缘」的后景动物只露出几像素细条，直接
         跳过不渲染（缝隙透出舞台底色更干净）；完全落在卡片横向区间内的
         动物保留（被卡片遮挡后从顶/底缘探出，正是原站的前后景深） */
      if (sideAvoid && y < frontBandY) {
        const inCardY = y + size > cardTop + size * 0.4 && y < cardBottom - size * 0.2;
        const straddleEdge =
          (x < cardLeft && x + size > cardLeft + 6) || (x < cardRight - 6 && x + size > cardRight);
        if (inCardY && straddleEdge) continue;
      }
      /* U 形前景（2026-09-08 Claude·用户点单对齐原站：卡片左右两侧各一列
         动物骑缘压前 + 底部横带压前）：
         ① 底部横带 y ≥ frontBandY；
         ② 桌面宽缝时（窄缝避让不触发），卡片左右最近一列动物向内骑进
            卡片边缘 ~25% 并标记前景——压在卡片左右边线上（原站同款） */
      const cx = x + size / 2;
      const nearLeftEdge = Math.abs(cx - cardLeft) < pitchX * 0.55;
      const nearRightEdge = Math.abs(cx - cardRight) < pitchX * 0.55;
      const inSideCorridor =
        !sideAvoid && y > cardTop - size * 0.5 && y < cardBottom && (nearLeftEdge || nearRightEdge);
      if (inSideCorridor) {
        x = nearLeftEdge ? cardLeft - size * 0.74 : cardRight - size * 0.26;
      }
      out.push({
        key: `r${row}c${col}`,
        /* 动物种类与音级按行列错开，相邻不重样、划动成旋律 */
        animalIndex: (row * 5 + col * 7 + Math.floor(hash01(seed + 3) * 5)) % ANIMALS.length,
        noteIndex: (row * 3 + col) % PENTA_SEMITONES.length,
        octave: row % 3 === 0 ? 1 : 0,
        x,
        y,
        size: size * (0.88 + hash01(seed + 4) * 0.24),
        flip: hash01(seed + 5) > 0.5,
        rot: (hash01(seed + 6) - 0.5) * 10,
        col,
        front: y >= frontBandY || inSideCorridor,
      });
    }
  }
  return out;
}

/** 登录卡副文案（1:1 复刻原站标语） */
export const CROWD_TAGLINE = 'People and agents shipping in the same rooms.';

/**
 * 签到墙成员名（CrowdWall 变体）：动物名 + 序号称谓
 * 2026-09-08 Claude·纯 UI 展示名册（非接口数据），点击签到只改本地状态。
 */
export function wallMemberName(animalIndex: number, serial: number): string {
  return `${ANIMALS[animalIndex].label}·${String(serial + 1).padStart(2, '0')}`;
}
