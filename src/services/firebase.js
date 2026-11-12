/**
 * FIREBASE INTEGRATION SERVICE
 * Handles Firestore real-time vitals synchronization and authentication placeholders.
 */

// Placeholder Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSy_DEEP_SPACE_CLINIC_MOCK_KEY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "deep-space-clinic.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "deep-space-clinic",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "deep-space-clinic.appspot.com",
  messagingSenderId: "109283091823",
  appId: "1:109283091823:web:980a9f87c8d9e"
};

/**
 * Sync daily manual biometric entries to Firestore collection `daily_vitals`
 * @param {Object} vitalsData - { bloodPressure, bloodSugar, heartRate, bodyTemp, timestamp }
 * @returns {Promise<{success: boolean, id: string}>}
 */
export async function syncVitalsToFirestore(vitalsData) {
  console.log("[Firebase] Committing daily vitals payload to Firestore /vitals collection:", vitalsData);
  
  // Simulated Firestore addDoc() / setDoc() network latency
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        id: `vitals_doc_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    }, 600);
  });
}

/**
 * Subscribe to real-time VPack wearable sensor stream from Firestore collection `wearable_telemetry`
 * Emulates `onSnapshot(doc(db, "telemetry", "vpack_live"), (doc) => callback(doc.data()))`
 * @param {Function} onDataCallback - invoked on each real-time telemetry frame
 * @returns {Function} unsubscribe cleanup function
 */
export function subscribeToVPackStream(onDataCallback) {
  console.log("[Firebase] Initializing real-time onSnapshot listener for VPack wearable telemetry...");

  // Send initial frame
  onDataCallback({
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

  // Emulate Firestore continuous real-time stream pulse
  const interval = setInterval(() => {
    onDataCallback({
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

  return () => {
    console.log("[Firebase] Detaching VPack real-time onSnapshot listener.");
    clearInterval(interval);
  };
}

