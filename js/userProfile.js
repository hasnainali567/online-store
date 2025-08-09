import { auth, signOut, onAuthStateChanged, getDoc, db, doc, sendEmailVerification, updateDoc, storage, uploadBytes, getDownloadURL, ref, serverTimestamp, addDoc, collection, arrayRemove, arrayUnion } from "./firebase.js";

let logoutBtn = document.getElementById('logoutBtn');
let verifyBtn = document.getElementById('verifyBtn');
let profilePic = document.getElementById('profilePic');
let cartDiv = document.getElementById('cartDiv');
let backBtn = document.getElementById('backBtn');
let editCart = document.getElementById('editCart');
let navMenu = document.querySelector('.nav-menu')
let saveEditBtn = document.getElementById('saveEditBtn');
let spinner = document.getElementById('spinner');
let editBtn = document.querySelectorAll('.editBtn');


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

            if (user.email === 'hasnain5f7@gmail.com') {
                console.log(navMenu.querySelector('.db-btn').classList.remove('d-none'))
                
            }
        }
        if (docSnap.exists()) {
            let data = docSnap.data();

            if (data.profileURL) {
                profilePic.src = data.profileURL;
            }
            let { name, email } = data;


            if (data.cart) {
                let sortedCart = data.cart.sort((a, b) => {
                    return b.addedAt - a.addedAt
                })
                console.log(sortedCart);
                
                renderCartItem(sortedCart)

            }

            userEmail.innerText = email
            userName.forEach((elem) => elem.innerText = name)
        }
        spinner.classList.add('d-none')
    }
})


const renderCartItem = async (data) => {
    cartDiv.innerHTML = ''
    for (let i = 0; i < data.length; i++) {

        let product = data[i];
        let productId = product.id;
        originalTitles.push(product.title);
        originalDescs.push(product.description);


        const cartElem = `<div id="cart-item" class="bg-light text-dark p-2 p-md-3 rounded w-100 mt-4">
                        <div class="card-body ">
                            <div class="d-flex cartText">
                                <div class="col-auto d-flex align-items-center">
                                    <div class="cartCheck d-none form-check">
                                    <input class="form-check-input bg-dark text-light" type="checkbox" value="" id="checkDefault">
                                    </div>
                                    <img src="${product.image}" loading="lazy" height="100" width="100"
                                        class="d-sm-block img-thumbnail cart-image me-2 m-sm-0 me-sm-2" alt="...">
                                    </div>
                                <div class="col-auto col-sm-10 d-flex flex-column flex-md-row flex-fill">
                                    <div class="flex-fill">
                                        <h3 class="cart-product-name m-0">${product.title}</h3>
                                        <p class="cart-product-des mb-2 m-sm-0 text-wrap">${product.description}</p>
                                    </div>
                                    <div class="col-auto d-flex flex-row flex-md-column justify-content-between">
                                        <span class="del-cart-item align-self-end rounded btn btn-outline-dark " disabled="${data[i].checkedOut}" data-id="${productId}"><i
                                                class="fa-solid fa-trash"></i></span>
                                        <button class="checkout-cart-item btn ${data[i].checkedOut ? 'btn-success' : 'btn-dark'}" ${data[i].checkedOut ? 'disabled' : ''} data-id="${productId}">${data[i].checkedOut ? 'Checked Out' : 'Check Out'}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`

        cartDiv.innerHTML += cartElem;
        handleResize();
    }
}

cartDiv && cartDiv.addEventListener('click', async (e) => {
    const checkOutBtn = e.target.closest('.checkout-cart-item');

    const delBtn = e.target.closest('.del-cart-item');

    if (delBtn) {
        const productId = delBtn.getAttribute('data-id');
        const checkOut = delBtn.getAttribute('disabled')
        const userId = auth.currentUser.uid;

        const cartItemDiv = delBtn.closest('#cart-item');

        if (cartItemDiv) {
            cartItemDiv.remove();
        }

        const userRef = doc(db, 'users', userId)

        let userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            let cart = userSnap.data().cart || [];
            console.log(cart);
            
            cart = cart.filter(item => item.id !== productId);

            await updateDoc(userRef, { cart });
        }

    }

    if (checkOutBtn) {
        const productId = checkOutBtn.getAttribute('data-id');
        checkOutBtn.setAttribute('disabled', true);
        checkOutBtn.innerText = '';
        checkOutBtn.innerHTML = `<div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>`;

        const userId = auth.currentUser.uid;
        const checkOut = checkOutBtn.getAttribute('disabled');
        // Send checkout request to admin
        // Example: Add a "checkoutRequests" document in Firestore for admin to review

        try {
            await addDoc(collection(db, "checkoutRequests"), {
                userId: auth.currentUser.uid,
                userEmail: auth.currentUser.email,
                productId,
                requestedAt: serverTimestamp()
            });
            const userRef = doc(db, 'users', userId)
            let userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                let cart = userSnap.data().cart || [];
                cart = cart.map(item =>
                    item.id === productId ? { ...item, checkedOut: checkOut } : item
                );

                await updateDoc(userRef, { cart });
            }
            checkOutBtn.innerText = 'Checked Out';
            checkOutBtn.classList.remove('btn-dark');
            checkOutBtn.classList.add('btn-success');
        } catch (error) {
            checkOutBtn.removeAttribute('disabled');
            checkOutBtn.innerText = 'Check Out';
            checkOutBtn.classList.remove('btn-success');
            checkOutBtn.classList.add('btn-dark');

        }
    }

})


logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
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
        const editCloseBtn = document.getElementById('editCloseBtn');

        const editName = document.getElementById('editName');
        const editImage = document.getElementById('editImage');

        // Remove previous listeners
        const newSaveBtn = saveEditBtn.cloneNode(true);
        saveEditBtn.parentNode.replaceChild(newSaveBtn, saveEditBtn);

        newSaveBtn.addEventListener('click', async (e) => {

            newSaveBtn.innerText = '';
            newSaveBtn.innerHTML = `<div id="saveEdit" class="spinner-border" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>`;
            e.preventDefault();

            const nameValue = editName.value.trim();
            const file = editImage.files[0];

            if (nameValue.length < 3) {
                editName.value = '';
                editName.placeholder = 'At least 3 characters';
                return;
            }

            if (!file) {
                return alert("Please select a profile image.");
            }

            if (file.size > 1048000) {
                alert('file is too large Plz select small one')
            }

            const validImageTypes = /^image\/(jpeg|png|jpg|webp)$/;
            if (!validImageTypes.test(file.type)) {
                return alert("Invalid file type. Only JPG, JPEG, PNG or WebP allowed.");
            }

            // Convert image to base64
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result; // image in base64

                try {
                    // Save base64 image and name to Firestore
                    await updateDoc(doc(db, "users", auth.currentUser.uid), {
                        name: nameValue,
                        profileURL: base64Image
                    });

                    // Update UI
                    profilePic.src = base64Image;
                    editName.value = nameValue;

                    newSaveBtn.innerHTML = '';
                    newSaveBtn.innerText = 'Save'
                    editCloseBtn.click();

                } catch (error) {
                    console.error("Error saving base64 image:", error);
                    alert("Something went wrong.");
                }
            };

            reader.readAsDataURL(file); // read file as base64

        });

    });
});










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