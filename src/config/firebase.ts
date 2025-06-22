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

// Debug environment variables
console.log('🔍 Firebase Config Debug:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  hasAppId: !!firebaseConfig.appId,
  apiKeyLength: firebaseConfig.apiKey?.length || 0,
  projectId: firebaseConfig.projectId
});

// Validate Firebase configuration
const isConfigValid = () => {
  return firebaseConfig.apiKey &&
         firebaseConfig.authDomain &&
         firebaseConfig.projectId &&
         firebaseConfig.appId;
};

// Initialize Firebase only if config is valid
let app: any = null;
let initializationError: string | null = null;

try {
  if (isConfigValid()) {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
  } else {
    initializationError = 'Firebase configuration is incomplete. Please check your environment variables.';
    console.warn('⚠️ Firebase configuration incomplete:', {
      hasApiKey: !!firebaseConfig.apiKey,
      hasAuthDomain: !!firebaseConfig.authDomain,
      hasProjectId: !!firebaseConfig.projectId,
      hasAppId: !!firebaseConfig.appId
    });
  }
} catch (error) {
  initializationError = `Firebase initialization failed: ${error}`;
  console.error('❌ Firebase initialization error:', error);
}

// Initialize Firebase services only if app is initialized
let auth: any = null;
let db: any = null;

if (app) {
  try {
    auth = getAuth(app);
    console.log('✅ Firebase Auth initialized');
  } catch (error) {
    console.error('❌ Firebase Auth initialization failed:', error);
  }

  try {
    db = getFirestore(app);
    console.log('✅ Firebase Firestore initialized');
  } catch (error) {
    console.error('❌ Firebase Firestore initialization failed:', error);
  }
}

export { auth, db };

// Configure auth for better error handling (only if auth is available)
if (auth) {
  auth.useDeviceLanguage(); // Use device language for auth UI
}

// Simple auth state check
export const isAuthReady = (): boolean => {
  return auth !== null && auth !== undefined;
};

// Firestore availability check (simplified)
export const isFirestoreAvailable = (): boolean => {
  return db !== null && db !== undefined && !initializationError;
};

// Get Firebase initialization status
export const getFirebaseStatus = () => {
  return {
    isInitialized: !!app,
    error: initializationError,
    hasAuth: !!auth,
    hasFirestore: !!db
  };
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

// Initialize analytics only if app is available and supported
let analytics = null;
if (app) {
  try {
    analytics = getAnalytics(app);
    console.log('✅ Firebase Analytics initialized');
  } catch (error) {
    console.log('⚠️ Analytics not supported in this environment');
  }
}
export { analytics };

export default app;
