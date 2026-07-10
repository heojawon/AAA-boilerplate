// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiZqUZ7oLO3CbJQ834hlW9MGK24BERazw",
  authDomain: "aaa-backend-faa0e.firebaseapp.com",
  projectId: "aaa-backend-faa0e",
  storageBucket: "aaa-backend-faa0e.firebasestorage.app",
  messagingSenderId: "680212189275",
  appId: "1:680212189275:web:2e7fa653e0773c7c052f7e",
  measurementId: "G-X885675973"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);