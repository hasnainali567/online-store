import { auth , doc, db, onAuthStateChanged , updateDoc, arrayUnion} from "./firebase.js";


let cardDiv = document.getElementById("cards-div");
let searchBtn = document.getElementById("searchBtn");
let spinner = document.getElementById("spinner");
let homeProfileBtn = document.getElementById("homeProfileBtn");
let userId;
let categoryArr = [];

let params = new URLSearchParams(window.location.search);
let searchQuery = params.get('search');
let cateQuery = params.get('category');


onAuthStateChanged(auth, async (user)=> {
  if (user) {
    userId = user.uid
    homeProfileBtn.setAttribute('href', 'userProfile.html')
    
  }
})


let promises = [fetch("https://dummyjson.com/products")];

let allProducts = [];
let data = async () => {
  try {
    let response = await Promise.all(promises);
    let result = await Promise.all(response.map((r) => r.json()));
    
    let [res] = result;
    allProducts = res;
    createCards(res);
    ModalCategoriesBtn(res, categoryArr);
    if (searchQuery) {
      filterBySearch(searchQuery)
      searchQuery = ''
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl)
    }

    if (cateQuery) {
      filterByCategory(cateQuery, res)
      cateQuery = '';
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  } catch (error) {
    console.error(error);
  }
};

data();

function createCards(data) {
  data = data.products;
  
  if (data.length < 1) {
    cardDiv.innerHTML =
    '<h2 class="text-light align-self-center">No Products Found!</h2>';
  } else {
    cardDiv && (cardDiv.innerHTML = "");
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
                <span data-id="${data[i].id}" class="homeCartBtn btn btn-success">$${data[i].price} <i class="fa-solid fa-shopping-cart"></i></span>
                    <a href="product.html?id=${data[i].id}" class="btn btn-dark d-flex flex-column">Read More</a></div>
                    </div>
                    </div>`;
                    
                    cardDiv && (cardDiv.innerHTML += card);
                    
                    spinner.classList.add("spinner-hide");
                  }
  }
}

function ModalCategoriesBtn(data, categoryArr) {
  let modalCategoryList = document.getElementById("modal-category-list");
  let cate = document.querySelectorAll(".cate");
  
  for (let i = 0; i < cate.length; i++) {
    cate[i].innerText = categoryArr[i];
  }
  
  let allBtns = "";
  for (let i = 0; i < categoryArr.length; i++) {
    allBtns += `<button class="categoryBtn btn btn-outline-dark">${categoryArr[i]}</button>`;
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

function filterByCategory(category, data) {
  cardDiv && (cardDiv.innerHTML = "");
  let filtered = data.products.filter((item) => item.category === category);
  createCards({ products: filtered });
  let modalCloseBtn = document.querySelector(".modal-close");
  modalCloseBtn.click();
}

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let search = e.target.parentElement.querySelector(".form-control");
  if (search.value.length < 1) {
    search.placeholder = "Plz Enter Something Here";
    createCards(allProducts);
  } else {
    let searchVal = search.value.trim().replace(/\s+/g, " ").toLowerCase();
    console.log(searchVal);
    
    filterBySearch(searchVal);
  }
});

function filterBySearch(search) {
  
  cardDiv.innerHTML = "";
  spinner.classList.remove("spinner-hide");
  let filtered = allProducts.products.filter((item) => {
    let title = item.title.toLowerCase();
    let desc = item.description.toLowerCase();
    return title.includes(search) || desc.includes(search);
  });
  
  createCards({ products: filtered });
  
  setTimeout(() => {
    spinner.classList.add("spinner-hide");
  }, 300);
}



cardDiv && cardDiv.addEventListener('click', async (e)=> {
  const btn = e.target.closest('.homeCartBtn')
  if (btn) {
    if (auth.currentUser) {
    let id = btn.getAttribute('data-id')
    console.log(userId , id);
    let userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      cart : arrayUnion(id)
    })
    
    console.log('data saved successfully');
    
  } else {
    btn.setAttribute('data-bs-toggle', 'modal')
    btn.setAttribute('data-bs-target', '#signModal');
    btn.click()
  }
  }
})


export {
  allProducts,
  categoryArr,
}