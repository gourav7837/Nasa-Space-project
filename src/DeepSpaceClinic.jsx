import React, { useState, useEffect, useRef } from "react";

/**
 * =============================================================================
 * BACKEND & FIREBASE INTEGRATION PLACEHOLDERS
 * =============================================================================
 */

// 1. Firebase Firestore Service Mock
export const syncVitalsToFirestore = async (vitalsData) => {
  console.log("[Firebase] Syncing daily vitals to Firestore collection 'daily_vitals':", vitalsData);
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, id: `doc_${Date.now()}` }), 500);
  });
};

export const subscribeToVPackStream = (callback) => {
  console.log("[Firebase] Initialized onSnapshot() real-time stream on 'wearable_telemetry/vpack_live'");
  callback({
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

  const interval = setInterval(() => {
    callback({
      connected: true,
      sensorId: "VPACK-X7-PRO",
      signalStrength: 99.4 + Math.random() * 0.5,
      latencyMs: (1.1 + Math.random() * 0.4).toFixed(1),
      batteryPct: 94,
      vo2Max: (47.8 + Math.random() * 0.8).toFixed(1),
      cadenceRpm: Math.floor(86 + Math.random() * 6),
      caloriesBurned: 420 + Math.floor(Math.random() * 3),
      smO2Pct: Math.floor(76 + Math.random() * 4)
    });
  }, 2500);

  return () => clearInterval(interval);
};

// 2. Node.js Backend API Service Mock
export const fetchNasaTelemetry = async () => {
  // NOTE: Node.js server securely holds the NASA DONKI API key
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        spaceWeather: {
          solarFluxClass: "Class C-1.2 (Low)",
          cosmicRadiationMsv: 0.38,
          status: "SAFE",
          fluxPercentage: 24
        },
        habitatAtmosphere: {
          co2LevelMmhg: 3.8,
          co2Percentage: 0.50,
          co2ThresholdMmhg: 4.0,
          status: "WARNING",
          warningPercentage: 68,
          o2PressureKpa: 101.3,
          o2Fraction: "20.9%"
        }
      });
    }, 400);
  });
};

export const uploadVoiceCheckInToGemma = async (audioBlob) => {
  // NOTE: Audio blob is sent to Node.js backend for Gemma AI Speech & Sentiment Analysis
  console.log("[Node.js Backend] Transmitting audio blob to Gemma AI...", { size: audioBlob?.size });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        transcript: "Crew mental resilience baseline stable. Circadian rhythm aligned with Martian day 24h 39m.",
        stressIndex: "NOMINAL",
        sentimentScore: 0.88
      });
    }, 700);
  });
};

/**
 * =============================================================================
 * MAIN COMPONENT: DEEP SPACE CLINIC
 * =============================================================================
 */
