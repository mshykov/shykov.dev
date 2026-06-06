import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Fail loudly-but-gracefully on misconfiguration: a missing var yields an
// `undefined` config value that otherwise only surfaces later as an opaque
// auth/Firestore runtime error. Log an actionable message instead.
const requiredKeys = ['apiKey', 'projectId', 'appId'] as const;
const missingKeys = requiredKeys.filter((k) => !firebaseConfig[k]);
if (missingKeys.length > 0) {
  const vars = missingKeys
    .map((k) => 'VITE_FIREBASE_' + k.replace(/[A-Z]/g, (c) => '_' + c).toUpperCase())
    .join(', ');
  console.error(
    `Firebase config is incomplete — missing env vars: ${vars}. ` +
    `Copy .env.example to .env and fill in the VITE_FIREBASE_* values.`
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Analytics is consent-gated (see the cookie banner in components/Layout.tsx)
// and only initialized when the environment supports it. `getAnalytics` is not
// called at import time so no GA cookie is set before the visitor accepts.
export let analytics: Analytics | null = null;

export const initAnalytics = async (): Promise<Analytics | null> => {
  if (analytics) return analytics;
  if (typeof window === 'undefined' || !firebaseConfig.measurementId) return null;
  if (localStorage.getItem('cookie-consent') !== 'accepted') return null;
  try {
    if (await isSupported()) {
      analytics = getAnalytics(app);
    }
  } catch {
    // Analytics unsupported in this environment (e.g. private mode) — ignore.
  }
  return analytics;
};

export default app;
