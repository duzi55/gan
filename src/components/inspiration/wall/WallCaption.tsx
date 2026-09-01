import { WALLS } from './wallShared';

/**
 * 画卷图注 WallCaption —— IN-04 满屏画卷的左下角标注（序号 + 图名）
 * 2026-08-31 Claude·抽离（解耦规范：图注呈现独立于滚动 / 吸附逻辑，
 *   后续同目录画廊组件直接复用，禁止各写一份）；纯展示组件，无 hooks
 *   无状态，当前帧序号由父组件（滚动进度）传入。
 *   可读性：压在画框自带的底部渐变 scrim 之上，白色 mono 小字。
 */
export function WallCaption({ current }: { current: number }) {
  const w = WALLS[current] ?? WALLS[0];
  return (
    <p className="pointer-events-none absolute bottom-4 left-4 z-10 font-mono text-[10px] uppercase tracking-[0.25em] text-white/85 sm:left-5">
      <span className="mr-2.5 text-white/55">
        {String(current + 1).padStart(2, '0')} / {String(WALLS.length).padStart(2, '0')}
      </span>
      {w.title} · {w.titleEn}
    </p>
  );
}
