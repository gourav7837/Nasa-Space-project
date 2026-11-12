import React from "react";

export default function Sidebar({ activeTab = "vitals", onSelectTab }) {
  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    },
    {
      id: "careers",
      label: "Careers",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21a6.5 6.5 0 0113 0" />
        </svg>
      )
    },
    {
      id: "vitals",
      label: "Log Vitals",
      isLive: true,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      )
    },
    {
      id: "exercises",
      label: "Exercises",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M6 16.5l4-4 4 4 6-6" />
          <path d="M16 6h4v4" />
        </svg>
      )
    },
    {
      id: "healthcare",
      label: "Health Care",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M2 12h20" />
        </svg>
      )
    },
    {
      id: "advanced",
      label: "Advanced",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      )
    }
  ];

  return (
    <aside className="w-64 bg-[#0a1020]/80 backdrop-blur-xl border-r border-[#00f3ff]/15 flex flex-col flex-shrink-0 z-20">
      {/* Top Left Title and NASA Branding */}
      <div className="p-5 border-b border-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0b3d91] to-[#00f3ff]/40 border border-[#00f3ff] shadow-[0_0_12px_rgba(0,243,255,0.4)] flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="#0b3d91" />
            <circle cx="35" cy="30" r="2" fill="#fff" />
            <circle cx="68" cy="28" r="2" fill="#fff" />
            <circle cx="60" cy="68" r="2" fill="#fff" />
            <circle cx="28" cy="62" r="1.5" fill="#fff" />
            <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="#00f3ff" strokeWidth="2.5" transform="rotate(-30 50 50)" />
            <path d="M 24 64 Q 50 32 78 40 L 74 46 Q 50 42 30 70 Z" fill="#ff2a55" />
          </svg>
        </div>
        <div className="overflow-hidden">
          <h1 className="text-sm font-extrabold tracking-wider text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.5)] font-sans uppercase">
            DEEP SPACE CLINIC
          </h1>
          <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
            NASA Space Apps
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab && onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-200 text-left relative ${
                isActive
                  ? "bg-[#00f3ff]/15 text-white border border-[#00f3ff]/60 shadow-[0_0_16px_rgba(0,243,255,0.25)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <span className={isActive ? "text-[#00f3ff] drop-shadow-[0_0_6px_#00f3ff]" : "text-gray-400"}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.isLive && (
                <span className="text-[9px] font-mono font-bold bg-[#00f3ff]/20 text-[#00f3ff] px-1.5 py-0.5 rounded border border-[#00f3ff]/40 tracking-wider">
                  LIVE
                </span>
              )}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#00f3ff] rounded-r shadow-[0_0_8px_#00f3ff]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Crew Info Footer */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#00ff88] p-0.5 shadow-[0_0_8px_rgba(0,255,136,0.4)] flex items-center justify-center font-mono text-xs font-bold text-[#00f3ff] bg-slate-900">
            AV
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">Cmdr. Alex Vance</p>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#00ff88]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_6px_#00ff88]" />
              BIOSYNC STABLE
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

