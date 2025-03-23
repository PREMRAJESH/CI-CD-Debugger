import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// API URL for fetching logs from Vercel
const API_URL =
  import.meta.env.VITE_API_URL || "https://your-project.vercel.app/api/logs";

// Function to fetch logs from Vercel API
export const fetchLogs = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log("CI/CD Logs:", data);
    return data;
  } catch (error) {
    console.error("Error fetching logs:", error);
    return null;
  }
};

export { db, collection, getDocs };
