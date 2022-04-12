import { getMovieById, getTopMovies, getMoviesByGenre, getAllGenres } from './utils/connections.js';
import { registerMovie } from './utils/observer.js'
let divFirstMovie, divTrendingMovies, divRomanticMovies, divAnimationMovies, 
divHorrorMovies, divMysteryMovies, menuBtn, menuTab, closeBtn, categoryList, 
headerPage, searchBtn, menuTittle, searchContainer, closeSearch, searchInput;

const GENRESTOSHOW = {
    romance: 10749,
    animation: 16,
    horror: 27,
    mystery: 9648
}

window.addEventListener("load", () => {
    divFirstMovie = document.querySelector("#js-first-movie-section");
    divTrendingMovies = document.querySelector("#js-trending-movies");
    divRomanticMovies = document.querySelector("#js-romantic-movies");
    divAnimationMovies = document.querySelector("#js-animation-movies");
    divHorrorMovies = document.querySelector("#js-horror-movies");
    divMysteryMovies = document.querySelector("#js-mystery-movies");
    menuBtn = document.querySelector("#js-menu");
    menuTittle = document.querySelector("#js-nav-tittle");
    searchBtn = document.querySelector("#js-search-btn");
    menuTab = document.querySelector("#js-menu-tab");
    closeBtn = document.querySelector("#js-close-menu");
    categoryList = document.querySelector("#js-category-list");
    headerPage = document.querySelector("#js-header");
    searchContainer = document.querySelector("#js-search-container");
    closeSearch = document.querySelector("#js-close-search");
    searchInput = document.querySelector("#js-search-input");

    menuBtn.onclick = showMenu;
    closeBtn.onclick = closeMenu;
    searchBtn.onclick = showSearchInput;
    closeSearch.onclick = closeSearchInput;
    
    renderFirstMovie(); // first movie to show.
    renderTopMovies();
    renderRomanceMovies();
    renderAnimationMovies();
    renderMysteryMovies();
    renderHorrorMovies();

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

async function loadMenuGenres() {
    const  dataList = await getAllGenres();
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

async function renderFirstMovie() {
    const data = await getMovieById("406759"); // 76341 naruto: 317442
    divFirstMovie.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${data.poster_path}')`;
}

function renderMovies(moviesInfo) {
    let movieList = "";
    
    moviesInfo.forEach(movie => { 
        if(movie?.poster_path) { // we add the img info to the dataset to use it with the Intersection Observer.
            movieList += 
            `<div class="movie-info">
                <div data-img-url="url('https://image.tmdb.org/t/p/w500${movie.poster_path}')" class="movie-image">
                    <img class="icon-watchlist" src="./src/assets/icons/watchlist-ribbon.svg" alt="watchlist icon">
                    <img class="icon-favorite" src="./src/assets/icons/favorite.svg" alt="favorite icon">
                </div>
                <div class="movie-text">
                    <h3 class="movie-name">${movie.title}</h3>
                    <span class="movie-rate">
                    <img class="icon-star" src="./src/assets/icons/star.svg" alt="star icon">
                        ${movie.vote_average}
                    </span>
                </div>
            </div>`;
        }
    });
    return movieList;
}

async function renderTopMovies() {
    const movies = await getTopMovies();
    const bestTrendingMovies = renderMovies(movies);

    divTrendingMovies.innerHTML = bestTrendingMovies;
    observingMovies(); // this is added here bc for some reason "renderTopMovies" is the last function to be execute.
}


async function renderRomanceMovies() {
    const moviesInfo = await getMoviesByGenre(GENRESTOSHOW.romance);
    const romanceMovies = renderMovies(moviesInfo);
    
    divRomanticMovies.innerHTML = romanceMovies;
}

async function renderAnimationMovies() {
    const moviesInfo = await getMoviesByGenre(GENRESTOSHOW.animation);
    const animationMovies = await renderMovies(moviesInfo);

    divAnimationMovies.innerHTML = animationMovies;
}

async function renderMysteryMovies() {
    const moviesInfo = await getMoviesByGenre(GENRESTOSHOW.mystery);
    const mysteryMovies = await renderMovies(moviesInfo);

    divMysteryMovies.innerHTML = mysteryMovies;
}

async function renderHorrorMovies() {
    const moviesInfo = await getMoviesByGenre(GENRESTOSHOW.horror);
    const horrorMovies = await renderMovies(moviesInfo);

    divHorrorMovies.innerHTML = horrorMovies;
}

function observingMovies() {
    let imageMovies = document.querySelectorAll(".movie-image");
    imageMovies.forEach((movieImg) => registerMovie(movieImg));
}

