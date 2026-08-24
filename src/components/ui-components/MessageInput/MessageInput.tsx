import React from 'react';

interface MessageInputProps {
  recipientName: string;
  onSend?: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ recipientName, onSend }) => {
  return (
    <div
      className="w-full min-w-[260px] max-w-[380px] rounded-[28px] p-5 transition-transform duration-200 hover:scale-[1.01]"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(248,246,242,0.92) 100%)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)',
        border: '1px solid rgba(255,255,255,0.85)',
      }}
    >
      <div className="relative z-10">
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/50 mb-5">
          <input type="text" placeholder={`Message ${recipientName}...`} className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-base" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {[<svg key="p" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>,
              <svg key="i" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
              <svg key="f" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>,
              <svg key="v" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
            ].map((icon, i) => (
              <button key={i} className="w-10 h-10 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 flex items-center justify-center text-gray-500 hover:bg-white/70 transition-colors">{icon}</button>
            ))}
          </div>
          <button
            className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 hover:opacity-90 transition-opacity"
            onClick={onSend}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
          </button>
        </div>
      </div>
    </div>
  );
};