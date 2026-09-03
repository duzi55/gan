import * as THREE from 'three';
import {
  APPLE_DARK,
  APPLE_HI,
  APPLE_MAIN,
  APPLE_STEM,
  BRANCH_DARK,
  BRANCH_MAIN,
  CLOUD_WHITE,
  LEAF_DARK,
  LEAF_LIGHT,
  LEAF_MAIN,
  LEAF_VEIN,
  RAY_COLOR,
  SKY_BOTTOM,
  SKY_MID,
  SKY_TOP,
  SUN_CORE,
} from './orchardShared';

/**
 * 果园程序化贴图（canvas 2D 绘制 → CanvasTexture，零外部资源）
 * 2026-09-03 Kimi·新增（IN-05 在意苹果 · 解耦铁律：贴图绘制与场景组装分离）：
 *   - 全部素材运行时程序生成：天光渐变 / 太阳辉光与光芒 / 白云 / 叶（明暗两色）/
 *     苹果 / 枝干 / 虚化叶团（前景 bokeh）/ 落光斑；
 *   - 配色全部取自 orchardShared（单一数据源），此处只管形状与笔触；
 *   - 统一 sRGB 色彩空间 + 透明背景，供正交场景直接做 Sprite / Plane 材质。
 */

/** 创建指定尺寸的 canvas 与 2d 上下文 */
function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!];
}

/** canvas → THREE 贴图（sRGB，线性过滤） */
function toTexture(c: HTMLCanvasElement): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.minFilter = THREE.LinearFilter;
  t.magFilter = THREE.LinearFilter;
  return t;
}

/** 天空：三段竖向渐变（顶深蓝 → 中天青 → 底近白） */
export function makeSkyTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(64, 512);
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, SKY_TOP);
  g.addColorStop(0.55, SKY_MID);
  g.addColorStop(1, SKY_BOTTOM);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 512);
  return toTexture(c);
}

/** 太阳辉光：暖白径向光斑 */
export function makeGlowTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256, 256);
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, SUN_CORE);
  g.addColorStop(0.25, 'rgba(255, 251, 232, 0.85)');
  g.addColorStop(0.6, 'rgba(255, 251, 232, 0.22)');
  g.addColorStop(1, 'rgba(255, 251, 232, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return toTexture(c);
}

/** 太阳光芒：12 束长三角光刃（缓慢自转，复刻视频枝头眩光） */
export function makeRaysTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512, 512);
  ctx.translate(256, 256);
  ctx.fillStyle = RAY_COLOR;
  for (let i = 0; i < 12; i++) {
    ctx.rotate(Math.PI / 6);
    const grad = ctx.createLinearGradient(0, 0, 0, -240);
    grad.addColorStop(0, 'rgba(255,253,240,0.30)');
    grad.addColorStop(1, 'rgba(255,253,240,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-7, 0);
    ctx.lineTo(0, -240);
    ctx.lineTo(7, 0);
    ctx.closePath();
    ctx.fill();
  }
  return toTexture(c);
}

/** 白云：三团径向柔白合并的一朵（横向舒展） */
export function makeCloudTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256, 128);
  const puff = (x: number, y: number, r: number, a: number) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255,255,255,${a})`);
    g.addColorStop(0.7, `rgba(255,255,255,${a * 0.55})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };
  puff(88, 72, 56, 0.95);
  puff(148, 62, 62, 0.98);
  puff(190, 78, 44, 0.9);
  ctx.fillStyle = CLOUD_WHITE;
  return toTexture(c);
}

/**
 * 叶：两头尖的椭圆叶形 + 中脉（dark 选深绿用于远层 / 背光）
 * 2026-09-03 Kimi·叶脉提亮、叶尖微翘，逼近视频里的透光叶
 */
