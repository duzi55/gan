/**
 * CrowdField.tsx —— IN-07 人群登录：手绘动物人群场（复刻核心）
 * 2026-09-08 Claude·新增（hilos.sh 登录页复刻）：
 *   - 铺满容器的手绘动物人群：布局算法见 hilosShared.buildCrowdLayout
 *     （负 gap 叠肩 / 交错行 / 顶部探出），ResizeObserver 自适应双端；
 *   - 交互三件套（对应原站 Unmute / Lift 18px / 鼠标划音）：
 *     ① hover 跳起 14px（CSS :hover + transition，零 JS 开销）
 *     ② hover 发声（父级注入的 synth.play，小调五声音阶）
 *     ③ 鼠标视差（容器 ±10px 反向漂移，reduced-motion 自动关闭）；
 *   - waveKey 变化触发「全场波浪」（列延迟跳跃，登录卡按钮彩蛋用）；
 *   - 人群为装饰层（aria-hidden），样式自包含 hl- 前缀，不溢出父级。
 */

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ANIMALS, buildCrowdLayout } from './hilosShared';

interface CrowdFieldProps {
  /** 发声接口（useCrowdSynth 提供；未传或 disabled 时静默） */
  onAnimalSound?: (noteIndex: number, octave: number) => void;
  /** 变化即触发全场波浪（列延迟 40ms 依次跳起） */
  waveKey?: number;
  /** 鼠标视差开关（默认 true；reduced-motion 用户自动禁用） */
  parallax?: boolean;
  className?: string;
}

export default function CrowdField({ onAnimalSound, waveKey = 0, parallax = true, className }: CrowdFieldProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [drift, setDrift] = useState({ x: 0, y: 0 });
  const [waving, setWaving] = useState(false);
  const [still, setStill] = useState(false); // prefers-reduced-motion

  /* 容器尺寸监听：人群随舞台尺寸重排（双端适配） */
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setBox({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* reduced-motion 检测一次即可（视差 / 波浪 / 跳动全部静态降级） */
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStill(true);
    }
  }, []);

  /* waveKey 变化 → 全场波浪 0.9s（动画结束自动复位） */
  useEffect(() => {
    if (waveKey <= 0 || still) return;
    setWaving(true);
    const t = setTimeout(() => setWaving(false), 950);
    return () => clearTimeout(t);
  }, [waveKey, still]);

  const crowd = useMemo(() => buildCrowdLayout(box.w, box.h), [box.w, box.h]);

  /** 鼠标视差：相对容器中心 ±10px 反向漂移（transition 平滑跟随） */
  const handleDrift = (e: React.PointerEvent) => {
    if (!parallax || still || e.pointerType === 'touch') return;
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    setDrift({
      x: ((e.clientX - r.left) / r.width - 0.5) * -20,
      y: ((e.clientY - r.top) / r.height - 0.5) * -14,
    });
  };

  return (
    <div
      ref={boxRef}
      className={`absolute inset-0 overflow-hidden ${className ?? ''}`}
      onPointerMove={handleDrift}
      aria-hidden="true"
    >
      {/* 自包含动效：hl- 前缀（灵感样式隔离铁律），reduced-motion 静态降级 */}
      <style>{`
        .hl-animal { transition: transform .28s cubic-bezier(.34,1.56,.64,1); will-change: transform; }
        .hl-animal:hover { transform: translateY(-14px) scale(1.07) !important; }
        @keyframes hl-wave { 0%,100% { transform: translateY(0); } 40% { transform: translateY(-16px); } }
        .hl-waving { animation: hl-wave .55s cubic-bezier(.34,1.56,.64,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .hl-animal, .hl-waving { transition: none; animation: none; }
          .hl-animal:hover { transform: none !important; }
        }
      `}</style>

      {/* 视差漂移层（人群整体反向微移，制造景深） */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${drift.x}px, ${drift.y}px)`,
          transition: 'transform .6s cubic-bezier(.22,1,.36,1)',
        }}
      >
        {crowd.map((a) => {
          const { Icon } = ANIMALS[a.animalIndex];
          return (
            /* 双层分离：外层静态姿态（rotate/flip），内层动作层（hover 跳 / 波浪），
               避免 hover transform 覆盖翻转与旋转（2026-09-08 Claude） */
            <span
              key={a.key}
              className="absolute block"
              style={{
                left: a.x,
                top: a.y,
                width: a.size,
                height: a.size,
                transform: `rotate(${a.rot}deg) scaleX(${a.flip ? -1 : 1})`,
              }}
            >
              <span
                className={`hl-animal block h-full w-full ${waving ? 'hl-waving' : ''}`}
                style={{ animationDelay: waving ? `${(a.col % 14) * 40}ms` : undefined }}
                onPointerEnter={() => onAnimalSound?.(a.noteIndex, a.octave)}
              >
                <Icon className="h-full w-full drop-shadow-[0_2px_3px_rgba(0,0,0,0.12)]" />
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
