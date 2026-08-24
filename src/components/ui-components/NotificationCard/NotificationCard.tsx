import React from 'react';

interface NotificationCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ title, description, icon }) => {
  return (
    <div
      className="w-full min-w-[260px] max-w-[380px] rounded-[28px] p-8 transition-transform duration-200 hover:scale-[1.01]"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(248,246,242,0.92) 100%)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)',
        border: '1px solid rgba(255,255,255,0.85)',
      }}
    >
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center mb-6 border border-yellow-100/50 shadow-inner">
          {icon || (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
      </div>
    </div>
  );
};