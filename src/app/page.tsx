import Link from "next/link";
import { ProductCard } from "@/components/ui-components/ProductCard";
import { ProfileCard } from "@/components/ui-components/ProfileCard";
import { WeatherCard } from "@/components/ui-components/WeatherCard";

const notes = [
  {
    date: "2026.08.24",
    title: "从 14 个 UI 组件到一个静态博客",
    desc: "把组件库改造成 GitHub Pages 静态博客的路径记录。",
  },
  {
    date: "2026.08.10",
    title: "极简风格的取舍",
    desc: "留白、字距、分割线——克制背后的设计决策。",
  },
  {
    date: "2026.07.28",
    title: "Tailwind v4 主题配置笔记",
    desc: "用 @theme inline 管理设计变量的实践。",
  },
  {
    date: "2026.07.12",
    title: "组件级样式的边界",
    desc: "为什么每个组件应该有自己的 CSS 文件。",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-20 pt-24 md:pb-28 md:pt-32">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
          Notes — a minimal blog
        </p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
          设计、代码
          <br />
          与界面的碎片。
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-zinc-500">
          记录组件设计、前端工程与极简界面实践。所有组件均为自建，
          用作博客的组成零件。
        </p>
        <div className="mt-10 flex items-center gap-6 text-sm">
          <Link
            href="/components/"
            className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900"
          >
            Browse components
          </Link>
          <Link
            href="/components/portfolio-carousel/"
            className="text-zinc-400 transition-colors hover:text-zinc-900"
          >
            3D Portfolio →
          </Link>
        </div>
      </section>

      {/* Selected components */}
      <section className="border-t border-zinc-200/70">
        <div className="mx-auto w-full max-w-5xl px-6 py-20 md:py-24">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium text-zinc-400">Selected components</h2>
            <Link
              href="/components/"
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >
              View all →
            </Link>
          </div>

          <div className="mt-8 grid gap-10 md:grid-cols-2">
            <Link href="/components/" className="group">
              <div className="pointer-events-none select-none flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-zinc-200/70 bg-white p-8 transition-colors group-hover:border-zinc-300">
                <ProfileCard
                  name="Chloe Harrison"
                  role="Product designer"
                  tags={["Figma", "UX Design"]}
                  rating={4.5}
                  earned="$15K+"
                  rate="$80/hr"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-sm font-medium text-zinc-900">Profile</h3>
                <span className="font-mono text-xs text-zinc-400">01</span>
              </div>
            </Link>

            <Link href="/components/" className="group">
              <div className="pointer-events-none select-none flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-zinc-200/70 bg-white p-8 transition-colors group-hover:border-zinc-300">
                <ProductCard
                  title="Crush Contrast"
                  price="€165,95"
                  imageUrl="https://picsum.photos/seed/blueshirt/400/400"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-sm font-medium text-zinc-900">Product</h3>
                <span className="font-mono text-xs text-zinc-400">02</span>
              </div>
            </Link>

            <Link href="/components/" className="group md:col-span-2">
              <div className="pointer-events-none select-none flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-zinc-200/70 bg-white p-8 transition-colors group-hover:border-zinc-300">
                <WeatherCard
                  temperature={28}
                  description="Pretty Sunny"
                  time="11:21 AM"
                  date="Feb 2, 2025"
                  location="Calicut, Kerala"
                  airQuality={72}
                  airQualityLabel="Moderate"
                  cloudCover={5}
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="text-sm font-medium text-zinc-900">Weather</h3>
                <span className="font-mono text-xs text-zinc-400">03</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="border-t border-zinc-200/70">
        <div className="mx-auto w-full max-w-5xl px-6 py-20 md:py-24">
          <h2 className="text-sm font-medium text-zinc-400">Notes</h2>
          <ul className="mt-8 divide-y divide-zinc-200/70 border-t border-b border-zinc-200/70">
            {notes.map((note) => (
              <li key={note.title}>
                <div className="flex flex-col gap-1 py-5 transition-colors hover:bg-zinc-100/60 sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="w-24 flex-shrink-0 font-mono text-xs text-zinc-400">
                    {note.date}
                  </span>
                  <div>
                    <h3 className="text-base font-medium text-zinc-900">{note.title}</h3>
                    <p className="mt-1 text-sm text-zinc-500">{note.desc}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
