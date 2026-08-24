import React from 'react';

interface FileUploadCardProps {
  onUpload?: () => void;
  onCancel?: () => void;
}

export const FileUploadCard: React.FC<FileUploadCardProps> = ({ onUpload, onCancel }) => {
  return (
    <div
      className="w-full min-w-[300px] max-w-[400px] rounded-[28px] p-6 transition-transform duration-200 hover:scale-[1.01]"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(248,246,242,0.92) 100%)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)',
        border: '1px solid rgba(255,255,255,0.85)',
      }}
    >
      <div className="relative z-10">
        <div className="border-2 border-dashed border-gray-200/60 rounded-2xl p-8 text-center mb-5 bg-white/20">
          <div className="w-16 h-16 rounded-full bg-blue-50/80 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-blue-100/50">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Drop your video here</h3>
          <p className="text-sm text-gray-400">For best results, video uploads should be at least 1080p (1920 x 1080 pixels) in MP4 format.</p>
        </div>
        <div className="rounded-2xl p-4 mb-5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 100%)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.5)' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50/80 flex items-center justify-center border border-blue-100/50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-800">Class meeting</h4>
              <p className="text-xs text-gray-400">MP4 · 24 MB · 4 sec left</p>
            </div>
            <button className="w-8 h-8 rounded-full bg-gray-100/80 flex items-center justify-center text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div className="mt-3 h-2 bg-gray-100/80 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" style={{ width: '70%' }} />
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 py-3 px-4 rounded-2xl bg-white/50 backdrop-blur-sm text-gray-600 font-medium border border-white/40 hover:bg-white/70 transition-colors" onClick={onCancel}>Cancel</button>
          <button className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg shadow-blue-500/25 hover:opacity-90 transition-opacity" onClick={onUpload}>Upload</button>
        </div>
      </div>
    </div>
  );
};