import { 
    getTvById, 
    getTvByGenre, 
    queryWithWord, 
    IMAGE_URL 
} from '../utils/connections.js';
import { registerMovie as registerTvSerie } from '../utils/observer.js';
let divFirstTvSerie, divActionAdventureTv, divAnimationTv, divComedyTv, 
divDrama, divWarAndPolitics, searchInput, searchResultContainer,
showAllMovieInfo;

window.addEventListener("load", () => {
    divFirstTvSerie = document.querySelector("#js-first-movie-section");
    divActionAdventureTv = document.querySelector("#js-action-adventure");
    divAnimationTv = document.querySelector("#js-animation");
    divComedyTv = document.querySelector("#js-comedy");
    divDrama = document.querySelector("#js-drama");
    divWarAndPolitics = document.querySelector("#js-war-politics");
    searchInput = document.querySelector("#js-search-input");
    searchResultContainer = document.querySelector("#js-search-results");

    Promise.all([
        renderActionAdventureTv(), 
        renderAnimationTv(), 
        renderComedyTv(),
        renderDramaTv(),
        renderWarAndPoliticsTv()
    ]).then(() => {
        observingTvSerie();
    });

    searchInput.addEventListener("keyup", searchTvSerie);
});

const GENRESTOSHOW = {
    actionAndAdventure: 10759,
    animation: 16,
    drama: 10751,
    comedy: 35,
    warAndPolitics: 10768
};

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

async function renderActionAdventureTv() {
    const tvInfo = await getTvByGenre(GENRESTOSHOW.actionAndAdventure);
    const actionTvSeries = renderSeries(tvInfo.results);
    
    divActionAdventureTv.innerHTML = actionTvSeries;
}

async function renderAnimationTv() {
    const tvInfo = await getTvByGenre(GENRESTOSHOW.animation);
    const animationTvSeries = renderSeries(tvInfo.results);
    
    divAnimationTv.innerHTML = animationTvSeries;
}

async function renderComedyTv() {
    const tvInfo = await getTvByGenre(GENRESTOSHOW.comedy);
    const comedyTvSeries = renderSeries(tvInfo.results);
    
    divComedyTv.innerHTML = comedyTvSeries;
}

async function renderDramaTv() {
    const tvInfo = await getTvByGenre(GENRESTOSHOW.drama);
    const dramaTvSeries = renderSeries(tvInfo.results);
    
    divDrama.innerHTML = dramaTvSeries;
}

async function renderWarAndPoliticsTv() {
    const tvInfo = await getTvByGenre(GENRESTOSHOW.warAndPolitics);
    const warAndPoliticsTvSeries = renderSeries(tvInfo.results);
    
    divWarAndPolitics.innerHTML = warAndPoliticsTvSeries;
}

async function searchTvSerie(event) {
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
                observingTvSerie();
                showAllMovieInfo = document.querySelector("#js-view-all-btn");
                showAllMovieInfo.onclick = () => {
                    window.location.href = `/src/views/tv-search.html?query=${value}&page=1`;
                };
            }
        }
    } else if(value.length < 4) {
        searchResultContainer.innerHTML = "";
    }
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

    data.forEach((tvSerieInfo) => {
        let datasetImage = `data-img-url="url('${IMAGE_URL + tvSerieInfo.poster_path}')"`;

        queryList += `
        <a class="no-link-style" href="/src/views/tv-info.html?tvId=${tvSerieInfo.id}">
            <div class="query-list">
                <div class="movie-image query-list-img" ${tvSerieInfo.poster_path !== null ? datasetImage : ""}>
                    ${tvSerieInfo.poster_path !== null ? "" : `<span class="center-message white-message">No Image</span>`}
                </div>
                <div class="query-list-title">${tvSerieInfo.name}</div>
            </div>
        </a>`;
    });
    return `
        ${queryList}
        <div id="js-view-all-btn" class="query-list-btn">View all results</div>
    `;
}


function observingTvSerie() {
    let imageTvSerie = document.querySelectorAll(".movie-image");
    imageTvSerie.forEach((tvImgSerie) => {
        registerTvSerie(tvImgSerie); // tracking every movie card with the observer
    });
}