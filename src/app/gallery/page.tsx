import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '图片流',
  description: '以视觉叙事——纯 CSS 色彩构图，零图片请求。',
};

interface VisualBlock {
  caption: string;
  gradient: string;
  /** large decorative character */
  glyph: string;
  /** aspect ratio class */
  aspect: string;
}

const blocks: VisualBlock[] = [
  { caption: '晨雾', gradient: 'linear-gradient(160deg, #d4d4d8 0%, #a1a1aa 40%, #52525b 100%)', glyph: '雾', aspect: 'aspect-[3/4]' },
  { caption: '巷', gradient: 'linear-gradient(45deg, #1c1917 0%, #292524 60%, #57534e 100%)', glyph: '巷', aspect: 'aspect-[4/3]' },
  { caption: '深夜路灯', gradient: 'radial-gradient(circle at 70% 30%, #fbbf24 0%, #1e1b3a 40%, #0c0a1f 100%)', glyph: '夜', aspect: 'aspect-[4/5]' },
  { caption: '林间光', gradient: 'linear-gradient(180deg, #365314 0%, #4d7c0f 30%, #84cc16 60%, #d9f99d 100%)', glyph: '光', aspect: 'aspect-[8/5]' },
  { caption: '山色', gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 30%, #64748b 60%, #94a3b8 100%)', glyph: '山', aspect: 'aspect-[3/4]' },
  { caption: '河岸', gradient: 'linear-gradient(135deg, #134e4a 0%, #0f766e 40%, #5eead4 100%)', glyph: '水', aspect: 'aspect-[4/5]' },
  { caption: '低光', gradient: 'radial-gradient(ellipse at 50% 80%, #78350f 0%, #1c1917 50%, #000000 100%)', glyph: '低', aspect: 'aspect-[4/3]' },
  { caption: '雾中树', gradient: 'linear-gradient(180deg, #e7e5e4 0%, #a8a29e 30%, #44403c 70%, #1c1917 100%)', glyph: '树', aspect: 'aspect-[3/4]' },
  { caption: '湖面', gradient: 'linear-gradient(180deg, #075985 0%, #0c4a6e 30%, #0e7490 60%, #22d3ee 100%)', glyph: '湖', aspect: 'aspect-[4/3]' },
  { caption: '静流', gradient: 'linear-gradient(120deg, #18181b 0%, #27272a 40%, #52525b 70%, #a1a1aa 100%)', glyph: '静', aspect: 'aspect-[4/5]' },
  { caption: '天际线', gradient: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 30%, #4f46e5 50%, #818cf8 70%, #c7d2fe 100%)', glyph: '天', aspect: 'aspect-[3/4]' },
  { caption: '黄昏', gradient: 'linear-gradient(180deg, #7c2d12 0%, #c2410c 30%, #f97316 50%, #fbbf24 70%, #fef3c7 100%)', glyph: '暮', aspect: 'aspect-[4/3]' },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="mx-auto max-w-5xl px-6 pt-16 pb-8">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-900"
        >
          ← 返回首页
        </Link>
        <h1 className="mt-6 font-serif text-3xl font-bold text-zinc-900">
          图片流
        </h1>
        <p className="mt-2 font-serif text-[15px] text-zinc-500">
          纯 CSS 色彩构图——零图片请求，瞬时加载。
        </p>
      </header>

      {/* Masonry — CSS gradients only, no <img> */}
      <div className="mx-auto max-w-5xl px-6 pb-24">
        <div className="columns-2 md:columns-3 gap-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
          {blocks.map((block, i) => (
            <figure
              key={i}
              className={`group relative overflow-hidden rounded-lg ${block.aspect}`}
              style={{ background: block.gradient }}
            >
              {/* Large decorative glyph */}
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center text-[6rem] font-bold leading-none opacity-20 transition-transform duration-700 group-hover:scale-110 md:text-[8rem]"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                {block.glyph}
              </div>
              {/* Hover caption */}
              <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-4 py-3 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {block.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
