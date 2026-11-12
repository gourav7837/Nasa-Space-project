import React, { useState, useEffect, useRef } from "react";
import { subscribeToVPackStream } from "../services/firebase";

export default function WearableVPack() {
  // Live vitals stream state received from Firestore
  const [telemetry, setTelemetry] = useState({
    connected: true,
    sensorId: "VPACK-X7-PRO",
    signalStrength: 99.8,
    latencyMs: 1.2,
    batteryPct: 94,
    vo2Max: 48.2,
    cadenceRpm: 88,
    caloriesBurned: 420,
    smO2Pct: 78
  });

  const canvasRef = useRef(null);
  const isDraggingRef = useRef(false);
  const rotRef = useRef({ x: 0.2, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });

  /**
   * =========================================================================
   * FIREBASE FIRESTORE REAL-TIME STREAM HOOK
   * =========================================================================
   * Listens to live wearable biometric documents synced from the astronaut's VPack.
   * Cleans up listener on component unmount.
   * =========================================================================
   */
  useEffect(() => {
    const unsubscribe = subscribeToVPackStream((liveData) => {
      setTelemetry((prev) => ({ ...prev, ...liveData }));
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // 3D Holographic Hand & Wrist Sensor Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    // Generate 3D hand anatomical skeleton points
    const nodes = [];
    const edges = [];

    // Wrist ring (sensor coupling)
    const WRIST_POINTS = 16;
    for (let i = 0; i < WRIST_POINTS; i++) {
      const angle = (i / WRIST_POINTS) * Math.PI * 2;
      nodes.push({ x: Math.cos(angle) * 44, y: 110, z: Math.sin(angle) * 34, type: "wrist" });
      nodes.push({ x: Math.cos(angle) * 48, y: 130, z: Math.sin(angle) * 38, type: "sensor" });
    }
    for (let i = 0; i < WRIST_POINTS; i++) {
      const next = (i + 1) % WRIST_POINTS;
      edges.push([i * 2, next * 2]);
      edges.push([i * 2 + 1, next * 2 + 1]);
      edges.push([i * 2, i * 2 + 1]);
    }

    // Fingers
    const fingers = [
      { baseX: -38, baseY: 55, len: 18, count: 3, angle: -0.6 },
      { baseX: -24, baseY: 10, len: 26, count: 4, angle: -0.15 },
      { baseX: -2,  baseY: -2, len: 30, count: 4, angle: 0.0 },
      { baseX: 20,  baseY: 8,  len: 26, count: 4, angle: 0.12 },
      { baseX: 40,  baseY: 24, len: 20, count: 4, angle: 0.28 }
    ];

    fingers.forEach((f) => {
      let prevIdx = nodes.length;
      nodes.push({ x: f.baseX, y: 65, z: 0, type: "palm" });

      let cx = f.baseX;
      let cy = f.baseY;
      const ang = -Math.PI / 2 + f.angle;

      for (let j = 0; j < f.count; j++) {
        cx += Math.cos(ang) * f.len;
        cy += Math.sin(ang) * f.len;
        const newIdx = nodes.length;
        nodes.push({ x: cx, y: cy, z: Math.sin(j * 0.8) * 8, type: "finger" });
        edges.push([prevIdx, newIdx]);
        prevIdx = newIdx;
      }
    });

    let pulse = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isDraggingRef.current) {
        rotRef.current.y += 0.006;
      }
      pulse = (pulse + 0.05) % (Math.PI * 2);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 15;
      const fov = 320;

      // Projection
      const projected = nodes.map((n) => {
        const cosY = Math.cos(rotRef.current.y), sinY = Math.sin(rotRef.current.y);
        const x1 = n.x * cosY - n.z * sinY;
        const z1 = n.z * cosY + n.x * sinY;

        const cosX = Math.cos(rotRef.current.x), sinX = Math.sin(rotRef.current.x);
        const y2 = n.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + n.y * sinX + 360;

        const scale = fov / z2;
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2,
          scale,
          type: n.type
        };
      });

      // Lines
      ctx.lineWidth = 1.2;
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        if (!p1 || !p2) return;

        const alpha = Math.max(0.15, Math.min(0.85, 380 / p1.z));
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        if (p1.type === "sensor" || p2.type === "sensor") {
          ctx.strokeStyle = `rgba(255, 214, 0, ${alpha * 0.9})`;
          ctx.shadowColor = "#ffd600";
          ctx.shadowBlur = 6;
        } else {
          ctx.strokeStyle = `rgba(0, 243, 255, ${alpha * 0.65})`;
          ctx.shadowColor = "#00f3ff";
          ctx.shadowBlur = 4;
        }
        ctx.stroke();
      });

      // Joint Nodes
      projected.forEach((p) => {
        ctx.beginPath();
        const r = p.type === "sensor" ? 3.5 * p.scale : 2.2 * p.scale;
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);

        if (p.type === "sensor") {
          const glow = (Math.sin(pulse * 3) + 1) * 0.5;
          ctx.fillStyle = `rgba(255, 214, 0, ${0.7 + glow * 0.3})`;
          ctx.shadowColor = "#ffd600";
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = "rgba(0, 243, 255, 0.85)";
          ctx.shadowColor = "#00f3ff";
          ctx.shadowBlur = 5;
        }
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    mouseRef.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };
  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - mouseRef.current.x;
    const dy = e.clientY - mouseRef.current.y;
    rotRef.current.y += dx * 0.008;
    rotRef.current.x += dy * 0.008;
    mouseRef.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div className="bg-[#0e1628]/70 backdrop-blur-md rounded-xl p-5 border border-[#ffd600]/45 shadow-[0_0_22px_rgba(255,214,0,0.18)] flex flex-col justify-between h-full">
      {/* Panel Header */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#ffd600]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="2" />
              <path strokeLinecap="round" strokeWidth="2" d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
            </svg>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#ffd600] drop-shadow-[0_0_8px_rgba(255,214,0,0.4)]">
              Wearable Sensor Sync / VPack
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#ffd600] bg-[#ffd600]/15 px-2 py-0.5 rounded border border-[#ffd600]/30">
            {telemetry.sensorId}
          </span>
        </div>

        {/* Connected Status Bar */}
        <div className="flex items-center justify-between p-2.5 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-lg font-mono text-xs mb-3">
          <div className="flex items-center gap-2 text-[#00ff88] font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
            CONNECTED
          </div>
          <div className="flex items-center gap-3 text-[11px] text-gray-300">
            <span>LATENCY: <b className="text-white">{telemetry.latencyMs}ms</b></span>
            <span>SYNC: <b className="text-white">{telemetry.signalStrength.toFixed(1)}%</b></span>
            <span>BATTERY: <b className="text-white">{telemetry.batteryPct}%</b></span>
          </div>
        </div>
      </div>

      {/* 3D Holographic Hand Viewer */}
      <div
        className="relative flex-1 min-h-[340px] bg-gradient-to-b from-[#00f3ff]/5 via-transparent to-[#040814] rounded-xl border border-[#ffd600]/25 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <canvas ref={canvasRef} width="400" height="380" className="w-full h-full block" />

        {/* HUD Overlay tags */}
        <div className="absolute top-3 left-3 text-[10px] font-mono text-[#ffd600] bg-black/60 px-2 py-1 rounded border border-[#ffd600]/40 backdrop-blur-sm pointer-events-none">
          HOLOGRAPHIC BIO-SCAN // WRIST SYNC
        </div>
        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[#00f3ff] bg-black/60 px-2 py-1 rounded border border-[#00f3ff]/40 backdrop-blur-sm pointer-events-none">
          DRAG TO ROTATE 3D
        </div>
      </div>

      {/* Active Exercises Vitals (Bottom of VPack) */}
      <div className="mt-4 bg-[#0a1020]/90 border border-[#ffd600]/30 rounded-lg p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#ffd600] tracking-wider uppercase">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>ACTIVE EXERCISES</span>
          </div>
          <span className="text-[10px] font-mono text-[#00ff88] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
            RESISTANCE CYCLE (CYCLE-04)
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 font-mono text-center">
          <div className="bg-[#121c32]/60 p-2 rounded border border-white/5">
            <div className="text-sm font-bold text-white">{telemetry.vo2Max}</div>
            <div className="text-[9px] text-gray-400 uppercase mt-0.5">VO2 Max</div>
          </div>
          <div className="bg-[#121c32]/60 p-2 rounded border border-white/5">
            <div className="text-sm font-bold text-white">{telemetry.cadenceRpm}</div>
            <div className="text-[9px] text-gray-400 uppercase mt-0.5">Cadence (RPM)</div>
          </div>
          <div className="bg-[#121c32]/60 p-2 rounded border border-white/5">
            <div className="text-sm font-bold text-white">{telemetry.caloriesBurned}</div>
            <div className="text-[9px] text-gray-400 uppercase mt-0.5">Energy (kcal)</div>
          </div>
          <div className="bg-[#121c32]/60 p-2 rounded border border-white/5">
            <div className="text-sm font-bold text-[#00f3ff]">{telemetry.smO2Pct}%</div>
            <div className="text-[9px] text-gray-400 uppercase mt-0.5">Muscle SmO2</div>
          </div>
        </div>
      </div>
    </div>
  );
}

