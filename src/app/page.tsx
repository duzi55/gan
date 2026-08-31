import Link from 'next/link';
import { getAllPosts, getTotalWords } from '@/lib/posts';
import { AuthorBio } from '@/components/blog/AuthorBio';
import { BlogStats } from '@/components/blog/BlogStats';
import { TagCloud } from '@/components/blog/TagCloud';
import { Newsletter } from '@/components/blog/Newsletter';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { getMonthlyCounts } from '@/lib/posts';
import { InkField } from '@/components/three';
// 2026-08-28 Claude·首页 03 区块由「图片流/画廊」取缔为「灵感」液态玻璃复刻预览
// 微缩图来自 inspiration/registry（纯 CSS 静态 JSX，零客户端 JS、零图片、零动画循环），不产生任何性能开销
import { INSPIRATIONS } from '@/components/inspiration/registry';
import '@/components/inspiration/liquid-glass.css';

/**
 * 首页 ——「墨境 Ink Field」三幕式版面
 * 2026-08-27 Claude·视觉重设计：
 *   第一幕 Hero：全屏 three.js 墨尘粒子场（InkField）+ 展示级书卷大标题；
 *   第二幕 文章：精选大卡（非对称分栏）+ 编号目录式列表与真实统计侧栏；
 *   第三幕 图像与订阅：渐变构图预览 + Newsletter。
 * 相比旧版移除了 ArticleDeck 3D 卡片墙与紫色光晕，统计数字全部来自真实数据。
 */

