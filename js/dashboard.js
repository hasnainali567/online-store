import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  db,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "./firebase.js";

let openSideBar = document.getElementById('openSideBar');
let sideBar = document.getElementById('sideBar');

openSideBar.addEventListener('click', ()=> {
    sideBar.classList.toggle('d-none')
})


onAuthStateChanged(auth, async (user)=>{
    if (user) {
        let userName = document.querySelectorAll('.userName');
        let name = user.email.slice(0, 1).toUpperCase() + user.email.slice(1, user.email.indexOf('@'));
        userName.forEach((elem) => elem.innerText = name)
    }

    // try {
    //     let docRef = doc(db, 'user', user.uid);
    //     let docSnap = await getDoc(docRef);
    //     if (docSnap.exists()) {
    //         console.log(docSnap.data());
            
    //     }
    // } catch (error) {
        
    // }
})