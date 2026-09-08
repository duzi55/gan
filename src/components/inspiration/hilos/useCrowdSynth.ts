/**
 * useCrowdSynth.ts —— IN-07 人群登录：人群和声合成器 hook
 * 2026-09-08 Claude·新增（hilos.sh 登录页复刻，对应原站 Sound 面板
 *   Synth: sawtooth / Scale: minorPentatonic / Volume 30% / Tail 1300ms / reverb）：
 *   - Web Audio 懒加载：AudioContext 只在用户首次明确「开嗓」后创建
 *     （浏览器自动播放策略：必须有用户手势），默认静音；
 *   - 单音 = sawtooth 振荡器 → 低通滤波（柔化锯齿毛刺）→ 指数衰减包络；
 *   - 混响尾 = feedback delay（0.26s / 32% 回授），模拟原站 Tail/reverb；
 *   - play() 防连发：同一时刻最多 ~24 个音（hover 连划也不会糊成一片）；
 *   - 卸载时 close() 释放（性能铁律：组件内部自持并清理）。
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { pentaFreq } from './hilosShared';

interface SynthNodes {
  ctx: AudioContext;
  master: GainNode;
  delay: DelayNode;
}

export function useCrowdSynth() {
  const nodesRef = useRef<SynthNodes | null>(null);
  const liveRef = useRef(0); // 当前存活音符数（防连发计数）
  const [enabled, setEnabled] = useState(false);

  /** 懒建音频图：master(0.24) → destination；delay 回授支路作混响尾 */
  const ensure = useCallback((): SynthNodes | null => {
    if (nodesRef.current) return nodesRef.current;
    if (typeof window === 'undefined') return null;
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0.24;
    master.connect(ctx.destination);
    /* 混响尾：delay 0.26s + 32% 回授（≈原站 Tail 1300ms 听感） */
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.26;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.32;
    const wet = ctx.createGain();
    wet.gain.value = 0.35;
    delay.connect(feedback).connect(delay);
    delay.connect(wet).connect(master);
    const nodes = { ctx, master, delay };
    nodesRef.current = nodes;
    return nodes;
  }, []);

  /** 开嗓（用户手势触发）：建图 + resume */
  const unmute = useCallback(() => {
    const nodes = ensure();
    if (!nodes) return;
    void nodes.ctx.resume();
    setEnabled(true);
  }, [ensure]);

  const mute = useCallback(() => {
    setEnabled(false);
    if (nodesRef.current) void nodesRef.current.ctx.suspend();
  }, []);

  const toggle = useCallback(() => {
    if (enabled) mute();
    else unmute();
  }, [enabled, mute, unmute]);

  /**
   * 弹一个音：noteIndex 五声音阶级（0-4），octave 八度偏移
   * enabled 之外静默不发声；hover 连划时靠 liveRef 限流。
   */
  const play = useCallback(
    (noteIndex: number, octave = 0) => {
      const nodes = nodesRef.current;
      if (!enabled || !nodes || nodes.ctx.state !== 'running') return;
      if (liveRef.current > 24) return;
      liveRef.current += 1;
      const { ctx, master, delay } = nodes;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = pentaFreq(noteIndex, octave);
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1700; // 柔化锯齿毛刺，贴近原站软 synth 听感
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, t);
      env.gain.exponentialRampToValueAtTime(0.5, t + 0.012);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      osc.connect(lp).connect(env);
      env.connect(master);
      env.connect(delay);
      osc.start(t);
      osc.stop(t + 0.6);
      osc.onended = () => {
        liveRef.current -= 1;
        osc.disconnect();
        lp.disconnect();
        env.disconnect();
      };
    },
    [enabled],
  );

  /** 卸载清理：关 AudioContext（性能铁律） */
  useEffect(() => {
    return () => {
      if (nodesRef.current) {
        void nodesRef.current.ctx.close();
        nodesRef.current = null;
      }
    };
  }, []);

  return { enabled, toggle, unmute, play };
}
