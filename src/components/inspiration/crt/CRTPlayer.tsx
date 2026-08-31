'use client';

/**
 * CRTPlayer —— IN-03「复古电视」原型 · 复古 CRT 电视卡带播放器整版复刻
 * 2026-08-31 Claude·新增并交互升级（用户提供小红书笔记；反馈：原片卡带
 *   可拖放插入电视，须还原拖放互动，且补齐此前缺失的卡带架 JSX）：
 *   - 布局：便携 CRT 电视居中（拉杆天线 / 凸面屏 / 深棕面板 / 旋钮 + 喇叭格栅 /
 *     进带窗 / 品牌标），下方 VHS 卡带架一排四张；
 *   - 拖放插带（对照原文「卡带拖到电视 → 插入 → 屏幕闪雪花 → 播放」）：
 *     卡带 HTML5 Drag & Drop——拖到机身上高亮「松手插带」提示，松手即插带；
 *     触屏 / 快捷场景保留点击插带兜底（button onClick）；
 *   - 插带时序（state 只切 key 强制重挂载，动效仍全部纯 CSS）：
 *     进带窗卡带条落入（crt-tape-in）→ 白噪声雪花闪屏（crt-snow steps 抖动）
 *     → 频道画面延迟登场（crt-show .5s 延迟挡住雪花首帧）+ ken-burns 缓动
 *     模拟播放 + OSD 荧光绿频道字符点亮（crt-osd）；每次换带整段重放；
 *   - 频道画面：本地入库图（路径见 crtShared.ts，2026-08-31 Claude·修复裂图），
 *     <img> 原生标签（项目 images.unoptimized）；扫描线 / 雪花 / 反光纯 CSS；
 *   - 铁律遵守：宽度 min() 钳制；字体栈自包含；keyframes 全部 crt- 前缀隔离
 *     无全局选择器；prefers-reduced-motion 关动画后画面直接呈现
 *     （画面可见性由挂载保证，不依赖动画 fill）；
 *   - state 仅为交互逻辑（拖拽源 / 悬停 / 已插卡带），不引入任何 mock 数据。
 * 加载键：'crt-player'（见 GlassMount LOADERS）。
 */

import { useState, type DragEvent } from 'react';
import { CRT_COLOR, CRT_FONT, CRT_KEYFRAMES, CRT_MONO, PANEL_GRADIENT, SCANLINES, SHELL_GRADIENT, SNOW_FILL, TAPES } from './crtShared';

/** 各频道装饰时间码（视觉元素，静态不自创业务数据） */
const TIMECODES = ['0:12:44', '0:08:17', '0:23:05', '0:15:32'];

