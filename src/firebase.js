import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9vDzctvx2C3UZsKC-NW8SQgV_fanKS28",
  authDomain: "indus-kioask.firebaseapp.com",
  projectId: "indus-kioask",
  storageBucket: "indus-kioask.firebasestorage.app",
  messagingSenderId: "427254650388",
  appId: "1:427254650388:web:6fb4217b381004067e3901",
  measurementId: "G-3TH3NQ4SZX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "main");
export default app;
