import {
    queryWithWord, 
    IMAGE_URL 
} from '../utils/connections.js';
import { registerMovie } from "../utils/observer.js";
let rootApp, searchInput, searchResultContainer, showAllMovieInfo, pageNumber,
userRequest;

window.addEventListener("load", () => {
    rootApp = document.querySelector("#app");
    searchInput = document.querySelector("#js-search-input");
    searchResultContainer = document.querySelector("#js-search-results");

    userRequest = getParameters("query");
    pageNumber = parseInt(getParameters("page"));
    console.log("user request #", userRequest);
    console.log("page #", pageNumber);
    renderMovieInfo(userRequest); // execute the whole movie info section.

    searchInput.addEventListener("keyup", searchMovie);
});

function getParameters( parameterName ) {
    let parameter = new URLSearchParams(window.location.search);
    return parameter.get(parameterName);
}

async function renderMovieInfo(query) {
    if(query !== null) {
        showMoviesFilteredBySearch(query);
        observingMovies();
    }
}

async function searchMovie(event) {
    let { value } = event.target; 
    if(event.keyCode === 13) {
        if(value !== "") {
            window.location.href = `/src/views/tv-search.html?query=${value}&page=1`;
        }
    } else if(value !== "" && value.length >= 4) {
        let queryResult = await queryOfInput(value, 5);

        if(queryResult !== null && queryResult !== undefined) {
            searchResultContainer.innerHTML = queryResult;

            if(queryResult !== `<div class="query-message">No results found</div>`) {
                observingMovies();
                showAllMovieInfo = document.querySelector("#js-view-all-btn");
                showAllMovieInfo.onclick = () => {
                    console.log("it has been clicked!!");
                    window.location.href = `/src/views/tv-search.html?query=${value}&page=1`;
                };
            }
        }
    } else if(value.length < 4) {
        searchResultContainer.innerHTML = "";
    }
}

async function showMoviesFilteredBySearch(value) {
    const data = await queryWithWord(value, pageNumber, "tv");

    if(data.results.length !== 0) { // showing the info when there is a value to search
        const movieResults = renderMovies(data.results);
        const pagination = createPagination(data.total_pages);
        const domPagination = `
        <div class="movie-pagination">
            ${pagination}
        </div>`;

        rootApp.innerHTML = `
        <section class="general-section">
            ${domPagination}
            <h2 class="first-tittle">Search results for <span class="color-yellow">"${userRequest}"</span></h2>
            <div class="movie-search-items">
                ${movieResults}
            </div>
            ${data.results.length > 12 ? domPagination : ""}
        </section>`;
        observingMovies();
        searchResultContainer.innerHTML = "";
    } else { // showing the user when there is no result found.
        rootApp.innerHTML = `
        <section class="general-section">
            <div class="not-found-section">
                <img class="not-found-image" src="/src/assets/imgs/not-found.png" alt="not found image">
            </div>
        </section>`;
        searchResultContainer.innerHTML = "";
    }
}

function renderMovies(moviesInfo) {
    let movieList = "";
    
    moviesInfo.forEach(movie => {
        if(movie?.id) {
            let datasetImage = `data-img-url="url('${IMAGE_URL}${movie.poster_path}')"`; // we add the img info to the dataset to use it with the Intersection Observer.
            movieList += 
            `<div class="movie-info">
                <a href="/src/views/tv-info.html?tvId=${movie.id}">
                    <div ${movie.poster_path !== null ? datasetImage : ""} class="movie-image">
                        <img class="icon-watchlist" src="/src/assets/icons/watchlist-ribbon.svg" alt="watchlist icon">
                        <img class="icon-favorite" src="/src/assets/icons/favorite.svg" alt="favorite icon">
                    </div>
                </a>
                <div class="movie-text">
                    <h3 class="movie-name">${movie.name}</h3>
                    <span class="movie-rate">
                    <img class="icon-star" src="/src/assets/icons/star.svg" alt="star icon">
                        ${movie.vote_average}
                    </span>
                </div>
            </div>`;
        }
    });
    return movieList;
}

