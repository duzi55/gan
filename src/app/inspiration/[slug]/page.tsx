import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { INSPIRATIONS, getInspiration } from '@/components/inspiration/registry';
import { GlassMount } from '@/components/inspiration/GlassMount';
import { Reveal } from '@/components/inspiration/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import '@/components/inspiration/liquid-glass.css';

/**
 * 灵感详情页 —— 「原型整屏 → 原文溯源 → 变体依次显现」三幕式滚动叙事
 * 2026-08-28 Claude·灵感系统 v2 重构（展示规则见 INSPIRATION_RULES.md）：
 *   - 第一幕 Hero：100svh 深空舞台，1:1 复刻原型独占整屏视窗居中展示，
 *     底部 lg-bob 提示向下滚动；离开舞台即回到系统宣纸风纸面；
 *   - 第二幕 原文：灵感来源卡（原链接外跳 / via / 复刻要点），
 *     满足「每个灵感条目必须可溯源」规则；
 *   - 第三幕 衍生：各变体 = 宣纸风标注行 + 深空舞台块（仅限该容器内），
 *     Reveal 滚动进入视口依次显现，GlassMount 按需 dynamic 加载；
 *   - 样式隔离：深空底 / 光斑 / 噪点只出现在舞台容器内部，
 *     舞台之外全部使用系统 ink-* / GlassCard 体系，不污染页面背景。
 */

/* 变体舞台光斑配色（按序轮换，与六要点色系一致） */
const BLOB_COLORS = ['rgba(56,189,248,0.28)', 'rgba(167,139,250,0.28)', 'rgba(251,113,133,0.26)'];

