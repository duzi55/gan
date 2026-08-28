'use client';

/**
 * StageNextButton —— 整屏舞台「下一屏」步进按钮
 * 2026-08-28 Claude·新增：解决滚轮/手指滑动对不准整屏视图的问题，
 *   用户点击后平滑滚动到下一个目标视图（配合页面级 scroll-snap: proximity 吸附）。
 *
 * 目标查找规则（JS 标记与 CSS 吸附解耦，页面里只放 data-* 属性）：
 *   - data-snap-stage：整屏原型舞台（滚动吸附点，同时也是步进目标）
 *   - data-snap-next ：舞台之后的区块（如衍生幕），仅作为最后一块舞台的步进终点
 *   - 取「视口顶线下方第一个」目标，因此在任何滚动位置点击都不会原地踏步。
 *
 * 动效：默认 smooth 平滑滚动；尊重 prefers-reduced-motion（reduce 时瞬时跳转）。
 * 解耦说明：本组件不感知页面结构，任何有 data-* 标记的页面均可复用。
 */

export function StageNextButton({
  hint = 'next · 下一屏',
}: {
  /** 按钮上的 mono 小字提示（按所在幕语境定制） */
  hint?: string;
}) {
  const handleClick = () => {
    /* 视口顶线下方（>10px 容差）的第一个标记元素 = 下一个视图 */
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-snap-stage], [data-snap-next]'),
    );
    const next = targets.find((el) => el.getBoundingClientRect().top > 10);
    if (!next) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    next.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="滚动到下一个视图"
      className="group flex cursor-pointer flex-col items-center gap-1.5"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 transition-colors group-hover:text-white">
        {hint}
      </span>
      <span
        aria-hidden
        className="lg-bob text-sm text-white/60 transition-colors group-hover:text-white"
      >
        ↓
      </span>
    </button>
  );
}
