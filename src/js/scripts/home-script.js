import { 
    getMovieById, 
    getTopMovies, 
    getMoviesByGenre, 
    IMAGE_URL,
    queryWithWord
} from '../utils/connections.js';
import { registerMovie } from '../utils/observer.js'
let divFirstMovie, divTrendingMovies, divRomanticMovies, divAnimationMovies, 
divHorrorMovies, divMysteryMovies, searchInput, searchResultContainer,
showAllMovieInfo;

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
    searchResultContainer = document.querySelector("#js-search-results");
    
    renderFirstMovie(); // first movie to show.

    // executing all the async functions that render the series cards and then running the observer function. 
    Promise.all([
        renderTopMovies(),
        renderRomanceMovies(),
        renderAnimationMovies(),
        renderMysteryMovies(),
        renderHorrorMovies()
    ]).then(() => {
        observingMovies();
    });

    searchInput.addEventListener("keyup", searchMovie);
});

async function searchMovie(event) {
    let { value } = event.target; 
    if(event.keyCode === 13) {
        console.log("key!!");
        if(value !== "") {
            window.location.href = `/src/views/movie-search.html?query=${value}&page=1`;
        }
    } else if(value !== "") {
        let queryResult = await queryOfInput(value, 5);

        if(queryResult !== null && queryResult !== undefined) {
            searchResultContainer.innerHTML = queryResult;

            if(queryResult !== `<div class="query-message">No results found</div>`) {
                observingMovies();
                showAllMovieInfo = document.querySelector("#js-view-all-btn");
                showAllMovieInfo.onclick = () => {
                    console.log("it has been clicked!!");
                    window.location.href = `/src/views/movie-search.html?query=${value}&page=1`;
                };
            }
        }
    }
}

async function queryOfInput(inputText, limite) {
    if(inputText.length > 3) {
        const data = await queryWithWord(inputText, 1, "movie");    
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

    data.forEach((movieInfo) => {
        let datasetImage = `data-img-url="url('${IMAGE_URL + movieInfo.poster_path}')"`;

        queryList += `
        <a class="no-link-style" href="/src/views/movie-info.html?movieId=${movieInfo.id}">
            <div class="query-list">
                <div class="movie-image query-list-img" ${movieInfo.poster_path !== null ? datasetImage : ""}>
                    ${movieInfo.poster_path !== null ? "" : `<span class="center-message white-message">No Image</span>`}
                </div>
                <div class="query-list-title">${movieInfo.title}</div>
            </div>
        </a>`;
    });
    return `
        ${queryList}
        <div id="js-view-all-btn" class="query-list-btn">View all results</div>
    `;
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
                <a href="/src/views/movie-info.html?movieId=${movie.id}">
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
    });
}
