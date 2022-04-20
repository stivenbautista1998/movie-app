import { getMovieGenres } from '../utils/connections.js'
let categoryList, menuBtn, menuTittle, searchBtn, closeBtn, closeSearch,
menuTab, searchContainer, searchInput, headerPage;

window.addEventListener("load", () => {
    categoryList = document.querySelector("#js-category-list");
    menuBtn = document.querySelector("#js-menu");
    menuTittle = document.querySelector("#js-nav-tittle");
    searchBtn = document.querySelector("#js-search-btn");
    closeBtn = document.querySelector("#js-close-menu");
    closeSearch = document.querySelector("#js-close-search");
    menuTab = document.querySelector("#js-menu-tab");
    searchContainer = document.querySelector("#js-search-container");
    searchInput = document.querySelector("#js-search-input");
    headerPage = document.querySelector("#js-header");

    menuBtn.onclick = showMenu;
    closeBtn.onclick = closeMenu;
    searchBtn.onclick = showSearchInput;
    closeSearch.onclick = closeSearchInput;

    loadMenuGenres();
    scrollHeader();
});

function scrollHeader() {
    let lastScrollY = window.scrollY;

    window.onscroll = () => {
        if(lastScrollY < window.scrollY) {
            headerPage.classList.add("header-hidden");
        } else {
            headerPage.classList.remove("header-hidden");
        }

        lastScrollY = window.scrollY;
    }
}

async function loadMenuGenres() {
    const  dataList = await getMovieGenres();
    const genresList = generateCategoryList(dataList.genres);
    categoryList.innerHTML = genresList;
}

function generateCategoryList(data) {
    let categoryList = "";
    data.forEach((item) => {
        categoryList += `<a href="#" data-id="${item.id}" class="category-item">${item.name}</a>`
    });

    return categoryList;
}

function showMenu() {
    document.body.classList.add("no-scroll");
    menuTab.classList.add("visible");
}

function closeMenu() {
    document.body.classList.remove("no-scroll");
    menuTab.classList.remove("visible");
}

function showSearchInput() {
    menuBtn.classList.add("hide-element");
    menuTittle.classList.add("hide-element");
    searchBtn.classList.add("hide-element");
    searchContainer.classList.remove("hide-element");
    searchInput.focus();
}

function closeSearchInput() {
    searchContainer.classList.add("hide-element");
    menuBtn.classList.remove("hide-element");
    menuTittle.classList.remove("hide-element");
    searchBtn.classList.remove("hide-element");
}