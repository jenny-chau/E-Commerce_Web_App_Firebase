import { initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const apiKey = import.meta.env.FIREBASE_API_KEY

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "e-commerce-app-3c583.firebaseapp.com",
  projectId: "e-commerce-app-3c583",
  storageBucket: "e-commerce-app-3c583.firebasestorage.app",
  messagingSenderId: "808005618267",
  appId: "1:808005618267:web:05bc8e2f75749023518d7e"
};

const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app); 
const db = getFirestore(app);

export { auth, db };