async function queryOfInput(inputText, limite) {
    if(inputText.length > 3) {
        const data = await queryWithWord(inputText, 1, "tv");    
        if(data.results.length !== 0) {
            const result = data.results.slice(0, limite);
            const movieSearchList = showSearchList(result);
            return movieSearchList;
        } else {
            return `<div class="query-message">No results found</div>`;
        }
    } else {
        return null;
    }
}

function showSearchList(data) {
    let queryList = "";

    data.forEach((movieInfo) => {
        let datasetImage = `data-img-url="url('${IMAGE_URL + movieInfo.poster_path}')"`;

        queryList += `
        <a class="no-link-style" href="/src/views/tv-info.html?tvId=${movieInfo.id}">
            <div class="query-list">
                <div class="movie-image query-list-img" ${movieInfo.poster_path !== null ? datasetImage : ""}>
                    ${movieInfo.poster_path !== null ? "" : `<span class="center-message white-message">No Image</span>`}
                </div>
                <div class="query-list-title">${movieInfo.name}</div>
            </div>
        </a>`;
    });
    return `
        ${queryList}
        <div id="js-view-all-btn" class="query-list-btn">View all results</div>
    `;
}


function createPagination(maxPages) {
    const arrowLeftLink = `href="/src/views/tv-search.html?query=${userRequest}&page=${pageNumber > 1 ? (pageNumber - 1) : pageNumber}"`;
    let listNavigation = `
        <a ${pageNumber > 1 ? arrowLeftLink : ""} class="no-link-style">
            <div class="pagination auto-center">
                <img class="arrow-right" src="/src/assets/icons/arrow.svg" alt="arrow right icon">
            </div>
        </a>`;

    if(pageNumber <= 3) {
        if(maxPages >= 5) {
            for (let index = 1; index <= 5; index++) {
                listNavigation += `
                <a href="/src/views/tv-search.html?query=${userRequest}&page=${index}" class="no-link-style">
                    <div class="pagination ${pageNumber === index ? "selected-page" : ""}">
                        ${index}
                    </div>
                </a>`;
            }
        } else {
            for (let index = 1; index <= maxPages; index++) {
                listNavigation += `
                <a href="/src/views/tv-search.html?query=${userRequest}&page=${index}" class="no-link-style">
                    <div class="pagination ${pageNumber === index ? "selected-page" : ""}">
                        ${index}
                    </div>
                </a>`;
            }
        }
    } else {
        if((pageNumber + 2) <= maxPages) {
            for (let index = -2; index <= 2; index++) {
                listNavigation += `
                <a href="/src/views/tv-search.html?query=${userRequest}&page=${pageNumber + index}" class="no-link-style">
                    <div class="pagination ${pageNumber === (pageNumber + index) ? "selected-page" : ""}">
                        ${pageNumber + index}
                    </div>
                </a>`;
            }
        } else {
            for (let index = -2; index <= (maxPages - pageNumber); index++) {
                listNavigation += `
                <a href="/src/views/tv-search.html?query=${userRequest}&page=${pageNumber + index}" class="no-link-style">
                    <div class="pagination ${pageNumber === (pageNumber + index) ? "selected-page" : ""}">
                        ${pageNumber + index}
                    </div>
                </a>`;
            }
        }
        
    }

    const arrowRightLink = `href="/src/views/tv-search.html?query=${userRequest}&page=${pageNumber < maxPages ? (pageNumber + 1) : pageNumber}"`;
    listNavigation += `
        <a ${pageNumber < maxPages ? arrowRightLink : ""} class="no-link-style">
            <div class="pagination auto-center">
                <img class="arrow-left" src="/src/assets/icons/arrow.svg" alt="arrow right icon">
            </div>
        </a>`;

    return listNavigation;
}

function observingMovies() {
    let imageMovies = document.querySelectorAll(".movie-image");
    imageMovies.forEach((movieImg) => {
        registerMovie(movieImg); // tracking every movie card with the observer
        /* movieImg.onclick = () => redirectToPage(movieImg.dataset.id); */
    });
}