/**
 * 灵感微缩图 Minis —— 组件简略版的纯 CSS 快照
 * 2026-08-28 Claude·性能设计（应用户要求"微缩图不能影响性能"）：
 *   - 每个微缩图是独立静态 JSX：无 hooks、无 'use client'、无图片、无动画循环，
 *     列表页/首页渲染它们不产生任何客户端 JS 与网络请求；
 *   - 结构与配色复刻自 glass/ 下对应完整组件（等比简化），点击卡片进入
 *     详情页后才按需加载真组件本体；
 *   - 仅使用 lg-glass / lg-liquid / lg-noise 三个 CSS 类（liquid-glass.css）。
 * 2026-08-31 Claude·例外（用户裁定，IN-04 治愈画卷起）：图片画廊类灵感的
 *   微缩图直接用原图缩略（本地已入库 webp + lazy/async，零客户端 JS），
 *   不再手写 CSS 微缩组件——「这种灵感的微缩图就用原图」。
 */

import { WALLS } from './wall/wallShared';

/** 01 · 玻璃唱片机微缩图 */
export function MiniPlayer() {
  return (
    <div className="lg-glass w-44 p-3.5" style={{ borderRadius: '1.2rem' }}>
      <div className="flex items-center gap-2.5">
        {/* 唱片：conic 黑胶纹 + 液态渐变标签 */}
        <span
          className="relative h-11 w-11 shrink-0 rounded-full"
          style={{ background: 'conic-gradient(#0d0d16, #2b2b3f 25%, #0d0d16 50%, #23233a 75%, #0d0d16)' }}
          aria-hidden
        >
          <span className="lg-liquid absolute inset-[32%] rounded-full border border-white/30" />
        </span>
        <span className="flex-1 space-y-1.5" aria-hidden>
          <span className="block h-1.5 w-4/5 rounded-full bg-white/70" />
          <span className="block h-1.5 w-1/2 rounded-full bg-white/30" />
        </span>
      </div>
      {/* 进度 + 控制点 */}
      <span className="mt-3 block h-1 rounded-full bg-white/20" aria-hidden>
        <span className="lg-liquid block h-full w-2/5 rounded-full" />
      </span>
      <span className="mt-2.5 flex items-center justify-center gap-3" aria-hidden>
        <i className="h-1 w-1 rounded-full bg-white/40" />
        <i className="h-3 w-3 rounded-full bg-white/90" />
        <i className="h-1 w-1 rounded-full bg-white/40" />
      </span>
    </div>
  );
}

/** 02 · 液态玻璃 Dock 微缩图 */
export function MiniDock() {
  const dots = ['#7dd3fc', '#c4b5fd', '#fda4af', '#fcd34d', '#86efac'];
  return (
    <div className="lg-glass flex items-center gap-2 px-3.5 py-2.5" style={{ borderRadius: '999px' }}>
      <span className="lg-noise" style={{ borderRadius: '999px' }} aria-hidden />
      {dots.map((c, i) => (
        <i
          key={c}
          className="block h-6 w-6 rounded-xl border border-white/20 bg-white/10"
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)', background: `linear-gradient(160deg, ${c}55, rgba(255,255,255,0.08))` }}
          aria-hidden
        >
          {/* 中间的键呈 hover 放大态，复刻 Dock 动势 */}
          {i === 2 && <span className="mx-auto mt-1 block h-1 w-1 rounded-full bg-white/90" />}
        </i>
      ))}
    </div>
  );
}

/** 03 · 玻璃通知卡微缩图 */
export function MiniNotification() {
  return (
    <div className="lg-glass w-48 p-3" style={{ borderRadius: '1.2rem' }}>
      <div className="flex gap-2.5">
        <span className="lg-liquid h-8 w-8 shrink-0 rounded-xl" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)' }} aria-hidden />
        <span className="flex-1 space-y-1.5 pt-0.5" aria-hidden>
          <span className="block h-1.5 w-3/4 rounded-full bg-white/75" />
          <span className="block h-1.5 w-full rounded-full bg-white/25" />
          <span className="block h-1.5 w-2/3 rounded-full bg-white/25" />
        </span>
      </div>
    </div>
  );
}