export default function DeepSpaceClinic() {
  const [activeTab, setActiveTab] = useState("vitals");
  const [notification, setNotification] = useState(null);

  // 1. Biometrics State
  const [bioForm, setBioForm] = useState({
    bloodPressure: "120/80",
    bloodSugar: "98",
    heartRate: "72",
    bodyTemp: "36.6"
  });
  const [isSyncingBio, setIsSyncingBio] = useState(false);

  // 2. Voice Check-In State
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [voiceTranscript, setVoiceTranscript] = useState(
    '"Crew mental resilience baseline stable. Circadian rhythm aligned with Martian day 24h 39m."'
  );

  // 3. Mood Slider State
  const [mood, setMood] = useState(84);

  // 4. VPack Real-time Telemetry State
  const [vpackData, setVpackData] = useState({
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

  // 5. NASA Telemetry State
  const [nasaData, setNasaData] = useState(null);

  // Canvas Refs
  const ecgCanvasRef = useRef(null);
  const voiceCanvasRef = useRef(null);
  const handCanvasRef = useRef(null);
  const marsCanvasRef = useRef(null);
  const isDraggingHand = useRef(false);
  const handRot = useRef({ x: 0.2, y: 0 });
  const lastMouse = useRef({ x: 0, y: 0 });

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Real-time Firestore Stream listener hook for VPack
  useEffect(() => {
    const unsub = subscribeToVPackStream((data) => {
      setVpackData((prev) => ({ ...prev, ...data }));
    });
    return () => unsub();
  }, []);

  // NASA Telemetry fetch hook
  useEffect(() => {
    fetchNasaTelemetry().then(setNasaData);
  }, []);

  // Voice recording timer
  useEffect(() => {
    let t;
    if (isRecording) t = setInterval(() => setVoiceSeconds((s) => s + 1), 1000);
    else setVoiceSeconds(0);
    return () => clearInterval(t);
  }, [isRecording]);

  // Mini ECG Animation
  useEffect(() => {
    const cvs = ecgCanvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    let anim, step = 0;
    const points = new Array(cvs.width || 280).fill(14);

    const draw = () => {
      step++;
      const mid = 14;
      let val = mid;
      const phase = step % 45;
      if (phase === 12) val = mid + 3;
      else if (phase === 15) val = mid - 12;
      else if (phase === 18) val = mid + 6;
      else if (phase === 24) val = mid - 3;
      else val = mid + (Math.random() - 0.5) * 1.5;

      points.push(val);
      if (points.length > cvs.width) points.shift();

      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.beginPath();
      ctx.strokeStyle = "#00f3ff";
      ctx.lineWidth = 1.6;
      ctx.shadowColor = "#00f3ff";
      ctx.shadowBlur = 8;
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(i, p);
        else ctx.lineTo(i, p);
      });
      ctx.stroke();
      anim = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(anim);
  }, []);

  // Cyan Audio Waveform Animation
  useEffect(() => {
    const cvs = voiceCanvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    let anim;
    const bars = 26;
    const freqs = new Array(bars).fill(6);

    const draw = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      const bw = cvs.width / bars - 3;
      const my = cvs.height / 2;

      for (let i = 0; i < bars; i++) {
        const target = isRecording
          ? Math.random() * (cvs.height * 0.75) + 6
          : Math.sin(Date.now() * 0.003 + i * 0.45) * 6 + 10;
        freqs[i] += (target - freqs[i]) * 0.25;
        const h = freqs[i];
        ctx.fillStyle = isRecording ? "#ff2a55" : "#00f3ff";
        ctx.shadowColor = isRecording ? "#ff2a55" : "#00f3ff";
        ctx.shadowBlur = 8;
        ctx.fillRect(i * (bw + 3), my - h / 2, bw, h);
      }
      ctx.shadowBlur = 0;
      anim = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(anim);
  }, [isRecording]);

  // 3D Holographic Hand Animation
  useEffect(() => {
    const cvs = handCanvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    let anim;

    const nodes = [];
    const edges = [];
    const WRIST = 16;
    for (let i = 0; i < WRIST; i++) {
      const a = (i / WRIST) * Math.PI * 2;
      nodes.push({ x: Math.cos(a) * 44, y: 110, z: Math.sin(a) * 34, type: "wrist" });
      nodes.push({ x: Math.cos(a) * 48, y: 130, z: Math.sin(a) * 38, type: "sensor" });
    }
    for (let i = 0; i < WRIST; i++) {
      const n = (i + 1) % WRIST;
      edges.push([i * 2, n * 2]);
      edges.push([i * 2 + 1, n * 2 + 1]);
      edges.push([i * 2, i * 2 + 1]);
    }

    const fDef = [
      { bx: -38, by: 55, len: 18, c: 3, a: -0.6 },
      { bx: -24, by: 10, len: 26, c: 4, a: -0.15 },
      { bx: -2,  by: -2, len: 30, c: 4, a: 0.0 },
      { bx: 20,  by: 8,  len: 26, c: 4, a: 0.12 },
      { bx: 40,  by: 24, len: 20, c: 4, a: 0.28 }
    ];

    fDef.forEach((f) => {
      let prev = nodes.length;
      nodes.push({ x: f.bx, y: 65, z: 0, type: "palm" });
      let cx = f.bx, cy = f.by;
      const rad = -Math.PI / 2 + f.a;
      for (let j = 0; j < f.c; j++) {
        cx += Math.cos(rad) * f.len;
        cy += Math.sin(rad) * f.len;
        const idx = nodes.length;
        nodes.push({ x: cx, y: cy, z: Math.sin(j * 0.8) * 8, type: "finger" });
        edges.push([prev, idx]);
        prev = idx;
      }
    });

    let pulse = 0;
    const draw = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      if (!isDraggingHand.current) handRot.current.y += 0.006;
      pulse = (pulse + 0.05) % (Math.PI * 2);

      const cx = cvs.width / 2, cy = cvs.height / 2 + 15, fov = 320;
      const proj = nodes.map((n) => {
        const cyo = Math.cos(handRot.current.y), syo = Math.sin(handRot.current.y);
        const x1 = n.x * cyo - n.z * syo;
        const z1 = n.z * cyo + n.x * syo;
        const cxo = Math.cos(handRot.current.x), sxo = Math.sin(handRot.current.x);
        const y2 = n.y * cxo - z1 * sxo;
        const z2 = z1 * cxo + n.y * sxo + 360;
        const s = fov / z2;
        return { x: cx + x1 * s, y: cy + y2 * s, z: z2, s, type: n.type };
      });

      edges.forEach(([i, j]) => {
        const p1 = proj[i], p2 = proj[j];
        if (!p1 || !p2) return;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        if (p1.type === "sensor" || p2.type === "sensor") {
          ctx.strokeStyle = "rgba(255, 214, 0, 0.85)";
          ctx.shadowColor = "#ffd600";
        } else {
          ctx.strokeStyle = "rgba(0, 243, 255, 0.55)";
          ctx.shadowColor = "#00f3ff";
        }
        ctx.stroke();
      });

      proj.forEach((p) => {
        ctx.beginPath();
        const r = p.type === "sensor" ? 3.5 * p.s : 2 * p.s;
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = p.type === "sensor" ? "#ffd600" : "#00f3ff";
        ctx.shadowBlur = 6;
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      anim = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(anim);
  }, []);

  // 3D Martian Landscape Animation
  useEffect(() => {
    const cvs = marsCanvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    let anim, offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      offset += 0.015;
      const fov = 180, camY = 85, hor = cvs.height * 0.38;

      for (let r = 0; r < 12; r++) {
        const z = (r * 20 - (offset * 24) % 20) + 18;
        const s = fov / (z + fov);
        const y = hor + camY * s;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 42, 85, ${0.7 - r / 15})`;
        ctx.moveTo(cvs.width / 2 - 200 * s, y);
        ctx.lineTo(cvs.width / 2 + 200 * s, y);
        ctx.stroke();
      }

      const domeScale = fov / (120 + fov);
      const domeX = cvs.width / 2;
      const domeY = hor + camY * domeScale - 20 * domeScale;
      ctx.beginPath();
      ctx.arc(domeX, domeY, 36 * domeScale, Math.PI, 0);
      ctx.strokeStyle = "#00f3ff";
      ctx.shadowColor = "#00f3ff";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
      anim = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(anim);
  }, []);

  const handleSyncFirebase = async (e) => {
    e.preventDefault();
    setIsSyncingBio(true);
    const res = await syncVitalsToFirestore(bioForm);
    setIsSyncingBio(false);
    notify(`Synced to Firebase Firestore: Document [${res.id}]`);
  };

  const handleToggleVoice = async () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      const res = await uploadVoiceCheckInToGemma(new Blob(["mock-voice"]));
      setVoiceTranscript(`"${res.transcript}"`);
      notify(`Gemma AI: Acoustic stress index ${res.stressIndex}`);
    }
  };

  return (
    <div className="flex w-screen min-h-screen bg-[#0B0D17] text-gray-100 font-sans selection:bg-[#00f3ff] selection:text-black overflow-x-hidden relative">
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-[#0a1020]/80 backdrop-blur-xl border-r border-[#00f3ff]/15 flex flex-col flex-shrink-0 z-20">
        <div className="p-5 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0b3d91] border border-[#00f3ff] shadow-[0_0_12px_rgba(0,243,255,0.4)] flex items-center justify-center flex-shrink-0">
            <span className="font-mono text-xs font-bold text-[#00f3ff]">NASA</span>
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-wider text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]">
              DEEP SPACE CLINIC
            </h1>
            <p className="text-[10px] text-gray-400 font-mono tracking-widest">HABITAT-ALPHA</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1.5">
          {[
            { id: "overview", label: "Overview" },
            { id: "careers", label: "Careers" },
            { id: "vitals", label: "Log Vitals", live: true },
            { id: "exercises", label: "Exercises" },
            { id: "healthcare", label: "Health Care" },
            { id: "advanced", label: "Advanced" }
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? "bg-[#00f3ff]/15 text-white border border-[#00f3ff]/60 shadow-[0_0_16px_rgba(0,243,255,0.25)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.label}</span>
                {item.live && (
                  <span className="text-[9px] font-mono bg-[#00f3ff]/20 text-[#00f3ff] px-1.5 py-0.5 rounded border border-[#00f3ff]/40">
                    LIVE
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* HEADER */}
        <header className="h-16 px-6 border-b border-[#00f3ff]/15 bg-[#0a1020]/60 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black tracking-widest text-[#00f3ff] drop-shadow-[0_0_12px_rgba(0,243,255,0.6)]">
              DEEP SPACE CLINIC
            </h1>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-[#ffd600] font-bold">SOL 342</span>
            <span>14:38:09 UTC</span>
          </div>
        </header>

        {/* 3-COLUMN CSS GRID LAYOUT */}
        <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-[1720px] w-full mx-auto">
          {/* COLUMN 1: DATA ENTRY & MOOD (CYAN BORDERS) */}
          <div className="flex flex-col gap-5">
            {/* Daily Biometric Entry */}
            <div className="bg-[#0e1628]/70 backdrop-blur-md rounded-xl p-4 border border-[#00f3ff]/40 shadow-[0_0_18px_rgba(0,243,255,0.18)]">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#00f3ff]">Daily Biometric Entry</h2>
                <span className="text-[10px] font-mono text-[#00f3ff] bg-[#00f3ff]/15 px-2 py-0.5 rounded">MANUAL</span>
              </div>
              <form onSubmit={handleSyncFirebase} className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-gray-400 block mb-1">Blood Pressure</label>
                    <input
                      type="text"
                      value={bioForm.bloodPressure}
                      onChange={(e) => setBioForm({ ...bioForm, bloodPressure: e.target.value })}
                      className="w-full bg-[#080d1a] border border-[#00f3ff]/30 rounded px-2 py-1.5 font-mono text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Blood Sugar</label>
                    <select
                      value={bioForm.bloodSugar}
                      onChange={(e) => setBioForm({ ...bioForm, bloodSugar: e.target.value })}
                      className="w-full bg-[#080d1a] border border-[#00f3ff]/30 rounded px-2 py-1.5 font-mono text-white outline-none"
                    >
                      <option value="92">92 mg/dL</option>
                      <option value="98">98 mg/dL</option>
                      <option value="115">115 mg/dL</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Heart Rate</label>
                    <input
                      type="number"
                      value={bioForm.heartRate}
                      onChange={(e) => setBioForm({ ...bioForm, heartRate: e.target.value })}
                      className="w-full bg-[#080d1a] border border-[#00f3ff]/30 rounded px-2 py-1.5 font-mono text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Body Temp</label>
                    <select
                      value={bioForm.bodyTemp}
                      onChange={(e) => setBioForm({ ...bioForm, bodyTemp: e.target.value })}
                      className="w-full bg-[#080d1a] border border-[#00f3ff]/30 rounded px-2 py-1.5 font-mono text-white outline-none"
                    >
                      <option value="36.4">36.4 °C</option>
                      <option value="36.6">36.6 °C</option>
                      <option value="37.2">37.2 °C</option>
                    </select>
                  </div>
                </div>
                <canvas ref={ecgCanvasRef} width="280" height="28" className="w-full h-7 bg-black/40 rounded border border-[#00f3ff]/20 block" />
                <button
                  type="submit"
                  disabled={isSyncingBio}
                  className="w-full py-2 bg-[#00f3ff]/20 hover:bg-[#00f3ff]/30 border border-[#00f3ff] text-white font-mono text-xs font-bold rounded shadow-[0_0_12px_rgba(0,243,255,0.3)] transition-all"
                >
                  {isSyncingBio ? "SYNCING TO FIRESTORE..." : "SYNC TO FIREBASE"}
                </button>
              </form>
            </div>

            {/* Voice Check-In */}
            <div className="bg-[#0e1628]/70 backdrop-blur-md rounded-xl p-4 border border-[#00f3ff]/40 shadow-[0_0_18px_rgba(0,243,255,0.18)]">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#00f3ff]">Voice Check-In</h2>
                <span className="text-[10px] font-mono text-[#00f3ff]">{isRecording ? "TRANSMITTING" : "AUDIO READY"}</span>
              </div>
              <canvas ref={voiceCanvasRef} width="260" height="50" className="w-full h-12 bg-black/40 rounded border border-[#00f3ff]/20 block" />
              <button
                onClick={handleToggleVoice}
                className={`w-full mt-3 py-2 text-xs font-mono font-bold rounded border transition-all ${
                  isRecording ? "bg-red-500/20 border-red-500 text-white animate-pulse" : "bg-[#00f3ff]/15 border-[#00f3ff] text-[#00f3ff]"
                }`}
              >
                {isRecording ? "STOP RECORDING // COMMIT TO AI" : "RECORD DAILY LOG / MOOD"}
              </button>
              <p className="mt-2 text-[11px] text-gray-400 italic bg-white/[0.02] p-2 border-l-2 border-[#00f3ff] rounded">
                {voiceTranscript}
              </p>
            </div>

            {/* Mood Slider */}
            <div className="bg-[#0e1628]/70 backdrop-blur-md rounded-xl p-4 border border-[#00f3ff]/40 shadow-[0_0_18px_rgba(0,243,255,0.18)]">
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span>HOW ARE YOU FEELING TODAY?</span>
                <span className="font-mono text-[#00f3ff]">{mood}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-full h-2 rounded bg-gradient-to-r from-[#ff2a55] via-[#ffd600] to-[#00f3ff] accent-[#00f3ff]"
              />
              <div className="flex justify-between font-mono text-[10px] mt-1.5">
                <span className="text-[#ff2a55]">◀ Exhausted / Isolated</span>
                <span className="text-[#00f3ff]">Energetic / Balanced ▶</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: LIVE WEARABLE SYNC (YELLOW BORDER - TALL PANEL) */}
          <div className="flex flex-col bg-[#0e1628]/70 backdrop-blur-md rounded-xl p-5 border border-[#ffd600]/45 shadow-[0_0_22px_rgba(255,214,0,0.18)] h-full justify-between">
            <div>
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#ffd600]">Wearable Sensor Sync (VPack)</h2>
                <span className="text-[10px] font-mono text-[#ffd600]">{vpackData.sensorId}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded font-mono text-xs">
                <span className="text-[#00ff88] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
                  CONNECTED
                </span>
                <span className="text-[11px] text-gray-300">BATTERY: <b className="text-white">{vpackData.batteryPct}%</b></span>
              </div>
            </div>

            {/* 3D Hand Canvas */}
            <div
              className="relative flex-1 min-h-[340px] my-4 bg-black/40 rounded-xl border border-[#ffd600]/25 overflow-hidden flex items-center justify-center cursor-grab"
              onMouseDown={(e) => {
                isDraggingHand.current = true;
                lastMouse.current = { x: e.clientX, y: e.clientY };
              }}
              onMouseUp={() => (isDraggingHand.current = false)}
              onMouseMove={(e) => {
                if (!isDraggingHand.current) return;
                handRot.current.y += (e.clientX - lastMouse.current.x) * 0.008;
                handRot.current.x += (e.clientY - lastMouse.current.y) * 0.008;
                lastMouse.current = { x: e.clientX, y: e.clientY };
              }}
            >
              <canvas ref={handCanvasRef} width="360" height="340" className="w-full h-full block" />
              <div className="absolute bottom-2 right-2 text-[9px] font-mono text-[#00f3ff] bg-black/70 px-2 py-0.5 rounded">
                DRAG TO ROTATE 3D
              </div>
            </div>

            {/* Active Exercises Vitals */}
            <div className="bg-[#0a1020] p-3 rounded border border-[#ffd600]/30 font-mono">
              <div className="text-[10px] text-[#ffd600] font-bold uppercase tracking-wider mb-2">ACTIVE EXERCISES</div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-white/5 p-1.5 rounded"><div className="font-bold">{vpackData.vo2Max}</div><div className="text-[9px] text-gray-400">VO2 Max</div></div>
                <div className="bg-white/5 p-1.5 rounded"><div className="font-bold">{vpackData.cadenceRpm}</div><div className="text-[9px] text-gray-400">RPM</div></div>
                <div className="bg-white/5 p-1.5 rounded"><div className="font-bold">{vpackData.caloriesBurned}</div><div className="text-[9px] text-gray-400">kcal</div></div>
                <div className="bg-white/5 p-1.5 rounded"><div className="font-bold text-[#00f3ff]">{vpackData.smO2Pct}%</div><div className="text-[9px] text-gray-400">SmO2</div></div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: TELEMETRY & GAMIFICATION (ORANGE & RED BORDERS) */}
          <div className="flex flex-col gap-5">
            {/* NASA Radiation & CO2 Telemetry */}
            <div className="bg-[#0e1628]/70 backdrop-blur-md rounded-xl p-4 border border-[#ff9100]/40 shadow-[0_0_18px_rgba(255,145,0,0.18)]">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#ff9100]">NASA Radiation & CO2 Telemetry</h2>
                <span className="text-[10px] font-mono text-[#ff9100]">DONKI STREAM</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">Current external space Weather</span>
                    <span className="font-mono text-[10px] font-bold text-[#00ff88] bg-[#00ff88]/15 px-2 py-0.5 rounded border border-[#00ff88]">
                      {nasaData?.spaceWeather?.status || "SAFE"}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#00ff88] to-[#00d672] w-[24%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">CO2 Levels</span>
                    <span className="font-mono text-[10px] font-bold text-[#ff9100] bg-[#ff9100]/15 px-2 py-0.5 rounded border border-[#ff9100]">
                      {nasaData?.habitatAtmosphere?.status || "WARNING"}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#ff9100] to-[#ff4400] w-[68%]" />
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-gray-400 mt-1">
                    <span>{nasaData?.habitatAtmosphere?.co2LevelMmhg || "3.8"} mmHg</span>
                    <span>THRESHOLD: 4.0 mmHg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Game Progress */}
            <div className="bg-[#0e1628]/70 backdrop-blur-md rounded-xl p-4 border border-[#ff2a55]/40 shadow-[0_0_18px_rgba(255,42,85,0.18)]">
              <div className="flex justify-between items-center mb-2.5 pb-2 border-b border-white/5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#ff2a55]">MISSION: MARS OUTPOST BUILD</h2>
                <span className="text-[10px] font-mono text-[#ff2a55]">SECTOR 04</span>
              </div>
              <div className="w-full h-40 bg-black/40 rounded-lg border border-[#ff2a55]/25 overflow-hidden">
                <canvas ref={marsCanvasRef} width="320" height="160" className="w-full h-full block" />
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Martian Colony Habitat</span>
                  <span className="font-mono text-[#00f3ff]">68%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#0066ff] to-[#00f3ff] w-[68%]" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-[#070e1c] border border-[#00f3ff] text-white px-4 py-2.5 rounded shadow-[0_0_15px_#00f3ff] font-mono text-xs z-50">
          {notification}
        </div>
      )}
    </div>
  );
}

