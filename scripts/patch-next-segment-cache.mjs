// 2026-08-28 Claude·Next.js 16.3.1 segment cache 零值哨兵补丁脚本（幂等）
//
// 功能说明：
//   修复线上（GitHub Pages 静态导出）segment cache 预取的致命缺陷，其因果链如下：
//     1) 构建端 collect-segment-data.js 将「无 shell 阶段」编码为信封 a 字段的哨兵值 0
//        （源码注释原文：each response's `a` falls out as the no-shell sentinel, 0），
//        静态导出产物 __PAGE__.txt 中体现为 `"a":"$@19"` 且行 19 值为 `19:0`；
//     2) 消费端 fetch-server-response.js 的 resolveShellStageData 仅识别 null，
//       哨兵 0 被误当作有效字节边界 → decodeStageUntilBoundary(clone, 0) 对
//       0 字节 buffer 构建、立即关闭的空 ReadableStream 做退化解码；
//     3) cache.js 的 readFulfilledStaleAt 对退化响应中非可迭代的 staleTime 直接调用
//       staleTime[Symbol.asyncIterator]() → 线上报错
//       "TypeError: t[Symbol.asyncIterator] is not a function"（eS 调用栈）；
//     4) 该异常发生在预取任务执行器的 try/catch 之外 → 整条预取 Promise rejection，
//       缓存条目永久停留 Pending → 首页点击文章无法跳转（导航挂死）。
//   上游 next 16.3.3 与 canary 均未修复（守卫仍只判 null），故本地以字符串替换打补丁：
//     守卫一 resolveShellStageData：哨兵 0（及任何非正数）与 null 同样视为「无 shell 阶段」，
//            交由调用方复用完整响应——完整解码路径已实证安全（staleTime 行先于信封初始化）；
//     守卫二 readFulfilledStaleAt：非可迭代 staleTime 纵深防御，回退静态 staleTime
//            （与上游「值缺席回退 STATIC_STALETIME_MS」语义一致）。
//
// 运行时机：package.json 的 postinstall（npm install 后）与 prebuild（构建前）自动执行，
//           保证 dev 与生产打包均带补丁。
//
// 注意：升级 next 版本后若目标代码变更导致匹配失败，本脚本会带明确信息报错退出，
//       此时应重查上游是否已修复该缺陷，再决定移除或适配本补丁。

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// 补丁标记：文件内含此串视为已打补丁，保证脚本幂等可重复执行
const MARK = 'PATCH-INKFIELD-SEGMENT-CACHE'

// 守卫一：resolveShellStageData 防零值哨兵（CJS 与 ESM 编译产物代码一致）
const shellGuardOld = `    const shellByteLength = await flightResponse.a;
    if (shellByteLength === null) {
        // Shell == main response — caller reuses the existing flightResponse.
        shellBodyClone.cancel();
        return null;
    }`
const shellGuardNew = `    const shellByteLength = await flightResponse.a;
    /* ${MARK} 2026-08-28 Claude·构建端以 0 作为「无 shell 阶段」哨兵写入信封 a 字段，
       原判断仅识别 null，哨兵 0 被误当作字节边界，0 字节空流退化解码后
       readFulfilledStaleAt 调用 t[Symbol.asyncIterator] 抛错，预取任务永久失败、
       点击导航挂死。此处将哨兵 0（及任何非正数）与 null 同样视为「无 shell 阶段」。 */
    if (shellByteLength === null || shellByteLength <= 0) {
        // Shell == main response — caller reuses the existing flightResponse.
        shellBodyClone.cancel();
        return null;
    }`

// 守卫二：readFulfilledStaleAt 防非可迭代 staleTime（CJS 与 ESM 仅 STATIC_STALETIME_MS 引用前缀不同）
const staleTimeGuardOld = (staleTimeRef) => `function readFulfilledStaleAt(now, staleTime) {
    if (staleTime === undefined) {
        return now + ${staleTimeRef};
    }`
const staleTimeGuardNew = (staleTimeRef) => `function readFulfilledStaleAt(now, staleTime) {
    /* ${MARK} 2026-08-28 Claude·纵深防御：退化 shell 解码可能产生非可迭代的 staleTime，
       直接调用 Symbol.asyncIterator 会抛 TypeError 使预取任务永久失败；
       非可迭代时回退静态 staleTime，与上游「值缺席回退」语义一致。 */
    if (staleTime === undefined || typeof (staleTime == null ? undefined : staleTime[Symbol.asyncIterator]) !== 'function') {
        return now + ${staleTimeRef};
    }`

const PATCHES = [
  {
    file: 'node_modules/next/dist/client/components/router-reducer/fetch-server-response.js',
    old: shellGuardOld,
    new: shellGuardNew,
  },
  {
    file: 'node_modules/next/dist/esm/client/components/router-reducer/fetch-server-response.js',
    old: shellGuardOld,
    new: shellGuardNew,
  },
  {
    file: 'node_modules/next/dist/client/components/segment-cache/cache.js',
    old: staleTimeGuardOld('_navigatereducer.STATIC_STALETIME_MS'),
    new: staleTimeGuardNew('_navigatereducer.STATIC_STALETIME_MS'),
  },
  {
    file: 'node_modules/next/dist/esm/client/components/segment-cache/cache.js',
    old: staleTimeGuardOld('STATIC_STALETIME_MS'),
    new: staleTimeGuardNew('STATIC_STALETIME_MS'),
  },
]

let patched = 0
let skipped = 0

for (const patch of PATCHES) {
  const absPath = path.join(rootDir, patch.file)
  if (!existsSync(absPath)) {
    throw new Error(`[patch-next-segment-cache] 目标文件不存在：${patch.file}（next 是否已安装？）`)
  }
  const source = readFileSync(absPath, 'utf8')
  if (source.includes(MARK)) {
    console.log(`[patch-next-segment-cache] 已打补丁，跳过：${patch.file}`)
    skipped += 1
    continue
  }
  // 旧代码必须恰好命中一次：0 次说明上游已变更（需重评补丁），多次说明匹配串不够精确
  const occurrences = source.split(patch.old).length - 1
  if (occurrences !== 1) {
    throw new Error(
      `[patch-next-segment-cache] 目标代码命中 ${occurrences} 次（期望 1 次）：${patch.file}\n` +
        '上游代码已变更，请重新评估本补丁是否仍需要或需要适配。'
    )
  }
  writeFileSync(absPath, source.replace(patch.old, patch.new))
  console.log(`[patch-next-segment-cache] 补丁完成：${patch.file}`)
  patched += 1
}

console.log(`[patch-next-segment-cache] 完成：新打 ${patched} 处，已存在跳过 ${skipped} 处`)
