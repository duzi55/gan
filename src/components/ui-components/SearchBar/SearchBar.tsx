import React from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search for actions, people, instruments', onSearch }) => {
  return (
    <div
      className="w-full min-w-[260px] max-w-[400px] rounded-[28px] p-5 transition-transform duration-200 hover:scale-[1.01]"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(248,246,242,0.92) 100%)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)',
        border: '1px solid rgba(255,255,255,0.85)',
      }}
    >
      <div className="relative z-10 bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/50 flex items-center gap-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" placeholder={placeholder} className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-sm" onChange={(e) => onSearch?.(e.target.value)} />
      </div>
    </div>
  );
};