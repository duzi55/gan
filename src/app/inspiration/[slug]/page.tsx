import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { INSPIRATIONS, getInspiration } from '@/components/inspiration/registry';
import { GlassMount } from '@/components/inspiration/GlassMount';
import { Reveal } from '@/components/inspiration/Reveal';
import { StageNextButton } from '@/components/inspiration/StageNextButton';
import { ReadingProgress } from '@/components/inspiration/ReadingProgress';
import { StageRail } from '@/components/inspiration/StageRail';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import '@/components/inspiration/liquid-glass.css';

/**
 * 灵感详情页 —— 「一篇灵感 = 一篇文章」式滚动叙事
 * 2026-08-28 Claude·文章式重构（用户澄清：一次灵感 = 一个链接 = 一张卡，
 *   详情页收纳该灵感下全部原型与变体；展示规则见 INSPIRATION_RULES.md）：
 *   - 序幕：灵感题头叠加在第一件原型整屏舞台（100svh 深空，白色排版），
 *     1:1 复刻原型独占整个视窗居中展示，底部 lg-bob 提示向下滚动；
 *   - 原型幕：其余原型各独占一整屏舞台（同语言，编号标注 Prototype i/N）；
 *   - 衍生幕（宣纸纸面）：全部变体扁平为 V1…Vn 序列，标注行（ink-index /
 *     ink-display / 所属原型 tag）+ rounded-3xl 深空舞台块，
 *     Reveal 滚动进入视口依次显现，GlassMount 按需 dynamic 加载；
 *   - 原文幕（宣纸纸面）：灵感来源卡（原链接外跳 / via / 收录日期），
 *     满足「每个灵感必须可溯源」规则；
 *   - 样式隔离：深空底 / 光斑 / 噪点只出现在舞台容器（整屏 section /
 *     变体块）内部，舞台之外全部为系统 ink-* / GlassCard 体系；
 *   - 2026-08-28 Claude·滚动吸附与步进：根滚动器开 scroll-snap（v2 改 mandatory，
 *     proximity 在桌面 Chrome 滚轮下几乎不触发），每块舞台底部放 StageNextButton
 *     点击直达下一视图；顶部 ReadingProgress 进度条 + 右侧 StageRail 屏点导航
 *     回应「不知道还剩多少没滚」；每屏以编号水印 / 要点 chips / desc 增加排版层次。
 */

/* 变体舞台光斑配色（按序轮换，与六要点色系一致） */
const BLOB_COLORS = ['rgba(56,189,248,0.28)', 'rgba(167,139,250,0.28)', 'rgba(251,113,133,0.26)'];

/* 整屏原型舞台高度：h-screen 回落 + 100svh 内联声明（双端适配，见规则文件第六条） */
const STAGE_HEIGHT = { height: '100svh' } as const;

/**
 * 2026-08-28 Claude·滚动吸附样式（v2）：
 * 首版 proximity 在桌面 Chrome 滚轮下几乎不触发（阈值保守），用户实测无吸附感；
 * 改为 mandatory：一格滚轮 = 一整屏，对齐精准。舞台之间没有可阅读内容，
 * 不存在「停留被拽走损失」；需要自由停留的变体/原文长列表区不设 snap 点，不受影响。
 * 仍用内联 <style>：随本页卸载从 DOM 移除，吸附只作用于本页，不污染全站；
 * snap 点由各整屏 section 的 snap-start 声明（Tailwind 原子类）。
 */
const SNAP_STYLE = 'html{scroll-snap-type:y mandatory;}';

/**
 * 2026-08-28 Claude·原型要点 chips：舞台上的关键词条（材质 / 渐变 / 噪点…），
 * 让每屏不止一个组件——编号水印 + 要点 + 说明文字构成编辑式排版层次。
 * 序幕（题头下）与原型幕（desc 下）两处复用。
 */
function PointsChips({ items }: { items: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {items.map((pt) => (
        <span
          key={pt}
          className="rounded-full border border-white/20 px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] text-white/55"
        >
          {pt}
        </span>
      ))}
    </div>
  );
}

