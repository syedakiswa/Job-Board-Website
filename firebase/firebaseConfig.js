import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCBZGGpV4CbZqMfVwRuwT0xM93t_zbwZbo",
    authDomain: "job-board-2a090.firebaseapp.com",
    projectId: "job-board-2a090",
    storageBucket: "job-board-2a090.firebasestorage.app",
    messagingSenderId: "452191248730",
    appId: "1:452191248730:web:638a62b375feb5245ad363",
    measurementId: "G-8F0E4PT9F2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);