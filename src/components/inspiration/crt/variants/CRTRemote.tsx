/**
 * CRTRemote —— IN-03「复古电视」变体 V2 · 遥控换台
 * 2026-08-31 Claude·新增（小红书笔记「复古 CRT 电视 + VHS 卡带播放器」的
 *   样式逻辑再演绎）：同一台奶油机身 CRT，交互从「插卡带」换成「按遥控器」
 *   ——右侧拟物遥控器数字键 1-4 换台，屏幕依旧雪花闪屏 → 画面延迟登场；
 *   - 复用 crtShared（TAPES / 渐变 / 扫描线 / 雪花 / keyframes），视觉与原型同源；
 *   - 交互引擎同 CRTPlayer：CSS-only radio（sr-only input + label + 兄弟选择器），
 *     规则串由 TAPES.map() 数据驱动生成，零 hooks 零 JS；
 *   - 铁律：宽度 min(560px, 84vw)、字体自包含、样式全部 crt- 前缀隔离、
 *     动效纯 CSS、prefers-reduced-motion 降级；
 *   - 加载键：'crt-player:remote'（见 GlassMount LOADERS）。
 */

import {
  CRT_COLOR,
  CRT_FONT,
  CRT_KEYFRAMES,
  CRT_MONO,
  PANEL_GRADIENT,
  SCANLINES,
  SHELL_GRADIENT,
  SNOW_FILL,
  TAPES,
} from '../crtShared';

/** 遥控器数字键标签（CH 01-04 → 1-4） */
const KEY_NUM = ['1', '2', '3', '4'];

/**
 * CSS-only 交互规则（由 TAPES 数据驱动生成）：
 *   - 画面：#crt-rm-{id}:checked ~ .crt-scene .crt-ch-{id} → 雪花闪完延迟登场 + ken-burns；
 *   - 雪花：换台瞬间 .crt-snow 闪屏一次；
 *   - OSD：仅当前频道可见（visibility）；
 *   - 遥控键：被选中的数字键点亮为对应卡带色（.crt-btn-{id}）。
 */
const RULES = TAPES.map(
  (t) => `
#crt-rm-${t.id}:checked ~ .crt-scene .crt-ch-${t.id} { opacity: 1; animation: crt-show .45s linear .5s both, crt-ken 16s ease-in-out infinite; }
#crt-rm-${t.id}:checked ~ .crt-scene .crt-snow { animation: crt-snow .55s steps(4) 1; }
#crt-rm-${t.id}:checked ~ .crt-scene .crt-osd { visibility: hidden; }
#crt-rm-${t.id}:checked ~ .crt-scene .crt-osd-${t.id} { visibility: visible; animation: crt-osd .9s linear both; }
#crt-rm-${t.id}:checked ~ .crt-scene .crt-btn { background: #e6dcc4; color: #6b5a40; box-shadow: 0 2px 4px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.6); }
#crt-rm-${t.id}:checked ~ .crt-scene .crt-btn-${t.id} { background: ${t.shell}; color: #fff; box-shadow: 0 0 0 2px ${t.spine}, 0 0 14px ${t.shell}66; }
`,
).join('\n');

/** 装饰时间码（OSD 右下角，纯氛围） */
const TIMECODES = ['0:12:44', '0:08:17', '0:23:05', '0:15:32'];

