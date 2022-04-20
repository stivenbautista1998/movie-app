import { 
    getFullMovieInfo, 
    queryWithWord, 
    IMAGE_URL 
} from '../utils/connections.js';
import { registerMovie } from "../utils/observer.js";
let rootApp, searchInput;

window.addEventListener("load", () => {
    rootApp = document.querySelector("#app");
    searchInput = document.querySelector("#js-search-input");

    const movieId = getParameters("movieId");
    renderMovieInfo(movieId); // execute the whole movie info section.

    searchInput.addEventListener("keydown", searchMovie);
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
                    <img id="js-image-bg" class="movie-info__bg-image" src="${IMAGE_URL}${movie.backdrop_path}" alt="trailer image">
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
// <div></div>

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
                <a href="http://127.0.0.1:8080/src/views/movie-info.html?movieId=${movie.id}">
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
                <a href="http://127.0.0.1:8080/src/views/movie-info.html?movieId=${movie.id}">
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
    if(event.keyCode === 13) {      
        let { value } = event.target; 
        if(value !== "") {
            const data = await queryWithWord(value);

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
                console.log(data);
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
