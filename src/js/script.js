import { getMovieById, getTopMovies, getMoviesByGenre } from './utils/connections.js';
let divFirstMovie, divTrendingMovies, divRomanticMovies, divAnimationMovies, divHorrorMovies, divMysteryMovies;

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
    
    renderFirstMovie(); // first movie to show.
    renderTopMovies();
    renderRomanceMovies();
    renderAnimationMovies();
    renderMysteryMovies();
    renderHorrorMovies();
});

async function renderFirstMovie() {
    const data = await getMovieById("406759"); // 76341 naruto: 317442
    divFirstMovie.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${data.poster_path}')`;
}

function renderMovies(moviesInfo) {
    let movieList = "";
    
    moviesInfo.forEach(movie => { 
        if(movie?.poster_path) {
            movieList += 
            `<div class="movie-info">
                <div class="movie-image" style="background-image: url('https://image.tmdb.org/t/p/w500${movie.poster_path}');">
                </div>
                <div class="movie-text">
                    <h3 class="movie-name">${movie.original_title}</h3>
                    <span class="movie-rate">${movie.vote_average}</span>
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

// const genresList = await getAllGenres();
// console.log(genresList.genres);

