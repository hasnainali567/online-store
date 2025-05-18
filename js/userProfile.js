import { auth, signOut, onAuthStateChanged, getDoc, db, doc, sendEmailVerification  } from "./firebase.js";

let logoutBtn = document.getElementById('logoutBtn');
let verifyBtn = document.getElementById('verifyBtn');


onAuthStateChanged(auth, async (user) => {
    if (user) {
console.log(user);
        let Verified = document.getElementById('Verified');
        let userName = document.querySelectorAll('.userName');
        let userEmail = document.querySelector('.userEmail');
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (user.emailVerified) {
            Verified.innerHTML = `<span class="material-symbols-outlined align-self-middle">
verified
</span>`
verifyBtn.innerText = 'Verifeid';
verifyBtn.setAttribute('disabled', true);
verifyBtn.classList.add('btn-success')
        }
        if (docSnap.exists()) {
            console.log('data---->' , docSnap.data());
            let data = docSnap.data();
            let {name, email} = data;
            console.log(email);
            
            userEmail.innerText = email
            userName.forEach((elem) => elem.innerText = name)
        }
        console.log(name);
    }
})


logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('logout success');
        window.location = 'index.html'

    })
})


verifyBtn.addEventListener('click', ()=>{
    sendEmailVerification(auth.currentUser)
  .then(() => {
    alert('Plz verify Your Email before continue')
    window.location = 'userProfile.html'
  });
})