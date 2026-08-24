import React from 'react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

interface BottomNavigationProps {
  items: NavItem[];
  onAdd?: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ items, onAdd }) => {
  return (
    <div
      className="w-full min-w-[300px] max-w-[400px] rounded-[24px] px-6 py-5"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(245,243,238,0.9) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
        border: '1px solid rgba(255,255,255,0.8)',
      }}
    >
      <div className="flex items-center justify-between">
        {items.slice(0, 2).map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
        <button
          className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform"
          onClick={onAdd}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        {items.slice(2).map((item, index) => (
          <NavItem key={index + 2} {...item} />
        ))}
      </div>
    </div>
  );
};

const NavItem: React.FC<NavItem> = ({ icon, label, isActive }) => {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-0.5 transition-transform">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
        isActive ? 'bg-black text-white shadow-lg' : 'bg-white/60 backdrop-blur-sm text-gray-500 border border-white/40'
      }`}>
        {icon}
      </div>
      <span className={`text-xs font-medium ${isActive ? 'text-black' : 'text-gray-400'}`}>{label}</span>
    </div>
  );
};