import type { Metadata } from 'next';
import Link from 'next/link';
import { INSPIRATIONS } from '@/components/inspiration/registry';
import { GlassCard } from '@/components/ui/GlassCard';
import '@/components/inspiration/liquid-glass.css';

/**
 * 灵感列表页 —— 宣纸风瀑布流卡片墙（每条灵感一张卡，未来每次复刻新增一张）
 * 2026-08-28 Claude·瀑布流改版（用户澄清需求）：
 *   - 列表布局由均匀网格改为瀑布流：纯 CSS columns 实现零 JS masonry，
 *     卡片高度随缩略窗比例错落，多卡自然组成纸面卡片墙；
 *   - 每条灵感 = 一张卡片（缩略图小窗 + 宣纸风信息栏），点击进详情
 *     才展示具体内容（原型整屏 → 原文溯源 → 衍生变体）；
 *   - 扩展方式：以后每复刻一个新链接，只需在 registry 新增一条 +
 *     对应组件，本页自动多出一张卡（数据驱动，无需改本页）；
 *   - 样式隔离：深空底（item.stage）与 lg-noise 只存在于卡片顶部的
 *     「缩略图小窗」内，页面版面全部为系统 ink-* / GlassCard 宣纸体系
 *     （规则见 INSPIRATION_RULES.md）。
 */

export const metadata: Metadata = {
  title: '灵感',
  description: '液态玻璃 UI 复刻——半透明材质、液态渐变、柔软体积感、颗粒噪点、虚焦景深、编辑式排版。',
};

/* 缩略窗比例按条目顺序轮换：制造瀑布流错落感（零 JS，构建期固定） */
const RATIOS = ['4 / 3', '3 / 4', '16 / 10', '1 / 1', '4 / 5', '5 / 4'];

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
          液态玻璃 UI 复刻手记——每复刻一个灵感就多一张卡片；点进每一张，
          才能看到整屏复刻的原型、原文来源与衍生出的变体。
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

      {/* ═══════════════ 瀑布流卡片墙：纯 CSS columns（列优先，break-inside 防截断） ═══════════════ */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {INSPIRATIONS.map((item, i) => {
            const Mini = item.Mini;
            return (
              <Link
                key={item.slug}
                href={`/inspiration/${item.slug}/`}
                className="group mb-6 block break-inside-avoid"
              >
                <GlassCard hover className="overflow-hidden p-0">
                  {/* 缩略图小窗：唯一的深空底容器（stage + lg-noise 严格限制在此窗内，样式隔离）；
                      比例按序轮换，形成瀑布流错落 */}
                  <div
                    className="relative flex items-center justify-center overflow-hidden rounded-t-2xl"
                    style={{ background: item.stage, aspectRatio: RATIOS[i % RATIOS.length] }}
                  >
                    <span className="lg-noise" aria-hidden />
                    {/* hover 微缩图轻微放大：纯 CSS transition，零 JS */}
                    <div className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.06]">
                      <Mini />
                    </div>
                    {/* 左上目录编号 + 右上变体数（编辑式排版元素） */}
                    <span className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.2em] text-white/40">
                      LG-{item.no}
                    </span>
                    <span className="absolute right-4 top-4 font-mono text-[10px] tracking-[0.2em] text-white/40">
                      +{item.variants.length}
                    </span>
                  </div>

                  {/* 信息栏：系统宣纸风（ink-display 中文题 + mono 英文题 + desc + 要点 chips） */}
                  <div className="p-5">
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
                    <div className="mt-4 flex flex-wrap gap-2">
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
          Zero-JS Masonry · On-Demand Detail Chunks
        </p>
      </section>
    </div>
  );
}
