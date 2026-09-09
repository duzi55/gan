/**
 * MatrixRain.tsx —— IN-08 变体 V1：代码雨屏保（黑客帝国数字雨全亮态）
 * 2026-09-09 Claude·新增：复用 DigitalRain 亮态大字号（fontSize 22）；
 *   中央名言 6s 一轮淡入淡出——轮换由 CSS 动画 onAnimationEnd 驱动
 *   （动画一轮 = 6s，天然与轮换同拍，零 setInterval）；
 *   点按 / 键盘任意键「唤醒」→ 白绿闪 + 「Knock, knock, Neo.」定格 2.5s
 *   后自动回归轮换；键盘监听挂在实体自身（onKeyDown）而非 window，
 *   避免与页面其它组件抢键（样式/行为隔离铁律）；
 *   prefers-reduced-motion：雨为静态一帧（DigitalRain 自带降级），
 *   名言不轮换、直显一句。
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import DigitalRain from '../DigitalRain';
import { MX, RAIN_MESSAGES } from '../matrixShared';

/** 唤醒定格彩蛋句（不进轮换队列，留给「被注意到」的那一刻） */
const KNOCK = 'Knock, knock, Neo.';

export default function MatrixRain() {
  /* awake：false=空闲轮换中 / true=被唤醒定格中 */
  const [awake, setAwake] = useState(false);
  /** 当前轮换名言下标 */
  const [msgIdx, setMsgIdx] = useState(0);
  /** reduced-motion 降级标记（名言直显不轮换） */
  const [reduced, setReduced] = useState(false);
  /** 唤醒定格计时（卸载清理，性能铁律） */
  const wakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* 探测 reduced-motion（客户端一次即可） */
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  /* 唤醒定格 2.5s 后自动回归轮换 */
  useEffect(() => {
    if (!awake) return;
    wakeTimer.current = setTimeout(() => setAwake(false), 2500);
    return () => {
      if (wakeTimer.current) clearTimeout(wakeTimer.current);
    };
  }, [awake]);

  /** 唤醒（点按实体 / 任意键；已唤醒时忽略） */
  const wake = () => {
    if (!awake) setAwake(true);
  };

  return (
    <div className="flex w-[min(680px,88vw)] flex-col items-center gap-5">
      <style>{`
        @keyframes mx-rain-fade { 0%{opacity:0} 12%{opacity:1} 84%{opacity:1} 100%{opacity:0} }
        @keyframes mx-rain-flash { 0%{opacity:.9} 100%{opacity:0} }
        @media (prefers-reduced-motion: reduce){
          .mx-rain-msg{animation:none!important;opacity:1!important}
        }
      `}</style>

      {/* 标注行 */}
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-500">Digital Rain</p>
        <p className="mt-1.5 text-sm text-neutral-600">屏保：代码雨里浮出的话——点一下，它会注意到你</p>
      </div>

      {/* 屏保实体：亮态代码雨 + 轮换名言 + 唤醒定格（点按 / 任意键交互） */}
      <div
        tabIndex={0}
        role="button"
        aria-label="矩阵屏保：点按或按任意键唤醒"
        onClick={wake}
        onKeyDown={(e) => {
          /* Tab 是无障碍导航键，不当作「任意键」 */
          if (e.key !== 'Tab') wake();
        }}
        className="relative h-[clamp(340px,46vw,460px)] w-full select-none outline-none"
        style={{
          background: MX.bg,
          border: `1px solid ${MX.line}`,
          boxShadow: '0 0 32px rgba(74,222,128,0.10), inset 0 0 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* 代码雨：屏保亮态大字号（数字雨画布，自带降帧/暂停/静态降级） */}
        <DigitalRain fontSize={22} speed={1.1} trail={0.06} />

        {/* 中央名言：awake 时让位给定格彩蛋句；动画一轮结束换下一句 */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
          {awake ? (
            <p
              className="font-mono text-xl sm:text-2xl"
              style={{ color: MX.greenGlow, textShadow: '0 0 14px rgba(74,222,128,0.65)' }}
            >
              {KNOCK}
            </p>
          ) : (
            <p
              key={reduced ? 'static' : msgIdx}
              className="mx-rain-msg font-mono text-xl sm:text-2xl"
              style={{
                color: MX.greenBright,
                textShadow: MX.textGlow,
                animation: reduced ? 'none' : 'mx-rain-fade 6s ease-in-out forwards',
              }}
              onAnimationEnd={() => {
                if (!reduced) setMsgIdx((i) => (i + 1) % RAIN_MESSAGES.length);
              }}
            >
              {reduced ? RAIN_MESSAGES[2] : RAIN_MESSAGES[msgIdx]}
            </p>
          )}
        </div>

        {/* 唤醒白绿闪层：挂载即播一次，2.5s 后随定格一起卸载 */}
        {awake && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              animation: 'mx-rain-flash .45s ease-out forwards',
              background:
                'radial-gradient(120% 90% at 50% 50%, rgba(232,255,242,0.5), rgba(74,222,128,0.18) 55%, transparent)',
            }}
          />
        )}

        {/* 底部角标：身份 + 交互提示（唤醒时变成「被追踪」） */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ color: 'rgba(74,222,128,0.55)' }}
        >
          <span>SCREENSAVER · ZION-OS</span>
          <span>{awake ? 'TRACED!' : '[ tap / any key ]'}</span>
        </div>
      </div>
    </div>
  );
}
