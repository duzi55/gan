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
export function buildCrowdLayout(width: number, height: number): CrowdAnimal[] {
  if (width < 40 || height < 40) return [];
  /* 2026-09-08 Claude·密度校准：size≈width/10（原站 Size 146px / pitchX 80px
     的 1.83 重叠比），1440px 屏横向约 18 列与原站一致；移动端正向下钳 64px */
  const size = Math.min(150, Math.max(64, width / 10));
  const pitchX = size * 0.55;
  const pitchY = size * 0.575;
  const cols = Math.ceil(width / pitchX) + 1;
  const rows = Math.ceil(height / pitchY) + 1;
  const out: CrowdAnimal[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const seed = row * 97 + col * 31;
      const stagger = row % 2 === 1 ? pitchX * 0.5 : 0;
      const jx = (hash01(seed + 1) - 0.5) * size * 0.22;
      const jy = (hash01(seed + 2) - 0.5) * size * 0.18;
      out.push({
        key: `r${row}c${col}`,
        /* 动物种类与音级按行列错开，相邻不重样、划动成旋律 */
        animalIndex: (row * 5 + col * 7 + Math.floor(hash01(seed + 3) * 5)) % ANIMALS.length,
        noteIndex: (row * 3 + col) % PENTA_SEMITONES.length,
        octave: row % 3 === 0 ? 1 : 0,
        x: col * pitchX - size * 0.24 + stagger + jx,
        y: row * pitchY - size * 0.2 + jy,
        size: size * (0.88 + hash01(seed + 4) * 0.24),
        flip: hash01(seed + 5) > 0.5,
        rot: (hash01(seed + 6) - 0.5) * 10,
        col,
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
