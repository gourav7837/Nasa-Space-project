import React, { useState, useEffect, useRef } from "react";
import { syncVitalsToFirestore } from "../services/firebase";

export default function BiometricEntry({ onNotification }) {
  // Controlled React state for daily biometrics
  const [formData, setFormData] = useState({
    bloodPressure: "120/80",
    bloodSugar: "98",
    heartRate: "72",
    bodyTemp: "36.6"
  });
  const [syncing, setSyncing] = useState(false);
  const ecgCanvasRef = useRef(null);

  // Live ECG rhythmic pulse animation
  useEffect(() => {
    const canvas = ecgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let step = 0;
    const points = new Array(canvas.width || 280).fill(14);

    const render = () => {
      step++;
      const mid = 14;
      let val = mid;
      const phase = step % 45;

      if (phase === 12) val = mid + 3;
      else if (phase === 15) val = mid - 12; // R peak
      else if (phase === 18) val = mid + 6;  // S drop
      else if (phase === 24) val = mid - 3;  // T curve
      else val = mid + (Math.random() - 0.5) * 1.5;

      points.push(val);
      if (points.length > canvas.width) points.shift();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = "#00f3ff";
      ctx.lineWidth = 1.6;
      ctx.shadowColor = "#00f3ff";
      ctx.shadowBlur = 8;

      for (let i = 0; i < points.length; i++) {
        if (i === 0) ctx.moveTo(i, points[i]);
        else ctx.lineTo(i, points[i]);
      }
      ctx.stroke();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Submit handler that calls the Firebase Firestore service
   */
  const handleSyncToFirebase = async (e) => {
    e.preventDefault();
    setSyncing(true);
    try {
      const result = await syncVitalsToFirestore({
        ...formData,
        timestamp: new Date().toISOString()
      });
      if (onNotification) {
        onNotification(`Synced to Firebase Firestore: Document ID [${result.id}]`);
      }
    } catch (err) {
      console.error("Firestore sync error:", err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-[#0e1628]/70 backdrop-blur-md rounded-xl p-4 border border-[#00f3ff]/40 shadow-[0_0_18px_rgba(0,243,255,0.18)] flex flex-col justify-between">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#00f3ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]">
            Daily Biometric Entry
          </h2>
        </div>
        <span className="text-[10px] font-mono text-[#00f3ff] bg-[#00f3ff]/15 px-2 py-0.5 rounded border border-[#00f3ff]/30">
          LOGGING
        </span>
      </div>

      <form onSubmit={handleSyncToFirebase} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Blood Pressure Input */}
          <div>
            <label className="flex justify-between text-[11px] font-medium text-gray-300 mb-1">
              <span>Blood Pressure</span>
              <span className="font-mono text-[#00f3ff] text-[10px]">mmHg</span>
            </label>
            <input
              type="text"
              name="bloodPressure"
              value={formData.bloodPressure}
              onChange={handleChange}
              placeholder="120/80"
              className="w-full bg-[#080d1a]/90 border border-[#00f3ff]/30 focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono outline-none transition-all"
            />
          </div>

          {/* Blood Sugar Select */}
          <div>
            <label className="flex justify-between text-[11px] font-medium text-gray-300 mb-1">
              <span>Blood Sugar</span>
              <span className="font-mono text-[#00f3ff] text-[10px]">mg/dL</span>
            </label>
            <select
              name="bloodSugar"
              value={formData.bloodSugar}
              onChange={handleChange}
              className="w-full bg-[#080d1a]/90 border border-[#00f3ff]/30 focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono outline-none cursor-pointer"
            >
              <option value="92">92 (Fasting)</option>
              <option value="98">98 (Nominal)</option>
              <option value="115">115 (Post-Meal)</option>
              <option value="135">135 (Elevated)</option>
            </select>
          </div>

          {/* Heart Rate Input */}
          <div>
            <label className="flex justify-between text-[11px] font-medium text-gray-300 mb-1">
              <span>Heart Rate</span>
              <span className="font-mono text-[#00f3ff] text-[10px]">BPM</span>
            </label>
            <input
              type="number"
              name="heartRate"
              value={formData.heartRate}
              onChange={handleChange}
              className="w-full bg-[#080d1a]/90 border border-[#00f3ff]/30 focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono outline-none transition-all"
            />
          </div>

          {/* Body Temperature Select */}
          <div>
            <label className="flex justify-between text-[11px] font-medium text-gray-300 mb-1">
              <span>Body Temp</span>
              <span className="font-mono text-[#00f3ff] text-[10px]">°C</span>
            </label>
            <select
              name="bodyTemp"
              value={formData.bodyTemp}
              onChange={handleChange}
              className="w-full bg-[#080d1a]/90 border border-[#00f3ff]/30 focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono outline-none cursor-pointer"
            >
              <option value="36.4">36.4 °C</option>
              <option value="36.6">36.6 °C (Norm)</option>
              <option value="37.1">37.1 °C</option>
              <option value="37.8">37.8 °C (Elevated)</option>
            </select>
          </div>
        </div>

        {/* Live Mini ECG Canvas */}
        <div className="bg-[#050914] rounded-lg p-2 border border-[#00f3ff]/20">
          <canvas ref={ecgCanvasRef} width="280" height="28" className="w-full h-7 block" />
        </div>

        {/* Sync to Firebase Submit Button */}
        <button
          type="submit"
          disabled={syncing}
          className="w-full bg-[#00f3ff]/15 hover:bg-[#00f3ff]/30 border border-[#00f3ff] text-white font-mono text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(0,243,255,0.25)] transition-all disabled:opacity-50"
        >
          {syncing ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-[#00f3ff]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>SYNCING TO FIRESTORE...</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 text-[#00f3ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>SYNC TO FIREBASE</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

