import { getTvById, getTvByGenre, IMAGE_URL } from '../utils/connections.js';
import { registerMovie } from '../utils/observer.js';
let divFirstMovie, divActionAdventureTv, divAnimationTv, divComedyTv, 
divDrama, divWarAndPolitics;

window.addEventListener("load", () => {
    divFirstMovie = document.querySelector("#js-first-movie-section");
    divActionAdventureTv = document.querySelector("#js-action-adventure");
    divAnimationTv = document.querySelector("#js-animation");
    divComedyTv = document.querySelector("#js-comedy");
    divDrama = document.querySelector("#js-drama");
    divWarAndPolitics = document.querySelector("#js-war-politics");
    
    renderFirstMovie();

    Promise.all([
        renderActionAdventureTv(), 
        renderAnimationTv(), 
        renderComedyTv(),
        renderDramaTv(),
        renderWarAndPoliticsTv()
    ]).then(() => {
        observingMovies();
    });

});

const GENRESTOSHOW = {
    actionAndAdventure: 10759,
    animation: 16,
    drama: 10751,
    comedy: 35,
    warAndPolitics: 10768
};

async function renderFirstMovie() {
    const data = await getTvById("1399"); // game of thrones.
    divFirstMovie.style.backgroundImage = `url('${IMAGE_URL}${data.poster_path}')`;
}

function renderMovies(moviesInfo) {
    let movieList = "";
    
    moviesInfo.forEach(movie => { 
        if(movie?.id) {
            let datasetImage = `data-img-url="url('${IMAGE_URL}${movie.poster_path}')"`; // we add the img info to the dataset to use it with the Intersection Observer.
            movieList += 
            `<div class="movie-info">
                <a href="http://127.0.0.1:8080/src/views/movie-info.html?movieId=${movie.id}">
                    <div ${movie.poster_path !== null ? datasetImage : ""} class="movie-image">
                        <img class="icon-watchlist" src="../assets/icons/watchlist-ribbon.svg" alt="watchlist icon">
                        <img class="icon-favorite" src="../assets/icons/favorite.svg" alt="favorite icon">
                    </div>
                </a>
                <div class="movie-text">
                    <h3 class="movie-name">${movie.name}</h3>
                    <span class="movie-rate">
                    <img class="icon-star" src="../assets/icons/star.svg" alt="star icon">
                        ${movie.vote_average}
                    </span>
                </div>
            </div>`;
        }
    });
    return movieList;
}

async function renderActionAdventureTv() {
    const moviesInfo = await getTvByGenre(GENRESTOSHOW.actionAndAdventure);
    const actionTv = renderMovies(moviesInfo);
    
    divActionAdventureTv.innerHTML = actionTv;
}

async function renderAnimationTv() {
    const moviesInfo = await getTvByGenre(GENRESTOSHOW.animation);
    const animationTv = renderMovies(moviesInfo);
    
    divAnimationTv.innerHTML = animationTv;
}

async function renderComedyTv() {
    const moviesInfo = await getTvByGenre(GENRESTOSHOW.comedy);
    const comedyTv = renderMovies(moviesInfo);
    
    divComedyTv.innerHTML = comedyTv;
}

async function renderDramaTv() {
    const moviesInfo = await getTvByGenre(GENRESTOSHOW.drama);
    const dramaTv = renderMovies(moviesInfo);
    
    divDrama.innerHTML = dramaTv;
}

async function renderWarAndPoliticsTv() {
    const moviesInfo = await getTvByGenre(GENRESTOSHOW.warAndPolitics);
    const warAndPoliticsTv = renderMovies(moviesInfo);
    
    divWarAndPolitics.innerHTML = warAndPoliticsTv;
}


function observingMovies() {
    let imageMovies = document.querySelectorAll(".movie-image");
    imageMovies.forEach((movieImg) => {
        registerMovie(movieImg); // tracking every movie card with the observer
        /* movieImg.onclick = () => redirectToPage(movieImg.dataset.id); */
    });
}