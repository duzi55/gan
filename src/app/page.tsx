import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import PortfolioCarousel3D from "@/components/ui-components/PortfolioCarousel3D";
import { StatsCard } from "@/components/ui-components/StatsCard";
import { LiveWeatherCard } from "@/components/ui-components/WeatherCard";
import { MusicPlayer } from "@/components/ui-components/MusicPlayer";
import { ProfileCard } from "@/components/ui-components/ProfileCard";
import { GalleryImage } from "@/components/GalleryImage";

const galleryItems = [
  { title: "Liquid", seed: "liquid-glass-01", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { title: "Sunset", seed: "sunset-vibes-02", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { title: "Midnight", seed: "midnight-city-03", gradient: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" },
  { title: "Pastel", seed: "pastel-dream-04", gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
  { title: "Ember", seed: "ember-glow-05", gradient: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)" },
  { title: "Ocean", seed: "ocean-deep-06", gradient: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)" },
];

export default function Home() {
  const posts = getAllPosts();
  const allTags = new Set(posts.flatMap(p => p.tags));
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)" }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")" }} />
        <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-purple-500/20 blur-[80px]" />
        <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
          <div className="mb-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/40">
            <span className="h-px w-8 bg-white/30" />
            <span>Notes · {now.getFullYear()}</span>
            <span className="h-px w-8 bg-white/30" />
          </div>
          <h1 className="font-serif text-4xl font-bold leading-[1.15] tracking-wide text-white md:text-6xl md:leading-[1.1]">
            设计、代码与
            <br />
            界面的碎片
          </h1>
          <p className="mx-auto mt-6 max-w-md font-serif text-base leading-relaxed text-white/50">
            一个关于设计美学、前端工程与极简界面的个人博客。
            <br />
            每一篇文章都是一次探索。
          </p>
        </div>
      </section>

      {/* ── 3D Portfolio Carousel ── */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 pt-4 pb-2 text-center">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">Portfolio Showcase</h2>
        </div>
        <PortfolioCarousel3D />
      </section>

      {/* ── Articles + Sidebar ── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-wide text-zinc-900 md:text-3xl">文章</h2>
            <p className="mt-1 text-sm text-zinc-400">设计思考与前端实践</p>
          </div>
          <span className="text-sm text-zinc-300">{posts.length} 篇</span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Article List */}
          <div className="space-y-5 lg:col-span-2">
            {posts.map((post, idx) => (
              <Link key={post.slug} href={`/posts/${post.slug}`} className="group block">
                <article className="relative flex overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/60 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg hover:shadow-zinc-200/60">
                  <div className="relative w-28 flex-shrink-0 overflow-hidden" style={{ background: post.gradient }}>
                    <span className="absolute bottom-3 left-3 right-3 font-serif text-[3rem] font-bold leading-none text-white/15">{String(idx + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center px-6 py-5">
                    <div className="mb-2 flex items-center gap-3 text-xs text-zinc-400">
                      <span>{post.date}</span>
                      <span className="h-px w-3 bg-zinc-300" />
                      <span className="flex gap-2">{post.tags.slice(0, 2).map((tag) => (<span key={tag}>#{tag}</span>))}</span>
                    </div>
                    <h3 className="mb-2 font-serif text-lg font-bold leading-snug text-zinc-900 transition-colors group-hover:text-zinc-600 md:text-xl">{post.title}</h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500">{post.excerpt}</p>
                  </div>
                  <div className="flex items-center pr-6">
                    <span className="text-2xl text-zinc-300 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:text-zinc-500">→</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Sidebar — Real functional components */}
          <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <StatsCard
              greeting={greeting}
              date={dateStr}
              userName="Reader"
            />
            <LiveWeatherCard />
            <MusicPlayer albumTitle="Lo-fi Beats" artist="Chillhop Music" year={2026} songCount={5} />
            <ProfileCard name="Yang" role="Designer & Developer" tags={["UI/UX", "Frontend", "3D"]} rating={4.9} earned="¥12k+" rate="98%" />
          </aside>
        </div>
      </section>

      {/* ── Gallery Preview — Real images from Picsum ── */}
      <section className="border-t border-zinc-200/60 bg-[#f5f3ee] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-wide text-zinc-900 md:text-3xl">图片流</h2>
              <p className="mt-1 text-sm text-zinc-400">Real photos · Powered by Picsum</p>
            </div>
            <Link href="/gallery" className="group inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-900">
              查看全部
              <span className="transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {galleryItems.map((g) => (
              <Link key={g.title} href="/gallery" className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
                {/* Gradient fallback */}
                <div className="absolute inset-0" style={{ background: g.gradient }} />
                {/* Real image from Picsum API */}
                <GalleryImage src={`https://picsum.photos/seed/${g.seed}/400/500`} alt={g.title} gradient={g.gradient} />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-sm font-medium text-white drop-shadow">{g.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="border-t border-zinc-200/60 py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-serif text-lg text-zinc-400">"好的设计不是做加法，而是做减法。"</p>
          <Link href="/gallery" className="mt-6 inline-block font-serif text-sm tracking-wide text-zinc-500 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-900">探索图片流 →</Link>
        </div>
      </section>
    </div>
  );
}
