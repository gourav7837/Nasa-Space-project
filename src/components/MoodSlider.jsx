import React, { useState } from "react";

export default function MoodSlider() {
  const [mood, setMood] = useState(84);

  // Derived psychological indices
  const dopamine = Math.min(99, Math.round(mood * 0.95 + 10));
  const cortisol = Math.max(8, Math.round(100 - mood * 0.85));
  const focus = Math.min(99, Math.round(mood * 0.88 + 15));

  const getStatusText = (val) => {
    if (val < 30) return "EXHAUSTED";
    if (val < 65) return "ADAPTING";
    if (val < 85) return "BALANCED";
    return "OPTIMAL";
  };

  return (
    <div className="bg-[#0e1628]/70 backdrop-blur-md rounded-xl p-4 border border-[#00f3ff]/40 shadow-[0_0_18px_rgba(0,243,255,0.18)] flex flex-col justify-between">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#00f3ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeWidth="2" d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" />
            <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2" />
          </svg>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]">
            Mood Slider
          </h2>
        </div>
        <span className="text-[10px] font-mono text-[#00f3ff] bg-[#00f3ff]/15 px-2 py-0.5 rounded border border-[#00f3ff]/30">
          PSYCH-EVAL
        </span>
      </div>

      {/* Controlled Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-white tracking-wide">
          <span>HOW ARE YOU FEELING TODAY?</span>
          <span className="font-mono text-[11px] text-[#00f3ff] bg-[#00f3ff]/15 px-2 py-0.5 rounded-full border border-[#00f3ff]/30">
            {mood}% {getStatusText(mood)}
          </span>
        </div>

        <div className="py-1">
          <input
            type="range"
            min="0"
            max="100"
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-[#ff2a55] via-[#ffd600] to-[#00f3ff] focus:outline-none accent-[#00f3ff]"
          />
        </div>

        <div className="flex justify-between font-mono text-[10px]">
          <span className="text-[#ff2a55]">◀ Exhausted / Isolated</span>
          <span className="text-[#00f3ff]">Energetic / Balanced ▶</span>
        </div>
      </div>

      {/* Neurochemical Readouts */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/5 font-mono">
        <div className="bg-[#0b1222] p-2 rounded border border-white/5 text-center">
          <div className="text-sm font-bold text-white">{dopamine}%</div>
          <div className="text-[9px] text-gray-400 uppercase tracking-wider mt-0.5">Dopamine</div>
        </div>
        <div className="bg-[#0b1222] p-2 rounded border border-white/5 text-center">
          <div className="text-sm font-bold text-[#ffd600]">{cortisol}%</div>
          <div className="text-[9px] text-gray-400 uppercase tracking-wider mt-0.5">Cortisol</div>
        </div>
        <div className="bg-[#0b1222] p-2 rounded border border-white/5 text-center">
          <div className="text-sm font-bold text-[#00ff88]">{focus}%</div>
          <div className="text-[9px] text-gray-400 uppercase tracking-wider mt-0.5">Focus Index</div>
        </div>
      </div>
    </div>
  );
}