/** 04 · 玻璃音量滑块微缩图 */
export function MiniSlider() {
  return (
    <div className="lg-glass w-44 px-4 py-3.5" style={{ borderRadius: '1.2rem' }}>
      <span className="mb-2.5 block h-1.5 w-8 rounded-full bg-white/40" aria-hidden />
      <span className="relative block h-2 rounded-full border border-white/15 bg-white/10" aria-hidden>
        <span className="lg-liquid absolute inset-y-0 left-0 w-3/5 rounded-full" />
        {/* 玻璃拇指 */}
        <span
          className="absolute left-[58%] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-white/80"
          style={{ background: 'linear-gradient(160deg, #ffffff, #dcd8f8)', boxShadow: '0 3px 8px rgba(0,0,0,0.35)' }}
        />
      </span>
    </div>
  );
}

/** 05 · 玻璃开关微缩图（开启态） */
export function MiniToggle() {
  return (
    <div className="lg-glass flex items-center gap-3 px-4 py-3" style={{ borderRadius: '1.2rem' }}>
      <span className="flex-1 space-y-1.5" aria-hidden>
        <span className="block h-1.5 w-12 rounded-full bg-white/75" />
        <span className="block h-1 w-8 rounded-full bg-white/30" />
      </span>
      {/* 开关：液态渐变轨道 + 玻璃 knob */}
      <span
        className="relative block h-6 w-11 shrink-0 rounded-full border border-white/20"
        style={{ background: 'linear-gradient(135deg, #67e8f9, #c4b5fd 55%, #fda4af)' }}
        aria-hidden
      >
        <span
          className="absolute right-0.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-white/80"
          style={{ background: 'linear-gradient(160deg, #ffffff, #e2e0f5)', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
        />
      </span>
    </div>
  );
}

/** 06 · 玻璃天气卡微缩图（⑥ 编辑式超大数字） */
export function MiniWeather() {
  return (
    <div className="lg-glass w-44 p-3.5" style={{ borderRadius: '1.2rem' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl font-extralight leading-none text-white" aria-hidden>
            26<span className="align-top text-xs text-white/70">°</span>
          </p>
          <span className="mt-1.5 block h-1 w-14 rounded-full bg-white/30" aria-hidden />
        </div>
        <span className="relative mt-0.5 block h-7 w-7" aria-hidden>
          <span className="lg-liquid absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)' }} />
        </span>
      </div>
      <span className="mt-2.5 flex justify-between border-t border-white/10 pt-2" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <i key={i} className="h-1 w-4 rounded-full bg-white/25" />
        ))}
      </span>
    </div>
  );
}

/**
 * 07 · 柔性账单微缩图（IN-02，粉彩浅色系快照）
 * 2026-08-31 Claude·新增：复刻自 invoice/InvoiceDashboard（等比简化）——
 *   白卡快照：Account + 超大极细金额 + 三胶囊（绿/黄/白）+ 分段进度 +
 *   紫色 Activity 小卡；零 hooks、零图片、零动画循环（性能铁律），
 *   与其余微缩图一样只用静态 JSX + 内联色值。
 */
export function MiniInvoice() {
  return (
    <div
      className="w-44 rounded-2xl bg-white/85 p-3 text-zinc-800 shadow-xl"
      style={{ fontFamily: '-apple-system, "Segoe UI", Roboto, sans-serif' }}
      aria-hidden
    >
      {/* Account + 金额海报 */}
      <p className="text-[7px] font-medium uppercase tracking-[0.18em] text-zinc-400">Account · Ohana Inc.</p>
      <p className="mt-0.5 text-xl font-extralight leading-none tracking-tight">$68,575.00</p>

      {/* 三胶囊：Paid / Credits / Balance */}
      <div className="mt-2 flex gap-1">
        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-300/30 px-1.5 py-0.5 text-[6px] font-medium">
          <i className="h-1 w-1 rounded-full bg-emerald-400" /> Paid
        </span>
        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-300/30 px-1.5 py-0.5 text-[6px] font-medium">
          <i className="h-1 w-1 rounded-full bg-amber-400" /> Credits
        </span>
        <span className="rounded-full bg-white px-1.5 py-0.5 text-[6px] font-medium shadow-sm">Balance</span>
      </div>

      {/* 分段进度条（绿 / 黄 / 白 三段） */}
      <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-white/80">
        <span className="h-full w-[34%] bg-emerald-400" />
        <span className="h-full w-[14%] bg-amber-400" />
        <span className="h-full flex-1 bg-white" />
      </div>

      {/* 底部行：标签页点阵 + 紫色 Activity 小卡 */}
      <div className="mt-2.5 flex items-end gap-1">
        <span className="h-1.5 w-6 rounded-t-md bg-zinc-800" />
        <span className="h-1.5 w-4 rounded-t-md bg-zinc-200" />
        <span className="h-1.5 w-4 rounded-t-md bg-zinc-200" />
        <span className="ml-auto inline-flex items-center gap-0.5 rounded-lg px-1.5 py-0.5 text-[6px] font-medium text-white" style={{ background: 'linear-gradient(140deg,#8b7cf6,#a78bfa)' }}>
          <i className="h-1 w-1 rounded-full bg-white/70" /> 12 Activities
        </span>
      </div>
    </div>
  );
}

/**
 * 09 · 治愈画卷微缩图（IN-04，原图缩略）
 * 2026-08-31 Claude·用户裁定：图片画廊类灵感微缩图直接用原图，不手写
 *   CSS 微缩组件——取 wallShared.WALLS 首图（林间溪瀑，本地已入库 webp，
 *   路径含 NEXT_PUBLIC_BASE_PATH 前缀 dev / 生产双端正确），
 *   object-cover 裁切进缩略窗；仍是静态 JSX：零 hooks、零客户端 JS，
 *   lazy + async 解码不影响列表页性能。
 */
export function MiniWall() {
  return (
    <div
      className="relative w-44 overflow-hidden rounded-xl border border-emerald-950/20 shadow-xl"
      aria-hidden
    >
      <img
        src={WALLS[0].src}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className="h-24 w-full select-none object-cover"
      />
    </div>
  );
}

/**
 * 10 · 在意苹果微缩图（IN-05，晴空果园快照）
 * 2026-09-03 Kimi·新增：复刻自 orchard/OrchardScene（等比简化）——
 *   蓝天三段渐变 + 一朵白云 + 阳光角斑 + 枝头三颗红苹果与叶点；
 *   零 hooks、零图片、零动画循环（性能铁律），静态 JSX + 内联色值自包含。
 * 2026-09-03 Kimi·替换：原 MiniCats（双子猫）随猫灵感下线一并移除。
 */
export function MiniOrchard() {
  return (
    <div
      className="relative w-44 overflow-hidden rounded-xl border border-sky-200/70 shadow-xl"
      style={{ background: 'linear-gradient(180deg, #2f7fd0 0%, #6bb8ee 55%, #cdeeff 100%)' }}
      aria-hidden
    >
      <div className="relative h-24">
        {/* 阳光角斑（右上暖光） */}
        <span
          className="absolute -right-3 -top-4 block h-12 w-12 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,251,232,0.95), rgba(255,251,232,0) 70%)' }}
        />
        {/* 白云（两团相叠） */}
        <span className="absolute left-6 top-3 block h-3.5 w-10 rounded-full bg-white/90" />
        <span className="absolute left-10 top-2 block h-3 w-6 rounded-full bg-white/95" />
        {/* 果枝（左上斜下） */}
        <span className="absolute left-2 top-7 block h-[3px] w-24 origin-left rotate-[16px] rounded-full" style={{ background: '#5d4037', transform: 'rotate(14deg)' }} />
        {/* 叶点（两绿错落） */}
        <span className="absolute left-4 top-6 block h-3 w-2 rotate-[-24deg] rounded-[50%]" style={{ background: '#3f9b4f' }} />
        <span className="absolute left-16 top-8 block h-3.5 w-2 rotate-[30deg] rounded-[50%]" style={{ background: '#57a94a' }} />
        <span className="absolute left-24 top-7 block h-3 w-2 rotate-[-12deg] rounded-[50%]" style={{ background: '#2e7d32' }} />
        {/* 三颗红苹果（带高光点） */}
        <span className="absolute left-8 top-10 block h-4 w-4 rounded-full shadow-sm" style={{ background: 'radial-gradient(circle at 35% 30%, #ff8a66, #d53a2a 60%, #9c1f16)' }} />
        <span className="absolute left-[52px] top-12 block h-[18px] w-[18px] rounded-full shadow-sm" style={{ background: 'radial-gradient(circle at 35% 30%, #ff8a66, #d53a2a 60%, #9c1f16)' }} />
        <span className="absolute left-[88px] top-10 block h-3.5 w-3.5 rounded-full shadow-sm" style={{ background: 'radial-gradient(circle at 35% 30%, #ff8a66, #d53a2a 60%, #9c1f16)' }} />
      </div>
    </div>
  );
}

/**
 * 08 · 复古电视微缩图（IN-03，复古 CRT 快照）
 * 2026-08-31 Claude·新增：复刻自 crt/CRTPlayer（等比简化）——
 *   奶油机身迷你电视：双天线 + 深棕框屏幕（日落画面用纯 CSS 渐变示意，
 *   零图片）+ 扫描线 + 荧光绿 OSD「CH 01」+ 底部四色卡带排；
 *   零 hooks、零图片、零动画循环（性能铁律），静态 JSX + 内联色值自包含。
 */
export function MiniCrt() {
  return (
    <div
      className="w-44 rounded-xl p-2.5 shadow-xl"
      style={{
        fontFamily: '-apple-system, "Segoe UI", Roboto, sans-serif',
        background: 'linear-gradient(165deg, #f7f0df, #e0cfae)',
        border: '1.5px solid #b49a72',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,.75), 0 18px 30px -14px rgba(40,30,15,.55)',
      }}
      aria-hidden
    >
      {/* 双天线 + 顶端圆球 */}
      <div className="relative h-3">
        <i className="absolute bottom-0 left-1/2 h-3.5 w-[1.5px] origin-bottom -rotate-[24deg] rounded-full bg-[#8f8f94]" />
        <i className="absolute bottom-0 left-1/2 h-3.5 w-[1.5px] origin-bottom rotate-[24deg] rounded-full bg-[#8f8f94]" />
      </div>

      {/* 屏幕（深棕框 + 日落画面渐变 + 扫描线 + OSD） */}
      <div className="rounded-lg p-1.5" style={{ background: 'linear-gradient(170deg, #4a3b2c, #332718)' }}>
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-md"
          style={{ background: 'linear-gradient(180deg, #f7b06a 0%, #e8834f 55%, #7c4a63 100%)' }}
        >
          {/* 扫描线（repeating-linear-gradient，纯 CSS） */}
          <span
            className="absolute inset-0"
            style={{ background: 'repeating-linear-gradient(180deg, rgba(0,0,0,.22) 0 1px, transparent 1px 3px)' }}
          />
          {/* 荧光绿 OSD 频道号 */}
          <span
            className="absolute bottom-1 left-1.5 text-[7px] font-bold tracking-[0.12em]"
            style={{ fontFamily: 'ui-monospace, Consolas, monospace', color: '#8dffb0', textShadow: '0 0 5px rgba(80,255,140,.55)' }}
          >
            CH 01
          </span>
        </div>
      </div>

      {/* 下面板：品牌标 + 迷你卡带排（四色块） */}
      <div className="mt-1.5 flex items-center gap-1.5 px-0.5">
        <span className="text-[5px] font-semibold uppercase tracking-[0.2em] text-[#7a6446]">OHANA·VISION</span>
        <span className="ml-auto flex gap-1" aria-hidden>
          <i className="h-3 w-3 rounded-[2px] bg-[#c96f4a]" />
          <i className="h-3 w-3 rounded-[2px] bg-[#3f6f8e]" />
          <i className="h-3 w-3 rounded-[2px] bg-[#5c7a4e]" />
          <i className="h-3 w-3 rounded-[2px] bg-[#7b6394]" />
        </span>
      </div>
    </div>
  );
}

