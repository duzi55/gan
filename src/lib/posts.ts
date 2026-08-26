import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  gradient: string;
  accent: string;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

const postsDir = path.join(process.cwd(), 'content', 'posts');

/** Format any date value (Date object or string) as YYYY-MM-DD. */
function formatDate(date: unknown): string {
  if (date instanceof Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  if (typeof date === 'string') return date.slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

/** Get all post metadata, sorted by date (newest first). */
export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDir).filter(
    (f) => f.endsWith('.md') && !f.startsWith('_')
  );

  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const { data } = matter(raw);
    return {
      slug,
      title: data.title ?? slug,
      date: formatDate(data.date),
      excerpt: data.excerpt ?? '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      gradient: data.gradient ?? 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
      accent: data.accent ?? '#e2b4bd',
    } as PostMeta;
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Get a single post with rendered HTML content. */
export async function getPost(slug: string): Promise<Post | null> {
  const filePath = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const processed = await remark().use(remarkHtml).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    title: data.title ?? slug,
    date: formatDate(data.date),
    excerpt: data.excerpt ?? '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    gradient: data.gradient ?? 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
    accent: data.accent ?? '#e2b4bd',
    contentHtml,
  };
}

/** Get all slugs for static export. */
export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

/** Synchronous metadata lookup (for generateMetadata). */
export function getPostMeta(slug: string): PostMeta | null {
  const filePath = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(raw);
  return {
    slug,
    title: (data.title ?? slug) as string,
    date: formatDate(data.date),
    excerpt: (data.excerpt ?? '') as string,
    tags: Array.isArray(data.tags) ? data.tags : [],
    gradient: (data.gradient ?? 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)') as string,
    accent: (data.accent ?? '#e2b4bd') as string,
  };
}
