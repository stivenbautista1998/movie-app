import { 
    getFullMovieInfo, 
    queryWithWord, 
    IMAGE_URL 
} from '../utils/connections.js';
import { registerMovie } from "../utils/observer.js";
let rootApp, searchInput, searchResultContainer, showAllMovieInfo, 
btnTrailer, closeTrailer;

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

function trailerOption(idVideo) {

    let youtubeTrailer = 
    `<div id="js-youtube-section" class="youtube-container">
        <div class="close">
            <img id="js-close-trailer" class="icon-trailer" src="/src/assets/icons/close.svg" alt="close icon">
        </div>
        <iframe class="youtube-video" src="https://www.youtube.com/embed/${idVideo}?rel=0" title="YouTube video player" frameborder="0" allowfullscreen>
        </iframe>
    </div>`;

    btnTrailer = document.querySelector("#js-btn-trailer");
    console.log(btnTrailer);
    btnTrailer.onclick = () => {
        rootApp.innerHTML += youtubeTrailer;
        console.log(youtubeTrailer);
        closeTrailer = document.querySelector("#js-close-trailer");

        closeTrailer.onclick = () => {
            let youtubeSection = document.querySelector("#js-youtube-section");
            rootApp.removeChild(youtubeSection);
        }
    }
}

function createDomMovieInfo(movie) {
    const mainImage = (movie.poster_path ? `<img id="js-image-movie" class="movie-info__image" src="${IMAGE_URL + movie.poster_path}" alt="main movie image">` 
    : `<div class="empty-img"><span class="center-message medium-font-size">No Image</span></div>`);

    const showCast = 
    `<div id="js-cast-movies" class="movie-container">
        ${getCast(movie.credits.cast, 10)}
    </div>`;

    const showSimilar = 
    `<div id="js-related-movies" class="movie-container">
        ${getMovieRelated(movie.similar.results)}
    </div>`;

    const btnShowTrailer = 
    `<button id="js-btn-trailer" class="btn-trailer">
        <img class="icon-play" src="../assets/icons/play.svg" alt="play icon">
    </button>`;

    const styleBgImage = `style="height: auto;"`;

    let htmlMovieInfo = `
        <section>
            <h2 class="movie-info__tittle">${movie.title}</h2>
            <div class="movie-info__image-wrapper">
                <div class="container-front-image">
                    ${mainImage}
                </div>
                <div class="container-btn-trailer">
                    <div class="image-bg" ${movie?.backdrop_path ? styleBgImage : ""}>
                        ${movie?.backdrop_path ? `<img id="js-image-bg" class="movie-info__bg-image" src="${IMAGE_URL}${movie.backdrop_path}" alt="trailer image">` : `<span class="center-message medium-font-size">No Poster Image</span>`}
                    </div> 
                    ${movie.videos.results.length !== 0 ? btnShowTrailer : ""}
                </div>
            </div>
            <div class="movie-info__sub-info">                
                <span class="release-info">${movie.release_date}</span>
                <span class="show-on-desktop language">Language: </span>
                <span class="language-info">${movie.original_language}</span>                
                <div class="start-vote">
                    <img class="icon-star" src="../assets/icons/star.svg" alt="star icon">
                    ${movie.vote_average}
                </div>
            </div>
            <div class="genres-section">
                ${movie.genres.length !== 0 ? movieGenreList(movie.genres) : '<span class="genre-movie">No genre found</span>'}
            </div>
            <div class="overview-section">
                ${movie.overview !== "" ? movie.overview : "This serie has no overview registered."}
            </div>
            <article class="general-section cast-section">
                <h2 class="tittle-section">Casting</h2>
                ${movie.credits.cast.length !== 0 ? showCast : `<div class='empty-section'><span class="center-message white-message">No Cast Found</span></div>`}
            </article>
            <article class="general-section">
                <h2 class="tittle-section">Similar Movies</h2>
                ${movie.similar.results.length !== 0 ? showSimilar : `<div class='empty-section'><span class="center-message white-message">No Similar Series Found</span></div>`}
            </article>
        </section>`;
    rootApp.innerHTML = htmlMovieInfo;
    if(movie.videos.results.length !== 0) {
        trailerOption(movie.videos.results[0].key);
    }
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
    });
}

async function searchMovie(event) {
    let { value } = event.target; 
    if(event.keyCode === 13) {
        if(value !== "") {
            window.location.href = `/src/views/movie-search.html?query=${value}&page=1`;
        }
    } else if(value !== "") {
        let queryResult = await queryOfInput(value, 5);

        if(queryResult !== null && queryResult !== undefined) {
            searchResultContainer.innerHTML = queryResult;

            if(queryResult !== `<div class="query-message">No results found</div>`) {
                observingCast();
                showAllMovieInfo = document.querySelector("#js-view-all-btn");
                showAllMovieInfo.onclick = () => {
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