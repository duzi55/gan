import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import PortfolioCarousel3D from "@/components/ui-components/PortfolioCarousel3D";
import { StatsCard } from "@/components/ui-components/StatsCard";
import { LiveWeatherCard } from "@/components/ui-components/WeatherCard";
import { MusicPlayer } from "@/components/ui-components/MusicPlayer";
import { ProfileCard } from "@/components/ui-components/ProfileCard";
import { ArticleCard } from "@/components/ArticleCard";
import { GalleryImage } from "@/components/GalleryImage";

const galleryItems = [
  { title: "Liquid", seed: "liquid-glass-01", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { title: "Sunset", seed: "sunset-vibes-02", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { title: "Midnight", seed: "midnight-city-03", gradient: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" },
  { title: "Pastel", seed: "pastel-dream-04", gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
  { title: "Ember", seed: "ember-glow-05", gradient: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)" },
  { title: "Ocean", seed: "ocean-deep-06", gradient: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)" },
];

/** override min-w/max-w of child component to fill grid cell */
const fill = "[&>div]:!min-w-0 [&>div]:!max-w-none [&>div]:w-full";

export default function Home() {
  const posts = getAllPosts();
  const allTags = new Set(posts.flatMap((p) => p.tags));
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const p = (i: number) => posts[i];

  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      {/* ── Hero + 3D Carousel integrated ── */}
      <section className="relative overflow-hidden" style={{ isolation: "isolate" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)" }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")" }} />
        <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-purple-500/20 blur-[80px]" />
        <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-2 text-center md:pt-28">
          <div className="mb-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/40">
            <span className="h-px w-8 bg-white/30" />
            <span>Notes · {now.getFullYear()}</span>
            <span className="h-px w-8 bg-white/30" />
          </div>
          <h1 className="font-serif text-3xl font-bold leading-[1.15] tracking-wide text-white md:text-5xl">
            设计、代码与界面的碎片
          </h1>
          <p className="mx-auto mt-4 max-w-md font-serif text-sm leading-relaxed text-white/50">
            一个关于设计美学、前端工程与极简界面的个人博客。
          </p>
        </div>

        {/* 3D carousel — inside hero, double isolation to prevent overflow */}
        <div className="relative overflow-hidden" style={{ isolation: "isolate" }}>
          <PortfolioCarousel3D />
        </div>
      </section>

      {/* ── Magazine Flow: articles + components mixed ── */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-wide text-zinc-900 md:text-3xl">文章</h2>
            <p className="mt-1 text-sm text-zinc-400">设计思考与前端实践</p>
          </div>
          <span className="text-sm text-zinc-300">{posts.length} 篇</span>
        </div>

        <div className="space-y-6">
          {/* Row 1: Featured article (wide) + Weather */}
          {posts.length > 0 && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {p(0) && <ArticleCard {...p(0)} index={0} />}
              </div>
              <div className={fill}>
                <LiveWeatherCard />
              </div>
            </div>
          )}

          {/* Row 2: Two articles side by side */}
          {posts.length > 2 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {p(1) && <ArticleCard {...p(1)} index={1} />}
              {p(2) && <ArticleCard {...p(2)} index={2} />}
            </div>
          )}

          {/* Row 3: Music player + Article */}
          {posts.length > 3 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className={fill}>
                <MusicPlayer albumTitle="Lo-fi Beats" artist="Chillhop Music" year={2026} songCount={5} />
              </div>
              {p(3) && <ArticleCard {...p(3)} index={3} />}
            </div>
          ) : (
            <div className={fill}>
              <MusicPlayer albumTitle="Lo-fi Beats" artist="Chillhop Music" year={2026} songCount={5} />
            </div>
          )}

          {/* Row 4: Stats + Profile + Article (3-col) */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className={fill}>
              <StatsCard greeting={greeting} date={dateStr} userName="Reader" />
            </div>
            <div className={fill}>
              <ProfileCard name="Yang" role="Designer & Developer" tags={["UI/UX", "Frontend", "3D"]} rating={4.9} earned="¥12k+" rate="98%" />
            </div>
            {p(4) ? (
              <ArticleCard {...p(4)} index={4} variant="vertical" />
            ) : (
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white/40 p-8 text-sm text-zinc-300">
                More coming soon
              </div>
            )}
          </div>

          {/* Remaining articles — flowing list */}
          {posts.length > 5 && (
            <div className="space-y-4 pt-2">
              {posts.slice(5).map((post, i) => (
                <ArticleCard key={post.slug} {...post} index={i + 5} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Gallery — Real photos from Picsum ── */}
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
                <div className="absolute inset-0" style={{ background: g.gradient }} />
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
