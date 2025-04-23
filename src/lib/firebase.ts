import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// WARNING: Hardcoding API keys is insecure. Use environment variables.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "YOUR_FALLBACK_API_KEY", // Example using env var
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "YOUR_FALLBACK_AUTH_DOMAIN",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "YOUR_FALLBACK_PROJECT_ID",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "YOUR_FALLBACK_STORAGE_BUCKET",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "YOUR_FALLBACK_SENDER_ID",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "YOUR_FALLBACK_APP_ID",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID // Optional
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
export const auth = getAuth(app);

// Note: For security, replace hardcoded fallback keys with actual keys
// stored securely, ideally via environment variables (.env file and Vite's env handling).
// Example .env content:
// REACT_APP_FIREBASE_API_KEY=AIzaSy...
// REACT_APP_FIREBASE_AUTH_DOMAIN=summer-camp...
// etc.