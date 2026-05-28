import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyCjBguJmFYUYndI3VC9YQ2TtQWZwbyB0qk",
  authDomain: "travelbridge-7ae98.firebaseapp.com",
  projectId: "travelbridge-7ae98",
  storageBucket: "travelbridge-7ae98.firebasestorage.app",
  messagingSenderId: "299594347524",
  appId: "1:299594347524:web:f094fd3f75a21e690db151",
  measurementId: "G-3NXY1VT5T4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();