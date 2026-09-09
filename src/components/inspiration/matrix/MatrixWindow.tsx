'use client';

import { useRef, type ReactNode } from 'react';
import { MX } from './matrixShared';

/**
 * MatrixWindow.tsx —— IN-08 细线窗口框架（黑客桌面所有窗口的统一外壳）
 * 2026-09-09 Claude·新增：
 *   - 细线风格：1px 矩阵绿边 + 直角（无圆角，机器美学）+ mono 小字标题栏 +
 *     右侧 [x] 关闭钮；标题栏左右各一枚「铆钉方点」装饰；
 *   - 拖动：pointer events 统一鼠标 / 触摸（setPointerCapture + delta 增量
 *     上报，不依赖容器 rect），标题栏 touch-action:none 防触摸滚动干扰，
 *     位置由父级（桌面）持有并钳制在舞台内（本组件只上报位移，受控渲染）；
 *   - 聚焦：按下标题栏即 onFocus（父级置顶 z-index）。
 */

export interface MatrixWindowProps {
  title: string;
  x: number;
  y: number;
  z: number;
  /** 窗口理想宽度 px（实际输出 min(width, 92vw) 钳制，双端适配铁律） */
  width?: number;
  /** 拖动边界（桌面舞台内尺寸，由父级测量提供） */
  bounds: { w: number; h: number };
  onFocus: () => void;
  onClose: () => void;
  onMove: (x: number, y: number) => void;
  children: ReactNode;
}

export default function MatrixWindow({
  title,
  x,
  y,
  z,
  width = 420,
  bounds,
  onFocus,
  onClose,
  onMove,
  children,
}: MatrixWindowProps) {
  /* 拖动锚点：按下时记录起点指针坐标，move 时按增量上报（不依赖容器 rect） */
  const dragRef = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  const clampX = (v: number) => Math.min(Math.max(v, 4), Math.max(bounds.w - 64, 4));
  const clampY = (v: number) => Math.min(Math.max(v, 44), Math.max(bounds.h - 64, 44));

  return (
    <div
      role="dialog"
      aria-label={title}
      className="absolute select-none"
      style={{
        left: x,
        top: y,
        zIndex: z,
        width: `min(${width}px, 92vw)`,
        background: 'rgba(2,10,7,0.92)',
        border: `1px solid ${MX.line}`,
        boxShadow: `0 0 0 1px ${MX.lineSoft}, 0 18px 48px -18px rgba(0,0,0,0.8), 0 0 22px -6px rgba(74,222,128,0.25)`,
      }}
      onPointerDown={onFocus}
    >
      {/* 标题栏（拖动手柄）：铆钉方点 + mono 标题 + [x] 关闭 */}
      <div
        className="flex cursor-move items-center gap-2 px-2.5 py-1.5"
        style={{ borderBottom: `1px solid ${MX.line}`, touchAction: 'none' }}
        onPointerDown={(e) => {
          (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
          dragRef.current = { px: e.clientX, py: e.clientY, x, y };
        }}
        onPointerMove={(e) => {
          const d = dragRef.current;
          if (!d) return;
          onMove(clampX(d.x + e.clientX - d.px), clampY(d.y + e.clientY - d.py));
        }}
        onPointerUp={() => (dragRef.current = null)}
        onPointerCancel={() => (dragRef.current = null)}
      >
        <i className="h-1.5 w-1.5 shrink-0" style={{ background: MX.green }} aria-hidden />
        <span
          className="min-w-0 flex-1 truncate font-mono text-[11px] uppercase tracking-[0.18em]"
          style={{ color: MX.greenBright, textShadow: MX.textGlow }}
        >
          {title}
        </span>
        <i className="h-1.5 w-1.5 shrink-0" style={{ background: MX.line }} aria-hidden />
        <button
          type="button"
          onClick={onClose}
          aria-label={`关闭 ${title}`}
          className="-my-1 shrink-0 px-1.5 py-1 font-mono text-[11px] transition-colors"
          style={{ color: MX.green }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(74,222,128,0.18)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          [x]
        </button>
      </div>

      {/* 窗体内容 */}
      <div className="p-3">{children}</div>
    </div>
  );
}
