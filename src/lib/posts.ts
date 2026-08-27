import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

/**
 * 文章数据层 —— 读取 content/posts/*.md
 * 2026-08-27 Claude·视觉重设计「墨境」：
 * - PostMeta 增加 words 真实字数（从 markdown 正文统计），供博客统计展示，
 *   替代此前组件内硬编码的 mock 数据。
 * - 新增 getMonthlyCounts：按真实发布日期统计近 N 月发布量。
 */

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  gradient: string;
  accent: string;
  /** 正文字数（CJK 字符数 + 拉丁词数），构建期统计 */
  words: number;
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

/**
 * 统计中文字数：CJK 字符按字计数，连续拉丁字母/数字按词计数。
 * 仅用于展示量级，不需要精确排版口径。
 */
export function countWords(raw: string): number {
  // 去除 markdown 标记与 frontmatter 已由 gray-matter 剥离
  const text = raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~\-|]/g, ' ');

  const cjk = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) ?? []).length;
  const latin = (text.match(/[A-Za-z0-9]+/g) ?? []).length;
  return cjk + latin;
}

/** Get all post metadata, sorted by date (newest first). */
export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDir).filter(
    (f) => f.endsWith('.md') && !f.startsWith('_')
  );

  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title ?? slug,
      date: formatDate(data.date),
      excerpt: data.excerpt ?? '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      gradient: data.gradient ?? 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
      accent: data.accent ?? '#e2b4bd',
      words: countWords(content),
    } as PostMeta;
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** 汇总全站总字数。 */
export function getTotalWords(posts: PostMeta[]): number {
  return posts.reduce((sum, p) => sum + p.words, 0);
}

/** 按真实发布日期统计最近 months 个自然月的发布量（旧→新排序）。 */
export function getMonthlyCounts(posts: PostMeta[], months = 3): { month: string; count: number }[] {
  // 以最新文章的月份为终点回溯，避免内容暂停时图表出现"未来月份"
  const latest = posts[0]?.date ? new Date(`${posts[0].date}T00:00:00`) : new Date();
  const result: { month: string; count: number }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(latest.getFullYear(), latest.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const count = posts.filter((p) => p.date.startsWith(key)).length;
    result.push({ month: `${d.getMonth() + 1}月`, count });
  }
  return result;
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
    words: countWords(content),
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
  const { data, content } = matter(raw);
  return {
    slug,
    title: (data.title ?? slug) as string,
    date: formatDate(data.date),
    excerpt: (data.excerpt ?? '') as string,
    tags: Array.isArray(data.tags) ? data.tags : [],
    gradient: (data.gradient ?? 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)') as string,
    accent: (data.accent ?? '#e2b4bd') as string,
    words: countWords(content),
  };
}
