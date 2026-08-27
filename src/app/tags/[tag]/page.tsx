import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { TagCloud } from '@/components/blog/TagCloud';
import { tagConfig, collectTags } from '@/lib/tags';

/**
 * 标签归档页 ——「墨境 Ink Field」版式
 * 2026-08-27 Claude·视觉重设计：
 *   - 移除紫/青光晕装饰 div；眉题与标题接入 ink-eyebrow / ink-display；
 *   - 列表行去掉卡片描边（默认透明），改为 divide 分隔的目录行，
 *     hover 时才浮现朱砂细框——与首页目录、posts 归档保持一致语言。
 */

export function generateStaticParams() {
  const posts = getAllPosts();
  return collectTags(posts).flatMap((tag) => {
    // 2026-08-27 Claude·修复中文标签 dev 预览 500：
    //   output: export 下 Next dev 会把请求段按百分号编码（%E8%AE%BE…）
    //   与这里的原始中文逐一比对，比对不上即报 missing param。
    //   因此为非 ASCII 标签额外补一条编码变体仅供 dev 匹配；
    //   编码副本目录由 sync-docs.mjs 在同步 docs/ 时跳过，
    //   线上仓库与 Pages 始终只保留中文正名目录，URL 结构不变。
    const encoded = encodeURIComponent(tag);
    if (encoded === tag) return [{ tag }];
    return [{ tag }, { tag: encoded }];
  });
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
    <div className="min-h-screen bg-background text-foreground">
      {/* ═══ 头部 ═══ */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 md:pt-28">
        <p className="ink-eyebrow">
          <span className="h-px w-8 bg-border" />
          Tags · 分类
        </p>
        <h1 className="ink-display mt-6 flex items-baseline gap-4 text-4xl leading-[1.15] text-foreground md:text-6xl">
          <span aria-hidden className="text-2xl text-muted md:text-4xl">{config.icon}</span>
          #{tag}
        </h1>
        <p className="mt-4 font-serif text-sm leading-loose text-muted md:text-base">
          收录 {posts.length} 篇文章
        </p>
      </section>

      {/* ═══ 文章列表：目录行式 ═══ */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="divide-y divide-border">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group grid items-center gap-4 rounded-xl border border-transparent px-5 py-4 transition-all hover:border-accent/30 hover:bg-foreground/[0.03] md:grid-cols-[auto_1fr_auto]"
            >
              <span className="ink-index hidden md:block">{String(i + 1).padStart(2, '0')}</span>
              <div className="min-w-0">
                <h3 className="truncate font-serif text-base font-medium leading-snug text-foreground">
                  <span className="ink-underline">{post.title}</span>
                </h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                  <span>{post.date}</span>
                  <span className="h-px w-3 bg-border" />
                  {post.tags
                    .filter((t) => t !== tag)
                    .map((t) => (
                      <span key={t} className="text-faint">
                        #{t}
                      </span>
                    ))}
                </div>
              </div>
              <span className="hidden text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent md:block">
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
