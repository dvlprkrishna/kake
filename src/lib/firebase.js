// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASOBWz3g4QwJDQ_0LzwghpVCa20BMo5cg",
  authDomain: "kake-8c1eb.firebaseapp.com",
  projectId: "kake-8c1eb",
  storageBucket: "kake-8c1eb.firebasestorage.app",
  messagingSenderId: "990873821978",
  appId: "1:990873821978:web:7c91c93c8560844a4c82a3",
  measurementId: "G-YMVL9KPZ5H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
