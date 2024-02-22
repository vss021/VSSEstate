// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "vssestate-24f4b.firebaseapp.com",
  projectId: "vssestate-24f4b",
  storageBucket: "vssestate-24f4b.appspot.com",
  messagingSenderId: "541763056589",
  appId: "1:541763056589:web:2e24576ce16bd1e4a78a84"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);