import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllSlugs, getPost, getPostMeta } from '@/lib/posts';
import ArticleCanvas from '@/components/ArticleCanvas';
import ReadingProgress from '@/components/ReadingProgress';
import { ReadingCompanion } from '@/components/blog/ReadingCompanion';
import { WeatherMood } from '@/components/blog/WeatherMood';
import { AuthorBio } from '@/components/blog/AuthorBio';

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

  return (
    <article className="min-h-screen bg-[#fbfaf7]">
      <ReadingProgress />

      {/* ── Hero with Canvas ── */}
      <div
        className="relative flex h-[60vh] w-full items-end overflow-hidden"
        style={{ background: post.gradient }}
      >
        {/* Canvas animation layer */}
        <ArticleCanvas accent={post.accent} />

        {/* Grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")",
          }}
        />

        {/* Large decorative first character */}
        <div
          className="pointer-events-none absolute right-6 top-1/2 -translate-y-[55%] select-none text-[14rem] font-bold leading-none opacity-[0.06] md:text-[22rem]"
          style={{ color: post.accent }}
        >
          {post.title.charAt(0)}
        </div>

        {/* Title block */}
        <div className="relative z-10 w-full px-6 pb-14 md:px-12 md:pb-20">
          <div className="mx-auto max-w-2xl">
            <div
              className="mb-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em]"
              style={{ color: post.accent }}
            >
              <span className="h-px w-6" style={{ background: post.accent }} />
              <span>{post.date}</span>
            </div>
            <h1 className="font-serif text-3xl font-bold leading-[1.2] tracking-wide text-white md:text-[2.75rem] md:leading-[1.18]">
              {post.title}
            </h1>
            <p className="mt-5 font-serif text-[15px] leading-relaxed text-white/70">
              {post.excerpt}
            </p>
          </div>
        </div>
      </div>

      {/* ── Article Body ── */}
      <div className="mx-auto max-w-2xl px-6 py-20 md:py-28">
        {/* Tags row */}
        <div className="mb-12 flex flex-wrap items-center gap-3">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="rounded-full bg-zinc-900/5 px-3 py-1 text-xs tracking-wide text-zinc-500 transition-colors hover:bg-zinc-900/10 hover:text-zinc-800"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* Rendered Markdown — rich typographic styling */}
        <div
          className="font-serif text-[18px] leading-[1.95] text-zinc-700
            [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-wide [&_h2]:text-zinc-900
            [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-zinc-900
            [&_p]:mb-6 [&_p]:text-zinc-600
            [&_p:first-of-type]:text-[20px] [&_p:first-of-type]:leading-[1.8] [&_p:first-of-type]:text-zinc-700
            [&_ul]:mb-6 [&_ul]:ml-1
            [&_ul]:list-none
            [&_li]:relative [&_li]:mb-3 [&_li]:pl-6 [&_li]:text-zinc-600
            [&_li::before]:absolute [&_li::before]:left-0 [&_li::before]:top-[0.7em] [&_li::before]:h-1.5 [&_li::before]:w-1.5 [&_li::before]:rounded-full [&_li::before]:bg-zinc-300
            [&_blockquote]:relative [&_blockquote]:my-8 [&_blockquote]:border-0 [&_blockquote]:pl-8
            [&_blockquote::before]:absolute [&_blockquote::before]:left-0 [&_blockquote::before]:top-0 [&_blockquote::before]:h-full [&_blockquote::before]:w-1 [&_blockquote::before]:rounded-full [&_blockquote::before]:bg-zinc-300
            [&_blockquote]:text-xl [&_blockquote]:font-medium [&_blockquote]:italic [&_blockquote]:leading-[1.7] [&_blockquote]:text-zinc-500
            [&_a]:text-zinc-900 [&_a]:underline [&_a]:decoration-zinc-300 [&_a]:underline-offset-4
            [&_strong]:font-bold [&_strong]:text-zinc-900
            [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

      </div>

      {/* ── Post-Reading: 阅读伴侣 + 氛围 ── */}
      <section className="bg-zinc-950 py-16">
        <div className="mx-auto max-w-2xl px-6">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-lg text-zinc-500">阅读体验</h2>
            <p className="mt-1 text-xs text-zinc-700">环境音与氛围，为这段阅读留个余韵</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <ReadingCompanion />
            <WeatherMood gradient={post.gradient} accent={post.accent} mood={post.tags[0] || '随笔'} />
          </div>
        </div>
      </section>

      {/* ── Author Bio ── */}
      <section className="bg-zinc-950 pb-16">
        <div className="mx-auto max-w-md px-6">
          <AuthorBio />
        </div>
      </section>

      {/* ── Article Footer ── */}
      <footer className="bg-zinc-950 border-t border-white/5 py-8">
        <div className="mx-auto max-w-2xl px-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sm text-zinc-600 transition-colors hover:text-zinc-300"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
              返回首页
            </Link>
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-2 text-sm text-zinc-600 transition-colors hover:text-zinc-300"
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
