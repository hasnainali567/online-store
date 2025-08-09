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

openSideBar.addEventListener('click', () => {
    sideBar.classList.toggle('d-none')
})


onAuthStateChanged(auth, async (user) => {
    if (user) {
        if (user.email === 'hasnain5f7@gmail.com') {
            let userName = document.querySelectorAll('.userName');
            let name = user.email.slice(0, 1).toUpperCase() + user.email.slice(1, user.email.indexOf('@'));
            userName.forEach((elem) => elem.innerText = name)
            let data = await fetch(`https://dummyjson.com/products/`);
            let res = await data.json();
            console.log(res);
        } else {
            window.location.href = 'userProfile.html';
        }
    } else {
        console.log('user not logged in');
        window.location.href = 'index.html';
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

logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('logout success');
        window.location = 'index.html'

    })
})


addProductSidebar.addEventListener('click', () => {
    addProductDiv.classList.remove('d-none');
    dashboardDiv.classList.add('d-none');
})


dashboardsidebar.addEventListener('click', () => {
    dashboardDiv.classList.remove('d-none');
    addProductDiv.classList.add('d-none');
})