/**
 * CrowdWall.tsx —— IN-07 变体 V2：签到人群墙（人群语言 × 房间成员场景）
 * 2026-09-08 Claude·新增：呼应 hilos 产品概念「Bots visit. Members belong.」——
 *   人群从背景走上前台成为「房间成员」：小动物初始灰淡（未到场），
 *   点击即点亮签到（跳起 + 发声 + 勾角标），再点取消；
 *   顶部实时计数「N / 25 位已到场」，Reset 一键清空；
 *   首次点击自动开嗓（用户手势解锁 AudioContext）；
 *   名册称谓见 hilosShared.wallMemberName（纯 UI 状态，非接口数据）。
 * 2026-09-08 Claude·成员去重（用户报「这里面有重复的」）：48 格 25 种
 *   必重复 → 改为全名册 25 格 5×5、一格一种不重复，顺序确定性打散。
 */

'use client';

import { useMemo, useState } from 'react';
import { ANIMALS, wallMemberName } from '../hilosShared';
import { useCrowdSynth } from '../useCrowdSynth';

/* 2026-09-08 Claude·修复重复（用户报「这里面有重复的」）：48 格配 25 种
   素材必然重复 23 只 → 改为全名册 25 格、一格一种不重复 */
const TOTAL = ANIMALS.length;

export default function CrowdWall() {
  const synth = useCrowdSynth();
  const [checked, setChecked] = useState<Set<number>>(new Set());

  /* 成员表 = 全名册 25 种各一只（与 hilos.sh 人群一一对应）；
     顺序按确定性 hash 打散（同输入同输出），避免 7 款机器人连号扎堆一行 */
  const members = useMemo(() => {
    const order = ANIMALS.map((_, i) => i).sort((a, b) => {
      const ha = Math.sin(a * 127.1 + 311.7) * 43758.5453;
      const hb = Math.sin(b * 127.1 + 311.7) * 43758.5453;
      return ha - Math.floor(ha) - (hb - Math.floor(hb));
    });
    return order.map((animalIndex, i) => ({
      animalIndex,
      noteIndex: i % 5,
      octave: i % 9 === 0 ? 1 : 0,
    }));
  }, []);

  /** 签到 / 取消：首次点击自动开嗓；签到发声 + 跳（CSS transition 语言同原型） */
  const toggleMember = (i: number) => {
    if (!synth.enabled) synth.unmute();
    const m = members[i];
    synth.play(m.noteIndex, m.octave);
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="flex w-[min(560px,94vw)] flex-col items-center gap-6">
      <style>{`
        .hl-member { transition: transform .25s cubic-bezier(.34,1.56,.64,1), opacity .25s ease, filter .25s ease; }
        .hl-member:hover { transform: translateY(-6px) scale(1.06); }
        @media (prefers-reduced-motion: reduce) { .hl-member { transition: none; } .hl-member:hover { transform: none; } }
      `}</style>

      {/* 顶部：标注 + 计数 + Reset */}
      <div className="flex w-full flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-neutral-500">Room Check-in</p>
          <p className="mt-1.5 text-sm text-neutral-600">
            <span className="font-bold text-neutral-900">{checked.size}</span>
            <span className="text-neutral-400"> / {TOTAL}</span> 位小动物已到场
          </p>
        </div>
        <button
          type="button"
          onClick={() => setChecked(new Set())}
          disabled={checked.size === 0}
          className="rounded-full border border-neutral-300 bg-white/80 px-4 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-neutral-500 disabled:opacity-40"
        >
          Reset
        </button>
      </div>

      {/* 人群墙（25 格 5×5，未到场灰淡，点亮即签到） */}
      <div className="grid w-full grid-cols-5 gap-1.5">
        {members.map((m, i) => {
          const { Icon } = ANIMALS[m.animalIndex];
          const on = checked.has(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggleMember(i)}
              aria-pressed={on}
              aria-label={`${wallMemberName(m.animalIndex, i)}${on ? '已签到' : '未签到'}`}
              className="group relative aspect-square outline-none"
            >
              <span
                className={`hl-member block h-full w-full ${
                  on ? 'opacity-100' : 'opacity-35 grayscale group-hover:opacity-70'
                }`}
              >
                <Icon className="h-full w-full" />
              </span>
              {/* 签到勾角标 */}
              {on && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white shadow">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
