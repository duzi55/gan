# 写作指南

## 快速开始

### 方式一：用脚本创建

```bash
npm run new-post "我的新文章"
```

会自动在 `content/posts/` 下创建一个带 frontmatter 的 markdown 文件。

### 方式二：手动创建

在 `content/posts/` 目录下新建一个 `.md` 文件，参考 `_template.md` 模板。

## Frontmatter 字段

```yaml
---
title: 文章标题（必填）
date: 2025-08-26（必填，YYYY-MM-DD 格式）
excerpt: 一句话摘要，显示在首页列表（必填）
tags:        # 标签列表
  - 设计
  - 随笔
gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)
accent: '#e2b4bd'  # 装饰强调色
---
```

## 渐变配色参考

| 气质 | gradient |
|---|---|
| 深夜蓝 | `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)` |
| 浅灰极简 | `linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 50%, #c7c7c7 100%)` |
| 暖茶褐 | `linear-gradient(135deg, #2c1810 0%, #5c3a1e 50%, #8b6914 100%)` |
| 暗紫夜 | `linear-gradient(135deg, #0c0c1d 0%, #1a0a2e 40%, #3a1a3e 100%)` |
| 深石灰 | `linear-gradient(135deg, #1c1917 0%, #44403c 50%, #78716c 100%)` |
| 湖蓝 | `linear-gradient(135deg, #0d1117 0%, #1a3040 40%, #2d5e7e 100%)` |
| 暖黄昏 | `linear-gradient(180deg, #7c2d12 0%, #c2410c 30%, #f97316 50%, #fbbf24 70%, #fef3c7 100%)` |
| 晨绿 | `linear-gradient(180deg, #365314 0%, #4d7c0f 30%, #84cc16 60%, #d9f99d 100%)` |

## Markdown 语法

```markdown
## 二级标题
### 三级标题

正文段落。

- 无序列表项
- 无序列表项

> 引用文本

**加粗** 和 *斜体*
```

## 发布流程

```bash
# 1. 写文章（在 content/posts/ 下创建或编辑 .md 文件）
# 2. 构建静态站点
npm run build

# 3. 复制到 docs/ 目录
# Windows:
robocopy out docs /E /NFL /NDL
# macOS/Linux:
cp -r out/* docs/

# 4. 提交推送
git add -A
git commit -m "new post: 文章标题"
git push origin main
```

GitHub Pages 会自动更新。

## 文件命名

- 用英文或拼音作为文件名（如 `night-walks.md`）
- 文件名即为 URL slug（如 `night-walks.md` → `/posts/night-walks/`）
- 不要以 `_` 开头（`_` 开头的文件会被忽略，如 `_template.md`）

## 注意事项

- 文章按 `date` 倒序排列在首页
- `gradient` 和 `accent` 是可选的，有默认值
- `tags` 是可选的
- 构建时会跳过 TypeScript 检查（`typescript.ignoreBuildErrors: true`）
