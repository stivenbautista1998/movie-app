import { getMovieById, getTopMovies, getAllGenres } from './utils/connections.js';
let divFirstMovie, divTrendingMovies;

window.addEventListener("load", () => {
    console.log("working carajo!!");
    divFirstMovie = document.querySelector("#js-first-movie-section");
    divTrendingMovies = document.querySelector("#js-trending-movies");
    
    // first movie to show.
    renderFirstMovie();

    renderTopMovies();

    renderGenres();
});

async function renderFirstMovie() {
    const data = await getMovieById("76341");
    divFirstMovie.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${data.poster_path}')`;
}

async function renderTopMovies() {
    let movieList = "";
    const movies = await getTopMovies(6);
    console.log(movies);
    movies.forEach(movie => {
        if(movie?.id) {
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
    divTrendingMovies.innerHTML = movieList;
}

async function renderGenres() {
    const genres = await getAllGenres();
    console.log(genres);
}