export default function CRTPlayer() {
  /** 已插入进带窗的卡带 id（首张默认在播；null 仅在异常兜底出现） */
  const [loaded, setLoaded] = useState<string | null>(TAPES[0].id);
  /** 正在拖拽的卡带 id（null = 未在拖） */
  const [dragId, setDragId] = useState<string | null>(null);
  /** 拖拽悬停在机身上（投放区高亮） */
  const [over, setOver] = useState(false);

  /* 拖起卡带：写入 dataTransfer 供松手读取，并登记拖拽源（源卡带变淡） */
  const handleDragStart = (e: DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'copy';
    setDragId(id);
  };

  /* 拖拽结束（无论是否投中）统一清态 */
  const handleDragEnd = () => {
    setDragId(null);
    setOver(false);
  };

  /* 机身作为投放区：允许 copy 落下并点亮高亮 */
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setOver(true);
  };

  /* 离开机身才熄灭高亮（忽略子元素间移动引发的 dragleave，避免闪烁） */
  const handleDragLeave = (e: DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false);
  };

  /* 松手投放：读出卡带 id → 插带播放 */
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) setLoaded(id);
    handleDragEnd();
  };

  const activeTape = TAPES.find((t) => t.id === loaded) ?? null;
  const activeIndex = TAPES.findIndex((t) => t.id === loaded);

  return (
    <div className="mx-auto flex w-fit flex-col items-center" style={{ fontFamily: CRT_FONT }}>
      {/* 自包含样式：共用 keyframes（crt- 前缀隔离，无全局选择器）；
          reduced-motion 时关闭动效，画面 / OSD 直接呈现（可见性不依赖动画） */}
      <style>{`${CRT_KEYFRAMES}\n@media (prefers-reduced-motion: reduce){ .crt-fx{animation:none !important} }`}</style>

      {/* ── 便携 CRT 电视（投放区：拖卡带到此松手插带） ── */}
      <section
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-label="复古电视机：把卡带拖到这里插放"
        className="relative w-[min(560px,84vw)] rounded-[26px] p-3 transition-[transform,box-shadow] duration-300"
        style={{
          background: SHELL_GRADIENT,
          border: `2px solid ${over ? CRT_COLOR.osd : CRT_COLOR.shellEdge}`,
          transform: over ? 'scale(1.015)' : 'none',
          boxShadow: over
            ? `0 0 0 5px ${CRT_COLOR.osdShadow}, 0 34px 60px -28px rgba(0,0,0,.65), inset 0 2px 6px rgba(255,255,255,.65)`
            : '0 34px 60px -28px rgba(0,0,0,.65), inset 0 2px 6px rgba(255,255,255,.65), inset 0 -6px 14px rgba(120,90,50,.28)',
        }}
      >
        {/* 拉杆天线：两根斜杆 + 顶端圆球（纯 CSS） */}
        <span aria-hidden className="absolute -top-[52px] left-[24%] h-[60px] w-[3px] origin-bottom rotate-[14deg] rounded-full" style={{ background: 'linear-gradient(180deg,#9aa0a6,#565b60)' }}>
          <i className="absolute -left-[3px] -top-1.5 h-2.5 w-2.5 rounded-full bg-zinc-400" />
        </span>
        <span aria-hidden className="absolute -top-[58px] right-[24%] h-[66px] w-[3px] origin-bottom -rotate-[20deg] rounded-full" style={{ background: 'linear-gradient(180deg,#9aa0a6,#565b60)' }}>
          <i className="absolute -left-[3px] -top-1.5 h-2.5 w-2.5 rounded-full bg-zinc-400" />
        </span>

        {/* 前面板（深棕） */}
        <div className="rounded-[18px] p-2.5" style={{ background: PANEL_GRADIENT, boxShadow: 'inset 0 1px 4px rgba(0,0,0,.6)' }}>
          {/* 凸面屏幕：黑框 + 内凹阴影 */}
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-xl"
            style={{ border: '10px solid #1c1a17', background: '#0a0a0c', boxShadow: 'inset 0 0 26px rgba(0,0,0,.9)' }}
          >
            {/* 频道画面（当前卡带；loaded 换 key → crt-show 延迟登场重放；
                2026-08-31 Claude·修复兄弟 key 重复：画面/雪花/OSD 同父，前缀区分） */}
            {activeTape && (
              <div key={`scene-${activeTape.id}`} className="crt-fx absolute inset-0" style={{ animation: 'crt-show .45s linear .5s both' }}>
                <img
                  src={activeTape.art}
                  alt={`${activeTape.channel} ${activeTape.title}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  style={{ animation: 'crt-ken 16s ease-in-out infinite' }}
                />
                {/* 扫描线 + 荧屏 vignette + 玻璃反光（播放质感三件套，纯 CSS） */}
                <span aria-hidden className="absolute inset-0" style={{ background: SCANLINES }} />
                <span aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(105% 105% at 50% 46%, transparent 58%, rgba(0,0,0,.5))' }} />
                <span aria-hidden className="absolute -left-1/4 top-0 h-full w-1/3 -rotate-12 bg-white/8" />
              </div>
            )}

            {/* 换带白噪声闪屏层（loaded 换 key → crt-snow 一次性 steps 抖动重放；
                基础 opacity-0 保证 reduced-motion 下不残留噪点） */}
            {activeTape && (
              <span
                key={activeTape.id}
                aria-hidden
                className="crt-fx pointer-events-none absolute inset-0 opacity-0"
                style={{ background: SNOW_FILL, backgroundSize: '110px 110px', animation: 'crt-snow .55s steps(4) 1' }}
              />
            )}

            {/* 拖拽投放提示（拖起卡带时浮现；悬停机身时加强） */}
            {dragId && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center transition-colors duration-150"
                style={{ background: over ? 'rgba(8,10,8,.42)' : 'rgba(8,10,8,.12)' }}
              >
                <span
                  className="rounded-full border px-3.5 py-1.5 text-[11px] font-bold tracking-[0.28em]"
                  style={{
                    color: CRT_COLOR.osd,
                    borderColor: `${CRT_COLOR.osd}66`,
                    background: 'rgba(6,10,6,.6)',
                    textShadow: `0 0 8px ${CRT_COLOR.osdShadow}`,
                    opacity: over ? 1 : 0.75,
                  }}
                >
                  {over ? '松手插带 ▼' : '拖到电视上'}
                </span>
              </div>
            )}

            {/* OSD（当前卡带；loaded 换 key → crt-osd 点亮重放） */}
            {activeTape && (
              <div
                key={activeTape.id}
                className="crt-fx pointer-events-none absolute inset-0 p-3"
                style={{ fontFamily: CRT_MONO, textShadow: `0 0 8px ${CRT_COLOR.osdShadow}`, animation: 'crt-osd .9s steps(1) both' }}
              >
                <p className="text-[13px] font-bold tracking-[0.2em]" style={{ color: CRT_COLOR.osd }}>
                  {activeTape.channel}
                </p>
                <p className="absolute bottom-2.5 right-3 flex items-center gap-1.5 text-[11px] font-semibold tracking-widest" style={{ color: CRT_COLOR.osd }}>
                  <span className="inline-block border-y-[5px] border-l-[8px] border-y-transparent" style={{ borderLeftColor: CRT_COLOR.osd }} aria-hidden />
                  PLAY {TIMECODES[activeIndex]}
                </p>
              </div>
            )}
          </div>

          {/* 下面板行：品牌标 · 进带窗 · 旋钮 ×2 · 喇叭格栅 */}
          <div className="mt-2.5 flex items-center gap-3 px-1">
            <span className="text-[9px] font-bold tracking-[0.22em]" style={{ fontFamily: CRT_MONO, color: '#d8c391' }}>
              OHANA·VISION
            </span>

            {/* 进带窗：当前卡带同色带条落入动画（等效「插入电视」） */}
            <div className="relative h-6 flex-1 overflow-hidden rounded-md" style={{ background: '#241b10', boxShadow: 'inset 0 2px 6px rgba(0,0,0,.85)' }}>
              {activeTape && (
                <span
                  key={activeTape.id}
                  className="crt-fx absolute inset-[3px] flex items-center gap-1 rounded px-1.5"
                  style={{ background: activeTape.shell, animation: 'crt-tape-in .5s cubic-bezier(.55,.06,.28,1.2) both' }}
                >
                  <i className="h-1.5 w-1.5 rounded-full" style={{ background: 'rgba(20,15,8,.7)' }} aria-hidden />
                  <i className="h-1.5 w-1.5 rounded-full" style={{ background: 'rgba(20,15,8,.7)' }} aria-hidden />
                  <i className="h-1 flex-1 rounded" style={{ background: CRT_COLOR.label }} aria-hidden />
                </span>
              )}
            </div>

            {/* 旋钮 ×2（带刻度点） */}
            {['VOL', 'CH'].map((k) => (
              <span key={k} className="relative hidden h-8 w-8 shrink-0 rounded-full sm:block" style={{ background: 'radial-gradient(circle at 34% 30%, #d9c9a6, #a08a62)', boxShadow: '0 2px 5px rgba(0,0,0,.5), inset 0 1px 2px rgba(255,255,255,.5)' }} aria-label={k}>
                <i className="absolute left-1/2 top-[3px] h-2 w-[2px] -translate-x-1/2 rounded bg-[#3a2d1c]" aria-hidden />
              </span>
            ))}

            {/* 喇叭格栅（竖条纹块） */}
            <span
              aria-hidden
              className="hidden h-8 w-14 shrink-0 rounded-md sm:block"
              style={{ background: 'repeating-linear-gradient(90deg, rgba(0,0,0,.5) 0 2px, rgba(255,255,255,.12) 2px 5px)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,.7)' }}
            />
          </div>
        </div>

        {/* 电视底脚 ×2 */}
        <div className="mx-10 flex justify-between" aria-hidden>
          <i className="h-2 w-8 rounded-b-md" style={{ background: '#8f7854' }} />
          <i className="h-2 w-8 rounded-b-md" style={{ background: '#8f7854' }} />
        </div>
      </section>

      {/* ── VHS 卡带架：拖拽 / 点击插带 ── */}
      <div className="mt-7 flex items-end justify-center gap-3 sm:gap-4" role="group" aria-label="VHS 卡带架">
        {TAPES.map((t) => {
          const loadedThis = loaded === t.id;
          return (
            <button
              key={t.id}
              type="button"
              draggable
              onDragStart={(e) => handleDragStart(e, t.id)}
              onDragEnd={handleDragEnd}
              onClick={() => setLoaded(t.id)}
              aria-pressed={loadedThis}
              title={`${t.channel} · ${t.title} — 拖到电视上插放，或点击直接插带`}
              className={`w-[min(118px,19vw)] cursor-grab touch-manipulation select-none rounded-[10px] p-1.5 pb-2 transition-all duration-200 active:cursor-grabbing ${
                dragId === t.id ? 'scale-95 opacity-40' : loadedThis ? '-translate-y-2' : 'hover:-translate-y-1.5'
              }`}
              style={{
                background: t.shell,
                border: `2px solid ${t.spine}`,
                boxShadow: loadedThis
                  ? `0 18px 30px -12px rgba(0,0,0,.55), 0 0 0 2px ${CRT_COLOR.label}`
                  : '0 8px 18px -10px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.35)',
              }}
            >
              {/* 白标签：频道号 + 节目名（手写标签质感） */}
              <span className="block rounded-[5px] px-1.5 py-1 text-left" style={{ background: CRT_COLOR.label }}>
                <span className="block text-[7px] font-bold tracking-[0.18em]" style={{ fontFamily: CRT_MONO, color: '#8a6a4a' }}>
                  {t.channel}
                </span>
                <span className="block truncate text-[10px] font-extrabold leading-tight" style={{ color: '#3a2d1c' }}>
                  {t.title}
                </span>
              </span>
              {/* 带仓窗：双带卷 */}
              <span className="mt-1.5 flex items-center justify-center gap-2.5 rounded-[5px] py-1.5" style={{ background: 'rgba(0,0,0,.28)' }} aria-hidden>
                <i className="h-4 w-4 rounded-full border-[3px]" style={{ borderColor: t.spine, background: '#241c12' }} />
                <i className="h-1.5 w-1.5 rounded-full" style={{ background: 'rgba(20,15,8,.7)' }} />
                <i className="h-4 w-4 rounded-full border-[3px]" style={{ borderColor: t.spine, background: '#241c12' }} />
              </span>
            </button>
          );
        })}
      </div>

      {/* 操作提示（可发现性） */}
      <p className="mt-3 text-center text-[11px] tracking-wide" style={{ color: '#8a7554' }}>
        把卡带拖到电视上插放 · 也可以直接点击
      </p>
    </div>
  );
}
