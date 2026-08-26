#!/usr/bin/env node
// scripts/new-post.js — 创建新文章
const fs = require('fs');
const path = require('path');

const title = process.argv[2] || '新文章';
const slug = title
  .toLowerCase()
  .replace(/[^\w\u4e00-\u9fff]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'new-post';

const date = new Date().toISOString().slice(0, 10);
const filePath = path.join(process.cwd(), 'content', 'posts', `${slug}.md`);

if (fs.existsSync(filePath)) {
  console.error(`已存在: ${filePath}`);
  process.exit(1);
}

const content = `---
title: ${title}
date: ${date}
excerpt: 在这里写一句话摘要。
tags:
  - 标签1
  - 标签2
gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)
accent: '#e2b4bd'
---

## 在这里开始写正文

Markdown 语法支持标题、列表、引用、加粗等。

### 二级标题

正文段落直接写。

- 列表项一
- 列表项二

> 引用文本用 > 开头。
`;

fs.mkdirSync(path.dirname(filePath), { recursive: true });
fs.writeFileSync(filePath, content, 'utf-8');
console.log(`已创建: ${filePath}`);
