/**
 * MatrixWake.tsx —— IN-08 变体 V2：唤醒终端（1999-03-31 影院开场字幕 CRT 复刻）
 * 2026-09-09 Claude·新增：扫描线 + 暗角 CRT 质感（纯 CSS 层，零图片资源）；
 *   WAKE_LINES 打字机逐字输出（~45ms/字符 setTimeout 链，行间停 300ms，
 *   链由 [lineIdx,charIdx] 状态驱动、每步 cleanup 防重入）；
 *   点按 / 键盘任意键「跳到下一行」（监听挂实体自身，不抢全局按键）；
 *   播完出现 [ replay ] 可重播；
 *   prefers-reduced-motion：跳过动画整段直显（规则第六条降级）。
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { MX, WAKE_LINES } from '../matrixShared';

/** 每字符打字间隔（ms） */
const CHAR_MS = 45;
/** 行与行之间的停顿（ms） */
const LINE_MS = 300;

export default function MatrixWake() {
  /** 已打完的行下标（该行正在逐字输出中） */
  const [lineIdx, setLineIdx] = useState(0);
  /** 当前行已输出到的字符下标 */
  const [charIdx, setCharIdx] = useState(0);
  /** 全部台词播完（出现 replay） */
  const [done, setDone] = useState(false);
  /** 打字链计时句柄（每步清理，防 StrictMode/卸载重入） */
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* 打字机主循环：状态驱动的 setTimeout 链 */
  useEffect(() => {
    /* reduced-motion：一次到位整段直显 */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLineIdx(WAKE_LINES.length);
      setDone(true);
      return;
    }
    if (done) return;
    const line = WAKE_LINES[lineIdx] ?? '';
    if (charIdx < line.length) {
      /* 当前行还没打完 → 下一字符 */
      timer.current = setTimeout(() => setCharIdx((c) => c + 1), CHAR_MS);
    } else if (lineIdx < WAKE_LINES.length - 1) {
      /* 行尾 → 停顿后进入下一行 */
      timer.current = setTimeout(() => {
        setLineIdx((l) => l + 1);
        setCharIdx(0);
      }, LINE_MS);
    } else {
      /* 最后一行打完 → 收尾 */
      timer.current = setTimeout(() => setDone(true), LINE_MS);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [lineIdx, charIdx, done]);

  /** 跳行：立即补完当前行并进入下一行开头（渲染层天然补显） */
  const skip = () => {
    if (done) return;
    if (timer.current) clearTimeout(timer.current);
    if (lineIdx >= WAKE_LINES.length - 1) {
      setDone(true);
      return;
    }
    setLineIdx((l) => l + 1);
    setCharIdx(0);
  };

  /** 重播：复位打字机状态 */
  const replay = () => {
    setLineIdx(0);
    setCharIdx(0);
    setDone(false);
  };

  return (
    <div className="flex w-[min(680px,88vw)] flex-col items-center gap-5">
      <style>{`
        @media (prefers-reduced-motion: reduce){
          .mx-wake-cursor{animation:none!important}
        }
      `}</style>

      {/* 标注行 */}
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-500">Wake Up</p>
        <p className="mt-1.5 text-sm text-neutral-600">开场字幕：Call trans opt——点按可以快进到下一行</p>
      </div>

      {/* CRT 终端实体：扫描线 + 暗角 + 打字机台词（点按 / 任意键跳行） */}
      <div
        tabIndex={0}
        role="button"
        aria-label="唤醒终端：点按或按任意键跳到下一行"
        onClick={skip}
        onKeyDown={(e) => {
          /* Tab 保留给无障碍导航 */
          if (e.key !== 'Tab') skip();
        }}
        className="relative h-[clamp(360px,48vw,440px)] w-full select-none overflow-hidden outline-none"
        style={{
          background: '#010403',
          border: `1px solid ${MX.line}`,
          boxShadow: '0 0 28px rgba(74,222,128,0.08), inset 0 0 46px rgba(0,0,0,0.72)',
        }}
      >
        {/* 台词区：左对齐终端排版 */}
        <div
          className="absolute inset-0 overflow-hidden px-5 py-5 font-mono text-[13px] leading-6 sm:px-7 sm:text-sm"
          style={{ color: MX.green, textShadow: MX.textGlow }}
        >
          {WAKE_LINES.map((line, i) => {
            /* 播完 → 整段直显；否则只渲染已到达的行 */
            if (!done && i > lineIdx) return null;
            const text = done || i < lineIdx ? line : line.slice(0, charIdx);
            /* 台词行（不带 > 前缀）用高亮色，系统行用正文绿 */
            const isSpeech = !line.startsWith('>');
            return (
              <p
                key={i}
                style={isSpeech ? { color: MX.greenBright, textShadow: '0 0 10px rgba(74,222,128,0.6)' } : undefined}
              >
                {text || '\u00A0'}
                {/* 光标：只在「正在打的那一行行尾」闪 */}
                {!done && i === lineIdx && (
                  <span className="mx-wake-cursor ml-0.5 inline-block animate-pulse" aria-hidden="true">
                    ▌
                  </span>
                )}
              </p>
            );
          })}
        </div>

        {/* 扫描线层：横向细纹（纯 CSS，零资源） */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0.30) 0px, rgba(0,0,0,0.30) 1px, transparent 1px, transparent 3px)',
          }}
        />
        {/* 暗角层：CRT 玻璃收边 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        {/* 底部操作条：跳行提示 / 播完后的 replay */}
        <div
          className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 pb-2.5 font-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ color: 'rgba(74,222,128,0.55)' }}
        >
          <span>REC · 1998-02-19</span>
          {done ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); /* 不触发实体的 skip */
                replay();
              }}
              className="border px-2.5 py-1 transition-colors"
              style={{ borderColor: MX.line, color: MX.greenBright }}
            >
              [ replay ]
            </button>
          ) : (
            <span>[ tap / any key · skip ]</span>
          )}
        </div>
      </div>
    </div>
  );
}
