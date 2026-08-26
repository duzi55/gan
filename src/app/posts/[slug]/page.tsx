import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllSlugs, getPost, getPostMeta } from '@/lib/posts';

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
    <article className="min-h-screen bg-zinc-50">
      {/* Cover — CSS gradient, zero network */}
      <div
        className="relative flex h-[45vh] w-full items-end overflow-hidden px-6 pb-10 md:px-12 md:pb-14"
        style={{ background: post.gradient }}
      >
        <div
          className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 select-none text-[12rem] font-bold leading-none opacity-[0.08] md:text-[18rem]"
          style={{ color: post.accent }}
        >
          {post.title.charAt(0)}
        </div>
        <div className="relative z-10">
          <h1 className="max-w-2xl text-2xl font-bold leading-tight text-white md:text-4xl md:leading-[1.25]">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-6 py-16">
        {/* Back */}
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-zinc-500 hover:text-zinc-900"
        >
          ← 返回首页
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <time className="font-mono tabular-nums">{post.date}</time>
          <span className="text-zinc-300">·</span>
          {post.tags.map((tag) => (
            <span key={tag} className="text-zinc-400">
              #{tag}
            </span>
          ))}
        </div>

        {/* Rendered markdown */}
        <div
          className="mt-10 font-serif text-[17px] leading-[1.9] text-zinc-800 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-zinc-900 [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-zinc-900 [&_p]:mb-4 [&_p]:text-zinc-700 [&_ul]:mb-4 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-600"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </div>
    </article>
  );
}
