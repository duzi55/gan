import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { TagCloud } from '@/components/blog/TagCloud';
import { tagConfig, collectTags } from '@/lib/tags';

export function generateStaticParams() {
  const posts = getAllPosts();
  return collectTags(posts).map((tag) => ({ tag }));
}

// Next 静态导出对非 ASCII 参数可能返回 URL 编码形式（如 %E8%AE%BE），统一解码
function normalizeTag(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  return params.then(({ tag }) => ({
    title: `#${normalizeTag(tag)}`,
    description: `关于「${normalizeTag(tag)}」的文章归档`,
  }));
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: rawTag } = await params;
  const tag = normalizeTag(rawTag);
  const allPosts = getAllPosts();
  const posts = allPosts.filter((p) => p.tags.includes(tag));
  if (posts.length === 0) notFound();

  const config = tagConfig(tag);
  const allTags = collectTags(allPosts);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ═══ 头部 ═══ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-12 md:pt-28">
          <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-zinc-600">
            <span className="h-px w-8 bg-zinc-700" />
            <span>Tags</span>
          </div>
          <h1 className="flex items-center gap-4 font-serif text-3xl font-bold text-zinc-50 md:text-5xl">
            <span className="font-serif text-2xl text-zinc-500 md:text-3xl">{config.icon}</span>
            #{tag}
          </h1>
          <p className="mt-4 font-serif text-sm text-zinc-500">
            收录 {posts.length} 篇文章
          </p>
        </div>
      </section>

      {/* ═══ 文章列表 ═══ */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="space-y-3">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group grid items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 transition-all hover:border-white/10 hover:bg-white/5 md:grid-cols-[auto_1fr_auto]"
            >
              <span className="hidden w-10 font-serif text-sm text-zinc-600 md:block">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h3 className="truncate font-serif text-base font-medium text-zinc-100 transition-colors group-hover:text-white">
                  {post.title}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                  <span>{post.date}</span>
                  <span className="h-px w-3 bg-zinc-700" />
                  {post.tags
                    .filter((t) => t !== tag)
                    .map((t) => (
                      <span key={t} className="text-zinc-600">
                        #{t}
                      </span>
                    ))}
                </div>
              </div>
              <span className="hidden text-zinc-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-zinc-300 md:block">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ 全部标签 ═══ */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <TagCloud tags={allTags} activeTag={tag} />
      </section>
    </div>
  );
}
