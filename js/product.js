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
    let reqApi = await fetch(`https://dummyjson.com/products/${id}`);
    let res = await reqApi.json();
    createProductPage(res);
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
    <img src="${data.images[0]}" height="420" width="327">
    </div>
    <div class="product-info">
      <div class="product-text">
      <h1>${data.title}</h1>
      <h2>by ${data.brand}</h2>
      <p>${data.description}</p>
      </div>
      
      <div class="quantity">
      <span>Quantity : </span>
      <div class="quantity-selector">
      <button class="qty-btn minus">−</button>
      <input type="number" min="1" value="1" class="qty-input">
      <button class="qty-btn plus">+</button>
      </div>
      </div>
      
      <div class="product-price-btn">
      <p><span>${data.price}</span>$</p>
      <button class="btn btn-outline-dark text-uppercase buy-btn" type="button">buy now</button>
      </div>
      </div>
  </div>`;

  productDetail.innerHTML = product;
  spinner.classList.add("spinner-hide");
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
}
