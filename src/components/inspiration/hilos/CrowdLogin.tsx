/**
 * CrowdLogin.tsx —— IN-07 人群登录原型（hilos.sh/login 1:1 复刻）
 * 2026-09-08 Claude·新增：
 *   - 构图 1:1：全屏手绘动物人群（CrowdField）+ 居中白色圆角登录卡
 *     （滑板狗 logo / hilos 字标 / 标语 / Watch demo / 邮箱 magic link /
 *     or 分隔 / GitHub·Google 第三方登录）；
 *   - 灵魂交互复刻：划过动物会「跳」（Lift）并「叫」（小调五声音阶
 *     sawtooth + 混响尾，默认静音，左下「Unmute the crowd」开嗓）；
 *   - 复刻边界声明（纯前端演示，无后端、无 mock）：
 *     ① Watch demo——原站为演示视频弹层，此处以「全场波浪」彩蛋代替；
 *     ② Continue with email——仅前端校验格式，合法即置 sent 态并全场
 *        庆祝波浪，不发送任何请求；
 *     ③ GitHub / Google——原站走 OAuth 跳转，复刻不跳转，以波浪回敬。
 *   - 移动端：卡片 min(430px, 92vw) 钳制，超高小屏卡片列内部滚动。
 *   - 配置项（2026-09-08 Claude·用户点单「边框太粗，提供配置项」）：
 *     右下角「人群调参」面板——描边粗细 / 人群大小 / 跳跃高度实时可调，
 *     状态字段见 hilosShared.CrowdConfig，hover 果冻跳动画在 CrowdField。
 */

'use client';

import { useState } from 'react';
import CrowdField from './CrowdField';
import CrowdControls from './CrowdControls';
import { useCrowdSynth } from './useCrowdSynth';
import { CROWD_CONFIG_DEFAULT, CROWD_TAGLINE, type CrowdConfig } from './hilosShared';
import { SkateDogIcon } from './animals';

/** GitHub 单色标（Simple Icons 路径，fill currentColor） */
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.04 11.04 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

/** Google「G」单色简笔（弧 + 横杠，stroke 风格与人群描边呼应） */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M21 12.2A9 9 0 1 1 15.2 4.6" />
      <path d="M12 12h8.4" />
    </svg>
  );
}

