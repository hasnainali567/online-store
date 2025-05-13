import { auth , createUserWithEmailAndPassword , onAuthStateChanged } from "./firebase.js";


let signUPBtn = document.getElementById('signUPBtn');
let emailInp = document.querySelector('.emailInp');
let nameInp = document.querySelector('.nameInp');
let passInp = document.getElementById('inputPassword6');
let picInt = document.getElementById('formFile');

signUPBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    let email = emailInp.value;
    let password = passInp.value;

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        const user = userCredential.user;
        user.displayName = nameInp.value
        console.log(user);
        
        
    })
    
})