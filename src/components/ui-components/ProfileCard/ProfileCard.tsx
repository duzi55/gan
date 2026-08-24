import React from 'react';

interface ProfileCardProps {
  name: string;
  role: string;
  avatar?: string;
  tags: string[];
  rating: number;
  earned: string;
  rate: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ name, role, avatar, tags, rating, earned, rate }) => {
  return (
    <div
      className="w-full min-w-[260px] max-w-[360px] rounded-[28px] p-6 transition-transform duration-200 hover:scale-[1.01]"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(248,246,242,0.92) 100%)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)',
        border: '1px solid rgba(255,255,255,0.85)',
      }}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/60 shadow-lg">
            {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-cyan-200 to-cyan-300" />}
          </div>
          <button className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm border border-white/50 flex items-center justify-center text-gray-500 shadow-md hover:bg-white/80 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          </button>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{name}</h2>
        <p className="text-gray-400 mb-4 text-sm">{role}</p>
        <div className="flex gap-2 mb-5">
          {tags.map((tag) => <span key={tag} className="px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-white/40 text-xs font-medium text-gray-600">{tag}</span>)}
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span className="font-semibold text-gray-800 text-sm">{rating}</span>
            </div>
            <p className="text-xs text-gray-400">Rating</p>
          </div>
          <div className="text-center"><p className="font-semibold text-gray-800 mb-1 text-sm">{earned}</p><p className="text-xs text-gray-400">Earned</p></div>
          <div className="text-center"><p className="font-semibold text-gray-800 mb-1 text-sm">{rate}</p><p className="text-xs text-gray-400">Rate</p></div>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-400 text-white font-medium shadow-lg shadow-cyan-500/25 hover:opacity-90 transition-opacity">Get in touch</button>
          <button className="w-14 h-14 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50 flex items-center justify-center text-gray-500 shadow-md hover:bg-white/80 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
};