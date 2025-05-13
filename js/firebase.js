import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth , createUserWithEmailAndPassword , signInWithEmailAndPassword , onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBtewJrnAZ1ZBqA0dTxWhuOOqx3gXp3M9g",
  authDomain: "online-store-a895a.firebaseapp.com",
  projectId: "online-store-a895a",
  storageBucket: "online-store-a895a.firebasestorage.app",
  messagingSenderId: "1088111085428",
  appId: "1:1088111085428:web:9592aa4ec9ef1305814e21",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
}