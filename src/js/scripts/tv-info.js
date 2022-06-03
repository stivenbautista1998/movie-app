import { 
    getFullTvInfo, 
    queryWithWord,
    IMAGE_URL 
} from '../utils/connections.js';
import { registerMovie as registerTvSerie  } from '../utils/observer.js'
let rootApp, searchInput, searchResultContainer, showAllMovieInfo, 
btnTrailer, closeTrailer, backPost, frontImage, frontImageLoaded, backImageLoaded;

window.addEventListener("load", () => {
    rootApp = document.querySelector("#app");
    searchInput = document.querySelector("#js-search-input");
    searchResultContainer = document.querySelector("#js-search-results");
    
    const tvSerieId = getParameters("tvId");
    renderTvSeriesInfo(tvSerieId).then(() => { // execute the whole movie info section.
        
        console.log({ frontImageLoaded });
        console.log({ backImageLoaded });

        if(frontImageLoaded === true && backImageLoaded === false) {
            backPost = document.querySelector(".image-bg");
            frontImage = document.querySelector("#js-image-movie");
            frontImage.onload = function() {
                backPost.style.height = this.height + "px";
            }
        }
    });

    searchInput.addEventListener("keyup", searchTvSerie);
    window.onresize = adjustBackground;
});

function adjustBackground() {
    if(frontImageLoaded === true && backImageLoaded === false) {
        backPost.style.height = frontImage.height + "px";
    }
}

