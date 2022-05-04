import { getMovieGenres, getTvGenres } from '../utils/connections.js';
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
    let dataList, genreId = null;
    if((window.location.pathname === "/") || (window.location.pathname === "/src/views/movie-info.html") || (window.location.pathname === "/src/views/movie-filter.html") || (window.location.pathname === "/src/views/movie-search.html")) {
        dataList = await getMovieGenres();

        if(window.location.pathname === "/src/views/movie-filter.html") {
            genreId = getParameters("genreId");
        }
    } else if((window.location.pathname === "/src/views/tv.html") || (window.location.pathname === "/src/views/tv-info.html") || (window.location.pathname === "/src/views/tv-filter.html") || (window.location.pathname === "/src/views/tv-search.html")) {
        dataList = await getTvGenres();

        if(window.location.pathname === "/src/views/tv-filter.html") {
            genreId = getParameters("genreId");
        }
    }

    const genresList = generateCategoryList(dataList.genres, genreId);
    categoryList.innerHTML = genresList;
}

function generateCategoryList(data, genreId) {
    let categoryList = "", selectedGenre = false, pageType = null;
    data.forEach((item) => {

        if(genreId !== null) {
            if(item.id == genreId) {
                selectedGenre = true;
            }
        }

        if((window.location.pathname === "/") || (window.location.pathname === "/src/views/movie-filter.html") || (window.location.pathname === "/src/views/movie-info.html") || (window.location.pathname === "/src/views/movie-search.html")) {
            pageType = "movie-filter.html";
        } else if((window.location.pathname === "/src/views/tv.html") || (window.location.pathname === "/src/views/tv-filter.html") || (window.location.pathname === "/src/views/tv-info.html") || (window.location.pathname === "/src/views/tv-search.html")) {
            pageType = "tv-filter.html";
        }

        categoryList += `
        <a class="no-link-style" href="/src/views/${pageType}?genreId=${item.id}&genreName=${item.name}&page=1">
            <li class="category-item ${selectedGenre ? "selected-genre" : ""}" data-id="${item.id}">
                ${item.name}
            </li>
        </a>`;
        selectedGenre = false;
    });

    return categoryList;
}

function getParameters( parameterName ) {
    let parameter = new URLSearchParams(window.location.search);
    return parameter.get(parameterName);
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