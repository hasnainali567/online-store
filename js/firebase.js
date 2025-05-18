import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth , createUserWithEmailAndPassword , signInWithEmailAndPassword , onAuthStateChanged , signOut, sendEmailVerification  } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getFirestore , doc, setDoc , getDoc, addDoc} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-storage.js";



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
const db = getFirestore(app);
const storage = getStorage(app);


export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  db,
  doc,
  setDoc,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  getDoc,
  addDoc,
  signOut,
  sendEmailVerification 
}