async function renderTvSeriesInfo(id) {
    if(id !== null) {
        let tvInfo = await getFullTvInfo(id);
        console.log(tvInfo);

        createDomTvInfo(tvInfo);
        observingTv();
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

function createDomTvInfo(tvSerie) {
    const mainImage = (tvSerie.poster_path ? `<img id="js-image-movie" class="movie-info__image" src="${IMAGE_URL + tvSerie.poster_path}" alt="main movie image">` 
    : `<div class="empty-img"><span class="center-position-short medium-font-size">No Image</span></div>`);

    const showCast = 
    `<div id="js-cast-movies" class="movie-container">
        ${getCast(tvSerie.credits.cast, 10)}
    </div>`;

    const showSimilar = 
    `<div id="js-related-movies" class="movie-container">
        ${getTvSeriesRelated(tvSerie.similar.results)}
    </div>`;

    const btnShowTrailer = 
    `<button id="js-btn-trailer" class="btn-trailer">
        <img class="icon-play" src="../assets/icons/play.svg" alt="play icon">
    </button>`;

    const styleBgImage = `style="height: auto;"`;

    frontImageLoaded = (tvSerie.poster_path ? true : false);
    backImageLoaded = (tvSerie?.backdrop_path ? true : false);
    
    let htmlTvSerieInfo = `
        <section>
            <h2 class="movie-info__tittle">${tvSerie.name}</h2>
            <div class="movie-info__image-wrapper">
                <div class="container-front-image">
                    ${mainImage}
                </div>
                <div class="container-btn-trailer">
                    <div class="image-bg" ${tvSerie?.backdrop_path ? styleBgImage : ""}>
                        ${tvSerie?.backdrop_path ? `<img id="js-image-bg" class="movie-info__bg-image" src="${IMAGE_URL}${tvSerie.backdrop_path}" alt="trailer image">` : `<span class="center-position medium-font-size">No Poster Image</span>`}
                    </div> 
                    ${tvSerie.videos.results.length !== 0 ? btnShowTrailer : ""}
                </div>
            </div>
            <div class="movie-info__sub-info">                
                <span class="release-info">${tvSerie.first_air_date}</span>
                <span class="show-on-desktop language">Language: </span>
                <span class="language-info">${tvSerie.original_language}</span>                
                <div class="start-vote">
                    <img class="icon-star" src="../assets/icons/star.svg" alt="star icon">
                    ${tvSerie.vote_average}
                </div>
            </div>
            <div class="genres-section">
                ${tvSerie.genres.length !== 0 ? tvSerieGenreList(tvSerie.genres) : '<span class="genre-movie">No genre found</span>'}
            </div>
            <div class="overview-section">
                ${tvSerie.overview !== "" ? tvSerie.overview : "This serie has no overview registered."}
            </div>
            <article class="general-section cast-section">
                <h2 class="tittle-section">Casting</h2>
                ${tvSerie.credits.cast.length !== 0 ? showCast : `<div class='empty-section'><span class="center-message white-message">No Cast Found</span></div>`}
            </article>
            <article class="general-section seasons-section">
                <h2 class="tittle-section">Seasons</h2>
                <div id="js-cast-movies" class="season-container">
                    ${tvSerie.seasons.length !== 0 ? showSeasons(tvSerie.seasons) : ""}
                </div>
            </article>
            <article class="general-section">
                <h2 class="tittle-section">Similar Series</h2>
                ${tvSerie.similar.results.length !== 0 ? showSimilar : `<div class='empty-section'><span class="center-message white-message">No Similar Series Found</span></div>`}
            </article>
        </section>`;
    rootApp.innerHTML = htmlTvSerieInfo;

    if(tvSerie.videos.results.length !== 0) {
        trailerOption(tvSerie.videos.results[0].key);
    }
}

function showSeasons(seasonsData) {
    let seasonDOM = "";
    seasonsData.forEach((season) => {
        if(season?.season_number >= 1) {
            let datasetImage = `data-img-url="url('${IMAGE_URL + season.poster_path}')"`;

            seasonDOM += `
            <div id="${season.id}" class="season-item">
                <div class="season-img-wrapper movie-image" ${season?.poster_path ? datasetImage : ""}>
                    ${season?.poster_path ? "" : '<div class="center-message">No Image</div>'}
                </div>
                <div class="season-text">
                    <h3 class="season-tittle">${season.name}</h3>
                    <div class="season-text-content">${season.overview === '' ? "No Description" : season.overview}</div>
                    <span class="season-info">Ep. ${season.episode_count}</span>
                    <span class="season-info">Rlsd. ${season.air_date}</span>
                </div>
            </div>`;
        }
    });

    return seasonDOM;
}
// <div class=""></div>


function tvSerieGenreList(tvGenres) {
    let genreList = "";
    tvGenres.forEach((genre) => {
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

function getTvSeriesRelated(data) {
    let tvList = "";
    data.forEach((tvSerie) => {
        if(tvSerie?.id) {
            let datasetImage = `data-img-url="url('${IMAGE_URL}${tvSerie.poster_path}')"`;
            tvList += 
            `<div class="movie-info">
                <a href="/src/views/tv-info.html?tvId=${tvSerie.id}">
                    <div ${tvSerie.poster_path !== null ? datasetImage : ""} class="movie-image">
                        <img class="icon-watchlist" src="../assets/icons/watchlist-ribbon.svg" alt="watchlist icon">
                        <img class="icon-favorite" src="../assets/icons/favorite.svg" alt="favorite icon">
                    </div>
                </a>
                <div class="movie-text">
                    <h3 class="movie-name">${tvSerie.name}</h3>
                    <span class="movie-rate">
                    <img class="icon-star" src="../assets/icons/star.svg" alt="star icon">
                        ${Math.round(tvSerie.vote_average * 10) / 10}
                    </span>
                </div>
            </div>`;
        }
    });
    return tvList;
}

function renderSeries(tvInfo) {
    let tvList = "";
    
    tvInfo.forEach(tv => { 
        if(tv?.id) {
            let datasetImage = `data-img-url="url('${IMAGE_URL}${tv.poster_path}')"`; // we add the img info to the dataset to use it with the Intersection Observer.
            tvList += 
            `<div class="movie-info">
                <a href="/src/views/tv-info.html?tvId=${tv.id}">
                    <div ${tv.poster_path !== null ? datasetImage : ""} class="movie-image">
                        <img class="icon-watchlist" src="../assets/icons/watchlist-ribbon.svg" alt="watchlist icon">
                        <img class="icon-favorite" src="../assets/icons/favorite.svg" alt="favorite icon">
                    </div>
                </a>
                <div class="movie-text">
                    <h3 class="movie-name">${tv.name}</h3>
                    <span class="movie-rate">
                    <img class="icon-star" src="../assets/icons/star.svg" alt="star icon">
                        ${tv.vote_average}
                    </span>
                </div>
            </div>`;
        }
    });
    return tvList;
}

async function searchTvSerie(event) {
    let { value } = event.target; 
    if(event.keyCode === 13) {
        if(value !== "") {
            window.location.href = `/src/views/tv-search.html?query=${value}&page=1`;
        }
    } else if(value !== "" && value.length >= 4) {
        let queryResult = await queryOfInput(value, 5);

        if(queryResult !== null && queryResult !== undefined) {
            searchResultContainer.innerHTML = queryResult;

            if(queryResult !== `<div class="query-message">No results found</div>`) {
                observingTv();
                showAllMovieInfo = document.querySelector("#js-view-all-btn");
                showAllMovieInfo.onclick = () => {
                    window.location.href = `/src/views/tv-search.html?query=${value}&page=1`;
                };
            }
        }
    } else if(value.length < 4) {
        searchResultContainer.innerHTML = "";
    }
}

async function queryOfInput(inputText, limite) {
    if(inputText.length > 3) {
        const data = await queryWithWord(inputText, 1, "tv");    
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

    data.forEach((tvSerieInfo) => {
        let datasetImage = `data-img-url="url('${IMAGE_URL + tvSerieInfo.poster_path}')"`;

        queryList += `
        <a class="no-link-style" href="/src/views/tv-info.html?tvId=${tvSerieInfo.id}">
            <div class="query-list">
                <div class="movie-image query-list-img" ${tvSerieInfo.poster_path !== null ? datasetImage : ""}>
                    ${tvSerieInfo.poster_path !== null ? "" : `<span class="center-position white-message">No Image</span>`}
                </div>
                <div class="query-list-title">${tvSerieInfo.name}</div>
            </div>
        </a>`;
    });
    return `
        ${queryList}
        <div id="js-view-all-btn" class="query-list-btn">View all results</div>
    `;
}

function observingTv() {
    let imageTv = document.querySelectorAll(".movie-image");
    imageTv.forEach((tvImg) => {
        registerTvSerie(tvImg); // tracking every movie card with the observer
    });
}

// number_of_seasons, seasons, number_of_episodes, networks, last_episode_to_air, next_episode_to_air, status {"in production"}
// popular:  https://api.themoviedb.org/3/tv/popular?api_key=<<api_key>>
// top rated:  https://api.themoviedb.org/3/tv/top_rated?api_key=<<api_key>>