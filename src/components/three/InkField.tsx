'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * InkField — 墨尘粒子场（three.js / WebGL）
 *
 * 视觉概念：悬浮在纸面上方的松烟墨尘，缓慢漂流，随鼠标产生轻微视差。
 * 明暗主题感知：浅色 = 松烟墨（深色粒子）；深色 = 淡金月尘（暖亮粒子）。
 *
 * 设计约束（2026-08-27 Claude·视觉重设计「墨境」）：
 * - 解耦：仅依赖 props，不感知任何页面业务；页面用 className 控制布局。
 * - SSG 安全：所有 WebGL 逻辑都在 useEffect 内执行，服务端渲染只输出容器。
 * - 性能：DPR 上限 1.75、粒子数按面积自适应、标签页隐藏时暂停渲染。
 * - 可访问性：prefers-reduced-motion 时只渲染一帧静态画面，不做动画循环。
 * - 容错：WebGL 不可用时静默失败，由容器的 CSS 渐变兜底，不阻塞页面。
 */

interface InkFieldProps {
  /** 粒子密度系数，默认 1；文章头图等小面积场景可适当调低 */
  density?: number;
  /** 覆盖容器样式类（定位/尺寸由调用方决定） */
  className?: string;
  /**
   * 指定粒子色相（#RRGGBB），如文章页传入 post.accent；
   * 不传则跟随明暗主题自动配色。
   */
  accentColor?: string;
}

/** 将 #RRGGBB 或 #RGB 解析为 THREE.Color，非法值返回 null。 */
function parseHexColor(hex: string): THREE.Color | null {
  const value = hex.trim().replace('#', '');
  const normalized =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value;
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;
  return new THREE.Color(`#${normalized}`);
}

/** 浅色主题：松烟墨粒子 */
const INK_COLOR_LIGHT = '#33302b';
/** 深色主题：淡金月尘 */
const INK_COLOR_DARK = '#cbb98a';

export function InkField({ density = 1, className = '', accentColor }: InkFieldProps) {
  // 外层容器：负责尺寸与 CSS 兜底背景（Three 初始化失败时依然有底色）
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* ───────── 前置检查：reduced-motion 仅静态呈现 ───────── */
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // WebGL 不可用：保留容器 CSS 背景，静默退出
      return;
    }

    /* ───────── 场景基础 ───────── */
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 14;

    /* ───────── 粒子系统：自定义 shader 的墨尘 Points ───────── */
    const width = () => container.clientWidth || 1;
    const height = () => container.clientHeight || 1;

    // 粒子数量按容器面积自适应，density 由调用方微调
    const count = Math.max(
      400,
      Math.min(2400, Math.round((width() * height()) / 750) * density)
    );

    // 属性缓冲：位置 / 尺寸缩放 / 随机参数（相位与速度打包成 vec3）
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const randoms = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // 铺满一个略大于视锥的立方体，营造纵深
      positions[i * 3] = (Math.random() - 0.5) * 30;      // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;  // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;  // z
      scales[i] = 0.35 + Math.random() * 0.9;
      randoms[i * 3] = Math.random() * Math.PI * 2;       // 相位
      randoms[i * 3 + 1] = 0.4 + Math.random() * 1.2;     // 速度 a
      randoms[i * 3 + 2] = 0.4 + Math.random() * 1.2;     // 速度 b
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));

    const uniforms = {
      uTime: { value: 0 },
      uSize: { value: 42 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.75) },
      uColor: { value: new THREE.Color(INK_COLOR_LIGHT) },
      uOpacity: { value: 0.5 },
    };

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uSize;
        uniform float uPixelRatio;
        attribute float aScale;
        attribute vec3 aRandom;

        void main() {
          vec3 p = position;
          // 多正弦叠加的流场漂移 —— 近似墨尘在水汽中的悬浮运动
          p.x += sin(uTime * aRandom.y * 0.32 + aRandom.x) * 0.9;
          p.y += sin(uTime * aRandom.z * 0.24 + aRandom.x * 1.7) * 0.7;
          p.z += cos(uTime * aRandom.y * 0.18 + aRandom.z) * 0.6;

          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = uSize * uPixelRatio * aScale * (1.0 / -mvPosition.z);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uOpacity;

        void main() {
          // 以点坐标为中心的软圆形衰减，边缘幂次柔化成"烟"
          float d = distance(gl_PointCoord, vec2(0.5));
          float strength = smoothstep(0.5, 0.0, d);
          strength = pow(strength, 2.4);
          gl_FragColor = vec4(uColor, strength * uOpacity);
        }
      `,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    /* ───────── 主题感知：监听 <html class="dark"> 变化切换粒子颜色 ───────── */
    const applyTheme = () => {
      if (accentColor) {
        const c = parseHexColor(accentColor);
        if (c) {
          uniforms.uColor.value.copy(c);
          uniforms.uOpacity.value = 0.55;
          return;
        }
      }
      const dark = document.documentElement.classList.contains('dark');
      uniforms.uColor.value.set(dark ? INK_COLOR_DARK : INK_COLOR_LIGHT);
      uniforms.uOpacity.value = dark ? 0.62 : 0.5;
    };
    applyTheme();

    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    /* ───────── 鼠标视差：相机缓动跟随指针 ───────── */
    const pointer = { x: 0, y: 0 };
    const lerpPointer = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    /* ───────── 尺寸同步 ───────── */
    const resize = () => {
      const w = width();
      const h = height();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    /* ───────── 渲染循环 ───────── */
    let raf = 0;
    let running = true;
    const clock = new THREE.Clock();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!running) return;

      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;

      // 相机缓动视差（幅度克制，避免抢内容）
      lerpPointer.x += (pointer.x - lerpPointer.x) * 0.03;
      lerpPointer.y += (pointer.y - lerpPointer.y) * 0.03;
      camera.position.x = lerpPointer.x * 0.9;
      camera.position.y = lerpPointer.y * 0.6;
      camera.lookAt(0, 0, 0);

      // 整体极慢自转，让静止视线里也有"呼吸感"
      points.rotation.z = t * 0.008;

      renderer.render(scene, camera);
    };

    // 标签页隐藏时暂停，恢复时继续（避免后台白白耗电）
    const onVisibility = () => {
      running = document.visibilityState === 'visible';
      if (running) clock.start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    if (prefersReducedMotion) {
      // reduced-motion：单帧静态呈现，不启动循环
      renderer.render(scene, camera);
    } else {
      tick();
    }

    /* ───────── 卸载清理 ───────── */
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
      themeObserver.disconnect();
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
    // accentColor 为受控入参：变化时重建场景即可（构建期写死，运行时不会变）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accentColor, density]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none overflow-hidden ${className}`}
      style={{
        /* CSS 兜底：JS/WebGL 失败时仍有温柔的纸面氛围 */
        background:
          'radial-gradient(ellipse at 30% 20%, rgba(120,110,95,0.07), transparent 60%)',
      }}
    />
  );
}