export default function CRTRemote() {
  return (
    <div className="mx-auto w-fit" style={{ fontFamily: CRT_FONT }}>
      {/* 自包含样式：keyframes + 交互规则（crt- 前缀隔离，无全局选择器） */}
      <style>{`${CRT_KEYFRAMES}\n${RULES}
@media (prefers-reduced-motion: reduce) {
  .crt-scene *, .crt-scene *::before { animation: none !important; }
  .crt-scene .crt-ch { opacity: 1 !important; }
}`}</style>

      {/* 隐藏 radio 组：四张卡带 = 四个频道（sr-only，defaultChecked 首项） */}
      {TAPES.map((t, i) => (
        <input
          key={t.id}
          type="radio"
          name="crt-remote"
          id={`crt-rm-${t.id}`}
          className="sr-only"
          defaultChecked={i === 0}
        />
      ))}

      {/* 场景：电视 + 遥控器（小屏纵排，sm 起并排） */}
      <section className="crt-scene flex flex-col items-center gap-7 sm:flex-row sm:items-end sm:gap-9">
        {/* ————— 电视机（与原型同机身语言） ————— */}
        <section
          className="relative w-[min(430px,84vw)] rounded-[24px] p-4"
          style={{
            background: SHELL_GRADIENT,
            boxShadow:
              'inset 0 2px 0 rgba(255,255,255,.75), inset 0 -3px 6px rgba(120,90,50,.28), 0 34px 70px -26px rgba(40,30,15,.55)',
            border: `2px solid ${CRT_COLOR.shellEdge}`,
          }}
        >
          {/* 双拉杆天线（装饰）·2026-08-31 Claude·移动端适配：天线伸出量 80px→52px，
              容进变体舞台块 py-14(56px) 顶部余量，不再被 overflow-hidden 裁切 */}
          <i className="absolute -top-[46px] left-1/2 h-[52px] w-[3px] origin-bottom -rotate-[22deg] rounded-full bg-[#8f8f94]" aria-hidden />
          <i className="absolute -top-[46px] left-1/2 h-[52px] w-[3px] origin-bottom rotate-[22deg] rounded-full bg-[#8f8f94]" aria-hidden />
          <i className="absolute -top-[52px] left-[calc(50%-16px)] h-3 w-3 -translate-x-1/2 rounded-full bg-[#c9c9ce] shadow" aria-hidden />
          <i className="absolute -top-[52px] left-[calc(50%+16px)] h-3 w-3 -translate-x-1/2 rounded-full bg-[#c9c9ce] shadow" aria-hidden />

          {/* 屏幕（深棕面板内凸面屏） */}
          <div
            className="rounded-[16px] p-2.5"
            style={{ background: PANEL_GRADIENT, boxShadow: 'inset 0 2px 6px rgba(0,0,0,.6)' }}
          >
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-[10px]"
              style={{ background: CRT_COLOR.screenFrame, boxShadow: 'inset 0 0 26px rgba(0,0,0,.85)' }}
            >
              {/* 频道画面层 ×4（radio checked 后延迟登场 + ken-burns 缓动） */}
              {TAPES.map((t) => (
                <div key={t.id} className={`crt-ch-${t.id} crt-ch absolute inset-0 opacity-0`} aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.art} alt="" className="h-full w-full object-cover" />
                  {/* 扫描线 + 暗角 + 玻璃反光 */}
                  <span className="absolute inset-0" style={{ background: SCANLINES, opacity: 0.5 }} />
                  <span className="absolute inset-0" style={{ background: 'radial-gradient(115% 100% at 50% 45%, transparent 58%, rgba(0,0,0,.55) 100%)' }} />
                  <span className="absolute -left-1/3 top-0 h-full w-1/2 rotate-[18deg] bg-gradient-to-r from-white/12 to-transparent" />
                </div>
              ))}

              {/* 换台白噪声雪花层（radio 切换时 steps 闪一次） */}
              <div className="crt-snow pointer-events-none absolute inset-0 opacity-0" style={{ background: SNOW_FILL, backgroundSize: '130px 130px' }} aria-hidden />

              {/* OSD ×4：荧光绿频道号 + PLAY 时间码（当前频道可见） */}
              {TAPES.map((t, i) => (
                <div
                  key={t.id}
                  className={`crt-osd-${t.id} crt-osd invisible absolute bottom-2.5 left-3 flex items-center gap-2`}
                  aria-hidden
                >
                  <span
                    className="text-[15px] font-bold tracking-[0.12em]"
                    style={{ fontFamily: CRT_MONO, color: CRT_COLOR.osd, textShadow: `0 0 8px ${CRT_COLOR.osdShadow}` }}
                  >
                    {t.channel}
                  </span>
                  <span
                    className="text-[10px] tracking-[0.18em]"
                    style={{ fontFamily: CRT_MONO, color: CRT_COLOR.osd, textShadow: `0 0 6px ${CRT_COLOR.osdShadow}` }}
                  >
                    ▶ {TIMECODES[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 下面板：品牌标 + 喇叭格栅（遥控形态无进带窗） */}
          <div className="mt-3 flex items-center gap-3 px-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7a6446]">OHANA·VISION</span>
            <span className="h-[6px] flex-1 rounded-full" style={{ background: 'repeating-linear-gradient(90deg, #cbb691 0 3px, transparent 3px 7px)' }} aria-hidden />
          </div>
        </section>

        {/* ————— 遥控器（label 数字键换台） ————— */}
        <aside
          className="crt-remote w-[84px] rounded-[18px] p-3 pb-4"
          style={{
            background: SHELL_GRADIENT,
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,.7), 0 26px 50px -22px rgba(40,30,15,.55)',
            border: `2px solid ${CRT_COLOR.shellEdge}`,
          }}
          aria-label="频道遥控器"
        >
          {/* 遥控器品牌窗 */}
          <p className="mb-2.5 text-center text-[8px] font-semibold uppercase tracking-[0.22em] text-[#8a7554]">Remote</p>

          {/* 数字键 1-4（label[for] → 隐藏 radio；选中态由规则点亮卡带色） */}
          <div className="flex flex-col gap-2">
            {TAPES.map((t, i) => (
              <label
                key={t.id}
                htmlFor={`crt-rm-${t.id}`}
                className={`crt-btn-${t.id} crt-btn flex h-9 cursor-pointer items-center justify-center rounded-[10px] text-[13px] font-bold`}
                style={{
                  background: '#e6dcc4',
                  color: '#6b5a40',
                  boxShadow: '0 2px 4px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.6)',
                }}
                title={`${t.channel} · ${t.title}`}
              >
                {KEY_NUM[i]}
              </label>
            ))}
          </div>

          {/* 底部装饰小键（VOL / MUTE，不可交互，纯拟物氛围） */}
          <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
            <i className="h-4 w-4 rounded-full bg-[#d8c9a8] shadow-inner" />
            <i className="h-4 w-4 rounded-full bg-[#d8c9a8] shadow-inner" />
          </div>
        </aside>
      </section>
    </div>
  );
}
