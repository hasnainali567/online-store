import { auth, signOut, onAuthStateChanged, getDoc, db, doc, sendEmailVerification, updateDoc, storage, uploadBytes, getDownloadURL, ref } from "./firebase.js";

let logoutBtn = document.getElementById('logoutBtn');
let verifyBtn = document.getElementById('verifyBtn');
let profilePic = document.getElementById('profilePic');
let cartDiv = document.getElementById('cartDiv');
let backBtn = document.getElementById('backBtn');
let editCart = document.getElementById('editCart');
let saveEditBtn = document.getElementById('saveEditBtn');
let spinner = document.getElementById('spinner');
let editBtn = document.querySelectorAll('.editBtn');
console.log(editBtn);


let originalTitles = [];
let originalDescs = [];

let handleResize = () => {
    let titles = document.querySelectorAll('.cart-product-name');
    let descs = document.querySelectorAll('.cart-product-des');

    for (let i = 0; i < titles.length; i++) {
        let title = originalTitles[i];
        let desc = originalDescs[i];

        // Title slice
        if (window.innerWidth < 385) {
            if (title.length > 18) {
                title = title.slice(0, 19);
                title = title.slice(0, title.lastIndexOf(' '));
                title += ' ....';

            }
            desc = desc.slice(0, 31);
            desc = desc.slice(0, desc.lastIndexOf(' '));
            desc += ' ....';
        } else if (window.innerWidth < 425) {
            desc = desc.slice(0, 36);
            desc = desc.slice(0, desc.lastIndexOf(' '));
            desc += ' ....';
        } else if (window.innerWidth < 461) {
            desc = desc.slice(0, 41);
            desc = desc.slice(0, desc.lastIndexOf(' '));
            desc += ' ....';
        } else if (window.innerWidth < 493) {
            desc = desc.slice(0, 51);
            desc = desc.slice(0, desc.lastIndexOf(' '));
            desc += ' ....';
        } else if (window.innerWidth < 532) {
            desc = desc.slice(0, 61);
            desc = desc.slice(0, desc.lastIndexOf(' '));
            desc += ' ....';
        } else if (window.innerWidth < 600) {
            desc = desc.slice(0, 71);
            desc = desc.slice(0, desc.lastIndexOf(' '));
            desc += ' ....';
        } else if (window.innerWidth < 768) {
            desc = desc.slice(0, 106);
            desc = desc.slice(0, desc.lastIndexOf(' '));
            desc += ' ....';
        } else if (window.innerWidth < 900) {
            desc = desc.slice(0, 116);
            desc = desc.slice(0, desc.lastIndexOf(' '));
            desc += ' ....';
        }

        titles[i].innerText = title;
        descs[i].innerText = desc;
    }
}

window.addEventListener('resize', handleResize);
window.addEventListener('load', handleResize);





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

            if (data.profileURL) {
                profilePic.src = data.profileURL;
            }
            let { name, email } = data;


            if (data.cart) {
                for (let i = 0; i < data.cart.length; i++) {
                    let product = await fetch(`https://dummyjson.com/products/${data.cart[i]}`);
                    product = await product.json();
                    originalTitles.push(product.title);
                    originalDescs.push(product.description);


                    const cartElem = `<div class="bg-light text-dark p-2 p-md-3 rounded w-100 mt-4">
                        <div class="card-body ">
                            <div class="d-flex cartText">
                                <div class="col-auto d-flex align-items-center">
                                    <div class="cartCheck d-none form-check">
                                    <input class="form-check-input bg-dark text-light" type="checkbox" value="" id="checkDefault">
                                    </div>
                                    <img src="${product.images[0]}"
                                        class="d-sm-block img-thumbnail cart-image me-2 m-sm-0 me-sm-2" alt="...">
                                    </div>
                                <div class="col-auto col-sm-10 d-flex flex-column flex-md-row flex-fill">
                                    <div class="flex-fill">
                                        <h3 class="cart-product-name m-0">${product.title}</h3>
                                        <p class="cart-product-des mb-2 m-sm-0 text-wrap">${product.description}</p>
                                    </div>
                                    <div class="col-auto d-flex flex-row flex-md-column justify-content-between">
                                        <span class="align-self-end rounded btn btn-outline-dark "><i
                                                class="fa-solid fa-trash"></i></span>
                                        <button class="btn btn-dark">Check out</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`

                    cartDiv.innerHTML += cartElem;
                    handleResize();
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

backBtn.addEventListener('click', () => {
    window.location = backBtn.value;
})
editBtn.forEach(elem => {
    elem.addEventListener('click', () => {
    const saveEditBtn = document.getElementById('saveEditBtn');
    const editName = document.getElementById('editName');
    const editImage = document.getElementById('editImage');

    // Remove previous listener to prevent multiple triggers
    const newSaveBtn = saveEditBtn.cloneNode(true);
    saveEditBtn.parentNode.replaceChild(newSaveBtn, saveEditBtn);

    newSaveBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const nameValue = editName.value.trim();
        const file = editImage.files[0];

        // ✅ Name validation
        if (nameValue.length < 3) {
            editName.value = '';
            editName.placeholder = 'At least 3 characters';
            return;
        }

        // ✅ File validation
        if (!file) {
            return alert("Please select a profile image.");
        }

        const validImageTypes = /^image\/(jpeg|png|jpg|webp)$/;
        if (!validImageTypes.test(file.type)) {
            return alert("Invalid file type. Only JPG, JPEG, PNG or WebP allowed.");
        }

        console.log(file);
        


        try {

            // Upload to Firebase Storage
            const storageRef = ref(storage, `users/${auth.currentUser.uid}/profile.jpg`);
            console.log(storageRef);
            await uploadBytes(storageRef, file);
            console.log('hi');
            
            const downloadURL = await getDownloadURL(storageRef);

            console.log(downloadURL);
            

            // Update Firestore
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                name: nameValue,
                profileURL: downloadURL
            });


            // Update profile image in UI
            profilePic.src = downloadURL;

            alert("Profile updated successfully!");

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
            modal.hide();
        } catch(error) {
            console.error(error + 'error');
            console.log(error.message);
            
        }
    });
});
})









let btns = editCart.parentElement.querySelectorAll('button');


editCart.addEventListener('click', (e) => {
    let cartCheck = document.querySelectorAll('.cartCheck');
    cartCheck.forEach(item => {
        item.classList.remove('d-none')
    })

    btns[1].classList.remove('d-none')
    btns[2].classList.remove('d-none')
    btns[3].classList.remove('d-none')
    editCart.classList.add('d-none');
})

btns[1].addEventListener('click', () => {

    let cartCheck = document.querySelectorAll('.cartCheck');
    cartCheck.forEach(item => {
        item.classList.add('d-none')
    })

    btns[1].classList.add('d-none')
    btns[2].classList.add('d-none')
    btns[3].classList.add('d-none')
    editCart.classList.remove('d-none');
})
btns[2].addEventListener('click', () => {

    let cartCheck = document.querySelectorAll('.cartCheck');
    cartCheck.forEach(item => {
        item.classList.add('d-none')
    })

    btns[1].classList.add('d-none')
    btns[2].classList.add('d-none')
    btns[3].classList.add('d-none')
    editCart.classList.remove('d-none');
})
btns[3].addEventListener('click', () => {

    let cartCheck = document.querySelectorAll('.cartCheck');
    cartCheck.forEach(item => {
        item.classList.add('d-none')
    })

    btns[1].classList.add('d-none')
    btns[2].classList.add('d-none')
    btns[3].classList.add('d-none')
    editCart.classList.remove('d-none');
})