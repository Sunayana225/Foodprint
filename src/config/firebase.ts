// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Using environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Configure auth for better error handling
auth.useDeviceLanguage(); // Use device language for auth UI

// Simple auth state check
export const isAuthReady = (): boolean => {
  return auth !== null && auth !== undefined;
};

// Firestore availability check (simplified)
export const isFirestoreAvailable = (): boolean => {
  return db !== null && db !== undefined;
};

// Simple error handler for Firestore operations
export const getFirestoreError = (error: any): string => {
  if (error?.code) {
    switch (error.code) {
      case 'permission-denied':
        return 'Permission denied. Please check your authentication.';
      case 'unavailable':
        return 'Service temporarily unavailable. Please try again.';
      case 'not-found':
        return 'Document not found.';
      default:
        return error.message || 'An unknown error occurred.';
    }
  }
  return error?.message || 'An unknown error occurred.';
};

// Initialize analytics only if supported
let analytics;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.log('Analytics not supported in this environment');
}
export { analytics };

export default app;
