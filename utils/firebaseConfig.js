// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTdm5bj43C_Kmlx73LOdaN8BzDereMpgc",
  authDomain: "jobfitnlp.firebaseapp.com",
  projectId: "jobfitnlp",
  storageBucket: "jobfitnlp.appspot.com",
  messagingSenderId: "667080205182",
  appId: "1:667080205182:web:197935277e72443132492f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };
