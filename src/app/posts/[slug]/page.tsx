import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllSlugs, getPost, getPostMeta, getAllPosts, getTotalWords } from '@/lib/posts';
import ReadingProgress from '@/components/ReadingProgress';
import { ReadingCompanion } from '@/components/blog/ReadingCompanion';
import { WeatherMood } from '@/components/blog/WeatherMood';
import { AuthorBio } from '@/components/blog/AuthorBio';
import TocAside from '@/components/blog/TocAside';
import MobileToc from '@/components/blog/MobileToc';
import PostNav from '@/components/blog/PostNav';
import { InkField } from '@/components/three';

/**
 * 文章详情页 ——「墨境 Ink Field」版式
 * 2026-08-27 Claude·视觉重设计：
 *   - Hero 由「ArticleCanvas 渐变洗底」改为「宣纸基底 + InkField 墨尘粒子」；
 *     文章自带渐变仅保留为顶部细色带，作为全页唯一颜色指涉；
 *   - 标题启用展示字体（ink-display），水印首字以文章 accent 压印纸面；
 *   - 引用条与列表点改为朱砂色，呼应印章视觉；
 *   - AuthorBio 改传真实统计（总篇数 / 总字数，构建期计算）。
 * 2026-08-27 Claude·阅读体验增强（借鉴 4real.ltd 博客细节）：
 *   - 新增桌面端目录侧栏 TocAside 与移动端目录悬浮球 MobileToc；
 *   - 文末新增上一篇 / 下一篇导航 PostNav；
 *   - 正文标题注入 id 锚点并加 scroll-mt，锚点跳转不被顶部遮挡。
 */

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then((p) => {
    const meta = getPostMeta(p.slug);
    if (!meta) return {};
    return { title: meta.title, description: meta.excerpt };
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  /* 全站真实统计（构建期由 markdown 计算，无 mock） */
  const allPosts = getAllPosts();
  const postCount = allPosts.length;
  const totalWords = getTotalWords(allPosts);

  /* 2026-08-27 Claude·按日期序列计算上一篇（更新）/ 下一篇（更早） */
  const idx = allPosts.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? { slug: allPosts[idx - 1].slug, title: allPosts[idx - 1].title } : undefined;
  const next =
    idx >= 0 && idx < allPosts.length - 1
      ? { slug: allPosts[idx + 1].slug, title: allPosts[idx + 1].title }
      : undefined;

  return (
    <article className="min-h-screen bg-background text-foreground">
      <ReadingProgress />

      {/* 2026-08-27 Claude·文章目录：桌面侧栏 + 移动端悬浮球（xl 断点切换） */}
      <TocAside headings={post.headings} />
      <MobileToc headings={post.headings} />

      {/* ═══════════════ Hero · 墨场 ═══════════════ */}
      <div className="relative flex min-h-[72svh] w-full items-end overflow-hidden bg-background">
        {/* 顶部细色带：文章专属渐变，降级为一道"题签线" */}
        <div className="absolute inset-x-0 top-0 z-20 h-1" style={{ background: post.gradient }} aria-hidden />

        {/* three.js 墨尘粒子层：SSR 安全容器、主题感知、reduced-motion 静帧 */}
        <InkField className="absolute inset-0 h-full w-full" density={0.7} />

        {/* 右上巨大水印首字：以文章 accent 淡淡压印在纸面上 */}
        <span
          className="pointer-events-none absolute right-4 top-14 select-none font-display text-[11rem] leading-none opacity-[0.07] md:right-10 md:top-24 md:text-[19rem]"
          style={{ color: post.accent }}
          aria-hidden
        >
          {post.title.charAt(0)}
        </span>

        {/* 标题块：日期/accent 眉题 → 展示体大标 → 衬线摘要 */}
        <div className="relative z-10 w-full px-6 pb-14 md:px-12 md:pb-20">
          <div className="mx-auto max-w-2xl">
            <div
              className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em]"
              style={{ color: post.accent }}
            >
              <span className="h-px w-8" style={{ background: post.accent }} />
              <span>{post.date}</span>
              <span className="h-px w-8" style={{ background: post.accent }} />
              <span>{post.words} 字</span>
            </div>

            <h1 className="ink-display max-w-2xl text-4xl leading-[1.18] text-foreground md:text-6xl">
              {post.title}
            </h1>

            <p className="mt-6 max-w-xl font-serif text-sm leading-loose text-muted md:text-base">
              {post.excerpt}
            </p>

            {/* 标签行：移动到 Hero 内，正文区更干净 */}
            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="rounded-full border border-border px-3 py-1 font-mono text-xs tracking-wide text-muted transition-colors hover:border-accent/50 hover:text-foreground"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ 正文 ═══════════════ */}
      <div className="mx-auto max-w-2xl px-6 py-20 md:py-28">
        {/* Markdown 渲染 —— 衬线长文排式；引用条与列表圆点使用朱砂呼应印章
            2026-08-27 Claude·h2/h3 增加 scroll-mt，锚点跳转时留出呼吸空间
            2026-08-27 Claude·代码块改为黑色 terminal 风格（mac 三灯 + GitHub Dark 配色），
              行内 code 保留纸面淡底； [&_pre::before] 用 box-shadow 一次画出三枚指示灯 */}
        <div
          className="font-serif text-[18px] leading-[1.95] text-foreground/80
            [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-wide [&_h2]:text-foreground
            [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-24 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground
            [&_p]:mb-6 [&_p]:text-muted
            [&_p:first-of-type]:text-[20px] [&_p:first-of-type]:leading-[1.8] [&_p:first-of-type]:text-foreground/85
            [&_ul]:mb-6 [&_ul]:ml-1
            [&_ul]:list-none
            [&_li]:relative [&_li]:mb-3 [&_li]:pl-6 [&_li]:text-muted
            [&_li::before]:absolute [&_li::before]:left-0 [&_li::before]:top-[0.7em] [&_li::before]:h-1.5 [&_li::before]:w-1.5 [&_li::before]:rounded-full [&_li::before]:bg-accent/60
            [&_blockquote]:relative [&_blockquote]:my-8 [&_blockquote]:border-0 [&_blockquote]:pl-8
            [&_blockquote::before]:absolute [&_blockquote::before]:left-0 [&_blockquote::before]:top-0 [&_blockquote::before]:h-full [&_blockquote::before]:w-1 [&_blockquote::before]:rounded-full [&_blockquote::before]:bg-accent/70
            [&_blockquote]:text-xl [&_blockquote]:font-medium [&_blockquote]:italic [&_blockquote]:leading-[1.7] [&_blockquote]:text-muted
            [&_a]:text-foreground [&_a]:underline [&_a]:decoration-accent/50 [&_a]:underline-offset-4
            [&_strong]:font-bold [&_strong]:text-foreground
            [&_em]:italic
            [&_pre]:relative [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-[#0d1117] [&_pre]:px-5 [&_pre]:pb-5 [&_pre]:pt-12 [&_pre]:shadow-lg [&_pre]:shadow-black/20
            [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-[1.7] [&_pre]:text-[#e6edf3]
            [&_pre::before]:absolute [&_pre::before]:left-5 [&_pre::before]:top-[18px] [&_pre::before]:h-3 [&_pre::before]:w-3 [&_pre::before]:rounded-full [&_pre::before]:bg-[#ff5f56] [&_pre::before]:shadow-[14px_0_0_#ffbd2e,28px_0_0_#27c93f] [&_pre::before]:content-['']
            [&_pre_code]:block [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:font-mono [&_pre_code]:text-inherit
            [&_code]:rounded [&_code]:bg-foreground/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </div>

      {/* 2026-08-27 Claude·文末上一篇 / 下一篇导航（借鉴 4real.ltd） */}
      <div className="mx-auto max-w-2xl px-6">
        <PostNav prev={prev} next={next} />
      </div>

      {/* ═══════════════ 阅读体验：伴侣 + 氛围 ═══════════════ */}
      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-2xl px-6">
          <div className="mb-8 text-center">
            <h2 className="ink-display text-lg text-muted">阅读体验</h2>
            <p className="mt-1 text-xs text-faint">环境音与氛围，为这段阅读留个余韵</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <ReadingCompanion />
            <WeatherMood gradient={post.gradient} accent={post.accent} mood={post.tags[0] || '随笔'} />
          </div>
        </div>
      </section>

      {/* ═══════════════ 作者名片（真实统计） ═══════════════ */}
      <section className="pb-16">
        <div className="mx-auto max-w-md px-6">
          <AuthorBio postCount={postCount} totalWords={totalWords} />
        </div>
      </section>

      {/* ═══════════════ 页脚导航 ═══════════════ */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-2xl px-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
              返回首页
            </Link>
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              图片流
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
