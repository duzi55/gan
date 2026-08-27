/**
 * sync-docs.mjs —— 将 out/ 构建产物镜像同步到 docs/ 目录
 *
 * 2026-08-27 Claude·视觉重设计「墨境」新增。
 * 背景：本仓库发布方式为「Pages 从 main 分支 /docs 目录读取」（非 GitHub Actions），
 *      此前该步骤为手动复制，此处固化为跨平台 node 脚本并挂入 postbuild 链：
 *        npm run build  →  flatten-rsc.mjs（拍平 RSC payload）
 *                       →  sync-docs.mjs（out/* 镜像到 docs/，并保证 .nojekyll 存在）
 *
 * 行为：全量覆盖式同步——先清空 docs/ 再整树复制 out/，
 *      避免「改稿后旧页面残留于仓库」的经典问题；
 *      最后写入空 .nojekyll，防止 Pages 的 Jekyll 忽略 `_next` 资源目录。
 */
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, 'out');
const destDir = path.join(projectRoot, 'docs');

/** 递归删除目录或文件（不存在则静默跳过） */
function removeRecursively(target) {
  if (!fs.existsSync(target)) return;
  fs.rmSync(target, { recursive: true, force: true });
}

/** 递归复制目录树 */
function copyRecursively(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    // 2026-08-27 Claude·跳过百分号编码副本：
    //   tags/[tag] 的 generateStaticParams 为修复 dev 预览会额外产出
    //   %E8%AE%BE… 这类编码目录，它们只服务本地匹配；
    //   GitHub Pages 按解码后的中文目录名查找文件，同步时必须剔除，
    //   保证仓库与线上只有「设计/摄影/…」正名目录。
    if (/%[0-9A-Fa-f]{2}/.test(entry.name)) {
      console.log(`[sync-docs] 跳过编码副本：${entry.name}`);
      continue;
    }
    const srcPath = path.join(from, entry.name);
    const destPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyRecursively(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (!fs.existsSync(srcDir)) {
  console.error('[sync-docs] 未找到 out/ 目录——请先执行 next build。');
  process.exit(1);
}

removeRecursively(destDir);
copyRecursively(srcDir, destDir);

// Jekyll 开关：无论 out 里是否有该文件，docs/ 中必须存在
fs.writeFileSync(path.join(destDir, '.nojekyll'), '');

console.log(`[sync-docs] 已将 out/ 全量同步至 docs/，并补写 .nojekyll。`);
