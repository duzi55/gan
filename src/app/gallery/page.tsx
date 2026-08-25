import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '图片流',
  description: '以视觉叙事——一张图接一张图，像水一样。',
};

interface GalleryImage {
  src: string;
  caption?: string;
  width: number;
  height: number;
}

const images: GalleryImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1500530855350-2d7f52e9d1f1?w=800&h=1200&fit=crop',
    caption: '晨雾',
    width: 800,
    height: 1200,
  },
  {
    src: 'https://images.unsplash.com/photo-1518837695005-49c8b533d4e8?w=800&h=600&fit=crop',
    caption: '巷',
    width: 800,
    height: 600,
  },
  {
    src: 'https://images.unsplash.com/photo-1493244040629-1b6a0e0e0e0e?w=800&h=1000&fit=crop',
    caption: '深夜路灯',
    width: 800,
    height: 1000,
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6223dbf3754?w=800&h=500&fit=crop',
    caption: '林间光',
    width: 800,
    height: 500,
  },
  {
    src: 'https://images.unsplash.com/photo-1469474968028-5662377a4a9b?w=800&h=1100&fit=crop',
    caption: '山色',
    width: 800,
    height: 1100,
  },
  {
    src: 'https://images.unsplash.com/photo-1426604966843-daded7c08ab1?w=800&h=900&fit=crop',
    caption: '河岸',
    width: 800,
    height: 900,
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=700&fit=crop',
    caption: '低光',
    width: 800,
    height: 700,
  },
  {
    src: 'https://images.unsplash.com/photo-1447752875360-2ee0f9c6b6e6?w=800&h=1200&fit=crop',
    caption: '雾中树',
    width: 800,
    height: 1200,
  },
  {
    src: 'https://images.unsplash.com/photo-1419242905480-2d5e0c3a3f05?w=800&h=600&fit=crop',
    caption: '湖面',
    width: 800,
    height: 600,
  },
  {
    src: 'https://images.unsplash.com/photo-1426604966843-daded7c08ab1?w=800&h=1000&fit=crop',
    caption: '静流',
    width: 800,
    height: 1000,
  },
  {
    src: 'https://images.unsplash.com/photo-1465056836046-0e6d0e3f2a0f?w=800&h=800&fit=crop',
    caption: '中景',
    width: 800,
    height: 800,
  },
  {
    src: 'https://images.unsplash.com/photo-1497405254271-95cd5dc8d3e1?w=800&h=1100&fit=crop',
    caption: '天际线',
    width: 800,
    height: 1100,
  },
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
          以视觉叙事——一张图接一张图，像水一样。
        </p>
      </header>

      {/* Masonry */}
      <div className="mx-auto max-w-5xl px-6 pb-24">
        <div className="columns-2 md:columns-3 gap-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
          {images.map((img, i) => (
            <figure key={i} className="group relative overflow-hidden rounded-lg bg-zinc-200">
              <img
                src={img.src}
                alt={img.caption ?? ''}
                loading="lazy"
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {img.caption && (
                <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
