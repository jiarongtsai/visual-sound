import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAHli85vuDjMNmK3r0_1k3VQvYSysvUFg",
  authDomain: "visual-sound-db.firebaseapp.com",
  projectId: "visual-sound-db",
  storageBucket: "visual-sound-db.appspot.com",
  messagingSenderId: "787155335374",
  appId: "1:787155335374:web:01814d19cc4c2b46ceb89f",
  measurementId: "G-K7K9LNCM0G",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
export default db;