export function makeLeafTexture(dark = false): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(128, 128);
  const g = ctx.createLinearGradient(64, 6, 64, 122);
  g.addColorStop(0, dark ? LEAF_DARK : LEAF_LIGHT);
  g.addColorStop(0.5, dark ? LEAF_DARK : LEAF_MAIN);
  g.addColorStop(1, dark ? '#1b4d27' : '#2e7d32');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(64, 6);
  ctx.bezierCurveTo(104, 30, 120, 60, 118, 88);
  ctx.bezierCurveTo(96, 108, 76, 118, 64, 122);
  ctx.bezierCurveTo(52, 118, 32, 108, 10, 88);
  ctx.bezierCurveTo(8, 60, 24, 30, 64, 6);
  ctx.fill();
  /* 中脉 + 侧脉 */
  ctx.strokeStyle = dark ? 'rgba(165,214,167,0.35)' : LEAF_VEIN;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(64, 12);
  ctx.quadraticCurveTo(60, 64, 64, 116);
  ctx.stroke();
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 4; i++) {
    const y = 34 + i * 20;
    ctx.beginPath();
    ctx.moveTo(63, y);
    ctx.quadraticCurveTo(80, y + 6, 96, y + 14);
    ctx.moveTo(63, y);
    ctx.quadraticCurveTo(46, y + 6, 30, y + 14);
    ctx.stroke();
  }
  return toTexture(c);
}

/** 苹果：左上高光的红圆果 + 果柄 + 萼点（视频里的粉黛红苹果） */
export function makeAppleTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(128, 128);
  const g = ctx.createRadialGradient(46, 40, 6, 64, 68, 62);
  g.addColorStop(0, APPLE_HI);
  g.addColorStop(0.45, APPLE_MAIN);
  g.addColorStop(1, APPLE_DARK);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(64, 68, 56, 0, Math.PI * 2);
  ctx.fill();
  /* 粉黛竖纹（视频苹果表皮的脂粉感） */
  ctx.strokeStyle = 'rgba(255, 200, 180, 0.28)';
  ctx.lineWidth = 5;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.arc(64 + i * 18, 70, 44, -Math.PI * 0.42, Math.PI * 0.42);
    ctx.stroke();
  }
  /* 果柄 + 萼点 */
  ctx.strokeStyle = APPLE_STEM;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(64, 16);
  ctx.quadraticCurveTo(66, 8, 72, 5);
  ctx.stroke();
  ctx.fillStyle = 'rgba(60, 20, 12, 0.75)';
  ctx.beginPath();
  ctx.arc(64, 122, 4, 0, Math.PI * 2);
  ctx.fill();
  /* 顶部柔光 */
  const hi = ctx.createRadialGradient(48, 36, 0, 48, 36, 26);
  hi.addColorStop(0, 'rgba(255,255,255,0.55)');
  hi.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = hi;
  ctx.fillRect(22, 10, 52, 52);
  return toTexture(c);
}

/** 枝干：横向渐细带小枝杈（场景里旋转摆放） */
export function makeBranchTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512, 96);
  const g = ctx.createLinearGradient(0, 0, 512, 0);
  g.addColorStop(0, BRANCH_DARK);
  g.addColorStop(1, BRANCH_MAIN);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.quadraticCurveTo(200, 22, 512, 40);
  ctx.lineTo(512, 58);
  ctx.quadraticCurveTo(200, 44, 0, 62);
  ctx.closePath();
  ctx.fill();
  /* 小枝杈 */
  ctx.strokeStyle = BRANCH_MAIN;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(300, 38);
  ctx.quadraticCurveTo(340, 16, 380, 10);
  ctx.moveTo(160, 42);
  ctx.quadraticCurveTo(190, 62, 220, 70);
  ctx.stroke();
  return toTexture(c);
}

/** 虚化叶团：前景散焦 bokeh（深绿柔斑，复刻视频前景虚焦叶） */
export function makeBlurBlobTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(256, 256);
  const g = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
  g.addColorStop(0, 'rgba(27, 94, 32, 0.92)');
  g.addColorStop(0.6, 'rgba(27, 94, 32, 0.55)');
  g.addColorStop(1, 'rgba(27, 94, 32, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return toTexture(c);
}

/** 落光斑：柔白小圆（阳光摇碎一地的 bokeh 粒子） */
export function makeDappleTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(64, 64);
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255, 255, 240, 0.9)');
  g.addColorStop(0.5, 'rgba(255, 255, 240, 0.35)');
  g.addColorStop(1, 'rgba(255, 255, 240, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return toTexture(c);
}
