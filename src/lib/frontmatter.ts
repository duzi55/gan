/**
 * 客户端安全的 frontmatter 解析/序列化
 * 2026-08-27 Claude·静态博客在线后台：posts.ts 数据层使用 gray-matter
 * （依赖 Node fs），无法在浏览器运行；此处按同一套字段约定手写实现，
 * 供 /admin 后台编辑文章时解析与回写 content/posts/*.md。
 *
 * 字段约定与 src/lib/posts.ts 保持一致：
 *   title / date(YYYY-MM-DD) / excerpt / tags(字符串数组) / gradient / accent
 */

/** 一篇文章的元信息（不含正文字数 words——那是构建期统计的展示数据） */
export interface AdminPostMeta {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  gradient: string;
  accent: string;
}

/** 与 posts.ts 的默认封面渐变保持一致 */
export const DEFAULT_GRADIENT = 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)';
/** 与 posts.ts 的默认强调色保持一致 */
export const DEFAULT_ACCENT = '#e2b4bd';

/** 解析失败的兜底空对象 */
const EMPTY_META: AdminPostMeta = {
  title: '',
  date: new Date().toISOString().slice(0, 10),
  excerpt: '',
  tags: [],
  gradient: DEFAULT_GRADIENT,
  accent: DEFAULT_ACCENT,
};

/**
 * 解析 markdown 文本 → { meta, body }
 * @param raw 完整 md 文本（以 --- 开头的 frontmatter + 正文）
 * @returns meta 元信息对象，body 为正文（markdown 源码）
 */
export function parseFrontmatter(raw: string): { meta: AdminPostMeta; body: string } {
  // 必须以 --- 行开头才是合法 frontmatter，否则整篇当正文
  if (!raw.startsWith('---')) {
    return { meta: { ...EMPTY_META }, body: raw };
  }

  const endIdx = findClosingDelimiter(raw);
  if (endIdx === -1) {
    return { meta: { ...EMPTY_META }, body: raw };
  }

  const headerBlock = raw.slice(4, endIdx); // 跳过开头的 "---\n"
  const body = raw.slice(raw.indexOf('\n', endIdx) + 1);

  const meta: AdminPostMeta = {
    title: '', date: '', excerpt: '',
    tags: [], gradient: DEFAULT_GRADIENT, accent: DEFAULT_ACCENT,
  };

  let inTags = false; // 当前是否处于 tags 多行列表内部
  for (const lineRaw of headerBlock.split('\n')) {
    const line = lineRaw.trim();
    if (!line || line.startsWith('#')) continue; // 跳过空行与注释（模板里有 # 开头的说明）

    // tags 列表项："  - 标签1"
    if (inTags) {
      const item = line.match(/^-\s+(.+)$/);
      if (item) {
        meta.tags.push(unquote(item[1].trim()));
        continue;
      }
      inTags = false; // 列表结束，回到普通键值模式
    }

    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, valueRaw] = kv;
    const value = unquote(valueRaw.trim());

    switch (key) {
      case 'title': meta.title = value; break;
      case 'date': meta.date = value.slice(0, 10); break;
      case 'excerpt': meta.excerpt = value; break;
      case 'gradient': if (value) meta.gradient = value; break;
      case 'accent': if (value) meta.accent = value; break;
      case 'tags':
        // 行内数组写法 tags: [a, b] 或多行列表的开头
        if (value.startsWith('[')) {
          meta.tags = value.replace(/^\[|\]$/g, '').split(',').map(s => unquote(s.trim())).filter(Boolean);
        } else if (!value) {
          inTags = true;
        }
        break;
    }
  }

  return { meta, body };
}

/**
 * 找到 frontmatter 结束分隔线（单独一行 ---）的位置索引。
 * 只找文件开头块内的第一处，正文里的 --- 不受影响。
 */
function findClosingDelimiter(raw: string): number {
  return raw.indexOf('\n---');
}

/**
 * 序列化 → 完整 md 文本（frontmatter + 正文）
 * 与 _template.md 的书写格式保持一致，保证后台保存的文章
 * 在构建期被 posts.ts / gray-matter 正确解析。
 */
export function serializeFrontmatter(meta: AdminPostMeta, body: string): string {
  const lines = [
    '---',
    `title: ${meta.title}`,
    `date: ${meta.date}`,
    `excerpt: ${meta.excerpt}`,
  ];
  if (meta.tags.length > 0) {
    lines.push('tags:');
    for (const t of meta.tags) lines.push(`  - ${t}`);
  }
  lines.push(`gradient: ${meta.gradient}`);
  lines.push(`accent: '${meta.accent}'`);
  lines.push('---', '');
  return lines.join('\n') + body;
}

/** 去除 YAML 风格包裹引号 */
function unquote(s: string): string {
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    return s.slice(1, -1);
  }
  return s;
}
