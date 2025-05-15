import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  doc,
  setDoc,
  db,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "./firebase.js";

let loginBtn = document.getElementById("loginBtn");
let emailInp = document.querySelector(".emailInp");
let passInp = document.getElementById("inputPassword6");

let isEmailOk = false;
let isPassOk = false;

emailInp.addEventListener("input", () => {
  if (emailInp.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
    isEmailOk = true;
    if (isPassOk) {
      loginBtn.removeAttribute("disabled");
    }
  } else {
    isEmailOk = false;
    loginBtn.setAttribute("disabled", true);
  }
  console.log("email :" + isEmailOk);
});

passInp.addEventListener("input", () => {
  if (
    passInp.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  ) {
    isPassOk = true;
    if (isEmailOk) {
      loginBtn.removeAttribute("disabled");
    }
  } else {
    isPassOk = false;
    loginBtn.setAttribute("disabled", true);
  }

  console.log(isPassOk);
});

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  loginBtn.innerText = "";
  loginBtn.innerHTML = `<div id="loginBtnSpinner" class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>`;
  let email = emailInp.value;
  let password = passInp.value;
  try {
    let userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log("Login Successfully : ", userCredential.user);
  } catch (error) {
    console.log("Login Error : " + error.message);
    loginBtn.innerHTML = "";
    loginBtn.innerText = "Log In";
    alert("Login error : " + error.message);
  }
});
