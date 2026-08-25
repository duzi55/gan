import { notFound } from 'next/navigation';
import Link from 'next/link';
import { posts } from '@/data/posts';

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then((p) => {
    const post = posts.find((x) => x.slug === p.slug);
    if (!post) return {};
    return {
      title: post.title,
      description: post.excerpt,
    };
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="min-h-screen bg-zinc-50">
      {/* Cover — CSS gradient, zero network */}
      <div
        className="relative flex h-[45vh] w-full items-end overflow-hidden px-6 pb-10 md:px-12 md:pb-14"
        style={{ background: post.gradient }}
      >
        {/* Decorative typography */}
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

        {/* Body */}
        <div className="mt-10 space-y-6 font-serif text-[17px] leading-[1.9] text-zinc-800">
          {post.content.split('\n').map((line, i) => {
            if (line.startsWith('## '))
              return (
                <h2
                  key={i}
                  className="pt-6 text-xl font-bold text-zinc-900"
                >
                  {line.slice(3)}
                </h2>
              );
            if (line.startsWith('### '))
              return (
                <h3
                  key={i}
                  className="pt-4 text-lg font-semibold text-zinc-900"
                >
                  {line.slice(4)}
                </h3>
              );
            if (line.startsWith('> '))
              return (
                <blockquote
                  key={i}
                  className="border-l-2 border-zinc-300 pl-4 italic text-zinc-600"
                >
                  {line.slice(2)}
                </blockquote>
              );
            if (line.startsWith('- '))
              return (
                <li key={i} className="ml-4 list-disc">
                  {line.slice(2)}
                </li>
              );
            if (line.trim() === '') return <div key={i} className="h-2" />;
            return (
              <p key={i} className="text-zinc-700">
                {line}
              </p>
            );
          })}
        </div>
      </div>
    </article>
  );
}
