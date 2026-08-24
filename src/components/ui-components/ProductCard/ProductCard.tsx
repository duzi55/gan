import React from 'react';

interface ProductCardProps {
  title: string;
  price: string;
  imageUrl: string;
  onAdd?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ title, price, imageUrl, onAdd }) => {
  return (
    <div
      className="w-full min-w-[260px] max-w-[360px] rounded-[24px] overflow-hidden transition-transform duration-200 hover:scale-[1.01]"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(245,243,238,0.9) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
        border: '1px solid rgba(255,255,255,0.8)',
      }}
    >
      <div className="relative z-10 flex h-[220px] p-5">
        <div className="flex-1 flex flex-col justify-center pr-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">{title}</h3>
          <p className="text-lg text-gray-500">{price}</p>
        </div>
        <div className="relative w-32 h-full rounded-2xl overflow-hidden flex-shrink-0">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>
      <button
        className="absolute bottom-5 right-5 z-20 w-11 h-11 rounded-full bg-white/70 backdrop-blur-md border border-white/60 flex items-center justify-center text-gray-600 shadow-lg hover:scale-110 transition-transform"
        onClick={onAdd}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};