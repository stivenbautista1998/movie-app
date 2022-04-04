import { getMovieById, getTopMovies } from './utils/connections.js';
let divFirstMovie, divTrendingMovies;

window.addEventListener("load", () => {
    console.log("working carajo!!");
    divFirstMovie = document.querySelector("#js-first-movie-section");
    divTrendingMovies = document.querySelector("#js-trending-movies");
    
    // first movie to show.
    renderFirstMovie();

    renderTopMovies();
});

async function renderFirstMovie() {
    const data = await getMovieById("76341");
    divFirstMovie.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${data.poster_path}')`;
}

async function renderTopMovies() {
    const data = await getTopMovies(6);
    console.log(data);
    /* divTrendingMovies.innerHTML = ""; */
}