export default function CrowdLogin() {
  const synth = useCrowdSynth();
  const [wave, setWave] = useState(0); // 全场波浪触发器（波浪 = 本复刻的通用彩蛋反馈）
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  /* 2026-09-08 Claude·人群配置项（用户点单「边框太粗，提供配置项」）：
     状态集中在此，CrowdField 经 CSS 变量/布局参数即时响应 */
  const [crowdCfg, setCrowdCfg] = useState<CrowdConfig>(CROWD_CONFIG_DEFAULT);
  const [controlsOpen, setControlsOpen] = useState(false);
  const cheer = () => setWave((w) => w + 1);

  /** 邮箱登录：仅前端格式校验（复刻演示无后端），合法 → sent 态 + 全场庆祝 */
  const submitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (sent) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;
    setSent(true);
    cheer();
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* 人群铺底（划过会跳、开嗓后会叫；描边/大小/跳跃受配置项驱动） */}
      <CrowdField onAnimalSound={synth.play} waveKey={wave} config={crowdCfg} />

      {/* 居中登录卡（1:1 原站构图）
          2026-09-08 Claude·修复 hover 穿透（用户报「hover 没效果」）：容器
          inset-0 全屏覆盖曾拦截全部指针事件、人群永远收不到 hover——
          容器 pointer-events-none 穿透，仅卡片本体恢复交互 */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-y-auto overscroll-contain p-4">
        <div
          className="pointer-events-auto w-[min(430px,92vw)] rounded-[28px] border border-neutral-100 bg-white px-7 py-9 sm:px-9"
          style={{ boxShadow: '0 30px 90px -24px rgba(15,15,20,0.35), 0 4px 18px -6px rgba(15,15,20,0.12)' }}
        >
          <SkateDogIcon className="mx-auto h-16 w-auto" />
          <h1 className="mt-1 text-center text-[34px] font-extrabold tracking-tight text-neutral-900">hilos</h1>
          <p className="mt-1.5 text-center text-[15px] text-neutral-500">{CROWD_TAGLINE}</p>

          {/* Watch demo：原站为视频弹层，复刻以全场波浪彩蛋代替（见文件头声明①） */}
          <button
            type="button"
            onClick={cheer}
            className="mx-auto mt-4 flex items-center gap-2 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-950"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white">
              <svg viewBox="0 0 10 12" className="ml-0.5 h-2 w-2" fill="currentColor" aria-hidden="true"><path d="M0 0 L10 6 L0 12 z" /></svg>
            </span>
            Watch demo
          </button>

          {/* 邮箱 magic link（复刻演示无后端，见文件头声明②） */}
          <form onSubmit={submitEmail} className="mt-5 space-y-3">
            <input
              type="email"
              required
              value={email}
              disabled={sent}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              aria-label="Email"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[15px] text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 disabled:opacity-60"
            />
            <button
              type="submit"
              className={`w-full rounded-xl px-4 py-3 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 ${
                sent ? 'bg-emerald-600' : 'bg-neutral-900 hover:bg-neutral-800'
              }`}
            >
              {sent ? 'Magic link sent ✓' : 'Continue with email'}
            </button>
          </form>

          {/* or 分隔（1:1：细线 + 小字） */}
          <div className="my-4 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-neutral-200" />
            <span className="text-xs text-neutral-400">or</span>
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          {/* 第三方登录（复刻不跳转，见文件头声明③） */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={cheer}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-neutral-100 px-4 py-3 text-[15px] font-medium text-neutral-800 transition-colors hover:bg-neutral-200"
            >
              <GithubIcon className="h-[18px] w-[18px]" />
              Continue with GitHub
            </button>
            <button
              type="button"
              onClick={cheer}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-neutral-100 px-4 py-3 text-[15px] font-medium text-neutral-800 transition-colors hover:bg-neutral-200"
            >
              <GoogleIcon className="h-[18px] w-[18px]" />
              Continue with Google
            </button>
          </div>
        </div>
      </div>

      {/* 左下角声音开关（1:1 原站「Unmute the crowd」圆球） */}
      <button
        type="button"
        onClick={synth.toggle}
        aria-pressed={synth.enabled}
        aria-label={synth.enabled ? 'Mute the crowd' : 'Unmute the crowd'}
        title={synth.enabled ? 'Mute the crowd' : 'Unmute the crowd'}
        className={`absolute bottom-5 left-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border shadow-lg transition-all hover:scale-105 ${
          synth.enabled ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-white text-neutral-700'
        }`}
      >
        {/* 音符图标：开嗓后带声波线 */}
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18V5l10-2v13" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="16.5" cy="16" r="2.5" />
          {!synth.enabled && <path d="M3 3l18 18" />}
        </svg>
      </button>

      {/* 右下角「人群调参」入口 + 面板（复刻原站 Crowd Controls，2026-09-08 Claude·配置项） */}
      <div className="absolute bottom-5 right-5 z-20 flex flex-col items-end gap-3">
        {controlsOpen && <CrowdControls value={crowdCfg} onChange={setCrowdCfg} />}
        <button
          type="button"
          onClick={() => setControlsOpen((o) => !o)}
          aria-expanded={controlsOpen}
          aria-label={controlsOpen ? 'Close crowd controls' : 'Open crowd controls'}
          title={controlsOpen ? 'Close crowd controls' : 'Open crowd controls'}
          className={`flex h-11 w-11 items-center justify-center rounded-full border shadow-lg transition-all hover:scale-105 ${
            controlsOpen ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-white text-neutral-700'
          }`}
        >
          {/* 滑杆图标（调参语义） */}
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 8h9M19 8h1M4 16h3M13 16h7" />
            <circle cx="16" cy="8" r="2.2" />
            <circle cx="10" cy="16" r="2.2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
