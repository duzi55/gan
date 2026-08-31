import type { Metadata } from 'next';
import Link from 'next/link';
import { INSPIRATIONS } from '@/components/inspiration/registry';
import { GlassCard } from '@/components/ui/GlassCard';
import '@/components/inspiration/liquid-glass.css';

/**
 * 灵感列表页 —— 宣纸风瀑布流卡片墙（一次灵感 = 一个链接 = 一张卡）
 * 2026-08-28 Claude·数据模型对齐（用户二次澄清）：
 *   - 卡片粒度 = 灵感（Entry），不是单件组件：同一来源下复刻的全部
 *     原型与变体只属于一张卡，点进详情才整屏展示（原型各一整幕 →
 *     衍生变体 → 原文溯源）；以后每复刻一个新链接，registry 新增一个
 *     Entry，本页自动多一张卡（数据驱动，无需改本页）；
 *   - 布局为纯 CSS columns 瀑布流（零 JS masonry），单卡时即一列，
 *     多卡后自然错落成墙；
 *   - 样式隔离：深空底（coverStage）与 lg-noise 只存在于卡片顶部的
 *     「缩略图小窗」内，页面版面全部为系统 ink-* / GlassCard 宣纸体系
 *     （规则见 INSPIRATION_RULES.md）。
 */

export const metadata: Metadata = {
  title: '灵感',
  // 2026-08-31 Claude·描述通用化：不再绑定「液态玻璃」单一语言（IN-02 起收录粉彩等更多风格）
  description: '灵感复刻档案——每复刻一个来源就多一张卡片：整屏原型、衍生变体与原文溯源。',
};

/* 缩略窗比例按条目顺序轮换：制造瀑布流错落感（零 JS，构建期固定） */
const RATIOS = ['4 / 3', '3 / 4', '16 / 10', '1 / 1', '4 / 5', '5 / 4'];

export default function InspirationPage() {
  /* 构建期由 registry 统计（真实数据原则，非硬编码） */
  const totalPrototypes = INSPIRATIONS.reduce((n, e) => n + e.prototypes.length, 0);
  const totalVariants = INSPIRATIONS.reduce(
    (n, e) => n + e.prototypes.reduce((m, p) => m + p.variants.length, 0),
    0,
  );
  /* 2026-08-31 Claude·via 统计去重：多灵感各自来源合并展示，不再硬取第一条 */
  const via =
    [...new Set(INSPIRATIONS.map((e) => e.source.via).filter(Boolean))].join(' / ') || '—';

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
          每复刻一个来源就多一张卡片；点进每一张，才能看到整屏复刻的
          原型、衍生出的变体与原文出处。
        </p>

        {/* mono 统计落款：灵感 / 原型 / 变体 / 来源（溯源链接在详情页展示） */}
        <div className="mt-12 flex flex-wrap items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
          <span>{INSPIRATIONS.length} inspirations</span>
          <span className="h-3 w-px bg-border" />
          <span>{totalPrototypes} prototypes</span>
          <span className="h-3 w-px bg-border" />
          <span>{totalVariants} variants</span>
          <span className="h-3 w-px bg-border" />
          <span>via {via}</span>
        </div>
      </header>

      {/* ═══════════════ 瀑布流卡片墙：纯 CSS columns（break-inside 防截断） ═══════════════ */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {INSPIRATIONS.map((entry, i) => {
            const Mini = entry.coverMini;
            /* 该灵感下的变体总数（卡角标） */
            const variants = entry.prototypes.reduce((m, p) => m + p.variants.length, 0);
            return (
              <Link
                key={entry.slug}
                href={`/inspiration/${entry.slug}/`}
                className="group mb-6 block break-inside-avoid"
              >
                <GlassCard hover className="overflow-hidden p-0">
                  {/* 缩略图小窗：唯一的深空底容器（coverStage + lg-noise 严格限制在此窗内，
                      样式隔离）；比例按序轮换，形成瀑布流错落 */}
                  <div
                    className="relative flex items-center justify-center overflow-hidden rounded-t-2xl"
                    style={{ background: entry.coverStage, aspectRatio: RATIOS[i % RATIOS.length] }}
                  >
                    <span className="lg-noise" aria-hidden />
                    {/* hover 微缩图轻微放大：纯 CSS transition，零 JS */}
                    <div className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.06]">
                      <Mini />
                    </div>
                    {/* 左上灵感编号 + 右上变体数（编辑式排版元素） */}
                    <span className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.2em] text-white/40">
                      IN-{entry.no}
                    </span>
                    <span className="absolute right-4 top-4 font-mono text-[10px] tracking-[0.2em] text-white/40">
                      +{variants}
                    </span>
                  </div>

                  {/* 信息栏：系统宣纸风（ink-display 中文题 + mono 英文题 + desc + 统计 chips） */}
                  <div className="p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      {/* group-hover 时显示墨笔下划线（globals.css .group:hover .ink-underline） */}
                      <h2 className="ink-display text-lg font-normal text-foreground">
                        <span className="ink-underline">{entry.title}</span>
                      </h2>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
                        {entry.titleEn}
                      </span>
                    </div>

                    <p className="mt-3 font-serif text-sm leading-relaxed text-muted">{entry.desc}</p>

                    {/* 构成统计：原型 / 变体 / 收录日期（系统 border token 描边小标签） */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.12em] text-faint">
                        {entry.prototypes.length} 原型
                      </span>
                      <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.12em] text-faint">
                        {variants} 变体
                      </span>
                      <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.12em] text-faint">
                        {entry.date}
                      </span>
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
