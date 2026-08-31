'use client';

/**
 * CRTHandheld —— IN-03「复古电视」变体 V2 · 掌上电视
 * 2026-08-31 Claude·新增；同日交互升级（用户反馈：卡带须可拖放插带）：
 *   - 形态：横版掌上迷你 CRT——顶部提手、屏幕左置、右列控制键、
 *     底部内嵌迷你卡带排；
 *   - 拖放插带（同原型交互语言）：迷你卡带可拖到机身上松手插入
 *     （HTML5 Drag & Drop + 高亮投放提示），触屏 / 快捷场景点击兜底；
 *   - 插带时序（state 只切 key 强制重挂载，动效全部纯 CSS）：
 *     白噪声雪花闪屏（crt-snow）→ 画面延迟登场（crt-show .5s 延迟挡首帧）
 *     + ken-burns 缓动模拟播放 + OSD 荧光绿字符点亮（crt-osd）；
 *   - 复用 crtShared（TAPES / 渐变 / 扫描线 / 雪花 / keyframes），视觉与原型同源；
 *   - 铁律：宽度 min(460px, 84vw)、字体自包含、样式 crt- 前缀隔离、
 *     prefers-reduced-motion 关动画画面直接呈现；state 仅为交互逻辑零 mock。
 * 加载键：'crt-player:handheld'（见 GlassMount LOADERS）。
 */

import { useState, type DragEvent } from 'react';
import {
  CRT_COLOR,
  CRT_FONT,
  CRT_KEYFRAMES,
  CRT_MONO,
  SCANLINES,
  SHELL_GRADIENT,
  SNOW_FILL,
  TAPES,
} from '../crtShared';

/** 装饰时间码（OSD 右下角，纯氛围） */
const TIMECODES = ['0:12:44', '0:08:17', '0:23:05', '0:15:32'];

