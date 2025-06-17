import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyANl95Co86NMZA_jhW0mGKIXA0UneTMa_c",
  authDomain: "sppucodeportal.firebaseapp.com",
  projectId: "sppucodeportal",
  storageBucket: "sppucodeportal.firebasestorage.app",
  messagingSenderId: "134920798057",
  appId: "1:134920798057:web:af2116e911f1aa14f4c7f8",
  measurementId: "G-7QMHBX7JDZ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);