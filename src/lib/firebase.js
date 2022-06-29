import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLX7GlWCGVLQ8NHZQ-kxceGgiqN9-KttA",
  authDomain: "todo-3a3c6.firebaseapp.com",
  projectId: "todo-3a3c6",
  storageBucket: "todo-3a3c6.appspot.com",
  messagingSenderId: "121616781980",
  appId: "1:121616781980:web:e9b28c0c2df5dd6f915359",
  measurementId: "G-T95DPZJ1JG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();

export default db;

