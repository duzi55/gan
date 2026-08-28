import type { Metadata } from 'next';

/**
 * 画廊页 ——「墨境 Ink Field」版式
 * 2026-08-27 Claude·视觉重设计：
 *   - 头部接入 ink-eyebrow / ink-display，副题加入"纸上色域"概念；
 *   - 每件作品左上角常驻 mono 编号（n-01…），hover 才显现题名——与全站
 *     「目录编号 + hover 题注」的语言一致。
 * 2026-08-27 Claude·画廊由「纯 CSS 渐变」升级为真图「纸上山水」系列：
 *   - 8 幅水墨主题图（AI 生成后入库 public/images/gallery/，与站点同 CDN 同域名，
 *     首访即缓存，无外链断链与跨域开销）；
 *   - <img> 统一 loading="lazy" + object-cover，按原图比例指定 aspect 占位防跳动；
 *   - 渐变保留为图片加载前的底色（低饱和纸灰，与水墨主题同调）；
 *   - 编号 / 字形压印 / hover 题注的视觉语言不变，glyph 透明度降低以不抢画面。
 */

export const metadata: Metadata = {
  title: '图片流',
  description: '纸上山水——八幅水墨写意，墨分五色，纸生云烟。',
};

interface VisualBlock {
  caption: string;
  /** 图片文件名（位于 public/images/gallery/） */
  src: string;
  /** 无障碍替代文本 */
  alt: string;
  /** large decorative character */
  glyph: string;
  /** aspect ratio class：与生成图比例一致，加载期占位防布局跳动 */
  aspect: string;
  /** 图片加载前的底色（水墨纸灰系） */
  fallback: string;
}

const blocks: VisualBlock[] = [
  { caption: '山色', src: '/gan/images/gallery/g-shanshui.jpg', alt: '水墨山水：云雾层叠的远山与松', glyph: '山', aspect: 'aspect-[16/9]', fallback: '#d6d3d1' },
  { caption: '湖面', src: '/gan/images/gallery/g-lake.jpg', alt: '水墨湖景：晨光中远山倒映静水', glyph: '湖', aspect: 'aspect-[4/3]', fallback: '#e7e5e4' },
  { caption: '雾林', src: '/gan/images/gallery/g-mist-forest.jpg', alt: '水墨雾林：古松间流雾层层', glyph: '雾', aspect: 'aspect-[4/3]', fallback: '#d4d4d8' },
  { caption: '月夜', src: '/gan/images/gallery/g-moonnight.jpg', alt: '水墨月夜：满月悬于山影之上', glyph: '夜', aspect: 'aspect-[4/3]', fallback: '#a8a29e' },
  { caption: '孤舟', src: '/gan/images/gallery/g-lone-boat.jpg', alt: '水墨孤舟：江面留白处一叶渔舟', glyph: '舟', aspect: 'aspect-[16/9]', fallback: '#e7e5e4' },
  { caption: '竹影', src: '/gan/images/gallery/g-bamboo.jpg', alt: '水墨竹石：劲节修竹墨笔写就', glyph: '竹', aspect: 'aspect-[4/3]', fallback: '#d6d3d1' },
  { caption: '雪岭', src: '/gan/images/gallery/g-snow-ridge.jpg', alt: '水墨雪岭：冬雪覆峰墨线勾崖', glyph: '雪', aspect: 'aspect-[4/3]', fallback: '#e7e5e4' },
  { caption: '檐雨', src: '/gan/images/gallery/g-rain-eaves.jpg', alt: '水墨檐雨：古寺瓦檐滴雨', glyph: '雨', aspect: 'aspect-[4/3]', fallback: '#a8a29e' },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="mx-auto max-w-5xl px-6 pt-20 pb-10 md:pt-28">
        <p className="ink-eyebrow">
          <span className="h-px w-8 bg-border" />
          Gallery · 纸上山水
        </p>
        <h1 className="ink-display mt-6 text-4xl leading-[1.15] text-foreground md:text-6xl">
          图片流
        </h1>
        <p className="mt-4 font-serif text-sm leading-loose text-muted md:text-base">
          纸上山水八帧——墨分五色，纸生云烟。
        </p>
      </header>

      {/* Masonry — 真图瀑布流：懒加载 + 纸灰底色兜底 */}
      <div className="mx-auto max-w-5xl px-6 pb-24">
        <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
          {blocks.map((block, i) => (
            <figure
              key={i}
              className={`group relative overflow-hidden rounded-lg ${block.aspect}`}
              style={{ background: block.fallback }}
            >
              {/* 作品图：lazy 懒加载（首图 eager 保证首屏即时呈现），hover 轻微放大 */}
              <img
                src={block.src}
                alt={block.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              {/* 左上角常驻编号：等宽小字号，融入画面 */}
              <span className="absolute left-3 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.25em] text-white/70 mix-blend-luminosity">
                n-{String(i + 1).padStart(2, '0')}
              </span>
              {/* Large decorative glyph（展示字体压印，真图下降透明度以免喧宾夺主） */}
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[6rem] leading-none opacity-15 transition-transform duration-700 group-hover:scale-105 md:text-[8rem]"
                style={{ color: 'rgba(255,255,255,0.9)' }}
                aria-hidden
              >
                {block.glyph}
              </div>
              {/* Hover caption */}
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 py-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-sm text-white">{block.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
