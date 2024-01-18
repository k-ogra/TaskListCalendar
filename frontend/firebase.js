import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "tasklistcalendar.firebaseapp.com",
  projectId: "tasklistcalendar",
  storageBucket: "tasklistcalendar.appspot.com",
  messagingSenderId: "710836918500",
  appId: "1:710836918500:web:ff7845a09c360b213a34f1",
  measurementId: "G-MBNW863TH1"
};

export const app = initializeApp(firebaseConfig);