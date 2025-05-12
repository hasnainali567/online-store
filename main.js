let cardDiv = document.getElementById("cards-div");
let spinner = document.getElementById("spinner");
let categoryArr = [];

let promises = [
  fetch("https://dummyjson.com/products")
];

let data = async () => {
  try {
    let response = await Promise.all(promises);
    let result = await Promise.all(response.map((r) => r.json()));

    let [res] = result;

    createCards(res);
    ModalCategoriesBtn(res);
  } catch (error) {
    console.error(error);
  }
};

data();

function createCards(data) {
    
  data = data.products;

  for (let i = 0; i < data.length; i++) {
    let description = data[i].description;
    let title = data[i].title;

    let category = data[i].category;

    if (!categoryArr.includes(category)) {
        categoryArr.push(category);
    }

    if (title.length > 22) {
      title = title.slice(0, 22);
      title = title.slice(0, title.lastIndexOf(" "));
      title = title + " ...";
    }

    if (description.length > 50) {
      description = description.slice(0, 51);
      description = description.slice(0, description.lastIndexOf(" "));
      description = description + " ...";
    }
    let card = `<div class="card" style="width: 18rem;">
                <img loading="lazy" src="${data[i].images[0]}" class="card-img-top" alt="...">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description}</p>
                    <div class="d-flex align-item-center justify-content-between">
                    <span class="btn btn-outline-success">$${data[i].price}</span>
                    <a href="product.html?id=${data[i].id}" class="btn btn-primary d-flex flex-column">Read More</a></div>
                </div>
            </div>`;

    cardDiv.innerHTML += card;

    spinner.classList.add("spinner-hide");
  }
}

function ModalCategoriesBtn(data) {
    
  let modalCategoryList = document.getElementById("modal-category-list");
  let cate = document.querySelectorAll(".cate");
  console.log(categoryArr);
  
  for (let i = 0; i < cate.length; i++) {
    cate[i].innerText = categoryArr[i];
  }

  let allBtns = '';
  for (let i = 0; i < categoryArr.length; i++) {
    
    allBtns += `<button class="categoryBtn btn btn-outline-primary">${categoryArr[i]}</button>`;
}
modalCategoryList.innerHTML = allBtns;

  let categoryBtn = document.querySelectorAll(".categoryBtn");

  categoryBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let cat = e.target.innerText;
      filterByCategory(cat, data);
    });
  });
}


function filterByCategory(category, data){
    cardDiv.innerHTML = '';
    let filtered = data.products.filter(item => item.category === category);
    createCards({products: filtered});
    let modalCloseBtn = document.querySelector('.modal-close');
    modalCloseBtn.click();
}