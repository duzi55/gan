/**
 * 标签配置 — 全站共享
 * 为每个标签赋予一个字符级图标与显示名，形成统一的视觉语言。
 */
export const TAG_CONFIG: Record<string, { icon: string; label: string }> = {
  '设计': { icon: '◇', label: '设计' },
  '字体': { icon: 'Aa', label: '字体' },
  '排版': { icon: '☰', label: '排版' },
  '茶': { icon: '◉', label: '茶' },
  '随笔': { icon: '✎', label: '随笔' },
  '生活': { icon: '◐', label: '生活' },
  '城市': { icon: '▦', label: '城市' },
  '摄影': { icon: '▣', label: '摄影' },
  '写作': { icon: '✦', label: '写作' },
  '极简': { icon: '○', label: '极简' },
};

/** 取标签配置，未配置的标签回退到圆点图标。 */
export function tagConfig(tag: string): { icon: string; label: string } {
  return TAG_CONFIG[tag] || { icon: '·', label: tag };
}

/** 从文章集合中提取全部标签（保持出现顺序）。 */
export function collectTags(posts: { tags: string[] }[]): string[] {
  return [...new Set(posts.flatMap((p) => p.tags))];
}
