/**
 * CrowdKeys.tsx —— IN-07 变体 V1：动物琴键（人群语言 × 乐器场景）
 * 2026-09-08 Claude·新增：保留原型「手绘动物 + 五声音阶」视觉/听觉语言，
 *   交互场景从「登录页背景」变为「一排可以弹的小动物」——
 *   8 只动物 = A3 C4 D4 E4 G4 A4 C5 D5（小调五声音阶跨八度），
 *   划过/点击弹奏，键盘 1–8 与 A S D F G H J K 同效；
 *   首次点击自动「开嗓」（浏览器自动播放策略要求用户手势），
 *   右下角仍可静音；按下即跳（原型 Lift 语言），音名随按点亮起。
 */

'use client';

import { useEffect, useState } from 'react';
import { ANIMALS } from '../hilosShared';
import { useCrowdSynth } from '../useCrowdSynth';

/** 琴键配置：8 音（音级 + 八度 + 音名 + 键盘映射 + 动物），确定性静态数据
 *  2026-09-08 Claude·音名校准：A3=220Hz 起，C/D/E/G 比同组 A 高（跨年），
 *  正确标记 A3 C4 D4 E4 G4 / A4 C5 D5；v3 名册 25 项后索引重选（近似原角色） */
const KEYS = [
  { note: 0, octave: 0, name: 'A3', kbd: ['1', 'a'], animal: 12 }, // 小狗 pup
  { note: 1, octave: 0, name: 'C4', kbd: ['2', 's'], animal: 11 }, // 小猫 cat
  { note: 2, octave: 0, name: 'D4', kbd: ['3', 'd'], animal: 13 }, // 兔子 bunny
  { note: 3, octave: 0, name: 'E4', kbd: ['4', 'f'], animal: 17 }, // 小熊 bear
  { note: 4, octave: 0, name: 'G4', kbd: ['5', 'g'], animal: 6 }, // 小猪 pig
  { note: 0, octave: 1, name: 'A4', kbd: ['6', 'h'], animal: 16 }, // 企鹅 penguin
  { note: 1, octave: 1, name: 'C5', kbd: ['7', 'j'], animal: 10 }, // 猫头鹰 owl
  { note: 2, octave: 1, name: 'D5', kbd: ['8', 'k'], animal: 14 }, // 奶牛 cow
] as const;

export default function CrowdKeys() {
  const synth = useCrowdSynth();
  const [pressed, setPressed] = useState<number | null>(null);

  /** 弹奏一键：首次交互自动开嗓（自动播放策略），随后发声 + 跳 */
  const strike = (i: number) => {
    if (!synth.enabled) synth.unmute();
    const k = KEYS[i];
    synth.play(k.note, k.octave);
    setPressed(i);
  };

  /* 键盘映射（1–8 / A–K）；卸载时清理（性能铁律） */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const i = KEYS.findIndex((k) => (k.kbd as readonly string[]).includes(e.key.toLowerCase()));
      if (i >= 0) strike(i);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [synth.enabled]);

  /* 按下态 220ms 自动释放（跳起动画节奏） */
  useEffect(() => {
    if (pressed === null) return;
    const t = setTimeout(() => setPressed(null), 220);
    return () => clearTimeout(t);
  }, [pressed]);

  return (
    <div className="flex w-[min(760px,94vw)] flex-col items-center gap-7">
      <style>{`
        .hl-key { transition: transform .2s cubic-bezier(.34,1.56,.64,1); }
        .hl-key:hover { transform: translateY(-10px); }
        @media (prefers-reduced-motion: reduce) { .hl-key { transition: none; } .hl-key:hover { transform: none; } }
      `}</style>

      {/* 标注行 */}
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-500">Animal Keys</p>
        <p className="mt-1.5 text-sm text-neutral-600">弹一排小动物——点一下开嗓，键盘 1–8 也能弹</p>
      </div>

      {/* 琴键排（移动端自动折行成 4×2） */}
      <div className="flex flex-wrap items-end justify-center gap-x-3 gap-y-6 sm:gap-x-4">
        {KEYS.map((k, i) => {
          const { Icon, label } = ANIMALS[k.animal];
          const isDown = pressed === i;
          return (
            <button
              key={`${k.note}-${k.octave}`}
              type="button"
              onPointerDown={() => strike(i)}
              aria-label={`${label}琴键 ${k.name}`}
              className="group flex w-[min(20vw,88px)] flex-col items-center gap-1.5 outline-none"
            >
              <span
                className={`hl-key block aspect-square w-full rounded-full bg-white/70 p-1 shadow-[0_10px_24px_-10px_rgba(15,15,20,0.25)] ${
                  isDown ? '-translate-y-3 scale-110' : ''
                }`}
              >
                <Icon className="h-full w-full" />
              </span>
              {/* 音名（按下点亮） */}
              <span
                className={`font-mono text-[11px] tracking-wider transition-colors ${
                  isDown ? 'font-bold text-neutral-900' : 'text-neutral-400 group-hover:text-neutral-600'
                }`}
              >
                {k.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* 声音开关（沿用原型语义） */}
      <button
        type="button"
        onClick={synth.toggle}
        aria-pressed={synth.enabled}
        className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
          synth.enabled
            ? 'border-neutral-900 bg-neutral-900 text-white'
            : 'border-neutral-300 bg-white/80 text-neutral-600 hover:border-neutral-500'
        }`}
      >
        {synth.enabled ? '🔊 人群开嗓中（点按静音）' : '🔇 人群静默中（点按开嗓）'}
      </button>
    </div>
  );
}
