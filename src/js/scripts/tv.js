import { 
    getTvById, 
    getTvByGenre, 
    queryWithWord, 
    IMAGE_URL 
} from '../utils/connections.js';
import { registerMovie as registerTvSerie } from '../utils/observer.js';
let divFirstTvSerie, divActionAdventureTv, divAnimationTv, divComedyTv, 
divDrama, divWarAndPolitics, searchInput, rootSearch;

window.addEventListener("load", () => {
    divFirstTvSerie = document.querySelector("#js-first-movie-section");
    divActionAdventureTv = document.querySelector("#js-action-adventure");
    divAnimationTv = document.querySelector("#js-animation");
    divComedyTv = document.querySelector("#js-comedy");
    divDrama = document.querySelector("#js-drama");
    divWarAndPolitics = document.querySelector("#js-war-politics");
    searchInput = document.querySelector("#js-search-input");
    rootSearch = document.querySelector("#js-search-root");
    
    renderFirstTvSerie();

    Promise.all([
        renderActionAdventureTv(), 
        renderAnimationTv(), 
        renderComedyTv(),
        renderDramaTv(),
        renderWarAndPoliticsTv()
    ]).then(() => {
        observingTvSerie();
    });

    searchInput.addEventListener("keydown", searchTvSerie);
});

const GENRESTOSHOW = {
    actionAndAdventure: 10759,
    animation: 16,
    drama: 10751,
    comedy: 35,
    warAndPolitics: 10768
};

async function renderFirstTvSerie() {
    const data = await getTvById("1399"); // game of thrones.
    divFirstTvSerie.style.backgroundImage = `url('${IMAGE_URL}${data.poster_path}')`;
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

async function renderActionAdventureTv() {
    const tvInfo = await getTvByGenre(GENRESTOSHOW.actionAndAdventure);
    const actionTvSeries = renderSeries(tvInfo);
    
    divActionAdventureTv.innerHTML = actionTvSeries;
}

async function renderAnimationTv() {
    const tvInfo = await getTvByGenre(GENRESTOSHOW.animation);
    const animationTvSeries = renderSeries(tvInfo);
    
    divAnimationTv.innerHTML = animationTvSeries;
}

async function renderComedyTv() {
    const tvInfo = await getTvByGenre(GENRESTOSHOW.comedy);
    const comedyTvSeries = renderSeries(tvInfo);
    
    divComedyTv.innerHTML = comedyTvSeries;
}

async function renderDramaTv() {
    const tvInfo = await getTvByGenre(GENRESTOSHOW.drama);
    const dramaTvSeries = renderSeries(tvInfo);
    
    divDrama.innerHTML = dramaTvSeries;
}

async function renderWarAndPoliticsTv() {
    const tvInfo = await getTvByGenre(GENRESTOSHOW.warAndPolitics);
    const warAndPoliticsTvSeries = renderSeries(tvInfo);
    
    divWarAndPolitics.innerHTML = warAndPoliticsTvSeries;
}

async function searchTvSerie(event) {
    if(event.keyCode === 13) {      
        let { value } = event.target; 
        if(value !== "") {
            const data = await queryWithWord(value, "tv");

            if(data.length !== 0) {
                const tvResults = renderSeries(data);
                rootSearch.innerHTML = `
                <section class="general-section">
                    <h2 class="first-tittle">Series Results</h2>
                    <div class="movie-search-items">
                        ${tvResults}
                    </div>
                </section>`;
                observingTvSerie();
                divFirstTvSerie.style.display = "none";
                rootSearch.style.paddingTop = "5em";
                console.log(data);
            } else {
                rootSearch.innerHTML = `
                <section class="general-section">
                    <div class="not-found-section">
                        <img class="not-found-image" src="../assets/imgs/not-found.png" alt="not found image">
                    </div>
                </section>`;
                divFirstTvSerie.style.display = "none";
                rootSearch.style.paddingTop = "5em";
                console.log(data);
            }
        }
    }
}


function observingTvSerie() {
    let imageTvSerie = document.querySelectorAll(".movie-image");
    imageTvSerie.forEach((tvImgSerie) => {
        registerTvSerie(tvImgSerie); // tracking every movie card with the observer
        /* movieImg.onclick = () => redirectToPage(movieImg.dataset.id); */
    });
}