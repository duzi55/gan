'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  APPLE_SPOTS,
  DAPPLE_COUNT,
  LINES,
  ORCHARD_BG,
  PICK_LINES,
  REGROW_LINE,
  TAP_HINT,
} from './orchardShared';
import {
  makeAppleTexture,
  makeBlurBlobTexture,
  makeBranchTexture,
  makeCloudTexture,
  makeDappleTexture,
  makeGlowTexture,
  makeLeafTexture,
  makeRaysTexture,
  makeSkyTexture,
} from './orchardTextures';

/**
 * 树冠之下 OrchardScene —— IN-05 在意苹果 · 原型（three.js 正交分层 2.5D 场景）
 * 2026-09-03 Kimi·新增（用户点单：复刻小红书 AlanGaller《幸福的秘诀是拥有
 *   苹果时只在意苹果🍎》视频——仰角苹果树冠慢镜头；视频为背景、融入互动、
 *   小清新文案、全屏视角；原视频为 blob DRM 流无法下载入库，按项目惯例
 *   three.js 程序化复刻同一场景，零外部资源）：
 *   - 场景（复刻视频画面）：正午蓝天三段渐变 → 太阳辉光 + 缓转光芒 →
 *     远层虚焦叶团 → 一朵慢走的白云 → 三组枝叶（左主果枝 / 右上枝 / 左下
 *     近景枝，苹果做钟摆悬挂）→ 阳光摇碎一地的落光斑 → 前景散焦叶团；
 *   - 交互（统一 pointer 事件，鼠标 / 触摸同构）：
 *     ① 风随指尖——指针搅动产生风力，枝叶与苹果摆幅随之起伏（带惯性）；
 *     ② 摘一颗苹果——点中苹果即摘下（旋转坠落淡出），随机回赠一句小清新
 *        文案；摘尽后枝头重新结果（弹性长大）并送出收束句；
 *     ③ 分层视差——远景近景按指针错位，全屏视角出 depth；
 *     ④ 小清新文案——底部轮换 5 句（首句为原视频标题溯源句）；
 *   - 双端适配：正交坐标按高度归一，横排布局随 aspect 收缩（竖屏不越界）；
 *     苹果触控命中半径 ×1.7（≥40px 热区）；DPR 上限 1.75；
 *     滚出视口 / 标签页隐藏暂停；reduced-motion 静态一帧；
 *     WebGL 失败静默降级为 CSS 蓝天兜底；
 *   - 解耦：配色文案布局在 orchardShared.ts，贴图绘制在 orchardTextures.ts，
 *     本文件只管场景组装 / 渲染循环 / 覆盖层 UI。
 */

/** 苹果状态机：悬挂 → 坠落 → 已摘 → 重生长 → 悬挂 */
type AppleState = 'hanging' | 'falling' | 'gone' | 'growing';

interface AppleNode {
  sprite: THREE.Sprite;
  /** 悬挂锚点（场景坐标，含横向布局收缩） */
  anchor: { x: number; y: number };
  r: number;
  branch: number;
  state: AppleState;
  /** 钟摆相位 / 坠落速度 / 生长计时 */
  phase: number;
  vx: number;
  vy: number;
  rot: number;
  growT: number;
  delay: number;
  /** 每帧回写世界坐标（命中检测用） */
  wx: number;
  wy: number;
}

/** 枝组配置（三组，对应视频构图：左主果枝 / 右上枝 / 左下近景枝） */
const BRANCHES = [
  { x: -0.62, y: 0.58, rotZ: -0.32, scale: 1.05, parallax: 0.024, leaves: 9 },
  { x: 0.66, y: 0.64, rotZ: Math.PI + 0.30, scale: 0.9, parallax: 0.024, leaves: 7 },
  { x: -0.78, y: -0.58, rotZ: 0.22, scale: 1.15, parallax: 0.036, leaves: 6 },
] as const;

/** 弹性回缓（苹果重新结果的长大曲线） */
function backOut(s: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(s - 1, 3) + c1 * Math.pow(s - 1, 2);
}

