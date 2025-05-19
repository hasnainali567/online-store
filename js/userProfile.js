import { auth, signOut, onAuthStateChanged, getDoc, db, doc, sendEmailVerification } from "./firebase.js";

let logoutBtn = document.getElementById('logoutBtn');
let verifyBtn = document.getElementById('verifyBtn');
let cartDiv = document.getElementById('cartDiv');
let backBtn = document.getElementById('backBtn');
let editCart = document.getElementById('editCart');
let spinner = document.getElementById('spinner');



onAuthStateChanged(auth, async (user) => {
    if (user) {
        let Verified = document.getElementById('Verified');
        let userName = document.querySelectorAll('.userName');
        let userEmail = document.querySelector('.userEmail');
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (user.emailVerified) {
            Verified.innerHTML = `<span class="material-symbols-outlined align-self-middle">verified</span>`
            verifyBtn.innerText = 'Verifeid';
            verifyBtn.setAttribute('disabled', true);
            verifyBtn.classList.add('btn-success')
        }
        if (docSnap.exists()) {
            console.log('data---->', docSnap.data());
            let data = docSnap.data();
            let { name, email } = data;


            if(data.cart) {
                for (let i = 0; i < data.cart.length; i++) {
                let product = await fetch(`https://dummyjson.com/products/${data.cart[i]}`);
                product = await product.json();

                console.log(product);
                
                const cartElem = `<div class="bg-light text-dark p-2 p-md-3 rounded w-100 mt-4">
                        <div class="card-body ">
                            <div class="d-flex cartText">
                                <div class="col-auto d-flex">
                                    <img src="${product.images[0]}"
                                        class="d-sm-block img-thumbnail cart-image me-2 m-sm-0 me-sm-2" alt="...">
                                    </div>
                                <div class="col-auto col-sm-10 d-flex flex-column flex-md-row flex-fill">
                                    <div class="flex-fill">
                                        <h3 class="cart-product-name m-0">${product.title}</h3>
                                        <p class="cart-product-des mb-2 m-sm-0 text-wrap">${product.description}</p>
                                    </div>
                                    <div class="col-auto d-flex flex-row flex-md-column justify-content-between">
                                        <span class="align-self-end p-2 px-3 rounded bg-outline-dark "><i
                                                class="fa-solid fa-trash"></i></span>
                                        <button class="btn btn-dark">Check out</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`

                    cartDiv.innerHTML += cartElem;
                }
                
            }

            userEmail.innerText = email
            userName.forEach((elem) => elem.innerText = name)
        }
        spinner.classList.add('d-none')
    }
})


logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('logout success');
        window.location = 'index.html'

    })
})


verifyBtn.addEventListener('click', () => {
    sendEmailVerification(auth.currentUser)
        .then(() => {
            alert('Plz verify Your Email before continue')
            window.location = 'userProfile.html'
        });
})

backBtn.addEventListener('click', ()=>{
    window.location = backBtn.value;
})


console.log(editCart);

let btns = editCart.parentElement.querySelectorAll('button');

editCart.addEventListener('click', (e)=> {
    console.log(btns);
    
    btns[1].classList.remove('d-none')
    btns[2].classList.remove('d-none')
    btns[3].classList.remove('d-none')
    editCart.classList.add('d-none');
})

btns[1].addEventListener('click', ()=>{

    btns[1].classList.add('d-none')
    btns[2].classList.add('d-none')
    btns[3].classList.add('d-none')
    editCart.classList.remove('d-none');
})
btns[2].addEventListener('click', ()=>{

    btns[1].classList.add('d-none')
    btns[2].classList.add('d-none')
    btns[3].classList.add('d-none')
    editCart.classList.remove('d-none');
})
btns[3].addEventListener('click', ()=>{

    btns[1].classList.add('d-none')
    btns[2].classList.add('d-none')
    btns[3].classList.add('d-none')
    editCart.classList.remove('d-none');
})