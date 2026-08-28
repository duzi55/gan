'use client';

import { useState } from 'react';

/**
 * 玻璃通知堆叠 GlassNotifStack —— GlassNotification 衍生变体 V1（stack）
 * 2026-08-28 Claude·灵感系统 v2：
 *   - 衍化思路：单条通知 → 三条错位堆叠流；后条向上叠压、逐级缩放降亮，
 *     可逐条关闭，全部关闭后呈现可复原玻璃胶囊（复刻要点 ①②③④）；
 *   - 通知文案为组件自包含展示样例（描述灵感系统自身行为，非站点业务数据）；
 *   - 由 GlassMount 以键 `glass-notification:stack` 按需 dynamic 加载；
 *   - 双端适配：宽度 min(320px, 84vw)。
 */

/** 堆叠通知样例（组件自包含，不接入任何业务接口） */
const CARDS = [
  { id: 'a', title: '液态玻璃 · 复刻完成', body: '原型已 1:1 复刻，可直接进入变体推演。', time: 'now' },
  { id: 'b', title: '变体 V1 已生成', body: '卡带机变体通过构图评审，建议保留噪点层。', time: '2m' },
  { id: 'c', title: '变体 V2 已生成', body: '调频电台变体就绪，滑杆沿用液态渐变填充。', time: '5m' },
];

export default function GlassNotifStack() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = CARDS.filter((c) => !dismissed.includes(c.id));

  /* 空态：一条可复原的玻璃胶囊，保持舞台不空 */
  if (visible.length === 0) {
    return (
      <button
        onClick={() => setDismissed([])}
        className="lg-glass px-5 py-3 text-sm text-white/70 transition-transform duration-300 hover:scale-[1.03]"
        style={{ borderRadius: '999px' }}
      >
        <span className="lg-noise" style={{ borderRadius: '999px' }} aria-hidden />
        通知已全部关闭 · 点击恢复
      </button>
    );
  }

  return (
    <div
      className="flex flex-col items-center"
      style={{ width: 'min(320px, 84vw)' }}
      data-component="glass-notification-stack"
    >
      {visible.map((c, i) => (
        <div
          key={c.id}
          className="lg-glass w-full p-4"
          style={{
            zIndex: visible.length - i,
            transform: `scale(${1 - i * 0.045})`,
            filter: `brightness(${1 - i * 0.16})`,
            marginTop: i === 0 ? 0 : '-3.4rem',
          }}
        >
          <span className="lg-noise rounded-[2rem]" aria-hidden />
          <div className="relative flex items-start gap-3">
            {/* ② 液态渐变序号方块 */}
            <span
              className="lg-liquid flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)' }}
              aria-hidden
            >
              {i + 1}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-[13px] font-semibold text-white">{c.title}</p>
                <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                  {c.time}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-white/60">{c.body}</p>
            </div>

            {/* 关闭钮：逐条移出堆叠 */}
            <button
              aria-label="关闭通知"
              onClick={() => setDismissed([...dismissed, c.id])}
              className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg
                className="h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
