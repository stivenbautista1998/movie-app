import { 
    getFullMovieInfo, 
    queryWithWord, 
    IMAGE_URL 
} from '../utils/connections.js';
import { registerMovie } from "../utils/observer.js";
let rootApp, searchInput, searchResultContainer, showAllMovieInfo;

window.addEventListener("load", () => {
    rootApp = document.querySelector("#app");
    searchInput = document.querySelector("#js-search-input");
    searchResultContainer = document.querySelector("#js-search-results");

    const movieId = getParameters("movieId");
    renderMovieInfo(movieId); // execute the whole movie info section.

    searchInput.addEventListener("keyup", searchMovie);
});

async function renderMovieInfo(id) {
    if(id !== null) {
        let movieInfo = await getFullMovieInfo(id);
        console.log(movieInfo);

        createDomMovieInfo(movieInfo);
        observingCast();
    }
}

function getParameters( parameterName ) {
    let parameter = new URLSearchParams(window.location.search);
    return parameter.get(parameterName);
}

function createDomMovieInfo(movie) {
    let htmlMovieInfo = `
        <section>
            <h2 class="movie-info__tittle">${movie.title}</h2>
            <div class="movie-info__image-wrapper">
                <div>
                    <img id="js-image-movie" class="movie-info__image" src="${IMAGE_URL}${movie.poster_path}" alt="main movie image">
                </div>
                <div class="image-bg">
                    ${movie?.backdrop_path ? `<img id="js-image-bg" class="movie-info__bg-image" src="${IMAGE_URL}${movie.backdrop_path}" alt="trailer image">` : `<span class="center-message medium-font-size">No Poster Image</span>`}
                </div>
            </div>
            <div class="movie-info__sub-info">                
                <span class="release-info">${movie.release_date}</span>               
                <span class="language-info">${movie.original_language}</span>                
                <div class="start-vote">
                    <img class="icon-star" src="../assets/icons/star.svg" alt="star icon">
                    ${movie.vote_average}
                </div>
            </div>
            <div class="genres-section">
                ${movieGenreList(movie.genres)}
            </div>
            <div class="overview-section">${movie.overview}</div>
            <article class="general-section cast-section">
                <h2 class="tittle-section">Casting</h2>
                <div id="js-cast-movies" class="movie-container">
                    ${movie.credits.cast.length !== 0 ? getCast(movie.credits.cast, 10) : ""}
                </div>
            </article>
            <article class="general-section">
                <h2 class="tittle-section">Similar Movies</h2>
                <div id="js-related-movies" class="movie-container">
                    ${getMovieRelated(movie.similar.results)}
                </div>
            </article>
        </section>`;
    rootApp.innerHTML = htmlMovieInfo;
}

function movieGenreList(movieGenres) {
    let genreList = "";
    movieGenres.forEach((genre) => {
        genreList += `<span id="${genre.id}" class="genre-movie">${genre.name}</span>`
    });
    return genreList;
}

function getCast(data, amountToShow) {
    let castList = "";
    for (let index = 0; index < amountToShow; index++) {
        const cast = data[index];
        
        if(cast?.id) {            
            let datasetImage = `data-img-url="url('${IMAGE_URL}${cast.profile_path}')"`;
        
            castList +=
            `<div class="movie-info">
                <div ${cast.profile_path !== null ? datasetImage : ""} class="movie-image">
                </div>
                <div class="movie-text cast-text">
                    <h3 class="cast-name">${cast.name}</h3>
                    <span class="cast-character">
                        ${cast.character}
                    </span>
                </div>
            </div>`;
        }
    }
    return castList;
}

function getMovieRelated(data) {
    let movieList = "";
    data.forEach((movie) => {
        if(movie?.id) {
            let datasetImage = `data-img-url="url('${IMAGE_URL}${movie.poster_path}')"`;
            movieList += 
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
                        ${Math.round(movie.vote_average * 10) / 10}
                    </span>
                </div>
            </div>`;
        }
    });
    return movieList;
}

function observingCast() {
    let imageCast = document.querySelectorAll(".movie-image");
    imageCast.forEach((castImg) => {
        registerMovie(castImg); // tracking every movie card with the observer
        /* movieImg.onclick = () => redirectToPage(movieImg.dataset.id); */
    });
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
    return movieList;
}

async function searchMovie(event) {
    let { value } = event.target; 
    if(event.keyCode === 13) {
        if(value !== "") {
            showMoviesFilteredBySearch(value);
        }
    } else if(value !== "") {
        let queryResult = await queryOfInput(value, 5);

        if(queryResult !== null && queryResult !== undefined) {
            searchResultContainer.innerHTML = queryResult;

            if(queryResult !== `<div class="query-message">No results found</div>`) {
                observingCast();
                showAllMovieInfo = document.querySelector("#js-view-all-btn");
                showAllMovieInfo.onclick = () => {
                    console.log("it has been clicked!!");
                    showMoviesFilteredBySearch(value);
                };
            }

        } else {
            searchResultContainer.innerHTML = "";
        }
    } else {
        searchResultContainer.innerHTML = "";
    }
}

async function queryOfInput(inputText, limite) {
    if(inputText.length > 3) {
        const data = await queryWithWord(inputText, "movie");    
        if(data.length !== 0) {
            const result = data.slice(0, limite);
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

async function showMoviesFilteredBySearch(value) {
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
        observingCast();
        searchResultContainer.innerHTML = "";
    } else {
        rootApp.innerHTML = `
        <section class="general-section">
            <div class="not-found-section">
                <img class="not-found-image" src="../assets/imgs/not-found.png" alt="not found image">
            </div>
        </section>`;
        searchResultContainer.innerHTML = "";
    }
}