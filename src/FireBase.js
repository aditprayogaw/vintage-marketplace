import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// --- PASTE KONFIGURASI DARI FIREBASE CONSOLE DI SINI ---
const firebaseConfig = {
  apiKey: "AIzaSyCW2fKMxh7clmfrVDhXIu4NacvCTCn0k7c",
  authDomain: "vintage-app-1aeb6.firebaseapp.com",
  projectId: "vintage-app-1aeb6",
  storageBucket: "vintage-app-1aeb6.firebasestorage.app",
  messagingSenderId: "563545849030",
  appId: "1:563545849030:web:d16f9e6ae0992c3797ebc7"
};

const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);      
const db = getFirestore(app);  
const storage = getStorage(app);

export { auth, db, storage};