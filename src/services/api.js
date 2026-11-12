/**
 * NODE.JS / EXPRESS BACKEND API CLIENT
 * Handles requests routed through the backend proxy for security:
 * 1. NASA DONKI API telemetry (Space Weather, Coronal Mass Ejections, Solar Flares)
 * 2. Gemma AI Voice Sentiment & Biomarker Analysis (transcription & psychological strain evaluation)
 */

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

/**
 * Fetch space weather telemetry and internal habitat atmospheric readings.
 * The Node.js backend holds the secret NASA API key (DONKI/CME/FLR endpoints).
 * @returns {Promise<Object>} Space radiation, solar flux, and habitat CO2 readings
 */
export async function fetchNasaTelemetry() {
  console.log(`[API] GET ${BACKEND_BASE_URL}/telemetry/space-weather (fetching from Node.js backend proxy)...`);

  // Emulate secure backend proxy response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        spaceWeather: {
          solarFluxClass: "Class C-1.2 (Low)",
          cosmicRadiationMsv: 0.38,
          status: "SAFE",
          fluxPercentage: 24,
          magnetosphereDeflection: "99.1%"
        },
        habitatAtmosphere: {
          co2LevelMmhg: 3.8,
          co2Percentage: 0.50,
          co2ThresholdMmhg: 4.0,
          status: "WARNING",
          warningPercentage: 68,
          o2PartialPressureKpa: 101.3,
          o2Fraction: "20.9%",
          statusO2: "SAFE"
        }
      });
    }, 400);
  });
}

/**
 * Upload daily audio check-in voice blob to Node.js backend for Gemma AI analysis.
 * The backend processes acoustics for vocal tremors, stress micro-cadence, and transcript sentiment.
 * @param {Blob} audioBlob - Raw audio blob from MediaRecorder
 * @returns {Promise<{transcript: string, sentimentScore: number, stressIndex: string}>}
 */
export async function uploadVoiceCheckInToGemma(audioBlob) {
  console.log("[API] POST /api/ai/voice-checkin: Uploading audio blob for Gemma AI sentiment analysis...", {
    blobSize: audioBlob?.size || 0,
    type: audioBlob?.type || "audio/webm"
  });

  // Emulated Gemma multimodal speech analysis latency
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transcript: "Crew mental resilience baseline stable. Circadian rhythm aligned with Martian day 24h 39m. Zero acoustic tremor detected.",
        sentimentScore: 0.88,
        stressIndex: "NOMINAL",
        vocalCadenceWpm: 128
      });
    }, 800);
  });
}

