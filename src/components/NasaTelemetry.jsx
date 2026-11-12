import React, { useState, useEffect } from "react";
import { fetchNasaTelemetry } from "../services/api";

export default function NasaTelemetry() {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * =========================================================================
   * NODE.JS / EXPRESS BACKEND PROXY INTEGRATION POINT
   * =========================================================================
   * Fetches real-time space weather data from the backend.
   * NOTE: The Node.js server securely holds the NASA DONKI API key and caches
   * responses to prevent client-side key leakage and respect NASA rate limits.
   * =========================================================================
   */
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const data = await fetchNasaTelemetry();
        if (isMounted) {
          setTelemetry(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("NASA DONKI telemetry fetch error:", err);
      }
    }

    loadData();
    const interval = setInterval(loadData, 10000); // Poll telemetry every 10s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-[#0e1628]/70 backdrop-blur-md rounded-xl p-4 border border-[#ff9100]/40 shadow-[0_0_18px_rgba(255,145,0,0.18)] flex flex-col justify-between">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#ff9100]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          </svg>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#ff9100] drop-shadow-[0_0_8px_rgba(255,145,0,0.4)]">
            NASA Radiation & CO2 Telemetry
          </h2>
        </div>
        <span className="text-[10px] font-mono text-[#ff9100] bg-[#ff9100]/15 px-2 py-0.5 rounded border border-[#ff9100]/30">
          DONKI STREAM
        </span>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center font-mono text-xs text-gray-400">
          SYNCING NASA DONKI API...
        </div>
      ) : (
        <div className="space-y-4">
          {/* Space Weather Section */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-gray-200 uppercase tracking-wide">
                Current external space Weather
              </span>
              <span className="font-mono text-[10px] font-bold text-[#00ff88] bg-[#00ff88]/15 border border-[#00ff88] px-2 py-0.5 rounded shadow-[0_0_8px_rgba(0,255,136,0.3)]">
                {telemetry?.spaceWeather?.status || "SAFE"}
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00ff88] to-[#00d672] rounded-full shadow-[0_0_10px_#00ff88] transition-all duration-500"
                style={{ width: `${telemetry?.spaceWeather?.fluxPercentage || 24}%` }}
              />
            </div>
            <div className="flex justify-between font-mono text-[10px] text-gray-400 mt-1.5">
              <span>SOLAR FLUX: <b className="text-white">{telemetry?.spaceWeather?.solarFluxClass}</b></span>
              <span>COSMIC RAD: <b className="text-white">{telemetry?.spaceWeather?.cosmicRadiationMsv} mSv/d</b></span>
            </div>
          </div>

          {/* CO2 Levels Section */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-gray-200 uppercase tracking-wide">
                Hab Module CO2 Levels
              </span>
              <span className="font-mono text-[10px] font-bold text-[#ff9100] bg-[#ff9100]/15 border border-[#ff9100] px-2 py-0.5 rounded shadow-[0_0_8px_rgba(255,145,0,0.3)]">
                {telemetry?.habitatAtmosphere?.status || "WARNING"}
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff9100] to-[#ff4400] rounded-full shadow-[0_0_10px_#ff9100] transition-all duration-500"
                style={{ width: `${telemetry?.habitatAtmosphere?.warningPercentage || 68}%` }}
              />
            </div>
            <div className="flex justify-between font-mono text-[10px] text-gray-400 mt-1.5">
              <span>CURRENT: <b className="text-[#ff9100]">{telemetry?.habitatAtmosphere?.co2LevelMmhg} mmHg ({telemetry?.habitatAtmosphere?.co2Percentage}%)</b></span>
              <span>THRESHOLD: <b className="text-white">{telemetry?.habitatAtmosphere?.co2ThresholdMmhg} mmHg</b></span>
            </div>
          </div>

          {/* Habitat O2 Partial Pressure */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex justify-between font-mono text-[10px] text-gray-400">
              <span>PRESSURE: <b className="text-white">{telemetry?.habitatAtmosphere?.o2PartialPressureKpa} kPa</b></span>
              <span>O2 FRACTION: <b className="text-[#00ff88]">{telemetry?.habitatAtmosphere?.o2Fraction} (NOMINAL)</b></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

