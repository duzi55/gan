import type { Metadata } from 'next';
import Link from 'next/link';
import { INSPIRATIONS } from '@/components/inspiration/registry';
import '@/components/inspiration/liquid-glass.css';

/**
 * 灵感列表页 —— 液态玻璃 UI 复刻（取缔原画廊页）
 * 2026-08-28 Claude·灵感页新增：
 *   - 复刻小红书灵感（rondesignlab）六要点：半透明材质 / 液态渐变 /
 *     柔软体积感 / 颗粒噪点 / 虚焦景深 / 编辑式排版；
 *   - 性能设计：本页为 Server Component + 纯 CSS 微缩图（minis），
 *     客户端 JS 为零；点击卡片进入详情页才按需加载组件本体（GlassMount）；
 *   - 深空舞台 + 虚焦光斑：玻璃组件在暗场中更"透"，与全站宣纸底形成
 *     「纸上展玻璃」的景深对比。
 */

export const metadata: Metadata = {
  title: '灵感',
  description: '液态玻璃 UI 复刻——半透明材质、液态渐变、柔软体积感、颗粒噪点、虚焦景深、编辑式排版。',
};

export default function InspirationPage() {
  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{ background: 'linear-gradient(165deg, #100d1d 0%, #181430 55%, #221731 100%)' }}
    >
      {/* ⑤ 虚焦光斑（景深来源）+ ④ 颗粒噪点：纯 CSS，零脚本 */}
      <div className="lg-stage pointer-events-none absolute inset-0" aria-hidden>
        <span className="lg-blob left-[-140px] top-[-100px] h-[460px] w-[460px]" style={{ background: 'rgba(56,189,248,0.34)' }} />
        <span className="lg-blob right-[-120px] top-[140px] h-[420px] w-[420px]" style={{ background: 'rgba(167,139,250,0.32)' }} />
        <span className="lg-blob bottom-[-160px] left-1/3 h-[460px] w-[460px]" style={{ background: 'rgba(251,113,133,0.28)' }} />
        <span className="lg-noise" />
      </div>

      {/* ⑥ 编辑式排版 Header：mono eyebrow + 超大题名 + 留白 */}
      <header className="relative mx-auto max-w-5xl px-6 pt-20 pb-12 md:pt-28">
        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-white/50">
          <span className="h-px w-8 bg-white/25" />
          Inspiration · 液态玻璃
        </p>
        <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl">
          灵感
        </h1>
        <p className="mt-4 max-w-xl font-serif text-sm leading-loose text-white/60 md:text-base">
          液态玻璃 UI 复刻手记——半透明材质、液态渐变、柔软体积感、颗粒噪点、虚焦景深、编辑式排版。
          列表仅渲染纯 CSS 微缩图，点进每一帧才按需加载可交互的组件本体。
        </p>
      </header>

      {/* 卡片网格：微缩舞台 + 零 JS hover（CSS only） */}
      <div className="relative mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INSPIRATIONS.map((item) => {
            const Mini = item.Mini;
            return (
              <Link
                key={item.slug}
                href={`/inspiration/${item.slug}/`}
                className="lg-card group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm"
              >
                {/* 微缩舞台：每条目专属液态光斑底 + 纯 CSS 微缩图 */}
                <div
                  className="relative flex aspect-[4/3] items-center justify-center overflow-hidden"
                  style={{ background: item.stage }}
                >
                  <span className="lg-noise" aria-hidden />
                  {/* hover 微缩图轻微放大（transition 在 CSS 层完成） */}
                  <div className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.06]">
                    <Mini />
                  </div>
                </div>

                {/* 信息栏：mono 编号 + 中英双题（⑥ 编辑式排版） */}
                <div className="flex items-start justify-between gap-3 p-5">
                  <div>
                    <p className="text-base font-medium text-white">{item.title}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
                      {item.titleEn}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/40">
                    LG-{item.no}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 性能说明落款 */}
        <p className="mt-12 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
          Zero-JS List · On-Demand Detail Chunks
        </p>
      </div>
    </div>
  );
}
