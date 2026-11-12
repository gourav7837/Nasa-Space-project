import React, { useRef, useEffect } from "react";

export default function MarsGameProgress({ progress = 68 }) {
  const canvasRef = useRef(null);

  // 3D Neon Wireframe Martian Landscape
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let offset = 0;

    const GRID_COLS = 20;
    const GRID_ROWS = 12;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      offset += 0.015;

      const fov = 180;
      const camY = 85;
      const horizon = canvas.height * 0.38;

      ctx.lineWidth = 1;

      // Latitude lines
      for (let r = 0; r < GRID_ROWS; r++) {
        const z = (r * 20 - (offset * 24) % 20) + 18;
        const scale = fov / (z + fov);
        const y = horizon + camY * scale;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 42, 85, ${Math.max(0.1, 0.75 - r / GRID_ROWS)})`;
        ctx.shadowColor = "#ff2a55";
        ctx.shadowBlur = r < 4 ? 6 : 1;

        const startX = canvas.width / 2 - GRID_COLS * 16 * scale;
        const endX = canvas.width / 2 + GRID_COLS * 16 * scale;
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
      }

      // Longitude perspective lines
      for (let c = -GRID_COLS / 2; c <= GRID_COLS / 2; c++) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 42, 85, 0.3)";
        ctx.shadowBlur = 2;

        for (let r = 0; r < GRID_ROWS; r++) {
          const z = (r * 20 - (offset * 24) % 20) + 18;
          const scale = fov / (z + fov);
          const x = canvas.width / 2 + c * 32 * scale;
          let y = horizon + camY * scale;

          // Martian terrain dunes
          const elevation = Math.sin(c * 0.45 + offset) * Math.cos(r * 0.5) * 7 * scale;
          y -= elevation;

          if (r === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // 3D Martian Outpost Geodesic Dome
      const domeZ = 120;
      const domeScale = fov / (domeZ + fov);
      const domeX = canvas.width / 2;
      const domeY = horizon + camY * domeScale - 20 * domeScale;
      const domeRadius = 38 * domeScale;

      ctx.beginPath();
      ctx.arc(domeX, domeY, domeRadius, Math.PI, 0);
      ctx.strokeStyle = "#00f3ff";
      ctx.shadowColor = "#00f3ff";
      ctx.shadowBlur = 10;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Geodesic strut crosswires
      ctx.beginPath();
      ctx.moveTo(domeX - domeRadius, domeY);
      ctx.lineTo(domeX + domeRadius, domeY);
      ctx.moveTo(domeX, domeY - domeRadius);
      ctx.lineTo(domeX, domeY);
      ctx.strokeStyle = "rgba(0, 243, 255, 0.55)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="bg-[#0e1628]/70 backdrop-blur-md rounded-xl p-4 border border-[#ff2a55]/40 shadow-[0_0_18px_rgba(255,42,85,0.18)] flex flex-col justify-between">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#ff2a55]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeWidth="2" />
          </svg>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#ff2a55] drop-shadow-[0_0_8px_rgba(255,42,85,0.4)]">
            MISSION: MARS OUTPOST BUILD
          </h2>
        </div>
        <span className="text-[10px] font-mono text-[#ff2a55] bg-[#ff2a55]/15 px-2 py-0.5 rounded border border-[#ff2a55]/30">
          SECTOR 04
        </span>
      </div>

      {/* 3D Neon Wireframe Landscape Canvas */}
      <div className="relative w-full h-44 bg-gradient-to-b from-[#ff2a55]/10 to-black/60 rounded-lg border border-[#ff2a55]/25 overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} width="320" height="176" className="w-full h-full block" />
        <div className="absolute top-2 left-2 text-[9px] font-mono text-[#ff2a55] bg-black/70 px-2 py-0.5 rounded border border-[#ff2a55]/40 backdrop-blur-sm pointer-events-none">
          TERRAIN SCAN // GEO-SYNCHRONOUS
        </div>
      </div>

      {/* Blue Progress Bar at Bottom */}
      <div className="mt-3 bg-[#0a1020]/80 p-3 rounded-lg border border-[#00f3ff]/20">
        <div className="flex justify-between items-center text-xs font-semibold text-white mb-1.5">
          <span>Colony Habitat Module 4</span>
          <span className="font-mono text-[#00f3ff] font-bold">{progress}%</span>
        </div>
        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-[#00f3ff]/30">
          <div
            className="h-full bg-gradient-to-r from-[#0066ff] to-[#00f3ff] rounded-full shadow-[0_0_12px_#00f3ff] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-[10px] text-gray-400 mt-2">
          <span>LOGGED: <b className="text-white">1,420 / 2,000</b></span>
          <span className="text-[#ffd600] font-semibold flex items-center gap-1">
            <svg className="w-3 h-3 text-[#ffd600]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            +150 BIO-CREDITS
          </span>
        </div>
      </div>
    </div>
  );
}

