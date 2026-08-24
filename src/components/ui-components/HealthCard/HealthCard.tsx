import React from 'react';

interface HealthCardProps {
  heartRate: number;
  distance: string;
  calories: number;
  standHours: number;
  onStart?: () => void;
}

export const HealthCard: React.FC<HealthCardProps> = ({
  heartRate,
  distance,
  calories,
  standHours,
  onStart,
}) => {
  const heartWaveData = [
    2, 3, 2, 4, 3, 5, 4, 6, 5, 8, 6, 10, 8, 12, 10, 15, 12, 18, 14, 22,
    16, 28, 18, 32, 20, 26, 18, 20, 16, 14, 12, 15, 13, 18, 14, 22, 16, 28, 20, 35,
    22, 30, 18, 15, 12, 10, 8, 6, 5, 4, 3, 4, 3, 5, 4, 6, 5, 8, 6, 10
  ];

  return (
    <div
      className="w-full min-w-[300px] max-w-[600px] rounded-[32px] overflow-hidden transition-transform duration-200 hover:scale-[1.01]"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(248,246,242,0.92) 100%)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 16px 56px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(255,255,255,0.4)',
        border: '1px solid rgba(255,255,255,0.85)',
      }}
    >
      {/* 心率区域 - 心形、文字、波形图在同一行 */}
      <div className="flex items-center px-5 sm:px-8 pt-6 sm:pt-8 pb-6">
        {/* 心形图标 */}
        <div className="relative flex-shrink-0 w-10 h-10 sm:w-[72px] sm:h-[72px]">
          <div className="absolute inset-0 rounded-full border border-pink-200/40 animate-ping" style={{ animationDuration: '2.5s' }}></div>
          <div className="absolute -inset-4 rounded-full border border-pink-100/30 animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-100/80 to-pink-50/50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-[38px] sm:h-[38px]" viewBox="0 0 24 24" fill="url(#hg2)">
              <defs>
                <linearGradient id="hg2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF7B7B" />
                  <stop offset="50%" stopColor="#FF5252" />
                  <stop offset="100%" stopColor="#E84040" />
                </linearGradient>
              </defs>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
        </div>
        
        {/* 心率文字 */}
        <div className="ml-2 sm:ml-6 flex-shrink-0">
          <p className="text-[10px] sm:text-sm text-gray-400 font-medium mb-1">Heart Rate</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-[52px] font-extrabold text-gray-800 tracking-tight leading-none">{heartRate}</span>
            <span className="text-xs sm:text-lg text-gray-500 font-medium">BPM</span>
          </div>
        </div>
        
        {/* 心率波形图 - 用flex-1占剩余空间，右侧留padding */}
        <div className="flex-1 min-w-0 flex items-end gap-px sm:gap-[2px] h-10 sm:h-14 ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-gray-200/40 overflow-hidden">
          {heartWaveData.map((height, i) => (
            <div
              key={i}
              className="flex-1 min-w-0 rounded-full"
              style={{
                height: `${height}px`,
                backgroundColor: height > 25 ? '#EF4444' : height > 15 ? '#F87171' : height > 8 ? '#FCA5A5' : '#FECACA',
              }}
            />
          ))}
        </div>
      </div>
      
      {/* 水平分割线 */}
      <div className="mx-5 sm:mx-8 h-[1px] bg-gradient-to-r from-transparent via-gray-200/60 to-transparent"></div>
      
      {/* 数据区域 - 三列带竖线 */}
      <div className="flex items-start px-6 sm:px-8 py-5 sm:py-6 gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight leading-none">{distance.split(' ')[0]}</span>
            <span className="text-sm sm:text-base text-gray-500 font-medium">{distance.split(' ')[1]}</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5">Distance</p>
        </div>
        
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-gray-200/70 to-transparent mx-1 sm:mx-3 mt-2 flex-shrink-0"></div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight leading-none">{calories}</span>
            <span className="text-sm sm:text-base text-gray-500 font-medium">kcal</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5">Calories</p>
        </div>
        
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-gray-200/70 to-transparent mx-1 sm:mx-3 mt-2 flex-shrink-0"></div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight leading-none">{standHours}</span>
            <span className="text-sm sm:text-base text-gray-500 font-medium">hr</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5 whitespace-nowrap">Stand Hours</p>
        </div>
      </div>
      
      {/* 底部导航 + GO按钮 */}
      <div className="relative px-4 sm:px-6 pb-6">
        <div
          className="rounded-[28px] px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.65) 100%)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 2px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(255,255,255,0.3)',
            border: '1px solid rgba(255,255,255,0.9)',
          }}
        >
          {/* Workouts */}
          <div className="flex flex-col items-center gap-1 sm:gap-2 hover:-translate-y-0.5 transition-transform">
            <div className="w-9 h-9 sm:w-[46px] sm:h-[46px] rounded-[14px] bg-gray-800 flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 sm:w-[22px] sm:h-[22px]" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.5 6.5h11"></path><path d="M6.5 17.5h11"></path><path d="M6 6.5v11"></path><path d="M18 6.5v11"></path><path d="M3 9v6"></path><path d="M21 9v6"></path>
              </svg>
            </div>
            <span className="hidden sm:block text-xs font-semibold text-gray-800">Workouts</span>
          </div>

          {/* Goals */}
          <div className="flex flex-col items-center gap-1 sm:gap-2 hover:-translate-y-0.5 transition-transform">
            <div className="w-9 h-9 sm:w-[46px] sm:h-[46px] rounded-[14px] bg-white/60 backdrop-blur-sm flex items-center justify-center border border-white/60">
              <svg className="w-4 h-4 sm:w-[22px] sm:h-[22px]" viewBox="0 0 24 24" fill="none" stroke="#B8B8B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <span className="hidden sm:block text-xs font-medium text-gray-400">Goals</span>
          </div>

          {/* GO! 按钮 */}
          <button className="relative -mt-8 sm:-mt-14 hover:scale-110 transition-transform" onClick={onStart}>
            <div className="absolute -inset-4 sm:-inset-6 rounded-full bg-orange-300/35 blur-2xl"></div>
            <div className="absolute -inset-2 sm:-inset-3 rounded-full bg-orange-400/25 blur-xl"></div>
            <div
              className="relative w-[56px] h-[56px] sm:w-[84px] sm:h-[84px] rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 35% 28%, #FFE0A0 0%, #FFBA4D 18%, #FF9500 38%, #FF7B00 55%, #F25C05 75%, #D94F00 100%)',
                boxShadow: '0 14px 40px rgba(242, 92, 5, 0.5), 0 6px 20px rgba(242, 92, 5, 0.35), inset 0 -8px 20px rgba(0,0,0,0.1), inset 0 8px 20px rgba(255,255,255,0.35)',
              }}
            >
              <div className="absolute top-2 left-3 sm:top-3 sm:left-4 w-5 h-3 sm:w-8 sm:h-5 rounded-full bg-white/40 blur-[4px] rotate-[-25deg]"></div>
              <span className="text-white font-extrabold text-base sm:text-[26px] drop-shadow-md">GO!</span>
            </div>
          </button>

          {/* Club */}
          <div className="flex flex-col items-center gap-1 sm:gap-2 hover:-translate-y-0.5 transition-transform">
            <div className="w-9 h-9 sm:w-[46px] sm:h-[46px] rounded-[14px] bg-white/60 backdrop-blur-sm flex items-center justify-center border border-white/60">
              <svg className="w-4 h-4 sm:w-[22px] sm:h-[22px]" viewBox="0 0 24 24" fill="none" stroke="#B8B8B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
              </svg>
            </div>
            <span className="hidden sm:block text-xs font-medium text-gray-400">Club</span>
          </div>

          {/* Account */}
          <div className="flex flex-col items-center gap-1 sm:gap-2 hover:-translate-y-0.5 transition-transform">
            <div className="w-9 h-9 sm:w-[46px] sm:h-[46px] rounded-[14px] bg-white/60 backdrop-blur-sm flex items-center justify-center border border-white/60">
              <svg className="w-4 h-4 sm:w-[22px] sm:h-[22px]" viewBox="0 0 24 24" fill="none" stroke="#B8B8B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span className="hidden sm:block text-xs font-medium text-gray-400">Account</span>
          </div>
        </div>
      </div>
    </div>
  );
};