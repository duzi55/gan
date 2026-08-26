import { AuthorBio } from '@/components/blog/AuthorBio';
import { Newsletter } from '@/components/blog/Newsletter';
import { BlogStats } from '@/components/blog/BlogStats';
import { getAllPosts } from '@/lib/posts';

export const metadata = {
  title: '关于',
  description: '关于这个博客、作者与设计理念。',
};

export default function AboutPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ═══ 头部 ═══ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-12 md:pt-28">
          <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-zinc-600">
            <span className="h-px w-8 bg-zinc-700" />
            <span>About</span>
          </div>
          <h1 className="font-serif text-3xl font-bold leading-[1.15] tracking-wide text-zinc-50 md:text-5xl">
            关于这个博客
          </h1>
          <p className="mt-4 max-w-lg font-serif text-sm leading-relaxed text-zinc-500">
            设计与代码的碎片，写给同样在意界面细节的人。
          </p>
        </div>
      </section>

      {/* ═══ 叙事 ═══ */}
      <section className="mx-auto max-w-2xl px-6 pb-16">
        <div className="space-y-6 font-serif text-[15px] leading-[1.9] text-zinc-400">
          <p>
            这里记录的是我在设计、前端工程与界面美学之间的徘徊。没有宏大叙事，只有一次次对「克制」的练习：
            少一个装饰，多一分留白；少一种颜色，多一层呼吸。
          </p>
          <p>
            博客的每篇文章都是一次设计实验——排版、字体、色彩、动效，内容与形式互为表里。
            我相信好的界面不是被「做」出来的，而是被「留」出来的。
          </p>
        </div>
      </section>

      {/* ═══ 作者名片 + 博客统计 ═══ */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <AuthorBio />
          <BlogStats posts={posts} />
        </div>
      </section>

      {/* ═══ 订阅 ═══ */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mx-auto max-w-md">
          <Newsletter />
        </div>
      </section>
    </div>
  );
}
