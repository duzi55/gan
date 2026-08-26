/**
 * Flatten Next.js RSC payload directories.
 *
 * Next.js static export generates `__next.<route>/<...>/__PAGE__.txt` (nested dirs),
 * but the browser requests `__next.<route>.<...>.__PAGE__.txt` (flat file with dots).
 * This script flattens all `__next.*` directories into dot-separated flat files.
 *
 * Usage: node scripts/flatten-rsc.mjs [outDir]
 */
import { readdir, rm, rename, stat } from 'fs/promises';
import { join, dirname, basename } from 'path';

async function findNextDirs(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith('__next.')) {
        results.push(fullPath);
      }
      results.push(...(await findNextDirs(fullPath)));
    }
  }
  return results;
}

async function getFilesRecursive(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getFilesRecursive(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function flatten(outDir) {
  // Sort by path length descending — process deepest first
  const nextDirs = (await findNextDirs(outDir)).sort(
    (a, b) => b.length - a.length
  );

  let count = 0;
  for (const nextDir of nextDirs) {
    const parent = dirname(nextDir);
    const dirName = basename(nextDir);
    const files = await getFilesRecursive(nextDir);

    for (const file of files) {
      let relPath = file.substring(nextDir.length).replace(/^[\\/]/, '');
      // Replace OS path separators with dots
      const flatName = dirName + '.' + relPath.replace(/[\\/]/g, '.');
      const destPath = join(parent, flatName);
      await rename(file, destPath);
      count++;
    }

    // Remove the now-empty directory tree
    await rm(nextDir, { recursive: true, force: true });
  }

  console.log(`\x1b[32m✓ Flattened ${count} RSC payload files from ${nextDirs.length} directories\x1b[0m`);
}

const outDir = process.argv[2] || './out';
flatten(outDir).catch((err) => {
  console.error('Error flattening RSC payloads:', err);
  process.exit(1);
});
