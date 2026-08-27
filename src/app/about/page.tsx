import { AuthorBio } from '@/components/blog/AuthorBio';
import { Newsletter } from '@/components/blog/Newsletter';
import { BlogStats } from '@/components/blog/BlogStats';
import { getAllPosts, getTotalWords, getMonthlyCounts } from '@/lib/posts';

/**
 * 关于页 ——「墨境 Ink Field」版式
 * 2026-08-27 Claude·视觉重设计：
 *   - 移除紫/青光晕装饰 div，回归细线框纸面的克制表达；
 *   - 头部眉题/标题统一为 ink-eyebrow + ink-display 体系；
 *   - BlogStats/AuthorBio 全部改为构建期真实统计（字数、月度发布量均由 markdown 计算），去除硬编码 mock。
 */

export const metadata = {
  title: '关于',
  description: '关于这个博客、作者与设计理念。',
};

export default function AboutPage() {
  const posts = getAllPosts();
  const totalWords = getTotalWords(posts);
  const monthlyData = getMonthlyCounts(posts);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ═══ 头部 ═══ */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 md:pt-28">
        <p className="ink-eyebrow">
          <span className="h-px w-8 bg-border" />
          About · 关于
        </p>
        <h1 className="ink-display mt-6 text-4xl leading-[1.15] text-foreground md:text-6xl">
          一个人的纸上工坊
        </h1>
        <p className="mt-4 max-w-lg font-serif text-sm leading-loose text-muted md:text-base">
          设计与代码的碎片，写给同样在意界面细节的人。
        </p>
      </section>

      {/* ═══ 叙事 ═══ */}
      <section className="mx-auto max-w-2xl px-6 pb-16">
        <div className="space-y-6 font-serif text-[15px] leading-[1.95] text-muted">
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

      {/* ═══ 作者名片 + 博客统计（均为真实数据） ═══ */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <AuthorBio postCount={posts.length} totalWords={totalWords} />
          <BlogStats
            articleCount={posts.length}
            totalWords={totalWords}
            lastUpdate={posts[0]?.date ?? '—'}
            monthlyData={monthlyData}
          />
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
