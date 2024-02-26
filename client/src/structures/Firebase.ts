// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBHT9wDkmxWs7T6a6m7ZNvFOY6JKJaE5Og",
    authDomain: "blitzappv1.firebaseapp.com",
    projectId: "blitzappv1",
    storageBucket: "blitzappv1.appspot.com",
    databaseURL: "https://blitzappv1-default-rtdb.asia-southeast1.firebasedatabase.app",
    messagingSenderId: "245689724814",
    appId: "1:245689724814:web:cb42ab432716d16de87edf",
    measurementId: "G-197ZK5TQZK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = getFirestore(app);
const rdb = getDatabase(app);

export { app, db, rdb };