export function generateStaticParams() {
  return INSPIRATIONS.map((e) => ({ slug: e.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then((p) => {
    const entry = getInspiration(p.slug);
    if (!entry) return {};
    return { title: `${entry.title} · 灵感`, description: entry.desc };
  });
}

export default async function InspirationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getInspiration(slug);
  if (!entry) notFound();

  const prototypes = entry.prototypes;
  const totalVariants = prototypes.reduce((m, p) => m + p.variants.length, 0);
  /* 变体扁平序列：V1…Vn 跨原型连续编号，标注所属原型 */
  const flatVariants = prototypes.flatMap((p) => p.variants.map((v) => ({ proto: p, v })));
  /* 灵感级环形导览：仅一条灵感时退化为纯返回链接 */
  const idx = INSPIRATIONS.findIndex((e) => e.slug === slug);
  const count = INSPIRATIONS.length;
  const prev = INSPIRATIONS[(idx - 1 + count) % count];
  const next = INSPIRATIONS[(idx + 1) % count];

  return (
    <div className="text-foreground">
      {/* 2026-08-28 Claude·滚动吸附开关：内联 style 只在本页存在（卸载即移除，不泄漏全站） */}
      <style dangerouslySetInnerHTML={{ __html: SNAP_STYLE }} />
      {/* 2026-08-28 Claude·顶部阅读进度条 + 右侧屏点导航：回应「不知道还剩多少没滚」 */}
      <ReadingProgress />
      <StageRail />

      {/* ═══════ 序幕 · 灵感题头 + 第一件原型整屏舞台（深空，仅限本容器） ═══════ */}
      <section
        className="relative h-screen snap-start overflow-hidden"
        data-snap-stage
        style={{ ...STAGE_HEIGHT, background: prototypes[0].stage }}
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

        {/* 顶部行：返回灵感 + 灵感编号（舞台内使用白色 mono 排版） */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 font-mono text-[11px] uppercase tracking-[0.3em] text-white/60 md:px-8">
          {/* 2026-08-28 Claude·双端适配：负 margin 扩大触控热区，11px 小字在移动端不难点 */}
          <Link
            href="/inspiration/"
            className="-my-2 inline-block py-2 transition-colors hover:text-white"
          >
            ← 灵感 Inspiration
          </Link>
          <span>IN-{entry.no}</span>
        </div>

        {/* 灵感题头：中文大题 + mono 英文题 + 收录日期 + 首件原型要点（压在舞台左上区域） */}
        <div className="absolute left-5 top-20 z-20 max-w-[70vw] md:left-8 md:top-24">
          <h1 className="ink-display text-3xl font-normal text-white md:text-5xl">{entry.title}</h1>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            {entry.titleEn} · {entry.date}
          </p>
          {/* 2026-08-28 Claude·要点 chips：首屏信息层次增强（材质/渐变/噪点关键词） */}
          <PointsChips items={prototypes[0].points} />
        </div>

        {/* ⑥ 编辑式排版：超大英文水印题（压在舞台底层） */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-4 left-3 z-0 select-none text-[24vw] font-semibold leading-none text-white/[0.06] md:text-[12rem]"
        >
          {entry.titleEn}
        </span>

        {/* 原型舞台：1:1 复刻原型独占整屏视窗，按需加载组件 chunk */}
        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <GlassMount slug={prototypes[0].slug} />
        </div>

        {/* 2026-08-28 Claude·屏序编号水印（右下）：与左下 titleEn 水印对角呼应，补充每屏层次 */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-6 right-4 z-0 select-none font-mono text-[22vw] font-semibold leading-none text-white/[0.07] md:right-8 md:text-[9rem]"
        >
          01
        </span>

        {/* 底部标注（原型 1/N）+ 复刻说明（2026-08-28 Claude·加 desc 补充每屏信息量） */}
        <div className="absolute bottom-12 left-5 z-20 max-w-[80vw] md:left-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
            Prototype 1/{prototypes.length} · {prototypes[0].title}
          </p>
          <p className="mt-2 font-serif text-sm text-white/60">{prototypes[0].desc}</p>
        </div>
        {/* 2026-08-28 Claude·滚动提示改为可点击步进按钮：点击平滑滚动到下一幕 */}
        <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 pb-5">
          <StageNextButton hint="scroll · 变体与原文" />
        </div>
      </section>

      {/* ═══════ 原型幕 2..N：其余原型各独占一整屏视窗（深空舞台） ═══════ */}
      {prototypes.slice(1).map((p, i) => {
        /* 2026-08-28 Claude·末块舞台的下一站是衍生幕，步进按钮文案随之切换 */
        const isLastStage = i + 2 === prototypes.length;
        return (
          <section
            key={p.slug}
            className="relative h-screen snap-start overflow-hidden"
            data-snap-stage
            style={{ ...STAGE_HEIGHT, background: p.stage }}
          >
            <span className="lg-noise" aria-hidden />
            <span
              className="lg-blob left-[-110px] top-[-100px] h-[400px] w-[400px]"
              style={{ background: BLOB_COLORS[i % BLOB_COLORS.length] }}
              aria-hidden
            />
            <span
              className="lg-blob bottom-[-130px] right-[-100px] h-[400px] w-[400px]"
              style={{ background: BLOB_COLORS[(i + 1) % BLOB_COLORS.length] }}
              aria-hidden
            />

            {/* 顶部行：灵感编号 + 原型英文题（白色 mono） */}
            <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 font-mono text-[11px] uppercase tracking-[0.3em] text-white/60 md:px-8">
              <span>IN-{entry.no}</span>
              <span>{p.titleEn}</span>
            </div>

            {/* 超大英文水印题（同序幕语言） */}
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-4 right-3 z-0 select-none text-[24vw] font-semibold leading-none text-white/[0.06] md:text-[12rem]"
            >
              {p.titleEn}
            </span>

            {/* 2026-08-28 Claude·屏序编号水印（左上）：与右下 titleEn 水印对角呼应 */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-4 top-16 z-0 select-none font-mono text-[22vw] font-semibold leading-none text-white/[0.07] md:left-8 md:top-20 md:text-[9rem]"
            >
              {String(i + 2).padStart(2, '0')}
            </span>

            {/* 原型本体独占整屏 */}
            <div className="relative z-10 flex h-full items-center justify-center px-6">
              <GlassMount slug={p.slug} />
            </div>

            {/* 底部标注：原型序号 + 中文名 + 复刻说明 + 要点 chips（白色小字，层次丰富） */}
            <div className="absolute bottom-10 left-5 z-20 max-w-[80vw] md:left-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
                Prototype {i + 2}/{prototypes.length} · {p.title}
              </p>
              <p className="mt-2 font-serif text-sm text-white/60">{p.desc}</p>
              {/* 2026-08-28 Claude·要点 chips：每屏信息层次增强 */}
              <PointsChips items={p.points} />
            </div>

            {/* 2026-08-28 Claude·底部步进按钮：点击直达下一视图（末块 → 衍生幕） */}
            <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 pb-5">
              <StageNextButton hint={isLastStage ? 'next · 衍生与原文' : 'next · 下一件原型'} />
            </div>
          </section>
        );
      })}

      {/* ═══════ 衍生幕 · 全部变体依次显现（回到宣纸纸面） ═══════ */}
      {/* 2026-08-28 Claude·data-snap-next：仅作最后一块舞台步进按钮的滚动终点标记，不参与 CSS 吸附 */}
      <section data-snap-next className="mx-auto max-w-5xl px-6 pt-16 md:pt-24">
        <SectionHeader
          index="01"
          title="衍 生"
          subtitle={`基于 ${prototypes.length} 件原型的 ${totalVariants} 个变体 · 向下滚动依次显现`}
        />

        <div className="space-y-12 md:space-y-16">
          {flatVariants.map(({ proto, v }, i) => (
            <Reveal key={`${proto.slug}:${v.id}`}>
              {/* 变体标注行：宣纸风排版（序号 / 中文题 / mono 英文题 / 所属原型） */}
              <div className="mb-3 flex flex-wrap items-baseline gap-3 px-1">
                <span className="ink-index">V{i + 1}</span>
                <h3 className="ink-display text-xl text-foreground">{v.title}</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
                  {v.titleEn}
                </span>
                {/* 所属原型 tag：跨原型变体序列中标识出处 */}
                <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.12em] text-faint">
                  {proto.title}
                </span>
              </div>
              <p className="mb-4 px-1 text-sm leading-relaxed text-muted">{v.desc}</p>

              {/* 深空变体舞台块：深空底与光斑只存在于本圆角容器内（样式隔离） */}
              <div
                className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-3xl px-4 py-14"
                style={{ background: proto.stage }}
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
                {/* 变体本体：`${proto.slug}:${v.id}` 键按需加载 */}
                <GlassMount slug={proto.slug} variant={v.id} />
                {/* 舞台角标 */}
                <span className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                  {v.titleEn}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════ 原文幕 · 灵感溯源（宣纸风 GlassCard） ═══════ */}
      <section className="mx-auto max-w-5xl px-6 pt-16 md:pt-24">
        <SectionHeader index="02" title="原 文" subtitle="灵感来源 · 可追溯" />
        <Reveal>
          <GlassCard className="p-7 md:p-9">
            {/* 来源平台与文章名 + 原始设计方 + 收录日期 */}
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-serif text-base font-medium text-foreground md:text-lg">
                {entry.source.label}
              </p>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
                {entry.date}
                {entry.source.via ? ` · via ${entry.source.via}` : ''}
              </span>
            </div>

            {/* 原文外跳链接（溯源核心：原链接或图片至少其一） */}
            <a
              href={entry.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-3 inline-flex max-w-full items-center gap-1.5 text-sm text-accent"
            >
              <span className="ink-underline break-all">{entry.source.url}</span>
              <span
                aria-hidden
                className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </a>

            {/* 灵感说明 */}
            <p className="mt-5 border-t border-border pt-5 font-serif text-sm leading-loose text-muted">
              {entry.desc}
            </p>
          </GlassCard>
        </Reveal>
      </section>

      {/* 尾部导览：单灵感时只保留返回；多条灵感时追加上一份 / 下一份（灵感级环形） */}
      <nav className="mx-auto mt-16 flex max-w-5xl items-center justify-between gap-4 border-t border-border px-6 pb-24 pt-8 text-sm md:mt-24">
        <Link
          href="/inspiration/"
          className="group inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
        >
          <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          全部灵感
        </Link>

        {count > 1 && (
          <div className="flex min-w-0 items-center gap-6">
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
          </div>
        )}
      </nav>
    </div>
  );
}
