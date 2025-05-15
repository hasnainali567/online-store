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
let picInt = document.getElementById("formFile");
let enterdImage = document.getElementById("enterdImage");

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
  if (
    passInp.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  ) {
    isPassOk = true;
    if (isEmailOk && isNameOk) {
      signUPBtn.removeAttribute("disabled");
    }
  } else {
    isPassOk = false;
    signUPBtn.setAttribute("disabled", true);
  }

  console.log(isPassOk);
});

picInt.addEventListener("change", () => {
  const file = picInt.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      enterdImage.src = e.target.result;
      enterdImage.classList.remove("d-none");
    };

    reader.readAsDataURL(file);
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

    let file = picInt.files[0];

    let user = userCredential.user;
    let downloadURL = "";

    if (file) {
      const storageRef = ref(
        storage,
        `profilePics/${user.uid}/${Date.now()}_${file.name}`
      );
      await uploadBytes(storageRef, file);
      downloadURL = await getDownloadURL(storageRef);
    }
    await setDoc(doc(db, "user", user.uid), {
      name,
      email,
      profilePic: downloadURL,
    });
  } catch (error) {
    console.log("Sign Up Error : ", error.message);
    signUPBtn.innerHTML = "";
    signUPBtn.innerText = "Sign Up";
    alert("Sign up error", error.message);
  }
});
