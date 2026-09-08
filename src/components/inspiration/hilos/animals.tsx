/**
 * animals.tsx —— IN-07 人群登录：hilos 原作 SVG 素材映射库（v3）
 * 2026-09-08 Claude·v3 素材更换（用户裁定「用别人的 SVG，别自己整」）：
 *   - 25 只人群肖像 + 1 登录卡 logo 全部取自 hilos.sh 官方公开资源
 *     （/illustrations/portraits/*.svg，色块立绘风，viewBox 356），
 *     已下载入库 public/images/inspiration/hilos/（站规：图在仓库永不断链，
 *     严禁运行时直链外站）；
 *   - 每个组件 = 一张本地 <img>（object-contain 防变形），className 由
 *     调用方控制尺寸/transform，被 CrowdField / CrowdKeys / CrowdWall 复用；
 *   - 描边配置项随之退役（原作为色块填充无 stroke，--hl-sw 不再适用，
 *     见 hilosShared.CrowdConfig v3 注释）。
 * 2026-09-08 Claude·v1 手绘 12 动物 / v2 角色级重画，均因不达原站水准
 *   废弃（用户两次裁定），手稿见 git 历史。
 */

import type { ComponentType } from 'react';

type IconProps = { className?: string };

/** 站内静态资源前缀（静态导出 basePath=/gan，同 minis.MiniCarousel 模式） */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
const DIR = `${BASE}/images/inspiration/hilos`;

/** 原作肖像 → 组件工厂：本地 <img> 包装（懒加载 + 禁拖拽 + 防变形） */
function makeIcon(file: string): ComponentType<IconProps> {
  return function HilosPortrait({ className }: IconProps) {
    return (
      <img
        src={`${DIR}/${file}`}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className={`object-contain ${className ?? ''}`}
      />
    );
  };
}

/* ── 动物肖像（18 只，原站 /illustrations/portraits/ 同款文件） ── */
export const HorseIcon = makeIcon('horse.svg');
export const DuckIcon = makeIcon('duck.svg');
export const WolfIcon = makeIcon('wolf.svg');
export const DeerIcon = makeIcon('deer.svg');
export const RacoonIcon = makeIcon('racoon.svg');
export const BirdIcon = makeIcon('bird.svg');
export const PigIcon = makeIcon('pig.svg');
export const CrocoIcon = makeIcon('croco.svg');
export const FoxIcon = makeIcon('fox.svg');
export const ElephantIcon = makeIcon('elephant.svg');
export const OwlIcon = makeIcon('owl.svg');
export const CatIcon = makeIcon('cat.svg');
export const PupIcon = makeIcon('pup.svg');
export const BunnyIcon = makeIcon('bunny.svg');
export const CowIcon = makeIcon('cow.svg');
export const SealionIcon = makeIcon('sealion.svg');
export const PenguinIcon = makeIcon('penguin.svg');
export const BearIcon = makeIcon('bear.svg');

/* ── 机器人肖像（7 款，原站 crowd 里的「agents」彩蛋） ── */
export const Robot01Icon = makeIcon('robot-01.svg');
export const Robot02Icon = makeIcon('robot-02.svg');
export const Robot03Icon = makeIcon('robot-03.svg');
export const Robot04Icon = makeIcon('robot-04.svg');
export const Robot05Icon = makeIcon('robot-05.svg');
export const Robot06Icon = makeIcon('robot-06.svg');
export const Robot07Icon = makeIcon('robot-07.svg');

/** 登录卡 logo（原站 /hilos-character.svg：滑板狗） */
export const SkateDogIcon = makeIcon('hilos-character.svg');
