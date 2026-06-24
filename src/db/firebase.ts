// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBeOM3oUXN7lttEwhImEXiJk4DZUXCxkSA",
  authDomain: "websitedeploy-ada64.firebaseapp.com",
  databaseURL: "https://websitedeploy-ada64-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "websitedeploy-ada64",
  storageBucket: "websitedeploy-ada64.firebasestorage.app",
  messagingSenderId: "471645939355",
  appId: "1:471645939355:web:a834bf360b48e1a791c83e",
  measurementId: "G-2D4NJTE8V3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);