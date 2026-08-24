import React from 'react';

interface StatsCardProps {
  greeting: string;
  date: string;
  userName: string;
  userAvatar?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ greeting, date, userName, userAvatar }) => {
  return (
    <div
      className="w-full min-w-[260px] max-w-[420px] rounded-[28px] p-6 transition-transform duration-200 hover:scale-[1.01]"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(248,246,242,0.92) 100%)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)',
        border: '1px solid rgba(255,255,255,0.85)',
      }}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div>
            <p className="text-sm text-gray-400 mb-1">{date}</p>
            <h2 className="text-2xl font-semibold text-gray-900">{greeting}</h2>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/60 shadow-md">
            {userAvatar ? <img src={userAvatar} alt={userName} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />}
          </div>
        </div>
        <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 100%)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.5)' }}>
          <div className="flex gap-2 mb-4">
            {['All', 'Active', 'Enrolled'].map((tab, index) => (
              <button key={tab} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${index === 2 ? 'bg-black text-white shadow-md' : 'bg-white/50 text-gray-500'}`}>{tab}</button>
            ))}
          </div>
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Members</h3>
              <p className="text-xs text-gray-400">Manage, total course members and their progress</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">1,930</p>
              <p className="text-xs text-gray-400">Total Members</p>
            </div>
          </div>
          <div className="h-32 rounded-xl relative overflow-hidden bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 border border-white/40">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
              <defs><linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f472b6" /><stop offset="50%" stopColor="#a78bfa" /><stop offset="100%" stopColor="#60a5fa" /></linearGradient></defs>
              <path d="M0,80 C50,70 100,60 150,50 C200,40 250,30 300,20" fill="none" stroke="url(#cg)" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="absolute top-1/2 left-2/3 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg">632</div>
          </div>
        </div>
      </div>
    </div>
  );
};