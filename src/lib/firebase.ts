
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "planejei-4oo42",
  "appId": "1:120489705522:web:660ffb2c96e9c53e60fc2b",
  "databaseURL": "https://planejei-4oo42-default-rtdb.firebaseio.com",
  "storageBucket": "planejei-4oo42.appspot.com",
  "apiKey": "AIzaSyBx4kriOPiZBPacBVy-kSxcvRBnQuw0euM",
  "authDomain": "planejei-4oo42.firebaseapp.com",
  "messagingSenderId": "120489705522",
  "measurementId": "G-DR2P9P32B6"
};


// Initialize Firebase
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

// Connect to emulators if running locally in dev mode
if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && process.env.NODE_ENV === 'development') {
    console.log("Connecting to Firebase Emulators");
    // Point to the emulators for auth and firestore
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectDatabaseEmulator(rtdb, 'localhost', 9000);
}


let analytics;
if (typeof window !== 'undefined') {
    isSupported().then(supported => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}


export { app, auth, db, rtdb };
