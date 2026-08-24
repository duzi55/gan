import React from 'react';

interface UserProfileProps {
  name: string;
  status: string;
  avatar?: string;
  bio?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ name, status, avatar, bio }) => {
  return (
    <div
      className="w-full min-w-[260px] max-w-[380px] rounded-[28px] p-6 transition-transform duration-200 hover:scale-[1.01]"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(248,246,242,0.92) 100%)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)',
        border: '1px solid rgba(255,255,255,0.85)',
      }}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <button className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm border border-white/40 flex items-center justify-center text-gray-500 hover:bg-white/70 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm border border-white/40 flex items-center justify-center text-gray-500 hover:bg-white/70 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm border border-white/40 flex items-center justify-center text-gray-500 hover:bg-white/70 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/60 shadow-lg mb-4">
            {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-pink-200 to-pink-300" />}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{name}</h2>
          <p className="text-sm text-gray-400">{status}</p>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>, label: 'Message' },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>, label: 'Call' },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>, label: 'Video call' },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>, label: 'Private' },
          ].map((action, index) => (
            <button key={index} className="flex flex-col items-center gap-2 hover:-translate-y-0.5 transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/40 flex items-center justify-center text-gray-600">{action.icon}</div>
              <span className="text-xs font-medium text-gray-500">{action.label}</span>
            </button>
          ))}
        </div>
        {bio && (
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
            <p className="text-xs text-gray-400 mb-1">bio</p>
            <p className="text-sm text-gray-600">{bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};