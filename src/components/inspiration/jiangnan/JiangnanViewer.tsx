'use client';

import { useCallback, useRef, useState } from 'react';
import { JIANGNAN_SCENES } from './jiangnanShared';
import { JiangnanCaption } from './JiangnanCaption';

/**
 * 满屏画卷 JiangnanViewer —— IN-09 江南小景 · 原型（一图一屏竖向画廊）
 * 2026-09-09 Claude·新增（用户口述「和原先的图片灵感一致」——沿 IN-04
 *   治愈画卷确立的画廊语言 1:1 复刻，数据源换《江南》·小景五幅横版
 *   场景原画；图片画廊类不做衍生变体，见 INSPIRATION_RULES.md 例外）：
 *   - 滚动容器即画框：overflow-y-auto + CSS scroll-snap（y mandatory），
 *     每幅场景 snap-start 独占一屏，滚轮 / 触摸松手即吸附落位；
 *     刻意不加 overscroll-contain——内层滚到首 / 末图后滚轮链式传给页面
 *     （IN-04 滚动锁死教训：contain 会截留滚轮把整页锁死）；
 *   - 原生滚动条隐藏（scrollbar-width:none + webkit 伪元素），右侧自绘细轨：
 *     轨道高 34% 屏，thumb 高 1/N 随滚动进度滑动，rAF 节流
 *     （一帧内多次 scroll 合并为一次计算）；
 *   - 底部翻页提示常驻：前 N-1 图显示 ↓ SCROLL（点击步进下一图），
 *     末图翻转为 ↑ TOP（点击回顶）；动画复用 lg-bob（已带
 *     prefers-reduced-motion 降级，见 liquid-glass.css）；
 *   - 双端适配：画框 w-full h-full 填满舞台预留区；场景为横版构图，
 *     竖屏 object-cover 居中裁切保持满屏不留白；细轨与图注字号不随屏宽缩小；
 *   - 数据唯一来源 jiangnanShared.JIANGNAN_SCENES，图注呈现抽离
 *     JiangnanCaption（解耦铁律）。
 */
export default function JiangnanViewer() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const [progress, setProgress] = useState(0);

  /* rAF 节流：一帧内多次 scroll 合并为一次进度计算（不直接 setState） */
  const onScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const el = viewportRef.current;
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? el.scrollTop / max : 0);
    });
  }, []);

  const count = JIANGNAN_SCENES.length;
  const current = Math.min(count - 1, Math.round(progress * (count - 1)));
  const atLast = current === count - 1;

  /* 步进：末图点击回顶，其余点击进下一图；smooth 滚动终点由 CSS snap 校正 */
  const step = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollTo({ top: atLast ? 0 : (current + 1) * el.clientHeight, behavior: 'smooth' });
  }, [atLast, current]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] border border-emerald-950/15 bg-[#101d1c] shadow-[0_36px_70px_-24px_rgba(16,42,38,0.5)]">
      {/* 画卷滚动容器：一图一屏 + 竖向吸附；tabIndex 使键盘方向键可用（a11y） */}
      <div
        ref={viewportRef}
        onScroll={onScroll}
        role="region"
        aria-label={`江南小景画卷，共 ${count} 幅`}
        tabIndex={0}
        className="absolute inset-0 snap-y snap-mandatory overflow-y-auto outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {JIANGNAN_SCENES.map((s, i) => (
          <section key={s.src} className="relative h-full snap-start">
            {/* 首图 eager 其余 lazy：首帧不被拖累，视口外不抢带宽 */}
            <img
              src={s.src}
              alt={`${s.title}（${s.titleEn}）· 江南小景场景原画`}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
              className="h-full w-full select-none object-cover"
            />
          </section>
        ))}
      </div>

      {/* 底部渐变 scrim：图注 / 提示在浅色天空的场景上也可读（纯装饰） */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent"
      />

      {/* 左下角图注（共享组件）：序号 + 图名 */}
      <JiangnanCaption current={current} />

      {/* 风格化细轨滚动条（原生已隐藏）：thumb 高 1/N，随进度沿轨道滑动 */}
      <div
        aria-hidden
        className="absolute right-2.5 top-1/2 h-[34%] w-[3px] -translate-y-1/2 rounded-full bg-white/25 sm:right-3.5"
      >
        <span
          className="absolute left-0 w-full rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.65)]"
          style={{ height: `${100 / count}%`, top: `${progress * (100 - 100 / count)}%` }}
        />
      </div>

      {/* 常驻翻页提示：↓ SCROLL 步进下一图；末图翻转 ↑ TOP 回顶（lg-bob 呼吸动画自带减少动态降级） */}
      <button
        type="button"
        onClick={step}
        aria-label={atLast ? '回到第一幅' : '滚动到下一幅'}
        className="group absolute bottom-3.5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 px-3 py-1 text-white/85 transition-colors hover:text-white"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
          {atLast ? 'Top' : 'Scroll'}
        </span>
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className={`lg-bob h-3.5 w-3.5 transition-transform duration-300 ${atLast ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6.5 8 11.5 13 6.5" />
        </svg>
      </button>
    </div>
  );
}
