import { 
    getMoviesByGenre, 
    queryWithWord, 
    IMAGE_URL 
} from '../utils/connections.js';
import { registerMovie } from '../utils/observer.js';
let rootApp, searchInput;

window.addEventListener("load", () => {
    rootApp = document.querySelector("#app");
    searchInput = document.querySelector("#js-search-input");
    const genreId = getParameters("genreId");
    const genreName  = getParameters("genreName");
    showMovieByGenreSelected(genreId, genreName);

    searchInput.addEventListener("keydown", searchMovie);
});

async function searchMovie(event) {
    if(event.keyCode === 13) {      
        let { value } = event.target; 
        if(value !== "") {
            const data = await queryWithWord(value, "movie");

            if(data.length !== 0) {
                const movieResults = renderMovies(data);

                rootApp.innerHTML = `
                <section class="general-section">
                    <h2 class="first-tittle">Movie Results</h2>
                    <div class="movie-search-items">
                        ${movieResults}
                    </div>
                </section>`;
                observingMovies();
            } else {
                rootApp.innerHTML = `
                <section class="general-section">
                    <div class="not-found-section">
                        <img class="not-found-image" src="../assets/imgs/not-found.png" alt="not found image">
                    </div>
                </section>`;
            }
        }
    }
}

async function showMovieByGenreSelected(genreId, genreName) {
    const movieInfo = await getMoviesByGenre(genreId);
    const movieList = renderMovies(movieInfo);
    rootApp.innerHTML = `
    <section class="general-section">
        <h2 class="first-tittle">Filtered By ${genreName}</h2>
        <div class="movie-search-items">
            ${movieList}
        </div>
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

function observingMovies() {
    let imageMovies = document.querySelectorAll(".movie-image");
    imageMovies.forEach((movieImg) => {
        registerMovie(movieImg); // tracking every movie card with the observer
        /* movieImg.onclick = () => redirectToPage(movieImg.dataset.id); */
    });
}