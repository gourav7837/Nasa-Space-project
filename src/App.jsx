import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import BiometricEntry from "./components/BiometricEntry";
import VoiceCheckIn from "./components/VoiceCheckIn";
import MoodSlider from "./components/MoodSlider";
import WearableVPack from "./components/WearableVPack";
import NasaTelemetry from "./components/NasaTelemetry";
import MarsGameProgress from "./components/MarsGameProgress";

export default function App() {
  const [activeTab, setActiveTab] = useState("vitals");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  return (
    <div className="flex w-screen min-h-screen bg-[#0B0D17] text-gray-100 font-sans selection:bg-[#00f3ff] selection:text-black overflow-x-hidden relative">
      {/* Background Radial Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f3ff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#ff2a55]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-[#ffd600]/5 rounded-full blur-3xl" />
      </div>

      {/* 1. Left Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Dashboard Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Header */}
        <Header
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          unreadAlerts={true}
        />

        {/* 3-Column CSS Grid Layout */}
        <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-[1720px] w-full mx-auto">
          {/* COLUMN 1: Data Entry & Mood (Cyan Borders) */}
          <div className="flex flex-col gap-5">
            <BiometricEntry onNotification={showNotification} />
            <VoiceCheckIn onNotification={showNotification} />
            <MoodSlider />
          </div>

          {/* COLUMN 2: Live Wearable Sync (Yellow Border - Tall Panel) */}
          <div className="flex flex-col">
            <WearableVPack />
          </div>

          {/* COLUMN 3: Telemetry & Gamification (Orange & Red Borders) */}
          <div className="flex flex-col gap-5">
            <NasaTelemetry />
            <MarsGameProgress progress={68} />
          </div>
        </main>
      </div>

      {/* Floating System Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#070e1c]/95 border border-[#00f3ff] text-white px-4 py-3 rounded-lg shadow-[0_0_20px_rgba(0,243,255,0.4)] font-mono text-xs flex items-center gap-2.5 animate-bounce">
          <svg className="w-4 h-4 text-[#00f3ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{notification}</span>
        </div>
      )}
    </div>
  );
}

