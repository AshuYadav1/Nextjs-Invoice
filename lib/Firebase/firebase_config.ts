// lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage as getFirebaseStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA86VrxY6wgO-gzCaicAEtBj4YANJSPrY",
  authDomain: "vegiwell-2.firebaseapp.com",
  databaseURL: "https://vegiwell-2-default-rtdb.firebaseio.com",
  projectId: "vegiwell-2",
  storageBucket: "vegiwell-2.appspot.com",
  messagingSenderId: "420552800873",
  appId: "1:420552800873:web:c6b404afe9ea8d5608c0f8"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize services
const auth = getAuth(app);
const storage = getFirebaseStorage(app); // Alias Firebase storage
const firestore = getFirestore(app);

export { app, auth, storage, firestore };
