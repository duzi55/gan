'use client';

import { useEffect, useRef, useState } from 'react';
import DigitalRain from './DigitalRain';
import MatrixWindow from './MatrixWindow';
import TerminalPane from './TerminalPane';
import { MX, MX_FOLDERS, RABBIT_FILE, findFile } from './matrixShared';

/**
 * MatrixDesktop.tsx —— IN-08 黑客桌面原型（Matrix 风格桌面）
 * 2026-09-09 Claude·新增（用户口述灵感：黑客帝国一样的桌面——细线条、绿色，
 *   有文件夹、可打开终端）：
 *   - 构图：顶部细线状态栏（ZION-OS · trace 装饰读数 · 实时时钟 1s 低频
 *     自持）+ 桌面图标栅格（3 个虚拟文件夹 / 终端 / white_rabbit.txt /
 *     回收站，全部细线条 SVG）+ 底部细线状态栏（快捷终端 / 白兔入口）；
 *   - 交互：单击选中（绿色虚线选框）、双击 / 双点打开窗口（自实现 380ms
 *     双击检测，移动端 dbltap 兼容）；窗口可拖动（MatrixWindow 指针增量）、
 *     按下即聚焦置顶（z 计数器）、[x] 关闭；
 *   - 终端窗口：help / ls / cat / whoami / date / matrix / rabbit / clear /
 *     exit（执行器与虚拟文件系统见 matrixShared，纯前端无网络请求）；
 *   - 背景：DigitalRain 暗态铺底（dim 小字号；reduced-motion 静态一帧）；
 *   - 双端：窗口宽度 min(px, 92vw) 钳制、位置钳制在舞台内；触控目标 ≥40px；
 *     底部状态栏常驻快捷入口，移动端不依赖双击也能把玩全部窗口。
 */

/** 桌面窗口状态（key 用于同类单例去重：term/trash/同文件夹/同文件只开一份） */
interface WinState {
  id: number;
  key: string;
  kind: 'folder' | 'view' | 'term' | 'trash';
  folderId?: string;
  fileName?: string;
  x: number;
  y: number;
  z: number;
}

/* ── 细线条图标（stroke 1.5 直角折线，机器美学；fill none） ── */
function FolderIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 8h8l2.5 3H28v16H4z" />
      <path d="M8 17h9M8 21h13" opacity=".55" />
    </svg>
  );
}
function TerminalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="3.5" y="5.5" width="25" height="21" />
      <path d="M8 12.5l5 4-5 4M16.5 20.5H24" />
    </svg>
  );
}
function FileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M8 3.5h11l5 5v20H8z" />
      <path d="M19 3.5v5h5M11.5 15h9M11.5 19h9M11.5 23h6" opacity=".7" />
    </svg>
  );
}
function TrashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M6.5 8.5h19M12.5 8.5v-3h7v3M9 8.5l1.6 19h10.8L23 8.5" />
      <path d="M13.5 13.5v9.5M18.5 13.5v9.5" opacity=".6" />
    </svg>
  );
}

/** 实时时钟（1s 低频 tick，组件内自持并在卸载清理；SSR 先渲染占位） */
function Clock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = () => setNow(new Date().toLocaleTimeString('zh-CN', { hour12: false }));
    fmt();
    const t = setInterval(fmt, 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="tabular-nums">{now ?? '--:--:--'}</span>;
}

