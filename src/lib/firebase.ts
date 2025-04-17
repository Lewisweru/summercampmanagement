import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLM4Tf9h5PYV1E0ONeC0NBV6OFqbIUCYY",
  authDomain: "summer-camp-management-s-3e50d.firebaseapp.com",
  projectId: "summer-camp-management-s-3e50d",
  storageBucket: "summer-camp-management-s-3e50d.firebasestorage.app",
  messagingSenderId: "439151269515",
  appId: "1:439151269515:web:e0b47f772295b55e17e68e",
  measurementId: "G-8X49E6BK0Y"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);