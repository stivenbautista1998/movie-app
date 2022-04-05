import { getMovieById, getTopMovies, getAllGenres, getMoviesByGenre } from './utils/connections.js';
let divFirstMovie, divTrendingMovies, divRomanticMovies;

const GENRESTOSHOW = {
    romance: 10749,
    animation: 16,
    comedy: 35,
    horror: 27,
    Fantasy: 14
}

window.addEventListener("load", () => {
    divFirstMovie = document.querySelector("#js-first-movie-section");
    divTrendingMovies = document.querySelector("#js-trending-movies");
    divRomanticMovies = document.querySelector("#js-romantic-movies");
    
    renderFirstMovie(); // first movie to show.
    renderTopMovies();
    renderRomanceMovies();
});

async function renderFirstMovie() {
    const data = await getMovieById("76341");
    divFirstMovie.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${data.poster_path}')`;
}

function renderMovies(moviesInfo) {
    let movieList = "";
    
    console.log(moviesInfo);
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

// const genresList = await getAllGenres();
// console.log(genresList.genres);

