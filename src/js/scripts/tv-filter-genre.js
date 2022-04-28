import { 
    getTvByGenre, 
    queryWithWord, 
    IMAGE_URL 
} from '../utils/connections.js';
import { registerMovie as registerTvSerie } from '../utils/observer.js';
let rootApp, searchInput, searchResultContainer, showAllMovieInfo;

window.addEventListener("load", () => {
    rootApp = document.querySelector("#app");
    searchInput = document.querySelector("#js-search-input");
    searchResultContainer = document.querySelector("#js-search-results");
    const genreId = getParameters("genreId");
    const genreName  = getParameters("genreName");
    showTvSeriesByGenreSelected(genreId, genreName);

    searchInput.addEventListener("keyup", searchTvSerie);
});

async function searchTvSerie(event) {
    let { value } = event.target; 
    if(event.keyCode === 13) {
        if(value !== "") {
            showTvSeriesFilteredBySearch(value);
        }
    } else if(value !== "") {
        let queryResult = await queryOfInput(value, 5);

        if(queryResult !== null && queryResult !== undefined) {
            searchResultContainer.innerHTML = queryResult;

            if(queryResult !== `<div class="query-message">No results found</div>`) {
                observingTvSerie();
                showAllMovieInfo = document.querySelector("#js-view-all-btn");
                showAllMovieInfo.onclick = () => {
                    console.log("it has been clicked!!");
                    showTvSeriesFilteredBySearch(value);
                };
            }

        } else {
            searchResultContainer.innerHTML = "";
        }
    } else {
        searchResultContainer.innerHTML = "";
    }
}

async function queryOfInput(inputText, limite) {
    if(inputText.length > 3) {
        const data = await queryWithWord(inputText, "tv");    
        if(data.length !== 0) {
            const result = data.slice(0, limite);
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

    data.forEach((tvSerieInfo) => {
        let datasetImage = `data-img-url="url('${IMAGE_URL + tvSerieInfo.poster_path}')"`;

        queryList += `
        <a class="no-link-style" href="/src/views/tv-info.html?tvId=${tvSerieInfo.id}">
            <div class="query-list">
                <div class="movie-image query-list-img" ${tvSerieInfo.poster_path !== null ? datasetImage : ""}>
                    ${tvSerieInfo.poster_path !== null ? "" : `<span class="center-message white-message">No Image</span>`}
                </div>
                <div class="query-list-title">${tvSerieInfo.title}</div>
            </div>
        </a>`;
    });
    return `
        ${queryList}
        <div id="js-view-all-btn" class="query-list-btn">View all results</div>
    `;
}

async function showTvSeriesFilteredBySearch(value) {
    const data = await queryWithWord(value, "tv");

    if(data.length !== 0) {
        const tvResults = renderSeries(data);

        rootApp.innerHTML = `
        <section class="general-section">
            <h2 class="first-tittle">Series Results</h2>
            <div class="movie-search-items">
                ${tvResults}
            </div>
        </section>`;
        observingTvSerie();
        searchResultContainer.innerHTML = "";
    } else {
        rootApp.innerHTML = `
        <section class="general-section">
            <div class="not-found-section">
                <img class="not-found-image" src="../assets/imgs/not-found.png" alt="not found image">
            </div>
        </section>`;
        searchResultContainer.innerHTML = "";
    }
}

async function showTvSeriesByGenreSelected(genreId, genreName) {
    const tvInfo = await getTvByGenre(genreId);
    const actionTvSeries = renderSeries(tvInfo);
    rootApp.innerHTML = `
    <section class="general-section">
        <h2 class="first-tittle">Filtered By ${genreName}</h2>
        <div class="movie-search-items">
            ${actionTvSeries}
        </div>
    </section>`;
    observingTvSerie();
}

function getParameters( parameterName ) {
    let parameter = new URLSearchParams(window.location.search);
    return parameter.get(parameterName);
}

function renderSeries(tvInfo) {
    let tvList = "";
    
    tvInfo.forEach(tv => { 
        if(tv?.id) {
            let datasetImage = `data-img-url="url('${IMAGE_URL}${tv.poster_path}')"`; // we add the img info to the dataset to use it with the Intersection Observer.
            tvList += 
            `<div class="movie-info">
                <a href="/src/views/tv-info.html?tvId=${tv.id}">
                    <div ${tv.poster_path !== null ? datasetImage : ""} class="movie-image">
                        <img class="icon-watchlist" src="../assets/icons/watchlist-ribbon.svg" alt="watchlist icon">
                        <img class="icon-favorite" src="../assets/icons/favorite.svg" alt="favorite icon">
                    </div>
                </a>
                <div class="movie-text">
                    <h3 class="movie-name">${tv.name}</h3>
                    <span class="movie-rate">
                    <img class="icon-star" src="../assets/icons/star.svg" alt="star icon">
                        ${tv.vote_average}
                    </span>
                </div>
            </div>`;
        }
    });
    return tvList;
}

function observingTvSerie() {
    let imageTvSerie = document.querySelectorAll(".movie-image");
    imageTvSerie.forEach((tvImgSerie) => {
        registerTvSerie(tvImgSerie); // tracking every movie card with the observer
        /* movieImg.onclick = () => redirectToPage(movieImg.dataset.id); */
    });
}