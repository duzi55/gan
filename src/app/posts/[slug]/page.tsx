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
      {/* Cover */}
      <div className="relative h-[50vh] w-full overflow-hidden bg-zinc-200">
        {post.cover ? (
          <img
            src={post.cover}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400">
            <span className="text-sm">{post.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
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

        {/* Title */}
        <h1 className="font-serif text-3xl font-bold leading-tight text-zinc-900">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="mt-4 flex items-center gap-3 text-sm text-zinc-500">
          <time>{post.date}</time>
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
