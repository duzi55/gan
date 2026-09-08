/**
 * CrowdControls.tsx —— IN-07 人群登录：人群调参面板（原站 Crowd Controls 复刻）
 * 2026-09-08 Claude·新增（用户点单「动物边框太粗，提供配置项」）：
 *   - 原站登录页自带 Crowd Controls 调参面板（Size/X gap/Y gap/Lift/音量
 *     等十余项），本复刻取最常用的三项：描边粗细 / 人群大小 / 跳跃高度；
 *   - 纯受控组件：value + onChange，状态由 CrowdLogin 持有并经
 *     CrowdField 的 CSS 变量与布局参数即时生效（解耦：面板本身不碰人群）；
 *   - Reset 一键回默认（CROWD_CONFIG_DEFAULT）。
 */

'use client';

import { CROWD_CONFIG_DEFAULT, type CrowdConfig } from './hilosShared';

interface CrowdControlsProps {
  value: CrowdConfig;
  onChange: (next: CrowdConfig) => void;
}

/** 单条滑块行：标签 + 当前值 + range（accent 色与卡片主按钮一致） */
function Row({
  label,
  display,
  min,
  max,
  step,
  value,
  onInput,
}: {
  label: string;
  display: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onInput: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-xs text-neutral-600">
        <span>{label}</span>
        <span className="font-mono text-[11px] text-neutral-400">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onInput(Number(e.target.value))}
        className="mt-1 w-full accent-neutral-900"
      />
    </label>
  );
}

export default function CrowdControls({ value, onChange }: CrowdControlsProps) {
  return (
    <div
      className="w-[min(260px,78vw)] rounded-2xl border border-neutral-100 bg-white/95 p-4 shadow-[0_18px_50px_-16px_rgba(15,15,20,0.35)] backdrop-blur"
      role="group"
      aria-label="人群调参"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-neutral-800">人群调参</p>
        <button
          type="button"
          onClick={() => onChange(CROWD_CONFIG_DEFAULT)}
          className="text-[11px] text-neutral-400 underline-offset-2 transition-colors hover:text-neutral-700 hover:underline"
        >
          Reset
        </button>
      </div>
      <div className="space-y-3">
        {/* 2026-09-08 Claude·v3：描边滑块下架（用户裁定换原作色块 SVG，无 stroke 可调） */}
        {/* 人群大小：动物边长 ≈ 容器宽 ÷ sizeDivisor（越小越大只） */}
        <Row
          label="人群大小"
          display={`÷ ${value.sizeDivisor}`}
          min={6}
          max={16}
          step={1}
          value={value.sizeDivisor}
          onInput={(v) => onChange({ ...value, sizeDivisor: v })}
        />
        {/* 跳跃高度：hover 果冻跳的 px 数 */}
        <Row
          label="跳跃高度"
          display={`${value.hopHeight}px`}
          min={6}
          max={28}
          step={1}
          value={value.hopHeight}
          onInput={(v) => onChange({ ...value, hopHeight: v })}
        />
      </div>
    </div>
  );
}
