import {
  auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  doc,
  setDoc,
  db,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "./firebase.js";

let signUPBtn = document.getElementById("signUPBtn");
let emailInp = document.querySelector(".emailInp");
let nameInp = document.querySelector(".nameInp");
let passInp = document.getElementById("inputPassword6");
// let picInt = document.getElementById("formFile");
// let enterdImage = document.getElementById("enterdImage");

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is already logged in");
    window.location.href = "userProfile.html";
  }
});
let isNameOk = false;
let isEmailOk = false;
let isPassOk = false;

nameInp.addEventListener("input", () => {
  console.log(nameInp.value);

  if (nameInp.value.length > 2) {
    isNameOk = true;
    if (isEmailOk && isPassOk) {
      signUPBtn.removeAttribute("disabled");
    }
  } else {
    isNameOk = false;
    signUPBtn.setAttribute("disabled", true);
  }

  console.log("Name :" + isNameOk);
});

emailInp.addEventListener("input", () => {
  if (emailInp.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
    isEmailOk = true;
    if (isNameOk && isPassOk) {
      signUPBtn.removeAttribute("disabled");
    }
  } else {
    isEmailOk = false;
    signUPBtn.setAttribute("disabled", true);
  }
  console.log("email :" + isEmailOk);
});

passInp.addEventListener("input", () => {

  let pass = passInp.value;
  let validation = document.getElementById('validation');
  validation = validation.querySelectorAll('p');

  let passLength = checkCondition(pass.length >= 8, validation[0], validation[0].innerText);
  let passUpper = checkCondition(pass.match(/[A-Z]/), validation[1], validation[1].innerText);
  let passLower = checkCondition(pass.match(/[a-z]/), validation[2], validation[2].innerText);
  let passNum = checkCondition(pass.match(/[0-9]/), validation[3], validation[3].innerText);
 
  
  if (passLength && passUpper && passLower && passNum) {
    isPassOk = true;
    if (isEmailOk && isNameOk) {
      signUPBtn.removeAttribute('disabled')
    }
  }

});

signUPBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  signUPBtn.innerText = "";
  signUPBtn.innerHTML = `<div id="signUPBtnSpinner" class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>`;
  let email = emailInp.value;
  let password = passInp.value;
  let name = nameInp.value;
  try {
    let userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    let user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name,
      email,
    })
    window.location = 'userProfile.html';
    
  } catch (error) {
    console.log("Sign Up Error : ", error.message);
    if (error.message.includes('email-already-in-use'))  {
      let already = document.getElementById('already');
      already.innerHTML = `email already in use Plz! <a href="login.html" id="">login</a>`
      
    } else {
      alert('Sign Up Error : Something went wrong!')
    }
    signUPBtn.innerHTML = "";
    signUPBtn.innerText = "Sign Up";
  }
});



function checkCondition(condition, element, text) {
  if (condition) {
    element.innerHTML = `<i class="bg-dark text-light fa-solid fa-check"></i> ${text}`;
    return true;
  } else {
    element.innerHTML = `<i class="fa-solid fa-xmark"></i> ${text}`;
    return false;
  }
}
