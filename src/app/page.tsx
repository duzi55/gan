import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { GalleryImage } from "@/components/GalleryImage";
import { ArticleDeck } from "@/components/blog/ArticleDeck";
import { AuthorBio } from "@/components/blog/AuthorBio";
import { BlogStats } from "@/components/blog/BlogStats";
import { TagCloud } from "@/components/blog/TagCloud";
import { Newsletter } from "@/components/blog/Newsletter";
import { GlassCard } from "@/components/ui/GlassCard";

const galleryItems = [
  { title: "晨雾", seed: "morning-mist-01", gradient: "linear-gradient(160deg, #d4d4d8 0%, #a1a1aa 40%, #52525b 100%)" },
  { title: "深夜", seed: "midnight-city-02", gradient: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" },
  { title: "林间", seed: "forest-light-03", gradient: "linear-gradient(180deg, #365314 0%, #4d7c0f 30%, #84cc16 60%, #d9f99d 100%)" },
  { title: "暮色", seed: "dusk-glow-04", gradient: "linear-gradient(180deg, #7c2d12 0%, #c2410c 30%, #f97316 50%, #fbbf24 100%)" },
  { title: "湖面", seed: "lake-surface-05", gradient: "linear-gradient(180deg, #075985 0%, #0c4a6e 30%, #0e7490 60%, #22d3ee 100%)" },
  { title: "静流", seed: "still-flow-06", gradient: "linear-gradient(120deg, #18181b 0%, #27272a 40%, #52525b 70%, #a1a1aa 100%)" },
];

export default function Home() {
  const posts = getAllPosts();
  const allTags = [...new Set(posts.flatMap((p) => p.tags))];
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ═══ Hero + ArticleDeck ═══ */}
      <section className="relative overflow-hidden">
        {/* 背景光晕 */}
        <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-8 md:pt-28">
          <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-zinc-600">
            <span className="h-px w-8 bg-zinc-700" />
            <span>Notes · {new Date().getFullYear()}</span>
          </div>
          <h1 className="font-serif text-3xl font-bold leading-[1.15] tracking-wide text-zinc-50 md:text-5xl">
            设计、代码与界面的碎片
          </h1>
          <p className="mt-4 max-w-lg font-serif text-sm leading-relaxed text-zinc-500">
            一个关于设计美学、前端工程与极简界面的个人博客。
          </p>
        </div>

        {/* ArticleDeck — 文章卡片组 */}
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-16">
          <ArticleDeck posts={posts} />
        </div>
      </section>

      {/* ═══ Featured Article ═══ */}
      {featured && (
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <GlassCard className="overflow-hidden" hover>
            <Link href={`/posts/${featured.slug}`} className="group block">
              <div className="grid gap-0 md:grid-cols-2">
                {/* 渐变封面 */}
                <div
                  className="relative h-48 overflow-hidden md:h-full min-h-[200px]"
                  style={{ background: featured.gradient }}
                >
                  <span className="absolute bottom-4 left-6 font-serif text-[5rem] font-bold leading-none text-white/10">
                    01
                  </span>
                  <div
                    className="absolute right-6 top-6 h-3 w-3 rounded-full"
                    style={{ backgroundColor: featured.accent }}
                  />
                </div>
                {/* 内容 */}
                <div className="p-6 md:p-8">
                  <div className="mb-3 flex items-center gap-3 text-xs text-zinc-500">
                    <span>{featured.date}</span>
                    <span className="h-px w-3 bg-zinc-700" />
                    <span className="flex gap-2">
                      {featured.tags.slice(0, 3).map((tag) => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl font-bold leading-snug text-zinc-50 transition-colors group-hover:text-white md:text-2xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {featured.excerpt}
                  </p>
                  <span className="mt-4 inline-block text-sm text-zinc-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-zinc-300">
                    阅读全文 →
                  </span>
                </div>
              </div>
            </Link>
          </GlassCard>
        </section>
      )}

      {/* ═══ Article Stream + BlogStats ═══ */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-zinc-100">最新文章</h2>
            <p className="mt-1 text-sm text-zinc-500">设计思考与前端实践</p>
          </div>
          <span className="text-sm text-zinc-600">{posts.length} 篇</span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* 文章卡片 — 暗色版 */}
          {rest.slice(0, 4).map((post, i) => (
            <Link key={post.slug} href={`/posts/${post.slug}`} className="group">
              <GlassCard className="h-full p-5" hover>
                <div
                  className="mb-4 h-24 overflow-hidden rounded-lg"
                  style={{ background: post.gradient }}
                >
                  <span className="flex h-full items-center justify-center font-serif text-[2.5rem] font-bold text-white/10">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                </div>
                <div className="mb-2 flex items-center gap-2 text-xs text-zinc-600">
                  <span>{post.date}</span>
                  <span className="h-px w-2 bg-zinc-700" />
                  <span>{post.tags[0]}</span>
                </div>
                <h3 className="mb-2 font-serif text-base font-medium leading-snug text-zinc-100 transition-colors group-hover:text-white">
                  {post.title}
                </h3>
                <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">
                  {post.excerpt}
                </p>
              </GlassCard>
            </Link>
          ))}

          {/* BlogStats 嵌入文章流 */}
          <div className="md:col-span-2 lg:col-span-1">
            <BlogStats
              articleCount={posts.length}
              totalWords={21000}
              lastUpdate={posts[0]?.date || "2025-08-26"}
            />
          </div>
        </div>
      </section>

      {/* ═══ AuthorBio + TagCloud ═══ */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-5 md:grid-cols-2">
          <AuthorBio />
          <TagCloud tags={allTags} />
        </div>
      </section>

      {/* ═══ Remaining Articles ═══ */}
      {rest.length > 4 && (
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="space-y-3">
            {rest.slice(4).map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-white/10 hover:bg-white/5"
              >
                <div
                  className="h-10 w-10 shrink-0 rounded-lg"
                  style={{ background: post.gradient }}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-serif text-sm font-medium text-zinc-200 group-hover:text-white">
                    {post.title}
                  </h3>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-600">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.tags.join(" / ")}</span>
                  </div>
                </div>
                <span className="text-zinc-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-zinc-400">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ Gallery Preview ═══ */}
      <section className="border-t border-white/5 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-zinc-100">图片流</h2>
              <p className="mt-1 text-sm text-zinc-500">色彩构图 · 视觉日记</p>
            </div>
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-200"
            >
              查看全部
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {galleryItems.map((g) => (
              <Link
                key={g.title}
                href="/gallery"
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
              >
                <div className="absolute inset-0" style={{ background: g.gradient }} />
                <GalleryImage
                  src={`https://picsum.photos/seed/${g.seed}/400/500`}
                  alt={g.title}
                  gradient={g.gradient}
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-sm font-medium text-white drop-shadow">{g.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Newsletter ═══ */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mx-auto max-w-md">
          <Newsletter />
        </div>
      </section>
    </div>
  );
}
