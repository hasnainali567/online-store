import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
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
let logoutBtn = document.getElementById('logoutBtn');
let dashboardsidebar = document.getElementById('dashboardsidebar');
let addProductSidebar = document.getElementById('addProductSidebar');
let dashboardDiv = document.getElementById('dashboardDiv');
let addProductDiv = document.getElementById('addProductDiv');

openSideBar.addEventListener('click', ()=> {
    sideBar.classList.toggle('d-none')
})


onAuthStateChanged(auth, async (user)=>{
    if (user) {
        let userName = document.querySelectorAll('.userName');
        console.log(user.email);
        
        let name = user.email.slice(0, 1).toUpperCase() + user.email.slice(1, user.email.indexOf('@'));
        console.log(name);
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

logoutBtn.addEventListener('click', ()=>{
    signOut(auth).then(()=>{
        console.log('logout success');
        window.location = 'index.html'
        
    })
})


addProductSidebar.addEventListener('click', ()=>{
    addProductDiv.classList.remove('d-none');
    dashboardDiv.classList.add('d-none');
})


dashboardsidebar.addEventListener('click', ()=>{
    dashboardDiv.classList.remove('d-none');
    addProductDiv.classList.add('d-none');
})