export default function Home() {
  const posts = getAllPosts();
  const allTags = [...new Set(posts.flatMap((p) => p.tags))];
  const totalWords = getTotalWords(posts);
  const monthlyData = getMonthlyCounts(posts);

  const [featured, ...rest] = posts;

  return (
    <div className="text-foreground">
      {/* ═══════════════ 第一幕 · 墨场 Hero ═══════════════ */}
      <section className="relative flex min-h-[92svh] items-center overflow-hidden">
        {/* three.js 墨尘粒子场：主题感知、DPR 限制、reduced-motion 静帧降级 */}
        <InkField className="absolute inset-0 h-full w-full" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-24 pb-20">
          <p className="ink-eyebrow">
            <span className="h-px w-10 bg-border" />
            Notes · Est. 2025
          </p>

          <h1 className="ink-display mt-8 max-w-4xl text-[2.75rem] font-normal leading-[1.18] text-foreground md:text-7xl">
            设计、代码
            <br />
            与界面的<span className="text-accent">碎片</span>。
          </h1>

          <p className="mt-8 max-w-md font-serif text-sm leading-loose text-muted md:text-base">
            一个关于设计美学、前端工程与极简界面的个人博客——
            把每一次思考都写成纸上的墨迹。
          </p>

          {/* 真实数据摘要（构建期由 markdown 计算，非硬编码） */}
          <div className="mt-12 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-faint">
            <span>{posts.length} posts</span>
            <span className="h-3 w-px bg-border" />
            <span>{(totalWords / 10000).toFixed(1)} 万字</span>
            <span className="h-3 w-px bg-border" />
            <span>updated {posts[0]?.date ?? '—'}</span>
          </div>
        </div>

        {/* 底部滚动提示：垂落的墨线 */}
        <div className="absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">scroll</span>
          <span className="ink-scroll-line block h-14 w-px bg-gradient-to-b from-faint to-transparent" />
        </div>
      </section>

      {/* ═══════════════ 第二幕 · 文章 ═══════════════ */}

      {/* 01 · 精选 —— 非对称编辑式大卡 */}
      {featured && (
        <section className="mx-auto max-w-6xl px-6 pt-20 md:pt-28">
          <SectionHeader index="01" title="精选" subtitle="最新的一篇手记" />
          <Link href={`/posts/${featured.slug}`} className="group block">
            <GlassCard className="overflow-hidden" hover>
              <div className="grid min-h-[300px] md:grid-cols-[5fr_7fr]">
                {/* 封面条：取文章自带渐变，叠放首字装饰
                    2026-08-27 Claude·修复移动端封面条高度塌陷导致装饰大字与
                    feature 标签重叠被裁（深色模式下尤为明显）：单列布局时
                    容器内全为绝对定位元素、无静态内容撑高，现改为移动端固定
                    高度 h-44，桌面端仍由右侧内容列 grid 拉伸撑起 */}
                <div className="relative h-44 overflow-hidden md:h-full" style={{ background: featured.gradient }}>
                  <span className="pointer-events-none absolute -bottom-10 left-4 select-none font-display text-[9rem] leading-none text-white/15">
                    {featured.title.charAt(0)}
                  </span>
                  <span className="ink-index absolute left-6 top-6 !text-white/70">feature</span>
                </div>

                {/* 内容区 */}
                <div className="flex flex-col justify-center gap-4 p-7 md:p-10">
                  <div className="flex items-center gap-3 font-mono text-xs text-faint">
                    <span>{featured.date}</span>
                    <span className="h-px w-4 bg-border" />
                    <span>{featured.words} 字</span>
                    <span className="h-px w-4 bg-border" />
                    <span>{featured.tags.slice(0, 2).map((t) => `#${t}`).join(' ')}</span>
                  </div>
                  <h3 className="ink-display max-w-fit text-2xl leading-snug text-foreground md:text-[2rem]">
                    <span className="ink-underline">{featured.title}</span>
                  </h3>
                  <p className="font-serif text-sm leading-loose text-muted">{featured.excerpt}</p>
                  <span className="inline-flex w-fit items-center gap-2 pt-2 text-sm text-accent transition-transform duration-300 group-hover:translate-x-1.5">
                    阅读全文 <span aria-hidden>→</span>
                  </span>
                </div>
              </div>
            </GlassCard>
          </Link>
        </section>
      )}

      {/* 02 · 目录 —— 编号列表 + 统计侧栏 */}
      <section className="mx-auto max-w-6xl px-6 pt-20 md:pt-28">
        <SectionHeader index="02" title="目 录" subtitle={`其余 ${rest.length} 篇 · 以时间排序`} />
        <div className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:gap-14">
          {/* 编号目录行 */}
          <div>
            {rest.length === 0 && (
              <p className="py-10 text-sm text-faint">更多手记正在路上。</p>
            )}
            <div className="divide-y divide-border">
              {rest.slice(0, 6).map((post, i) => (
                <Link key={post.slug} href={`/posts/${post.slug}`} className="group -mx-3 flex items-baseline gap-5 rounded-lg px-3 py-5 transition-colors hover:bg-foreground/[0.025]">
                  <span className="ink-index">{String(i + 1).padStart(2, '0')}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-base font-medium leading-snug text-foreground md:text-lg">
                      <span className="ink-underline">{post.title}</span>
                    </h3>
                    <p className="mt-1.5 truncate text-xs text-faint">
                      {post.date} · {post.tags.join(' / ')}
                    </p>
                  </div>
                  <span className="hidden font-mono text-[11px] tracking-wider text-faint sm:block">
                    {post.words} 字
                  </span>
                </Link>
              ))}
            </div>
            {rest.length > 6 && (
              <Link href="/posts" className="group mt-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground">
                <span className="ink-underline">查看全部</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            )}
          </div>

          {/* 侧栏：真实统计 + 作者名片 */}
          <aside className="space-y-5 self-start lg:sticky lg:top-24">
            <BlogStats
              articleCount={posts.length}
              totalWords={totalWords}
              lastUpdate={posts[0]?.date ?? '—'}
              monthlyData={monthlyData}
            />
            <AuthorBio postCount={posts.length} totalWords={totalWords} />
          </aside>
        </div>
      </section>

      {/* ═══════════════ 第三幕 · 图像与订阅 ═══════════════ */}

      {/* 03 · 灵感 —— 复刻微缩预览
          2026-08-28 Claude·取缔画廊图片流，改为灵感组件预览：
          列表只渲染纯 CSS 微缩图（Server Component 直出，
          不引入任何客户端 JS / 图片请求 / 动画循环），完整组件在灵感详情页按需加载
          2026-08-31 Claude·取样改为「每灵感取首件原型」（跨灵感均衡曝光，
          新增灵感自动上榜）；副标题与编号落款去「液态玻璃 / LG-」单一前缀 */}
      <section className="mx-auto max-w-6xl px-6 pt-20 md:pt-28">
        <SectionHeader
          index="03"
          title="灵 感"
          subtitle="灵感复刻档案 · 微缩即纯 CSS"
          action={{ href: '/inspiration', label: '全部' }}
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {/* 每灵感取首件原型（灵感级取样），链接指向所属灵感详情页 */}
          {INSPIRATIONS.map((entry) => {
            const proto = entry.prototypes[0];
            return (
              <Link
                key={proto.slug}
                href={`/inspiration/${entry.slug}/`}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
              >
                {/* 微缩舞台：专属光斑背景 + 等比微缩图 */}
                <div
                  className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  style={{ background: proto.stage }}
                >
                  <div className="flex h-full w-full scale-[0.52] items-center justify-center sm:scale-[0.58]">
                    <proto.Mini />
                  </div>
                </div>
                {/* 底部信息条：中文题 + 灵感/原型编号（通用前缀，不再绑定 LG-） */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/55 to-transparent px-4 pb-3 pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-sm text-white drop-shadow">{proto.title}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/70">
                    IN-{entry.no} / P{proto.no}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 04 · 标签 + 订阅 */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:pt-28 md:pb-28">
        <SectionHeader index="04" title="余 墨" subtitle="按标签 wander，或留下邮箱等下一篇" />
        <div className="grid gap-5 lg:grid-cols-2">
          <TagCloud tags={allTags} />
          <Newsletter />
        </div>
      </section>
    </div>
  );
}

/* ─────────── 首页内部的小型数据与视图辅助 ─────────── */
/* 2026-08-28 Claude·移除 galleryPreview 数组：画廊已被灵感页取缔，
   03 区块改用 inspiration/registry 的纯 CSS 微缩图 */
