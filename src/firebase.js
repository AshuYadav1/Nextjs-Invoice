// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDA86VrxY6wgO-gzCaicAEtBj4YANJSPrY",
    authDomain: "vegiwell-2.firebaseapp.com",
    databaseURL: "https://vegiwell-2-default-rtdb.firebaseio.com",
    projectId: "vegiwell-2",
    storageBucket: "vegiwell-2.appspot.com",
    messagingSenderId: "420552800873",
    appId: "1:420552800873:web:c6b404afe9ea8d5608c0f8"
  };
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


export { db, storage };