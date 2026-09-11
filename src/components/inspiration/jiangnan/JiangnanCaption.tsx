import { JIANGNAN_SCENES } from './jiangnanShared';

/**
 * 江南画卷图注 JiangnanCaption —— IN-09 满屏画卷的左下角标注（序号 + 图名）
 * 2026-09-09 Claude·新增（IN-09 江南小景，沿 IN-04 WallCaption 抽离范式）：
 *   纯展示组件，无 hooks 无状态，当前帧序号由父组件（滚动进度）传入；
 *   不跨目录复用 wall/WallCaption（其数据源绑定 WALLS，跨目录耦合违解耦铁律），
 *   按同构语言在 jiangnan 目录内自持一份，数据源指向 JIANGNAN_SCENES。
 *   可读性：压在画框自带的底部渐变 scrim 之上，白色 mono 小字。
 */
export function JiangnanCaption({ current }: { current: number }) {
  const s = JIANGNAN_SCENES[current] ?? JIANGNAN_SCENES[0];
  return (
    <p className="pointer-events-none absolute bottom-4 left-4 z-10 font-mono text-[10px] uppercase tracking-[0.25em] text-white/85 sm:left-5">
      <span className="mr-2.5 text-white/55">
        {String(current + 1).padStart(2, '0')} / {String(JIANGNAN_SCENES.length).padStart(2, '0')}
      </span>
      {s.title} · {s.titleEn}
    </p>
  );
}
