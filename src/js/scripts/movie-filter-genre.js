import { 
    getMoviesByGenre, 
    queryWithWord, 
    IMAGE_URL 
} from '../utils/connections.js';
import { registerMovie } from '../utils/observer.js';
let rootApp, searchInput, searchResultContainer, showAllMovieInfo, 
pageNumber, genreId, genreName;

window.addEventListener("load", () => {
    rootApp = document.querySelector("#app");
    searchInput = document.querySelector("#js-search-input");
    searchResultContainer = document.querySelector("#js-search-results");
    genreId = getParameters("genreId");
    genreName  = getParameters("genreName");
    pageNumber = parseInt(getParameters("page"));
    showMovieByGenreSelected();

    searchInput.addEventListener("keyup", searchMovie);
});

async function searchMovie(event) {
    let { value } = event.target; 
    if(event.keyCode === 13) {
        if(value !== "") {
            window.location.href = `/src/views/movie-search.html?query=${value}&page=1`;
        }
    } else if(value !== "") {
        let queryResult = await queryOfInput(value, 5);

        if(queryResult !== null && queryResult !== undefined) {
            searchResultContainer.innerHTML = queryResult;

            if(queryResult !== `<div class="query-message">No results found</div>`) {
                observingMovies();
                showAllMovieInfo = document.querySelector("#js-view-all-btn");
                showAllMovieInfo.onclick = () => {
                    window.location.href = `/src/views/movie-search.html?query=${value}&page=1`;
                };
            }
        }
    }
}

async function queryOfInput(inputText, limite) {
    if(inputText.length > 3) {
        const data = await queryWithWord(inputText, 1, "movie");    
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
        <a class="no-link-style" href="/src/views/movie-info.html?movieId=${movieInfo.id}">
            <div class="query-list">
                <div class="movie-image query-list-img" ${movieInfo.poster_path !== null ? datasetImage : ""}>
                    ${movieInfo.poster_path !== null ? "" : `<span class="center-message white-message">No Image</span>`}
                </div>
                <div class="query-list-title">${movieInfo.title}</div>
            </div>
        </a>`;
    });
    return `
        ${queryList}
        <div id="js-view-all-btn" class="query-list-btn">View all results</div>
    `;
}

async function showMovieByGenreSelected() {
    const movieInfo = await getMoviesByGenre(genreId, pageNumber);
    const movieList = renderMovies(movieInfo.results);

    const pagination = createPagination(movieInfo.total_pages);
        const domPagination = `
        <div class="movie-pagination">
            ${pagination}
        </div>`;

    rootApp.innerHTML = `
    <section class="general-section">
        ${domPagination}
        <h2 class="first-tittle">Filtered By ${genreName}</h2>
        <div class="movie-search-items">
            ${movieList}
        </div>
        ${domPagination}
    </section>`;
    observingMovies();
}

function getParameters( parameterName ) {
    let parameter = new URLSearchParams(window.location.search);
    return parameter.get(parameterName);
}

function renderMovies(movieInfo) {
    let moviesList = "";
    
    movieInfo.forEach(movie => { 
        if(movie?.id) {
            let datasetImage = `data-img-url="url('${IMAGE_URL}${movie.poster_path}')"`; // we add the img info to the dataset to use it with the Intersection Observer.
            moviesList += 
            `<div class="movie-info">
                <a href="/src/views/movie-info.html?movieId=${movie.id}">
                    <div ${movie.poster_path !== null ? datasetImage : ""} class="movie-image">
                        <img class="icon-watchlist" src="../assets/icons/watchlist-ribbon.svg" alt="watchlist icon">
                        <img class="icon-favorite" src="../assets/icons/favorite.svg" alt="favorite icon">
                    </div>
                </a>
                <div class="movie-text">
                    <h3 class="movie-name">${movie.title}</h3>
                    <span class="movie-rate">
                    <img class="icon-star" src="../assets/icons/star.svg" alt="star icon">
                        ${movie.vote_average}
                    </span>
                </div>
            </div>`;
        }
    });
    return moviesList;
}

// function that returns the pagination elements as a string.
function createPagination(maxPages) {
    const arrowLeftLink = `href="/src/views/movie-filter.html?genreId=${genreId}&genreName=${genreName}&page=${pageNumber > 1 ? (pageNumber - 1) : pageNumber}"`;
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
                <a href="/src/views/movie-filter.html?genreId=${genreId}&genreName=${genreName}&page=${index}" class="no-link-style">
                    <div class="pagination ${pageNumber === index ? "selected-page" : ""}">
                        ${index}
                    </div>
                </a>`;
            }
        } else {
            for (let index = 1; index <= maxPages; index++) {
                listNavigation += `
                <a href="/src/views/movie-filter.html?genreId=${genreId}&genreName=${genreName}&page=${index}" class="no-link-style">
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
                <a href="/src/views/movie-filter.html?genreId=${genreId}&genreName=${genreName}&page=${pageNumber + index}" class="no-link-style">
                    <div class="pagination ${pageNumber === (pageNumber + index) ? "selected-page" : ""}">
                        ${pageNumber + index}
                    </div>
                </a>`;
            }
        } else {
            for (let index = -2; index <= (maxPages - pageNumber); index++) {
                listNavigation += `
                <a href="/src/views/movie-filter.html?genreId=${genreId}&genreName=${genreName}&page=${pageNumber + index}" class="no-link-style">
                    <div class="pagination ${pageNumber === (pageNumber + index) ? "selected-page" : ""}">
                        ${pageNumber + index}
                    </div>
                </a>`;
            }
        }
        
    }

    const arrowRightLink = `href="/src/views/movie-filter.html?genreId=${genreId}&genreName=${genreName}&page=${pageNumber < maxPages ? (pageNumber + 1) : pageNumber}"`;
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
    });
}