export default function OrchardScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  /* 场景闭包 → React 覆盖层（文案轮换 / 摘果回赠句）的桥 */
  const uiPickRef = useRef<() => void>(() => {});
  const uiRegrowRef = useRef<() => void>(() => {});
  const randomPickRef = useRef<() => void>(() => {});
  const pickTimerRef = useRef(0);
  const [webglFailed, setWebglFailed] = useState(false);
  /** 当前展示文案（key 变化触发过渡动画） */
  const [line, setLine] = useState({ text: LINES[0] as string, key: 0 });
  /** 摘果回赠句（非空时覆盖轮换文案，大字居中） */
  const [picked, setPicked] = useState<{ text: string; key: number } | null>(null);

  /* 文案轮换：6s 一句（picked 展示期间暂停轮换计时） */
  useEffect(() => {
    if (picked) return;
    const iv = window.setInterval(() => {
      setLine((l) => ({ text: LINES[(l.key + 1) % LINES.length], key: l.key + 1 }));
    }, 6000);
    return () => window.clearInterval(iv);
  }, [picked]);

  /* 场景闭包调回：摘果 → 随机回赠句（3.5s 后恢复轮换） */
  useEffect(() => {
    uiPickRef.current = () => {
      setPicked({ text: PICK_LINES[Math.floor(Math.random() * PICK_LINES.length)], key: Date.now() });
      window.clearTimeout(pickTimerRef.current);
      pickTimerRef.current = window.setTimeout(() => setPicked(null), 3500);
    };
    uiRegrowRef.current = () => {
      setPicked({ text: REGROW_LINE, key: Date.now() });
      window.clearTimeout(pickTimerRef.current);
      pickTimerRef.current = window.setTimeout(() => setPicked(null), 3500);
    };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* ───── 前置检查：reduced-motion 仅静态一帧 ───── */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      // WebGL 不可用：保留 CSS 蓝天兜底（异步置态防 eslint 级联渲染限制）
      queueMicrotask(() => setWebglFailed(true));
      return;
    }

    /* ───── 渲染器 / 正交相机（场景半高 = 1，宽度随 aspect） ───── */
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.setAttribute('aria-hidden', 'true');

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 50);
    camera.position.z = 10;

    /* 着色 / 编译失败：three 不抛错只告警，canvas 透明透出 CSS 蓝天兜底 */
    try {
      renderer.compile(scene, camera);
    } catch {
      queueMicrotask(() => setWebglFailed(true));
      renderer.dispose();
      return;
    }
    container.prepend(renderer.domElement);

    /* ───── 贴图（全部程序生成） ───── */
    const tex = {
      sky: makeSkyTexture(),
      glow: makeGlowTexture(),
      rays: makeRaysTexture(),
      cloud: makeCloudTexture(),
      leaf: makeLeafTexture(false),
      leafDark: makeLeafTexture(true),
      apple: makeAppleTexture(),
      branch: makeBranchTexture(),
      blob: makeBlurBlobTexture(),
      dapple: makeDappleTexture(),
    };

    /** 建层辅助：统一透明 / 深度关 / 渲染序（画家算法分层） */
    const layer = <T extends THREE.Object3D>(obj: T, order: number, parallax: number, baseX: number, baseY: number): T => {
      obj.renderOrder = order;
      obj.userData.parallax = parallax;
      obj.userData.baseX = baseX;
      obj.userData.baseY = baseY;
      scene.add(obj);
      return obj;
    };
    const basicMat = (map: THREE.Texture, opacity = 1) =>
      new THREE.SpriteMaterial({ map, transparent: true, opacity, depthWrite: false, depthTest: false });
    const layers: THREE.Object3D[] = [];

    /* ───── 层 0-4：天 / 阳光 / 远叶 / 云 ───── */
    const sky = layer(new THREE.Sprite(basicMat(tex.sky)), 0, 0.004, 0, 0);
    sky.scale.set(6, 3, 1);
    layers.push(sky);

    const sunGlow = layer(new THREE.Sprite(basicMat(tex.glow, 0.95)), 1, 0.008, 0.3, 0.8);
    sunGlow.scale.set(1.15, 1.15, 1);
    const sunRays = layer(new THREE.Sprite(basicMat(tex.rays, 0.55)), 2, 0.008, 0.3, 0.8);
    sunRays.scale.set(2.2, 2.2, 1);
    layers.push(sunGlow, sunRays);

    const farL = layer(new THREE.Sprite(basicMat(tex.blob, 0.85)), 3, 0.012, -0.85, 0.78);
    farL.scale.set(1.6, 1.1, 1);
    const farR = layer(new THREE.Sprite(basicMat(tex.blob, 0.8)), 3, 0.012, 0.95, 0.82);
    farR.scale.set(1.4, 1.0, 1);
    layers.push(farL, farR);

    /* 白云：视频标志性的一朵（置于左下天区，避开阳光辉光遮挡） */
    const cloud = layer(new THREE.Sprite(basicMat(tex.cloud, 0.96)), 4, 0.016, -0.38, 0.12);
    cloud.scale.set(1.5, 0.75, 1);
    layers.push(cloud);

    /* ───── 层 5-6：三组枝叶 + 苹果 ───── */
    const branchGroups: THREE.Group[] = [];
    BRANCHES.forEach((cfg, bi) => {
      const g = new THREE.Group();
      g.userData.rotBase = cfg.rotZ;
      g.userData.phase = bi * 2.1;
      /* 枝干本体（2026-09-03 Kimi·修正：枝身收窄 0.22→0.16，去粗笨感） */
      const br = new THREE.Sprite(basicMat(tex.branch));
      br.scale.set(1.15 * cfg.scale, 0.16 * cfg.scale, 1);
      br.material.rotation = cfg.rotZ;
      g.add(br);
      /* 叶：沿枝方向散布（明暗两色混用，随机相位）
         2026-09-03 Kimi·修正：叶更小、转角更散、垂直散布更开——
         原均一方向似鱼鳞排列 */
      for (let i = 0; i < cfg.leaves; i++) {
        const leaf = new THREE.Sprite(basicMat(i % 3 === 0 ? tex.leafDark : tex.leaf));
        const t = (i + 0.5) / cfg.leaves - 0.5; // -0.5..0.5 沿枝
        const lx = Math.cos(cfg.rotZ) * t * 1.05 * cfg.scale;
        const ly = Math.sin(cfg.rotZ) * t * 1.05 * cfg.scale + (Math.random() - 0.3) * 0.20;
        const s = (0.11 + Math.random() * 0.09) * cfg.scale;
        leaf.scale.set(s, s, 1);
        leaf.position.set(lx, ly, 0);
        leaf.userData.rotBase = (Math.random() - 0.5) * 2.4;
        leaf.userData.phase = Math.random() * Math.PI * 2;
        leaf.material.rotation = leaf.userData.rotBase;
        g.add(leaf);
      }
      g.position.set(cfg.x, cfg.y, 0);
      layer(g, 5, cfg.parallax, cfg.x, cfg.y);
      branchGroups.push(g);
      layers.push(g);
    });

    const apples: AppleNode[] = APPLE_SPOTS.map((spot, i) => {
      const sprite = new THREE.Sprite(basicMat(tex.apple));
      sprite.renderOrder = 6;
      scene.add(sprite);
      const a: AppleNode = {
        sprite,
        anchor: { x: spot.x, y: spot.y },
        r: spot.r,
        branch: spot.branch,
        state: 'hanging',
        phase: i * 1.37,
        vx: 0,
        vy: 0,
        rot: 0,
        growT: 0,
        delay: 0,
        wx: spot.x,
        wy: spot.y,
      };
      sprite.scale.set(spot.r * 2, spot.r * 2, 1);
      return a;
    });

    /* 果梗连接线：枝线 → 苹果顶（2026-09-03 Kimi·补：原苹果悬空似漂浮，
       加细梗即读作真悬挂；梗随苹果钟摆微倾，坠落 / 重生联动显隐） */
    const branchYAt = (bi: number, x: number): number => {
      const b = BRANCHES[bi];
      return b.y + (x - b.x) * Math.tan(b.rotZ);
    };
    const stems = apples.map(() => {
      const stem = new THREE.Sprite(
        new THREE.SpriteMaterial({ color: 0x5d4037, transparent: true, opacity: 0.9, depthWrite: false, depthTest: false })
      );
      stem.renderOrder = 6;
      scene.add(stem);
      return stem;
    });

    /* ───── 层 7：落光斑（阳光摇碎一地） ───── */
    const dapples: Array<{ sp: THREE.Sprite; speed: number; phase: number; baseA: number }> = [];
    for (let i = 0; i < DAPPLE_COUNT; i++) {
      const sp = new THREE.Sprite(basicMat(tex.dapple, 0.3));
      const s = 0.03 + Math.random() * 0.05;
      sp.scale.set(s, s, 1);
      sp.position.set((Math.random() - 0.5) * 2.4, Math.random() * 2.4 - 1.2, 0);
      layer(sp, 7, 0.03, sp.position.x, sp.position.y);
      dapples.push({ sp, speed: 0.05 + Math.random() * 0.08, phase: Math.random() * Math.PI * 2, baseA: 0.14 + Math.random() * 0.22 });
      layers.push(sp);
    }

    /* ───── 层 8：前景散焦叶团（视频的前景虚化）
       2026-09-03 Kimi·修正：缩小 + 降透明 + 更贴角——原大块绿斑糊住半场 ───── */
    [
      { x: -1.18, y: -0.85, sx: 1.1, sy: 0.8 },
      { x: 1.18, y: -0.8, sx: 0.95, sy: 0.72 },
      { x: 0.15, y: -1.28, sx: 1.2, sy: 0.65 },
    ].forEach((cfg) => {
      const sp = layer(new THREE.Sprite(basicMat(tex.blob, 0.55)), 8, 0.05, cfg.x, cfg.y);
      sp.scale.set(cfg.sx, cfg.sy, 1);
      layers.push(sp);
    });

    /* ───── 布局：横排随 aspect 收缩（竖屏不越界）
       2026-09-03 Kimi·修正：枝组 baseX 同步 ×layoutX——原仅苹果锚点收缩，
       竖屏下枝留原地、苹果脱离枝头 ───── */
    let layoutX = 1;
    const applyLayout = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      const aspect = w / h;
      camera.left = -aspect;
      camera.right = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      layoutX = Math.min(1, aspect * 1.12);
      sky.scale.set(Math.max(3, 2.4 * aspect + 1), 3, 1);
      branchGroups.forEach((g, i) => {
        g.userData.baseX = BRANCHES[i].x * layoutX;
      });
    };
    applyLayout();
    const resizeObserver = new ResizeObserver(applyLayout);
    resizeObserver.observe(container);

    /* ───── 交互状态：指针 / 风 / 摘果 ───── */
    const pointer = { x: 0, y: 0 };
    const gaze = { x: 0, y: 0 };
    let wind = 0.15; // 风力（枝叶苹果摆幅乘区）
    let windTarget = 0.15;
    const lastP = { x: 0, y: 0, t: 0 };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      /* 指针速度 → 风力（指尖搅动成阵风，之后自然衰减） */
      const now = performance.now();
      const dt = Math.max(16, now - lastP.t) / 1000;
      const v = Math.hypot(nx - lastP.x, ny - lastP.y) / dt;
      lastP.x = nx;
      lastP.y = ny;
      lastP.t = now;
      windTarget = Math.min(1.6, 0.15 + v * 0.55);
      pointer.x = nx;
      pointer.y = ny;
    };

    /** 摘果：命中最近一颗悬挂中的苹果（热区 = 半径 ×1.7，移动端友好） */
    const pickAt = (wx: number, wy: number): boolean => {
      let best: AppleNode | null = null;
      let bestD = Infinity;
      for (const a of apples) {
        if (a.state !== 'hanging') continue;
        const d = Math.hypot(a.wx - wx, a.wy - wy);
        if (d < a.r * 1.7 && d < bestD) {
          best = a;
          bestD = d;
        }
      }
      if (!best) return false;
      best.state = 'falling';
      best.vx = (Math.random() - 0.5) * 0.35;
      best.vy = 0;
      uiPickRef.current();
      return true;
    };

    const onPointerDown = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const aspect = rect.width / rect.height;
      const wx = (((e.clientX - rect.left) / rect.width) * 2 - 1) * aspect;
      const wy = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      pickAt(wx, wy);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerdown', onPointerDown, { passive: true });

    /* 键盘 / 读屏入口：随机摘一颗（按钮 onClick 接入） */
    randomPickRef.current = () => {
      const hanging = apples.filter((a) => a.state === 'hanging');
      if (!hanging.length) return;
      const a = hanging[Math.floor(Math.random() * hanging.length)];
      a.state = 'falling';
      a.vx = (Math.random() - 0.5) * 0.35;
      a.vy = 0;
      uiPickRef.current();
    };

    /* ───── 渲染循环（滚出视口 / 标签页隐藏即暂停） ───── */
    let raf = 0;
    let running = true;
    let pageVisible = true;
    let inView = true;
    const clock = new THREE.Clock();
    const updateRunning = () => {
      const next = pageVisible && inView;
      if (next && !running) clock.start();
      running = next;
    };
    const onVisibility = () => {
      pageVisible = document.visibilityState === 'visible';
      updateRunning();
    };
    document.addEventListener('visibilitychange', onVisibility);
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        updateRunning();
      },
      { rootMargin: '100px' }
    );
    io.observe(container);

    let regrowTimer = 0; // 摘尽后的重新结果倒计时

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!running) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      /* 注视 / 风力缓动（风有惯性，阵风过后慢慢平息） */
      gaze.x += (pointer.x - gaze.x) * 0.06;
      gaze.y += (pointer.y - gaze.y) * 0.06;
      windTarget += (0.15 - windTarget) * 0.4 * dt;
      wind += (windTarget - wind) * 0.9 * dt;

      /* 分层视差 */
      for (const obj of layers) {
        const f = obj.userData.parallax as number;
        obj.position.x = (obj.userData.baseX as number) + gaze.x * f * (obj === cloud ? 1 : layoutX);
        obj.position.y = (obj.userData.baseY as number) + gaze.y * f * 0.5;
      }

      /* 云慢慢走（极慢漂移，到底回卷） */
      cloud.userData.baseX = (cloud.userData.baseX as number) + dt * 0.006;
      if ((cloud.userData.baseX as number) > 1.6) cloud.userData.baseX = -1.6;

      /* 太阳：辉光呼吸 + 光芒缓转 */
      sunGlow.material.opacity = 0.88 + Math.sin(t * 0.8) * 0.07;
      sunRays.material.rotation += dt * 0.03;

      /* 枝叶：风摆（枝组低频 + 叶片高频抖动） */
      for (const g of branchGroups) {
        g.rotation.z = (g.userData.rotBase as number) * 0.03 + Math.sin(t * 0.9 + (g.userData.phase as number)) * 0.022 * (0.4 + wind);
        for (const child of g.children.slice(1)) {
          const leaf = child as THREE.Sprite; // 枝组 children 除枝干外均为叶 Sprite
          leaf.material.rotation = (leaf.userData.rotBase as number) + Math.sin(t * 1.9 + (leaf.userData.phase as number)) * 0.13 * (0.35 + wind);
        }
      }

      /* 苹果：钟摆悬挂 / 坠落 / 重生 状态机（果梗联动） */
      let hangingCount = 0;
      apples.forEach((a, ai) => {
        const stem = stems[ai];
        const bg = branchGroups[a.branch];
        const bx = bg.position.x - (bg.userData.baseX as number); // 枝视差增量
        const by = bg.position.y - (bg.userData.baseY as number);
        if (a.state === 'hanging') {
          hangingCount++;
          const ang = Math.sin(t * 1.25 + a.phase) * 0.11 * (0.35 + wind);
          a.wx = a.anchor.x * layoutX + bx + Math.sin(ang) * 0.05;
          a.wy = a.anchor.y + by + (1 - Math.cos(ang)) * -0.05;
          a.sprite.position.set(a.wx, a.wy, 0);
          a.sprite.material.rotation = ang * 0.6;
          /* 果梗：枝线 → 苹果顶 */
          const topX = a.anchor.x * layoutX + bx;
          const topY = branchYAt(a.branch, a.anchor.x) + by;
          const botX = a.wx;
          const botY = a.wy + a.r * 0.75;
          stem.position.set((topX + botX) / 2, (topY + botY) / 2, 0);
          stem.scale.set(0.008, Math.max(0.01, Math.hypot(botX - topX, botY - topY)), 1);
          stem.material.rotation = -Math.atan2(botX - topX, topY - botY);
          stem.material.opacity = 0.9;
        } else if (a.state === 'falling') {
          a.vy -= 4.2 * dt;
          a.wx += a.vx * dt;
          a.wy += a.vy * dt;
          a.rot += 5.5 * dt;
          a.sprite.position.set(a.wx, a.wy, 0);
          a.sprite.material.rotation = a.rot;
          a.sprite.material.opacity = THREE.MathUtils.clamp((a.wy + 1.15) / 0.6, 0, 1);
          stem.material.opacity = 0;
          if (a.wy < -1.25) {
            a.state = 'gone';
            a.sprite.material.opacity = 0;
          }
        } else if (a.state === 'gone') {
          /* 等待重生长（由 regrow 逻辑统一调度） */
        } else if (a.state === 'growing') {
          if (a.delay > 0) {
            a.delay -= dt;
          } else {
            a.growT = Math.min(1, a.growT + dt / 0.55);
            const s = a.r * 2 * backOut(a.growT);
            a.sprite.scale.set(Math.max(0.001, s), Math.max(0.001, s), 1);
            a.sprite.material.opacity = Math.min(1, a.growT * 2);
            a.wx = a.anchor.x * layoutX + bx;
            a.wy = a.anchor.y + by;
            a.sprite.position.set(a.wx, a.wy, 0);
            stem.material.opacity = 0.9 * a.growT;
            if (a.growT >= 1) {
              a.state = 'hanging';
              a.sprite.material.opacity = 1;
              hangingCount++;
            }
          }
        }
      });

      /* 摘尽调度：全部落下后 1.0s 开始逐颗重生 + 收束句（只触发一次） */
      if (hangingCount === 0 && apples.every((a) => a.state === 'gone')) {
        if (regrowTimer <= 0) {
          regrowTimer = 1.0;
        } else {
          regrowTimer -= dt;
          if (regrowTimer <= 0) {
            apples.forEach((a, i) => {
              a.state = 'growing';
              a.growT = 0;
              a.delay = i * 0.12;
            });
            uiRegrowRef.current();
            regrowTimer = 0;
          }
        }
      }

      /* 落光斑：缓降 + 闪烁（风大时斜落） */
      for (const d of dapples) {
        d.sp.userData.baseY = (d.sp.userData.baseY as number) - d.speed * dt;
        d.sp.userData.baseX = (d.sp.userData.baseX as number) + wind * 0.05 * dt;
        if ((d.sp.userData.baseY as number) < -1.25) {
          d.sp.userData.baseY = 1.25;
          d.sp.userData.baseX = (Math.random() - 0.5) * 2.4;
        }
        d.sp.material.opacity = d.baseA * (0.65 + 0.35 * Math.sin(t * 1.8 + d.phase));
      }

      renderer.render(scene, camera);
    };

    if (prefersReducedMotion) {
      /* reduced-motion：中性姿态单帧（苹果归位悬挂） */
      for (const a of apples) {
        a.sprite.position.set(a.anchor.x * layoutX, a.anchor.y, 0);
        a.sprite.scale.set(a.r * 2, a.r * 2, 1);
      }
      renderer.render(scene, camera);
    } else {
      tick();
    }

    /* ───── 卸载清理 ───── */
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.clearTimeout(pickTimerRef.current);
      randomPickRef.current = () => {};
      scene.traverse((obj) => {
        if (obj instanceof THREE.Sprite) obj.material.dispose();
      });
      Object.values(tex).forEach((t) => t.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  /** 提示按钮入口：随机摘一颗（转发给场景闭包） */
  const poke = () => randomPickRef.current();

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="在意苹果互动舞台：移动指尖起风，点苹果即可摘下"
      className="relative h-full w-full cursor-pointer select-none overflow-hidden rounded-[1.5rem] border border-sky-200/60 shadow-[0_36px_70px_-24px_rgba(30,80,140,0.5)]"
      style={{ background: ORCHARD_BG }}
    >
      {/* 内凹亮角：舞台景深感（纯装饰） */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[1.5rem]"
        style={{ boxShadow: 'inset 0 0 110px rgba(10, 40, 80, 0.18)' }}
      />

      {/* WebGL 不可用兜底：蓝天之上给一句说明（静默降级，不阻塞页面） */}
      {webglFailed && (
        <p className="absolute inset-0 z-20 flex items-center justify-center px-8 text-center font-serif text-sm leading-relaxed text-white/90">
          当前设备 / 浏览器不支持 WebGL，苹果树冠无法呈现
        </p>
      )}

      {/* 小清新文案区：底部轮换句（picked 时让位） */}
      <p
        key={line.key}
        aria-live="polite"
        className={`pointer-events-none absolute inset-x-0 bottom-[16%] z-20 px-6 text-center font-serif text-sm tracking-[0.08em] text-white transition-all duration-700 sm:text-lg ${
          picked ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-95'
        }`}
        style={{ textShadow: '0 1px 10px rgba(20, 60, 110, 0.55), 0 0 2px rgba(20, 60, 110, 0.4)' }}
      >
        {line.text}
      </p>

      {/* 摘果回赠句：大字居中浮现（覆盖轮换句期间） */}
      {picked && (
        <p
          key={picked.key}
          className="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 px-8 text-center font-serif text-xl tracking-[0.06em] text-white sm:text-2xl"
          style={{
            textShadow: '0 2px 14px rgba(20, 60, 110, 0.6), 0 0 3px rgba(20, 60, 110, 0.45)',
            animation: 'dc-line-in 0.6s ease-out both',
          }}
        >
          {picked.text}
        </p>
      )}

      {/* 组件级覆盖层样式（自包含，dc- 前缀不外溢）：回赠句浮现动画 */}
      <style>{`
        @keyframes dc-line-in {
          0% { opacity: 0; transform: translateY(10px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          p[style*="dc-line-in"] { animation: none; }
        }
      `}</style>

      {/* 常驻提示（键盘 / 读屏入口：点击随机摘一颗；视觉点选由容器 pointerdown 命中） */}
      <button
        type="button"
        onClick={poke}
        onPointerDown={(e) => e.stopPropagation() /* 避免与容器 pointerdown 重复 */}
        aria-label="摘一颗苹果，收下一句小清新文案"
        className="group absolute bottom-3.5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 px-3 py-1 text-white/90 transition-colors hover:text-white"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">{TAP_HINT}</span>
        {/* 苹果图标（lg-bob 呼吸动画，自带 prefers-reduced-motion 降级） */}
        <svg aria-hidden viewBox="0 0 24 24" className="lg-bob h-3.5 w-3.5" fill="currentColor">
          <path d="M12 7c-.4-1.8.4-3.6 2-4.6.2 1.9-.8 3.7-2 4.6z" />
          <path d="M15.6 7.6c-1.8 0-2.7.8-3.6.8s-1.8-.8-3.6-.8C5.9 7.6 4 10 4 12.7c0 3.9 3.3 8.7 6.1 8.7.8 0 1.2-.4 1.9-.4s1.1.4 1.9.4c2.8 0 6.1-4.8 6.1-8.7 0-2.7-1.9-5.1-4.4-5.1z" />
        </svg>
      </button>
    </div>
  );
}