/**
 * 11 · 扇形作品集微缩图（IN-06，文件夹轮播快照）
 * 2026-09-04 Kimi·新增：PortfolioCarousel3D 恢复上架（原 ui-components 首版
 *   组件，2026-08-26 重构下线，用户裁定找回注册为灵感）——按用户裁定
 *   「图片画廊类灵感的微缩图就用原图」（IN-04 起），直接取作品集原卡
 *   （中央天蓝卡）缩略，双卡错位叠放示意扇形展开；lazy/async，零客户端 JS。
 */
export function MiniCarousel() {
  const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return (
    <div
      className="relative w-44 overflow-hidden rounded-xl border border-slate-200/70 shadow-xl"
      style={{ background: 'linear-gradient(160deg, #eef4ff, #e9edfb)' }}
      aria-hidden
    >
      <div className="relative h-24">
        {/* 后卡（酸橙绿海报，左倾露出） */}
        <img
          src={`${BASE}/portfolio-cards/A_bright_lime_green_graphic_de_2026-08-24T00-39-37.png`}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute left-4 top-2.5 h-[84px] w-[64px] select-none rounded-lg object-cover shadow-md"
          style={{ transform: 'rotate(-10deg)' }}
        />
        {/* 前卡（天蓝人物卡，右倾压叠） */}
        <img
          src={`${BASE}/portfolio-cards/A_sky_blue_gradient_card_with__2026-08-24T00-39-48.png`}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute left-[68px] top-1.5 h-[88px] w-[66px] select-none rounded-lg object-cover shadow-lg"
          style={{ transform: 'rotate(6deg)' }}
        />
      </div>
    </div>
  );
}

