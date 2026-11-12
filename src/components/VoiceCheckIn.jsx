import React, { useState, useEffect, useRef } from "react";
import { uploadVoiceCheckInToGemma } from "../services/api";

export default function VoiceCheckIn({ onNotification }) {
  const [isRecording, setIsRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState(
    '"Crew mental resilience baseline stable. Circadian rhythm aligned with Martian day 24h 39m."'
  );

  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Animated cyan waveform canvas graphic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const bars = 28;
    const freqs = new Array(bars).fill(6);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / bars - 3;
      const midY = canvas.height / 2;

      for (let i = 0; i < bars; i++) {
        const target = isRecording
          ? Math.random() * (canvas.height * 0.75) + 6
          : Math.sin(Date.now() * 0.003 + i * 0.45) * 6 + 10;

        freqs[i] += (target - freqs[i]) * 0.25;
        const h = freqs[i];
        const x = i * (barWidth + 3);
        const y = midY - h / 2;

        ctx.fillStyle = isRecording ? "#ff2a55" : "#00f3ff";
        ctx.shadowColor = isRecording ? "#ff2a55" : "#00f3ff";
        ctx.shadowBlur = isRecording ? 10 : 6;
        ctx.fillRect(x, y, barWidth, h);
      }

      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isRecording]);

  // Recording timer
  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  /**
   * Handle Audio Capture and Node.js Gemma AI sentiment upload
   */
  const handleToggleRecord = async () => {
    if (!isRecording) {
      // START RECORDING
      setIsRecording(true);
      audioChunksRef.current = [];

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) audioChunksRef.current.push(e.data);
          };
          mediaRecorderRef.current.start();
        }
      } catch (err) {
        console.warn("Local microphone stream optional/mock fallback:", err.message);
      }
    } else {
      // STOP RECORDING & TRANSMIT BLOB TO NODE.JS BACKEND FOR GEMMA AI
      setIsRecording(false);
      setAnalyzing(true);

      // Create Audio Blob (or synthesized fallback mock blob)
      const audioBlob = audioChunksRef.current.length > 0
        ? new Blob(audioChunksRef.current, { type: "audio/webm" })
        : new Blob(["mock-astronaut-voice-data"], { type: "audio/webm" });

      /**
       * =========================================================================
       * BACKEND INTEGRATION POINT: Node.js / Express Gemma AI Processing
       * =========================================================================
       * Here the audio blob is sent to the Node.js backend.
       * The backend leverages Gemma AI (via Google GenAI SDK / Vertex AI) to extract:
       * 1. Speech-to-text transcription
       * 2. Acoustic biomarker stress scores (vocal tremors, latency, fatigue)
       * 3. Crew psychological resilience classification
       * =========================================================================
       */
      try {
        const response = await uploadVoiceCheckInToGemma(audioBlob);
        setTranscript(`"${response.transcript}"`);
        if (onNotification) {
          onNotification(`Gemma AI: Acoustic stress index ${response.stressIndex} (Resilience: 98%)`);
        }
      } catch (err) {
        console.error("Gemma AI transcription error:", err);
      } finally {
        setAnalyzing(false);
      }
    }
  };

  const formatTimer = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `00:${m}:${s}`;
  };

  return (
    <div className="bg-[#0e1628]/70 backdrop-blur-md rounded-xl p-4 border border-[#00f3ff]/40 shadow-[0_0_18px_rgba(0,243,255,0.18)] flex flex-col justify-between">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#00f3ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]">
            Voice Check-In
          </h2>
        </div>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
            isRecording
              ? "bg-[#ff2a55]/20 text-[#ff2a55] border-[#ff2a55]/40 animate-pulse"
              : "text-[#00f3ff] bg-[#00f3ff]/15 border-[#00f3ff]/30"
          }`}
        >
          {isRecording ? "TRANSMITTING" : "AUDIO READY"}
        </span>
      </div>

      {/* Waveform Graphic Box */}
      <div className="bg-[#060a14] rounded-lg p-3 border border-[#00f3ff]/25 flex flex-col items-center">
        <canvas ref={canvasRef} width="260" height="56" className="w-full h-14 block" />
        <div className="w-full flex justify-between font-mono text-[10px] text-gray-400 mt-2">
          <span>FREQ: 44.1 kHz</span>
          <span className="text-[#00f3ff] font-bold">{formatTimer(seconds)}</span>
          <span>NOISE: -64 dB</span>
        </div>
      </div>

      {/* Record Button */}
      <button
        onClick={handleToggleRecord}
        disabled={analyzing}
        className={`w-full mt-3 py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
          isRecording
            ? "bg-[#ff2a55]/20 text-white border border-[#ff2a55] shadow-[0_0_16px_rgba(255,42,85,0.4)] animate-pulse"
            : "bg-[#00f3ff]/15 hover:bg-[#00f3ff]/25 text-[#00f3ff] border border-[#00f3ff] shadow-[0_0_12px_rgba(0,243,255,0.2)]"
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2" />
        </svg>
        <span>
          {analyzing
            ? "GEMMA AI PROCESSING..."
            : isRecording
            ? "STOP RECORDING // COMMIT TO AI"
            : "RECORD DAILY LOG / MOOD"}
        </span>
      </button>

      {/* Transcript Preview */}
      <div className="mt-2.5 p-2 bg-white/[0.02] border-l-2 border-[#00f3ff] rounded text-[11px] text-gray-400 italic line-clamp-2">
        {transcript}
      </div>
    </div>
  );
}

