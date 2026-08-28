import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { INSPIRATIONS, getInspiration } from '@/components/inspiration/registry';
import { GlassMount } from '@/components/inspiration/GlassMount';
import '@/components/inspiration/liquid-glass.css';

/**
 * 灵感详情页 —— 单件液态玻璃组件的可交互舞台
 * 2026-08-28 Claude·灵感页新增：
 *   - generateStaticParams 预渲染全部 slug（静态导出要求）；
 *   - 组件本体由 GlassMount 按需 dynamic 加载（每件独立 chunk），
 *     本页 HTML/首屏只含舞台与排版，组件 JS 访问时才下载；
 *   - ⑤ 虚焦景深（大 blur 光斑）+ ⑥ 编辑式排版（超大英文题名 +
 *     mono 编号 + 复刻要点标签）。
 */

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
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{ background: 'linear-gradient(165deg, #100d1d 0%, #181430 55%, #221731 100%)' }}
    >
      {/* ⑤ 虚焦光斑 + ④ 噪点：景深氛围层 */}
      <div className="lg-stage pointer-events-none absolute inset-0" aria-hidden>
        <span className="lg-blob left-[-120px] top-[-80px] h-[440px] w-[440px]" style={{ background: 'rgba(56,189,248,0.32)' }} />
        <span className="lg-blob right-[-110px] top-[120px] h-[400px] w-[400px]" style={{ background: 'rgba(167,139,250,0.3)' }} />
        <span className="lg-blob bottom-[-150px] left-1/3 h-[440px] w-[440px]" style={{ background: 'rgba(251,113,133,0.28)' }} />
        <span className="lg-noise" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-16 md:pt-20">
        {/* 面包屑行：返回灵感 + 目录编号 */}
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
          <Link href="/inspiration/" className="transition-colors hover:text-white">
            ← 灵感 Inspiration
          </Link>
          <span>LG-{item.no}</span>
        </div>

        {/* ⑥ 编辑式排版：超大英文题名 + 中文副题 */}
        <h1 className="mt-10 text-5xl font-semibold leading-none tracking-tight text-white md:text-8xl">
          {item.titleEn}
        </h1>
        <p className="mt-4 font-display text-xl text-white/85 md:text-2xl">
          {item.title} —— {item.desc}
        </p>

        {/* 复刻要点标签：玻璃 chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {item.points.map((p) => (
            <span
              key={p}
              className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs text-white/75 backdrop-blur-md"
            >
              {p}
            </span>
          ))}
        </div>

        {/* 组件舞台：进入本页才按需下载对应组件 chunk */}
        <div className="mt-14 flex min-h-[300px] items-center justify-center">
          <GlassMount slug={item.slug} />
        </div>

        {/* 上一件 / 下一件（环形导览） */}
        <nav className="mt-20 flex items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm">
          <Link
            href={`/inspiration/${prev.slug}/`}
            className="group inline-flex min-w-0 items-center gap-2 text-white/60 transition-colors hover:text-white"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            <span className="truncate">{prev.title}</span>
          </Link>
          <Link
            href={`/inspiration/${next.slug}/`}
            className="group inline-flex min-w-0 items-center gap-2 text-right text-white/60 transition-colors hover:text-white"
          >
            <span className="truncate">{next.title}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
