import { 
    getMovieById, 
    getTopMovies, 
    getMoviesByGenre, 
    IMAGE_URL,
    queryWithWord
} from '../utils/connections.js';
import { registerMovie } from '../utils/observer.js'
let divFirstMovie, divTrendingMovies, divRomanticMovies, divAnimationMovies, 
divHorrorMovies, divMysteryMovies, searchInput, rootSearch;

const GENRESTOSHOW = {
    romance: 10749,
    animation: 16,
    horror: 27,
    mystery: 9648
};

window.addEventListener("load", () => {
    divFirstMovie = document.querySelector("#js-first-movie-section");
    divTrendingMovies = document.querySelector("#js-trending-movies");
    divRomanticMovies = document.querySelector("#js-romantic-movies");
    divAnimationMovies = document.querySelector("#js-animation-movies");
    divHorrorMovies = document.querySelector("#js-horror-movies");
    divMysteryMovies = document.querySelector("#js-mystery-movies");
    searchInput = document.querySelector("#js-search-input");
    rootSearch = document.querySelector("#js-search-root");
    
    renderFirstMovie(); // first movie to show.
    renderTopMovies();
    renderRomanceMovies();
    renderAnimationMovies();
    renderMysteryMovies();
    renderHorrorMovies();

    searchInput.addEventListener("keydown", searchMovie);
});

async function searchMovie(event) {
    if(event.keyCode === 13) {      
        let { value } = event.target; 
        if(value !== "") {
            const data = await queryWithWord(value);

            if(data.length !== 0) {
                const movieResults = renderMovies(data);
                rootSearch.innerHTML = `
                <section class="general-section">
                    <h2 class="first-tittle">Movie Results</h2>
                    <div class="movie-search-items">
                        ${movieResults}
                    </div>
                </section>`;
                observingMovies();
                divFirstMovie.style.display = "none";
                rootSearch.style.paddingTop = "5em";
                console.log(data);
            } else {
                rootSearch.innerHTML = `
                <section class="general-section">
                    <div class="not-found-section">
                        <img class="not-found-image" src="./src/assets/imgs/not-found.png" alt="not found image">
                    </div>
                </section>`;
                divFirstMovie.style.display = "none";
                rootSearch.style.paddingTop = "5em";
                console.log(data);
            }
        }
    }
}

async function renderFirstMovie() {
    const data = await getMovieById("406759"); // 76341 naruto: 317442
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
                        <img class="icon-watchlist" src="./src/assets/icons/watchlist-ribbon.svg" alt="watchlist icon">
                        <img class="icon-favorite" src="./src/assets/icons/favorite.svg" alt="favorite icon">
                    </div>
                </a>
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
    imageMovies.forEach((movieImg) => {
        registerMovie(movieImg); // tracking every movie card with the observer
        /* movieImg.onclick = () => redirectToPage(movieImg.dataset.id); */
    });
}

/* function redirectToPage(movieId) {
    console.log(movieId);
} */
