import React from "react";

export default function Header({ onToggleSound, soundEnabled, unreadAlerts = true }) {
  return (
    <header className="h-16 px-6 border-b border-[#00f3ff]/15 bg-[#0a1020]/60 backdrop-blur-md flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
      {/* Title in Cyan on Left */}
      <div className="flex items-baseline gap-3">
        <h1 className="text-xl font-black tracking-widest text-[#00f3ff] drop-shadow-[0_0_12px_rgba(0,243,255,0.6)] flex items-center gap-2">
          <svg className="w-5 h-5 text-[#00f3ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          DEEP SPACE CLINIC
        </h1>
        <span className="text-[10px] font-mono text-gray-400 tracking-wider pl-3 border-l border-white/15 hidden sm:inline">
          HABITAT-ALPHA // BIO-TELEMETRY
        </span>
      </div>

      {/* Right Controls: Mission Sol Clock, Audio Toggle, Bell & Help Icons */}
      <div className="flex items-center gap-3">
        {/* Mission Clock */}
        <div className="font-mono text-xs text-gray-300 bg-[#00f3ff]/5 border border-[#00f3ff]/20 px-3 py-1.5 rounded-full flex items-center gap-2 hidden md:flex">
          <span className="text-[#ffd600] font-bold">SOL 342</span>
          <span>14:38:09 UTC</span>
        </div>

        {/* Audio FX Toggle */}
        <button
          onClick={onToggleSound}
          className="font-mono text-xs px-2.5 py-1.5 rounded-lg border border-[#00f3ff]/30 text-[#00f3ff] bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 transition-all flex items-center gap-1.5"
          title="Toggle UI Audio Chirps"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 010 7.07" />
          </svg>
          <span className="hidden sm:inline">{soundEnabled ? "AUDIO ON" : "AUDIO OFF"}</span>
        </button>

        {/* Notification Bell with Badge */}
        <button
          className="w-9 h-9 rounded-lg bg-slate-900/70 border border-white/10 hover:border-[#00f3ff] text-gray-300 hover:text-[#00f3ff] flex items-center justify-center relative transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          title="Telemetry Notifications"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadAlerts && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff2a55] shadow-[0_0_8px_#ff2a55] animate-ping" />
          )}
        </button>

        {/* Help Question Mark Icon */}
        <button
          className="w-9 h-9 rounded-lg bg-slate-900/70 border border-white/10 hover:border-[#00f3ff] text-gray-300 hover:text-[#00f3ff] flex items-center justify-center transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          title="NASA Clinic Manual & Protocol"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </button>
      </div>
    </header>
  );
}

