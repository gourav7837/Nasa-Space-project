# DEEP SPACE CLINIC // React + Tailwind Frontend

A sci-fi themed health monitoring dashboard for **"DEEP SPACE CLINIC"** with glassmorphism panel effects, neon glowing borders, and dedicated integration hooks for **Firebase Firestore** and a **Node.js/Express** backend (handling NASA DONKI API and Gemma AI sentiment analysis).

---

## 📁 Project Architecture

```
nasa-space-project/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx            # Left navigation with DEEP SPACE CLINIC branding & menu
│   │   ├── Header.jsx             # Top bar with Sol 342 mission clock, alerts & audio toggle
│   │   ├── BiometricEntry.jsx     # Cyan border: Daily biometric inputs & "Sync to Firebase"
│   │   ├── VoiceCheckIn.jsx       # Cyan border: Glowing audio waveform & Gemma AI audio blob upload
│   │   ├── MoodSlider.jsx         # Cyan border: Controlled slider (Exhausted -> Balanced)
│   │   ├── WearableVPack.jsx      # Yellow border: 3D holographic hand & Firestore real-time stream
│   │   ├── NasaTelemetry.jsx      # Orange border: Space weather & CO2 (via Node.js DONKI proxy)
│   │   └── MarsGameProgress.jsx   # Red border: 3D Martian terrain wireframe & colony progress bar
│   ├── services/
│   │   ├── firebase.js            # Firestore real-time onSnapshot listener & vitals sync functions
│   │   └── api.js                 # Node.js backend client for NASA DONKI & Gemma AI voice analysis
│   ├── App.jsx                    # 3-column CSS Grid layout inside bg-[#0B0D17]
│   ├── DeepSpaceClinic.jsx        # ALL-IN-ONE single file component (ideal for Cursor / v0 / Next.js)
│   ├── main.jsx                   # React root entry
│   └── index.css                  # Tailwind styles + Space Mono font setup
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🔌 Integration Points

### 1. Firebase Firestore (`src/services/firebase.js`)
* **Real-Time Wearable Stream (`subscribeToVPackStream`)**:
  Listens via `onSnapshot` to `wearable_telemetry/vpack_live`, updating `vo2Max`, `cadenceRpm`, `smO2Pct`, and `batteryPct` dynamically.
* **Manual Biometric Commits (`syncVitalsToFirestore`)**:
  Triggered by the *"Sync to Firebase"* button in `BiometricEntry.jsx`, writing daily astronaut entries to the `/daily_vitals` Firestore collection.

### 2. Node.js / Express Backend Proxy (`src/services/api.js`)
* **NASA DONKI Space Weather API (`fetchNasaTelemetry`)**:
  The frontend fetches from `GET /api/telemetry/space-weather`. The Node.js backend securely holds the NASA API key to fetch solar flare (FLR) and coronal mass ejection (CME) data.
* **Gemma AI Multimodal Voice Analysis (`uploadVoiceCheckInToGemma`)**:
  The microphone recording from `VoiceCheckIn.jsx` produces an audio blob sent to `POST /api/ai/voice-checkin` where Gemma AI extracts acoustic biomarkers (tremor, cadence, stress classification).

---

## 🎨 Color Coding & Layout Spec

* **Aesthetic**: `bg-[#0B0D17]` deep space backdrop with frosted glass (`backdrop-blur-md` and `bg-[#0e1628]/70`).
* **Column 1 (Left - Cyan Glowing Borders)**:
  - Daily Biometric Entry
  - Voice Check-In with audio waveform
  - Mood Slider (Exhausted / Isolated ⟵ ⟶ Energetic / Balanced)
* **Column 2 (Center - Yellow Glowing Border)**:
  - Tall Wearable Sensor Sync (VPack) panel with interactive 3D holographic hand render and active exercise vitals.
* **Column 3 (Right - Orange & Red Glowing Borders)**:
  - NASA Radiation & CO2 Telemetry (Orange glowing border, high-contrast `SAFE` and `WARNING` indicators).
  - Mission: Mars Outpost Build (Red glowing border, 3D neon Martian wireframe grid with blue progress bar).
* **Typography**:
  - `Inter` for standard UI labels and text.
  - `Space Mono` for all data, telemetry readings, and numbers.

