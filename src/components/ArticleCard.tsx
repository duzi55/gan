import Link from "next/link";

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  gradient: string;
  index: number;
  variant?: "horizontal" | "vertical";
}

/**
 * 可复用文章卡片 — 支持水平/垂直两种布局
 */
export function ArticleCard({
  slug,
  title,
  excerpt,
  date,
  tags,
  gradient,
  index,
  variant = "horizontal",
}: ArticleCardProps) {
  const numStr = String(index + 1).padStart(2, "0");

  if (variant === "vertical") {
    return (
      <Link href={`/posts/${slug}`} className="group block h-full">
        <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/60 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg hover:shadow-zinc-200/60">
          <div className="relative h-40 flex-shrink-0 overflow-hidden" style={{ background: gradient }}>
            <span className="absolute bottom-3 left-4 font-serif text-[3rem] font-bold leading-none text-white/15">{numStr}</span>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <div className="mb-2 flex items-center gap-3 text-xs text-zinc-400">
              <span>{date}</span>
              <span className="h-px w-3 bg-zinc-300" />
              <span className="flex gap-2">{tags.slice(0, 2).map((tag) => (<span key={tag}>#{tag}</span>))}</span>
            </div>
            <h3 className="mb-2 font-serif text-base font-bold leading-snug text-zinc-900 transition-colors group-hover:text-zinc-600">{title}</h3>
            <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-zinc-500">{excerpt}</p>
            <span className="mt-3 text-sm text-zinc-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-zinc-700">阅读 →</span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/posts/${slug}`} className="group block">
      <article className="relative flex overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/60 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg hover:shadow-zinc-200/60">
        <div className="relative w-24 flex-shrink-0 overflow-hidden" style={{ background: gradient }}>
          <span className="absolute bottom-2 left-2 right-2 font-serif text-[2.5rem] font-bold leading-none text-white/15">{numStr}</span>
        </div>
        <div className="flex flex-1 flex-col justify-center px-5 py-4">
          <div className="mb-1.5 flex items-center gap-3 text-xs text-zinc-400">
            <span>{date}</span>
            <span className="h-px w-3 bg-zinc-300" />
            <span className="flex gap-2">{tags.slice(0, 2).map((tag) => (<span key={tag}>#{tag}</span>))}</span>
          </div>
          <h3 className="mb-1.5 font-serif text-base font-bold leading-snug text-zinc-900 transition-colors group-hover:text-zinc-600">{title}</h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500">{excerpt}</p>
        </div>
        <div className="flex items-center pr-5">
          <span className="text-xl text-zinc-300 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:text-zinc-500">→</span>
        </div>
      </article>
    </Link>
  );
}