export function generateStaticParams() {
  return INSPIRATIONS.map((i) => ({ slug: i.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then((p) => {
    const item = getInspiration(p.slug);
    if (!item) return {};
    return { title: `${item.title} · 灵感`, description: item.desc };
  });
}

export default async function InspirationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getInspiration(slug);
  if (!item) notFound();

  /* 环形序列的上一件 / 下一件（详情页底部导览） */
  const idx = INSPIRATIONS.findIndex((i) => i.slug === slug);
  const count = INSPIRATIONS.length;
  const prev = INSPIRATIONS[(idx - 1 + count) % count];
  const next = INSPIRATIONS[(idx + 1) % count];

  return (
    <div className="text-foreground">
      {/* ═══════ 第一幕 · 原型整屏舞台（深空，仅限本容器） ═══════ */}
      <section
        className="relative h-screen overflow-hidden"
        style={{ height: '100svh', background: item.stage }}
      >
        {/* ④ 颗粒噪点 + ⑤ 虚焦光斑：舞台景深氛围（纯 CSS） */}
        <span className="lg-noise" aria-hidden />
        <span
          className="lg-blob left-[-120px] top-[-90px] h-[420px] w-[420px]"
          style={{ background: 'rgba(56,189,248,0.3)' }}
          aria-hidden
        />
        <span
          className="lg-blob bottom-[-140px] right-[-110px] h-[420px] w-[420px]"
          style={{ background: 'rgba(167,139,250,0.28)' }}
          aria-hidden
        />

        {/* 顶部行：返回灵感 + 目录编号（舞台内使用白色排版） */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 font-mono text-[11px] uppercase tracking-[0.3em] text-white/60 md:px-8">
          {/* 2026-08-28 Claude·双端适配：负 margin 扩大触控热区，11px 小字在移动端不难点 */}
          <Link
            href="/inspiration/"
            className="-my-2 inline-block py-2 transition-colors hover:text-white"
          >
            ← 灵感 Inspiration
          </Link>
          <span>LG-{item.no}</span>
        </div>

        {/* ⑥ 编辑式排版：超大英文水印题（压在舞台底层） */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-4 left-3 z-0 select-none text-[24vw] font-semibold leading-none text-white/[0.06] md:text-[12rem]"
        >
          {item.titleEn}
        </span>

        {/* 原型舞台：1:1 复刻原型独占整屏视窗，按需加载组件 chunk */}
        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <GlassMount slug={item.slug} />
        </div>

        {/* 底部标注 + 向下滚动提示（lg-bob 浮动，reduced-motion 静帧） */}
        <p className="absolute bottom-14 left-5 z-20 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45 md:left-8">
          Prototype · 复刻原型 1:1
        </p>
        <div className="absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5 pb-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            scroll · 原文与变体
          </span>
          <span className="lg-bob text-sm text-white/60" aria-hidden>
            ↓
          </span>
        </div>
      </section>

      {/* ═══════ 第二幕 · 原文溯源（回到宣纸纸面） ═══════ */}
      <section className="mx-auto max-w-5xl px-6 pt-16 md:pt-24">
        <SectionHeader index="01" title="原 文" subtitle="灵感来源 · 可追溯" />
        <Reveal>
          <GlassCard className="p-7 md:p-9">
            {/* 来源平台与文章名 + 原始设计方 */}
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-serif text-base font-medium text-foreground md:text-lg">
                {item.source.label}
              </p>
              {item.source.via && (
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
                  via {item.source.via}
                </span>
              )}
            </div>

            {/* 原文外跳链接（溯源核心：原链接或图片至少其一） */}
            <a
              href={item.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-3 inline-flex max-w-full items-center gap-1.5 text-sm text-accent"
            >
              <span className="ink-underline break-all">{item.source.url}</span>
              <span
                aria-hidden
                className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </a>

            {/* 复刻说明 */}
            <p className="mt-5 border-t border-border pt-5 font-serif text-sm leading-loose text-muted">
              {item.desc}
            </p>

            {/* 复刻要点（六要点子集） */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
                复刻要点
              </span>
              {item.points.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                >
                  {p}
                </span>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      </section>

      {/* ═══════ 第三幕 · 衍生变体（滚动依次显现） ═══════ */}
      <section className="mx-auto max-w-5xl px-6 pt-16 md:pt-24">
        <SectionHeader
          index="02"
          title="衍 生"
          subtitle={`基于原型的 ${item.variants.length} 个变体 · 向下滚动依次显现`}
        />

        <div className="space-y-12 md:space-y-16">
          {item.variants.map((v, i) => (
            <Reveal key={v.id}>
              {/* 变体标注行：宣纸风排版（编号 / 中文题 / mono 英文题 / 思路） */}
              <div className="mb-3 flex flex-wrap items-baseline gap-3 px-1">
                <span className="ink-index">V{i + 1}</span>
                <h3 className="ink-display text-xl text-foreground">{v.title}</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
                  {v.titleEn}
                </span>
              </div>
              <p className="mb-4 px-1 text-sm leading-relaxed text-muted">{v.desc}</p>

              {/* 深空变体舞台块：深空底与光斑只存在于本圆角容器内（样式隔离） */}
              <div
                className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-3xl px-4 py-14"
                style={{ background: item.stage }}
              >
                <span className="lg-noise rounded-3xl" aria-hidden />
                <span
                  className="lg-blob left-[-90px] bottom-[-120px] h-[360px] w-[360px]"
                  style={{ background: BLOB_COLORS[i % BLOB_COLORS.length] }}
                  aria-hidden
                />
                <span
                  className="lg-blob right-[-80px] top-[-100px] h-[320px] w-[320px]"
                  style={{ background: BLOB_COLORS[(i + 1) % BLOB_COLORS.length] }}
                  aria-hidden
                />
                {/* 变体本体：`slug:variantId` 键按需加载 */}
                <GlassMount slug={item.slug} variant={v.id} />
                {/* 舞台角标 */}
                <span className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                  {v.titleEn}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 上一件 / 下一件（环形导览，宣纸风） */}
      <nav className="mx-auto mt-16 flex max-w-5xl items-center justify-between gap-4 border-t border-border px-6 pb-24 pt-8 text-sm md:mt-24">
        <Link
          href={`/inspiration/${prev.slug}/`}
          className="group inline-flex min-w-0 items-center gap-2 text-muted transition-colors hover:text-foreground"
        >
          <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          <span className="truncate">{prev.title}</span>
        </Link>
        <Link
          href={`/inspiration/${next.slug}/`}
          className="group inline-flex min-w-0 items-center gap-2 text-right text-muted transition-colors hover:text-foreground"
        >
          <span className="truncate">{next.title}</span>
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </nav>
    </div>
  );
}
