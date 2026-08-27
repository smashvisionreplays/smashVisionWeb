import React from 'react';

// The row used by both the share and download option modals: icon tile, label
// and one line explaining what the format is for.
const ClipOptionButton = ({ icon, label, description, onClick, busy = false, className = '' }) => (
  <button
    onClick={onClick}
    disabled={busy}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left hover:bg-white/[0.06] hover:border-[#acbb22]/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
  >
    <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#acbb22]/20 to-[#B8E016]/5 border border-[#acbb22]/25 flex items-center justify-center text-[#B8E016] shrink-0">
      {busy
        ? <span className="w-5 h-5 rounded-full border-2 border-[#acbb22]/30 border-t-[#B8E016] animate-spin"></span>
        : <span className="w-5 h-5">{icon}</span>}
    </span>
    <span className="flex flex-col min-w-0">
      <span className="text-white/90 text-sm font-semibold">{label}</span>
      <span className="text-white/40 text-xs leading-relaxed">{description}</span>
    </span>
  </button>
);

export const ShareIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
  </svg>
);

export const DownloadIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
  </svg>
);

export const InstagramIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export default ClipOptionButton;