/**
 * 12 · 人群登录微缩图（IN-07，hilos 登录页快照）
 * 2026-09-08 Claude·新增：复刻自 hilos/CrowdLogin（等比简化）——
 *   黑白手绘人群（四排错位小圆头 + 豆豆眼）叠肩铺满，中央白色圆角登录卡
 *   （圆 logo / 灰线 / 黑主按钮 / 浅灰第三方钮）；零 hooks、零图片、
 *   零动画循环（性能铁律），静态 JSX + Tailwind 自包含。
 */
export function MiniCrowd() {
  /* 一排 8 颗小动物头（白圆 + 粗黑边 + 豆豆眼，重复调用铺四排） */
  const row = (pos: string) => (
    <div className={`absolute flex gap-1 ${pos}`} aria-hidden>
      {Array.from({ length: 8 }, (_, i) => (
        <i
          key={i}
          className="flex h-6 w-6 items-start justify-center gap-[3px] rounded-full border-2 border-neutral-800 bg-white pt-[7px]"
        >
          <b className="h-[3px] w-[3px] rounded-full bg-neutral-800" />
          <b className="h-[3px] w-[3px] rounded-full bg-neutral-800" />
        </i>
      ))}
    </div>
  );
  return (
    <div
      className="relative h-[7.5rem] w-44 overflow-hidden rounded-xl border border-neutral-200/80 bg-[#fafaf9] shadow-xl"
      aria-hidden
    >
      {/* 人群：四排错位铺满（第二/四排右错半格，复刻叠肩感） */}
      {row('-left-2 top-0.5')}
      {row('left-3 top-[26px]')}
      {row('-left-2 top-[52px]')}
      {row('left-3 top-[78px]')}

      {/* 登录卡（白圆角 + 黑主按钮，1:1 等比简化） */}
      <div className="absolute left-1/2 top-1/2 z-10 w-[92px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-neutral-100 bg-white p-2 shadow-[0_10px_24px_-8px_rgba(15,15,20,0.3)]">
        <i className="mx-auto block h-3 w-3 rounded-full border-2 border-neutral-800 bg-white" />
        <i className="mx-auto mt-1 block h-1 w-8 rounded-full bg-neutral-300" />
        <i className="mt-1.5 block h-1.5 w-full rounded-sm bg-neutral-100 ring-1 ring-neutral-200" />
        <i className="mt-1 block h-2.5 w-full rounded-md bg-neutral-900" />
        <i className="mt-1 block h-2 w-full rounded-md bg-neutral-100" />
      </div>
    </div>
  );
}