export default function MatrixDesktop() {
  const stageRef = useRef<HTMLDivElement>(null);
  const zRef = useRef(10);
  const idRef = useRef(1);
  const lastTapRef = useRef<{ key: string; t: number }>({ key: '', t: 0 });
  const [wins, setWins] = useState<WinState[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  /* 舞台内尺寸：窗口初始定位与拖动钳制都用（ResizeObserver 自持） */
  const [stage, setStage] = useState({ w: 1200, h: 700 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStage({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** 聚焦置顶：z 取自计数器（纯 updater，StrictMode 安全） */
  const focusWin = (id: number) => {
    const z = ++zRef.current;
    setWins((prev) => prev.map((w) => (w.id === id ? { ...w, z } : w)));
  };
  const closeWin = (id: number) => setWins((prev) => prev.filter((w) => w.id !== id));
  const moveWin = (id: number, x: number, y: number) =>
    setWins((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));

  /** 打开窗口（同类单例：key 相同只聚焦）；位置按已有窗口数级联并钳制舞台内 */
  const openWin = (base: Omit<WinState, 'id' | 'x' | 'y' | 'z'>) => {
    const exist = wins.find((w) => w.key === base.key);
    if (exist) {
      focusWin(exist.id);
      return;
    }
    const z = ++zRef.current;
    const n = wins.length;
    const x = Math.min(Math.max(stage.w < 480 ? 8 + (n % 4) * 12 : 64 + (n % 6) * 32, 4), Math.max(stage.w - 300, 4));
    const y = Math.min(Math.max(stage.h < 480 ? 64 + (n % 4) * 14 : 92 + (n % 5) * 28, 44), Math.max(stage.h - 260, 44));
    setWins((prev) => [...prev, { ...base, id: idRef.current++, x, y, z }]);
  };

  /** 图标点按：单击选中；380ms 内再点同键 = 打开（自实现双击，移动端兼容） */
  const tapIcon = (key: string, open: () => void) => {
    setSelected(key);
    const now = Date.now();
    const last = lastTapRef.current;
    if (last.key === key && now - last.t < 380) {
      open();
      lastTapRef.current = { key: '', t: 0 };
    } else {
      lastTapRef.current = { key, t: now };
    }
  };

  /** 桌面图标清单（文件夹 ×3 + 终端 + 白兔文件 + 回收站） */
  const icons = [
    ...MX_FOLDERS.map((f) => ({
      key: `folder:${f.id}`,
      label: f.label,
      Icon: FolderIcon,
      open: () => openWin({ key: `folder:${f.id}`, kind: 'folder' as const, folderId: f.id }),
    })),
    {
      key: 'term',
      label: '终端',
      Icon: TerminalIcon,
      open: () => openWin({ key: 'term', kind: 'term' as const }),
    },
    {
      key: 'rabbit',
      label: RABBIT_FILE.name,
      Icon: FileIcon,
      open: () => openWin({ key: `view:${RABBIT_FILE.name}`, kind: 'view' as const, fileName: RABBIT_FILE.name }),
    },
    {
      key: 'trash',
      label: '回收站',
      Icon: TrashIcon,
      open: () => openWin({ key: 'trash', kind: 'trash' as const }),
    },
  ];

  return (
    <div
      ref={stageRef}
      className="relative h-full w-full select-none overflow-hidden font-mono"
      onPointerDown={() => setSelected(null)}
    >
      {/* 代码雨暗态铺底（reduced-motion 时为静态一帧，见 DigitalRain） */}
      <DigitalRain dim fontSize={14} speed={0.8} opacity={0.5} />

      {/* 顶部细线状态栏 */}
      <div
        className="absolute inset-x-0 top-0 z-30 flex items-center gap-3 px-4 py-2 text-[11px] tracking-[0.16em]"
        style={{ borderBottom: `1px solid ${MX.line}`, color: MX.green, background: 'rgba(2,8,6,0.72)' }}
      >
        <span style={{ color: MX.greenBright, textShadow: MX.textGlow }}>■ ZION-OS v2.19</span>
        <span className="hidden sm:inline opacity-60">trace 0.00% · SECURE</span>
        <span className="ml-auto opacity-80">
          <Clock />
        </span>
      </div>

      {/* 桌面图标栅格（顶部避让状态栏；触控目标 44px） */}
      <div className="absolute inset-0 flex flex-wrap content-start gap-x-1 gap-y-4 p-4 pt-14">
        {icons.map(({ key, label, Icon, open }) => {
          const active = selected === key;
          return (
            <button
              key={key}
              type="button"
              aria-label={`打开 ${label}`}
              onClick={(e) => {
                e.stopPropagation();
                tapIcon(key, open);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="flex w-[84px] flex-col items-center gap-1.5 rounded-sm px-1 py-2 outline-none transition-colors"
              style={
                active
                  ? { background: 'rgba(74,222,128,0.1)', outline: `1px dashed ${MX.line}`, outlineOffset: '-1px' }
                  : undefined
              }
            >
              <Icon className="h-11 w-11" />
              <span
                className="max-w-full truncate text-center text-[11px] leading-none"
                style={{ color: active ? MX.greenBright : MX.green }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 窗口层（按下窗口不清除选中：stopPropagation 在 MatrixWindow 根上拦截冒泡） */}
      {wins.map((w) => {
        const folder = w.folderId ? MX_FOLDERS.find((f) => f.id === w.folderId) : undefined;
        const file = w.fileName ? (w.fileName === RABBIT_FILE.name ? RABBIT_FILE : findFile(w.fileName)) : undefined;
        return (
          <MatrixWindow
            key={w.id}
            title={
              w.kind === 'folder'
                ? `~/zion/${w.folderId}/`
                : w.kind === 'view'
                  ? `cat ${w.fileName}`
                  : w.kind === 'term'
                    ? 'terminal — zion'
                    : 'trash'
            }
            x={w.x}
            y={w.y}
            z={w.z}
            width={w.kind === 'term' ? 460 : 380}
            bounds={stage}
            onFocus={() => focusWin(w.id)}
            onClose={() => closeWin(w.id)}
            onMove={(x, y) => moveWin(w.id, x, y)}
          >
            {/* 文件夹窗口：文件行列表，点击查看正文 */}
            {w.kind === 'folder' && folder && (
              <div className="text-[12px]" style={{ color: MX.green }}>
                {folder.files.map((f) => (
                  <button
                    key={f.name}
                    type="button"
                    onClick={() => openWin({ key: `view:${f.name}`, kind: 'view', fileName: f.name })}
                    className="flex w-full items-baseline gap-2 px-1.5 py-2 text-left transition-colors hover:bg-[rgba(74,222,128,0.1)]"
                  >
                    <span className="truncate" style={{ color: MX.greenBright }}>
                      {f.name}
                    </span>
                    <span className="ml-auto shrink-0 text-[11px] opacity-60">{f.note}</span>
                  </button>
                ))}
                <p className="mt-2 px-1.5 text-[11px] opacity-50">// {folder.hint} · 点击文件查看</p>
              </div>
            )}

            {/* 文件查看窗口：正文 pre 展示 */}
            {w.kind === 'view' && file && (
              <pre className="max-h-[42vh] overflow-auto whitespace-pre-wrap break-all font-mono text-[12px] leading-[1.8]" style={{ color: MX.green }}>
                {file.body}
              </pre>
            )}

            {/* 终端窗口 */}
            {w.kind === 'term' && <TerminalPane onExit={() => closeWin(w.id)} />}

            {/* 回收站：空状态趣味 */}
            {w.kind === 'trash' && (
              <p className="px-1 py-6 text-center text-[12px] leading-[2]" style={{ color: MX.green }}>
                （空）
                <br />
                <span className="opacity-60">这里很干净——矩阵不产生垃圾。</span>
              </p>
            )}
          </MatrixWindow>
        );
      })}

      {/* 底部细线状态栏：装饰读数 + 快捷入口（移动端不依赖双击） */}
      <div
        className="absolute inset-x-0 bottom-0 z-30 flex items-center gap-2 px-4 py-1.5 text-[11px] tracking-[0.16em]"
        style={{ borderTop: `1px solid ${MX.line}`, color: MX.green, background: 'rgba(2,8,6,0.72)' }}
      >
        <span className="hidden sm:inline opacity-60">KNOSIS BBS · SIGNAL LOCKED</span>
        <span className="sm:hidden opacity-60">SIGNAL LOCKED</span>
        <span className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => openWin({ key: 'term', kind: 'term' })}
            className="px-2 py-1 transition-colors hover:bg-[rgba(74,222,128,0.12)]"
            style={{ color: MX.greenBright }}
          >
            [ terminal ]
          </button>
          <button
            type="button"
            onClick={() => openWin({ key: `view:${RABBIT_FILE.name}`, kind: 'view', fileName: RABBIT_FILE.name })}
            className="px-2 py-1 transition-colors hover:bg-[rgba(74,222,128,0.12)]"
            style={{ color: MX.greenBright }}
          >
            [ white_rabbit ]
          </button>
        </span>
      </div>
    </div>
  );
}
