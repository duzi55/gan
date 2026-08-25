import Link from "next/link";
import { posts } from "@/data/posts";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-24">
      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20">
        <p className="text-[13px] tracking-[0.4em] text-zinc-400">NOTES</p>
        <h1 className="mt-8 font-display text-[2.6rem] leading-[1.25] tracking-wide text-zinc-900 md:text-[3.4rem] md:leading-[1.22]">
          设计、代码
          <br />
          与界面的碎片。
        </h1>
        <p className="mt-8 max-w-xl text-[15px] leading-loose text-zinc-500">
          一个关于设计、前端工程与极简界面的个人笔记。
          写得慢，想得多；博客与组件，都在这里慢慢生长。
        </p>
      </section>

      {/* Gallery Entry */}
      <section className="mb-2 border-t border-zinc-200/70 py-6">
        <Link
          href="/gallery"
          className="group flex items-baseline justify-between"
        >
          <span className="font-display text-lg text-zinc-900 transition-colors group-hover:text-zinc-500">
            图片流
          </span>
          <span className="text-sm text-zinc-400 transition-colors group-hover:text-zinc-900">
            以视觉叙事 →
          </span>
        </Link>
      </section>

      {/* Posts */}
      <section className="border-t border-zinc-200/70 pt-2">
        <ul className="divide-y divide-zinc-200/70">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/posts/${post.slug}`}
                className="group -mx-4 block px-4 py-7 transition-colors hover:bg-stone-100/70"
              >
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="font-mono text-[13px] tabular-nums text-zinc-400 sm:w-[7.5rem] sm:shrink-0">
                    {post.date}
                  </span>
                  <div>
                    <h2 className="text-[17px] font-bold leading-snug tracking-wide text-zinc-900">
                      {post.title}
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                      {post.excerpt}
                    </p>
                    {post.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-zinc-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
