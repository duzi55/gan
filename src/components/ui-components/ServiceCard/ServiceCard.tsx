import React from 'react';

interface ServiceItem {
  icon: React.ReactNode;
  label: string;
  color: string;
}

interface ServiceCardProps {
  services: ServiceItem[];
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ services }) => {
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
            <p className="text-sm text-gray-400 mb-1">October 27, 2025</p>
            <h2 className="text-xl font-semibold text-gray-900">Welcome Back, John</h2>
          </div>
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/40">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium text-gray-600">Online</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-5">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col items-center gap-2 hover:-translate-y-0.5 transition-transform">
              <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center text-white shadow-lg`}>{service.icon}</div>
              <span className="text-xs font-medium text-gray-600">{service.label}</span>
            </div>
          ))}
        </div>
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/50 flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Where to?" className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-sm" />
          <button className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/40 hover:bg-white/80 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span className="text-xs font-medium text-gray-600">Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};