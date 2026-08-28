import type { Metadata } from 'next';
import Link from 'next/link';
import { INSPIRATIONS } from '@/components/inspiration/registry';
import { GlassCard } from '@/components/ui/GlassCard';
import '@/components/inspiration/liquid-glass.css';

/**
 * 灵感列表页 —— 原系统宣纸风（v2，样式隔离版）
 * 2026-08-28 Claude·列表页改回原系统风格：
 *   - 需求：列表区域完全保持原有系统风格（宣纸底 / ink-* / GlassCard / 系统色彩 token），
 *     仅在点击进入详情页后才展示灵感对应的组件内容（深空舞台只属于详情页 hero）；
 *   - 样式隔离：深空底（item.stage）与 lg-noise 只允许出现在卡片内的
 *     「微缩预览小窗」容器中，绝不外溢到页面背景（规则见 INSPIRATION_RULES.md）；
 *   - 性能不变：本页为 Server Component + 纯 CSS 微缩图（minis），客户端 JS 为零，
 *     玻璃组件本体（原型 + 变体）进入详情页后才由 GlassMount 按需 dynamic 加载；
 *   - 溯源不变：页脚统计条目 / 变体数量，每个条目的原文链接在详情页「原文」区块展示。
 */

export const metadata: Metadata = {
  title: '灵感',
  description: '液态玻璃 UI 复刻——半透明材质、液态渐变、柔软体积感、颗粒噪点、虚焦景深、编辑式排版。',
};

export default function InspirationPage() {
  /* 变体总数：构建期由 registry 统计，非硬编码（真实数据原则） */
  const totalVariants = INSPIRATIONS.reduce((n, i) => n + i.variants.length, 0);
  const via = INSPIRATIONS[0]?.source.via ?? '—';

  return (
    <div className="text-foreground">
      {/* ═══════════════ 页头：ink-eyebrow + ink-display 大题（原系统排版语言） ═══════════════ */}
      <header className="mx-auto max-w-6xl px-6 pt-20 pb-12 md:pt-28">
        <p className="ink-eyebrow">
          <span className="h-px w-10 bg-border" />
          Inspiration · 液态玻璃
        </p>

        <h1 className="ink-display mt-8 text-[2.75rem] font-normal leading-[1.18] text-foreground md:text-7xl">
          灵感<span className="text-accent">。</span>
        </h1>

        <p className="mt-8 max-w-xl font-serif text-sm leading-loose text-muted md:text-base">
          液态玻璃 UI 复刻手记——每一条灵感先在详情页整屏复刻原型，再滚动态衍生出多个变体。
          列表只放纯 CSS 微缩图，点进每一帧才按需加载可交互的组件本体。
        </p>

        {/* mono 统计落款：条目 / 变体 / 来源（溯源信息在详情页展示原链接） */}
        <div className="mt-12 flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
          <span>{INSPIRATIONS.length} prototypes</span>
          <span className="h-3 w-px bg-border" />
          <span>{totalVariants} variants</span>
          <span className="h-3 w-px bg-border" />
          <span>via {via}</span>
        </div>
      </header>

      {/* ═══════════════ 卡片网格：宣纸 GlassCard + 内嵌深空微缩预览窗 ═══════════════ */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INSPIRATIONS.map((item) => {
            const Mini = item.Mini;
            return (
              <Link key={item.slug} href={`/inspiration/${item.slug}/`} className="group block">
                <GlassCard hover className="flex h-full flex-col overflow-hidden p-0">
                  {/* 微缩预览小窗：唯一的深空底容器（stage + lg-noise 严格限制在此窗内，样式隔离） */}
                  <div
                    className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-t-2xl"
                    style={{ background: item.stage }}
                  >
                    <span className="lg-noise" aria-hidden />
                    {/* hover 微缩图轻微放大：纯 CSS transition，零 JS */}
                    <div className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.06]">
                      <Mini />
                    </div>
                    {/* 右上目录编号（编辑式排版元素） */}
                    <span className="absolute right-4 top-4 font-mono text-[10px] tracking-[0.2em] text-white/40">
                      LG-{item.no}
                    </span>
                  </div>

                  {/* 信息栏：系统宣纸风（ink-display 中文题 + mono 英文题 + desc + 要点 chips） */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      {/* group-hover 时显示墨笔下划线（globals.css .group:hover .ink-underline） */}
                      <h2 className="ink-display text-lg font-normal text-foreground">
                        <span className="ink-underline">{item.title}</span>
                      </h2>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
                        {item.titleEn}
                      </span>
                    </div>

                    <p className="mt-3 font-serif text-sm leading-relaxed text-muted">{item.desc}</p>

                    {/* 复刻要点：系统 border token 描边小标签 */}
                    <div className="mt-4 flex flex-wrap gap-2 pt-1">
                      {item.points.map((p) => (
                        <span
                          key={p}
                          className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.12em] text-faint"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>

        {/* 性能说明落款 */}
        <p className="mt-12 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
          Zero-JS List · On-Demand Detail Chunks
        </p>
      </section>
    </div>
  );
}