export default function CRTHandheld() {
  /** 已插入的迷你卡带 id（首张默认在播） */
  const [loaded, setLoaded] = useState<string | null>(TAPES[0].id);
  /** 正在拖拽的卡带 id（null = 未在拖） */
  const [dragId, setDragId] = useState<string | null>(null);
  /** 拖拽悬停在机身上（投放区高亮） */
  const [over, setOver] = useState(false);

  /* 拖起迷你卡带：写入 dataTransfer 并登记拖拽源 */
  const handleDragStart = (e: DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'copy';
    setDragId(id);
  };

  /* 拖拽结束统一清态 */
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

  /* 离开机身才熄灭高亮（忽略子元素间移动引发的 dragleave） */
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
    <div className="mx-auto w-fit" style={{ fontFamily: CRT_FONT }}>
      {/* 自包含样式：共用 keyframes（crt- 前缀隔离）；reduced-motion 关动画画面直接呈现 */}
      <style>{`${CRT_KEYFRAMES}\n@media (prefers-reduced-motion: reduce){ .crt-fx{animation:none !important} }`}</style>

      {/* ————— 掌上电视机身（横版，顶部提手；投放区） ————— */}
      <section
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-label="掌上电视机：把迷你卡带拖到这里插放"
        className="crt-hh relative w-[min(460px,84vw)] rounded-[22px] p-3.5 transition-[transform,box-shadow] duration-300"
        style={{
          background: SHELL_GRADIENT,
          border: `2px solid ${over ? CRT_COLOR.osd : CRT_COLOR.shellEdge}`,
          transform: over ? 'scale(1.015)' : 'none',
          boxShadow: over
            ? `0 0 0 5px ${CRT_COLOR.osdShadow}, inset 0 2px 0 rgba(255,255,255,.75), inset 0 -3px 6px rgba(120,90,50,.28), 0 32px 64px -26px rgba(40,30,15,.55)`
            : 'inset 0 2px 0 rgba(255,255,255,.75), inset 0 -3px 6px rgba(120,90,50,.28), 0 32px 64px -26px rgba(40,30,15,.55)',
        }}
      >
        {/* 顶部提手（拱形描边，纯装饰） */}
        <span
          className="absolute -top-[26px] left-1/2 h-[34px] w-[38%] -translate-x-1/2 rounded-t-[20px]"
          style={{ border: '6px solid #d9c9a6', borderBottom: 'none', boxShadow: 'inset 0 2px 0 rgba(255,255,255,.6)' }}
          aria-hidden
        />

        {/* 屏幕区：左屏 + 右列控制键（横版布局特征） */}
        <div className="flex items-stretch gap-3">
          {/* 屏幕（黑框凸面屏） */}
          <div
            className="relative flex-1 overflow-hidden rounded-[12px]"
            style={{ background: CRT_COLOR.screenFrame, padding: 7, boxShadow: 'inset 0 0 18px rgba(0,0,0,.8)' }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[8px]" style={{ background: CRT_COLOR.screenFrame, boxShadow: 'inset 0 0 22px rgba(0,0,0,.85)' }}>
              {/* 频道画面（当前卡带；loaded 换 key → 延迟登场重放；
                  2026-08-31 Claude·修复兄弟 key 重复：画面/雪花/OSD 同父，前缀区分） */}
              {activeTape && (
                <div key={`scene-${activeTape.id}`} className="crt-fx absolute inset-0" style={{ animation: 'crt-show .45s linear .5s both' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={activeTape.art} alt={`${activeTape.channel} ${activeTape.title}`} loading="lazy" className="h-full w-full object-cover" style={{ animation: 'crt-ken 16s ease-in-out infinite' }} />
                  <span className="absolute inset-0" style={{ background: SCANLINES, opacity: 0.5 }} />
                  <span className="absolute inset-0" style={{ background: 'radial-gradient(115% 100% at 50% 45%, transparent 58%, rgba(0,0,0,.55) 100%)' }} />
                  <span className="absolute -left-1/3 top-0 h-full w-1/2 rotate-[18deg] bg-gradient-to-r from-white/12 to-transparent" />
                </div>
              )}

              {/* 插带白噪声雪花层（loaded 换 key 重放；基础 opacity-0 兜底） */}
              {activeTape && (
                <span
                  key={activeTape.id}
                  aria-hidden
                  className="crt-fx pointer-events-none absolute inset-0 opacity-0"
                  style={{ background: SNOW_FILL, backgroundSize: '120px 120px', animation: 'crt-snow .55s steps(4) 1' }}
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
                    className="rounded-full border px-2.5 py-1 text-[9px] font-bold tracking-[0.24em]"
                    style={{
                      color: CRT_COLOR.osd,
                      borderColor: `${CRT_COLOR.osd}66`,
                      background: 'rgba(6,10,6,.6)',
                      textShadow: `0 0 8px ${CRT_COLOR.osdShadow}`,
                      opacity: over ? 1 : 0.75,
                    }}
                  >
                    {over ? '松手插带 ▼' : '拖到机身上'}
                  </span>
                </div>
              )}

              {/* OSD（当前卡带；loaded 换 key → crt-osd 点亮重放） */}
              {activeTape && (
                <div
                  key={`osd-${activeTape.id}`}
                  className="crt-fx pointer-events-none absolute bottom-1.5 left-2 flex items-center gap-1.5"
                  style={{ fontFamily: CRT_MONO, textShadow: `0 0 8px ${CRT_COLOR.osdShadow}`, animation: 'crt-osd .9s steps(1) both' }}
                  aria-hidden
                >
                  <span className="text-[12px] font-bold tracking-[0.12em]" style={{ color: CRT_COLOR.osd }}>
                    {activeTape.channel}
                  </span>
                  <span className="text-[8px] tracking-[0.16em]" style={{ color: CRT_COLOR.osd }}>
                    ▶ {TIMECODES[activeIndex]}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 右列控制键：小旋钮 + 指示灯（纯拟物装饰） */}
          <div className="flex w-[46px] shrink-0 flex-col items-center justify-center gap-2.5" aria-hidden>
            <i className="h-7 w-7 rounded-full" style={{ background: 'radial-gradient(circle at 34% 30%, #d9c9a6, #a08a62)', boxShadow: '0 2px 4px rgba(0,0,0,.45), inset 0 1px 2px rgba(255,255,255,.5)' }} />
            <i className="h-7 w-7 rounded-full" style={{ background: 'radial-gradient(circle at 34% 30%, #d9c9a6, #a08a62)', boxShadow: '0 2px 4px rgba(0,0,0,.45), inset 0 1px 2px rgba(255,255,255,.5)' }} />
            <i className="h-2 w-2 rounded-full" style={{ background: CRT_COLOR.osd, boxShadow: `0 0 8px ${CRT_COLOR.osdShadow}` }} />
            <span className="text-[7px] font-semibold uppercase tracking-[0.18em] text-[#7a6446]">Power</span>
          </div>
        </div>

        {/* 底部迷你卡带排（拖拽 / 点击插带；已插卡带上浮 + 米白描边） */}
        <div className="crt-deck mt-3 flex items-end justify-center gap-2.5 rounded-[14px] px-2 py-2.5" style={{ background: 'rgba(60,45,28,.14)' }} role="group" aria-label="迷你卡带排">
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
                title={`${t.channel} · ${t.title} — 拖到机身上插放，或点击直接插带`}
                /* 2026-08-31 Claude·移动端适配：54px→min(54px,14.5vw)，<360px 窄屏不再溢出机身 */
                className={`w-[min(54px,14.5vw)] cursor-grab select-none rounded-[6px] transition-all duration-200 active:cursor-grabbing ${
                  dragId === t.id ? 'scale-95 opacity-40' : loadedThis ? '-translate-y-1.5' : 'hover:-translate-y-1'
                }`}
                style={{
                  boxShadow: loadedThis
                    ? `0 0 0 2px ${CRT_COLOR.label}, 0 10px 18px -6px rgba(0,0,0,.45)`
                    : '0 4px 8px -3px rgba(0,0,0,.35)',
                }}
              >
                {/* 迷你卡带：壳色块 + 白标签 + 带卷双圆 */}
                <span className="block overflow-hidden rounded-[5px]" style={{ background: t.shell, height: 34 }}>
                  <span className="mx-[5px] mt-[4px] block h-[9px] overflow-hidden whitespace-nowrap rounded-[2px] px-1 text-[6.5px] font-semibold leading-[9px] text-[#3a2d1c]" style={{ background: CRT_COLOR.label }}>
                    {t.title}
                  </span>
                  <span className="mt-[5px] flex items-center justify-center gap-1.5" aria-hidden>
                    <i className="h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: t.spine, background: '#241c12' }} />
                    <i className="h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: t.spine, background: '#241c12' }} />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
