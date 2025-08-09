import { collection, getDoc, db, doc } from "./firebase.js";
import { allProducts, categoryArr } from "./main.js";

let searchBtn = document.getElementById("searchBtn");
let spinner = document.querySelector(".productSpinner");
let params = new URLSearchParams(window.location.search);

function ModalCategoriesBtn(data, categoryArr) {
  let modalCategoryList = document.getElementById("modal-category-list");
  let cate = document.querySelectorAll(".cate");

  cate.forEach((btn, i) => {
    if (categoryArr[i]) {
      btn.innerText = categoryArr[i];

      btn.addEventListener("click", () => {
        window.location.href = `index.html?category=${encodeURIComponent(
          categoryArr[i]
        )}`;
      });
    }
  });

  let allBtns = "";
  for (let i = 0; i < categoryArr.length; i++) {
    allBtns += `<button class="categoryBtn btn btn-outline-primary">${categoryArr[i]}</button>`;
  }
  modalCategoryList.innerHTML = allBtns;

  let categoryBtn = document.querySelectorAll(".categoryBtn");

  categoryBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let cat = e.target.innerText;
      window.location.href = `index.html?category=${encodeURIComponent(cat)}`;
    });
  });
}

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let search = document
    .querySelector(".form-control")
    .value.trim()
    .toLowerCase();
  if (search.length > 0) {
    window.location.href = `index.html?search=${encodeURIComponent(search)}`;
  }
});

let id = params.get("id");

let item = async () => {
  try {
    let product = await getDoc(doc(db, 'products', id));
    console.log(product.data());
    
    createProductPage(product.data());
    ModalCategoriesBtn(allProducts, categoryArr);
  } catch (error) {
    console.log(error);
  }
};
item();

function createProductPage(data) {
  let productDetail = document.getElementById("product-detail");
  let product = `<div class="wrapper">
    <div class="product-img">
    <a  href="index.html" class="backBtn btn btn-secondary "><i class="fa-solid fa-arrow-left"></i></a >
    <img src="${data.images[0]}" height="420" width="327">
    </div>
    <div class="product-info">
      <div class="product-text">
      <h1>${data.title}</h1>
      <h3 class="mb-2">by ${data.brand}</h3>
      <div class="rating mb-1">Rating :
       ${getRatingStars(data.rating)}
    <span class="rating-value">${data.rating}</span>
  </div>
      <p class="mb-2"><strong>Description : </strong>${data.description}</p>
      </div>

       


  <ul class="product-details m-0">
    <li><strong>Availability:</strong> In Stock</li>
    <li><strong>Remaining:</strong> ${data.stock} items</li>
    <li><strong>Warranty:</strong> ${data.warrantyInformation}</li>
  </ul>
      
      <div class="quantity">
        <span>Quantity : </span>
        <div class="quantity-selector">
          <button class="qty-btn minus">−</button>
          <input type="number" min="1" value="1" class="qty-input">
          <button class="qty-btn plus">+</button>
        </div>
      </div>
      
      <div class="product-price-btn">
        <p class="m-0"><span>${data.price}</span>$</p>
        <button class="btn btn-outline-dark text-uppercase buy-btn" type="button">Add to Cart <i class="fa-solid fa-shopping-cart ms-1"></i></button>
      </div>
  </div>`;


  productDetail.innerHTML = product;
  const minusBtn = document.querySelector(".minus");
  const plusBtn = document.querySelector(".plus");
  const qtyInput = document.querySelector(".qty-input");
  
  minusBtn &&
  minusBtn.addEventListener("click", () => {
    if (qtyInput.value > 1) {
      qtyInput.value--;
      console.log(qtyInput.value);
    }
  });
  
  plusBtn &&
  plusBtn.addEventListener("click", () => {
    qtyInput.value++;
    console.log(qtyInput.value);
  });
  spinner.classList.add("spinner-hide");
}



const toggleBtn = document.getElementById('toggleTheme');

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  toggleBtn.textContent = document.body.classList.contains('dark-mode')
    ? '☀️ Light Mode'
    : '🌙 Dark Mode';
});


// Convert rating to stars
function getRatingStars(rating) {
  const full = '⭐'.repeat(Math.floor(rating));
  const empty = '☆'.repeat(5 - Math.floor(rating));
  return `${full}${empty}`;
}



