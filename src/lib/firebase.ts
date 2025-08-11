
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6vY4_rKyYRNMJEEFXs12QpP61yCLw9Fk",
  authDomain: "vida-financeira-planner.firebaseapp.com",
  projectId: "vida-financeira-planner",
  storageBucket: "vida-financeira-planner.appspot.com",
  messagingSenderId: "84532001329",
  appId: "1:84532001329:web:a672d3eb98dcf99ff4b310",
  measurementId: "G-XY94WQRR7Z"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Connect to emulators if running locally in dev mode
if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && process.env.NODE_ENV === 'development') {
    console.log("Connecting to Firebase Emulators");
    // Point to the emulators for auth and firestore
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
}


let analytics;
if (typeof window !== 'undefined') {
    isSupported().then(supported => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}


export { app, auth, db };
