import { 
    getFullTvInfo, 
    queryWithWord,
    IMAGE_URL 
} from '../utils/connections.js';
import { registerMovie as registerTvSerie  } from '../utils/observer.js'
let rootApp, searchInput;

window.addEventListener("load", () => {
    rootApp = document.querySelector("#app");
    searchInput = document.querySelector("#js-search-input");
    const tvSerieId = getParameters("tvId");
    renderTvSeriesInfo(tvSerieId); // execute the whole movie info section.

    searchInput.addEventListener("keydown", searchTvSerie);
});

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

function createDomTvInfo(tvSerie) {
    let htmlTvSerieInfo = `
        <section>
            <h2 class="movie-info__tittle">${tvSerie.name}</h2>
            <div class="movie-info__image-wrapper">
                <div>
                    <img id="js-image-movie" class="movie-info__image" src="${IMAGE_URL}${tvSerie.poster_path}" alt="main movie image">
                </div>
                <div class="image-bg">
                    ${tvSerie?.backdrop_path ? `<img id="js-image-bg" class="movie-info__bg-image" src="${IMAGE_URL}${tvSerie.backdrop_path}" alt="trailer image">` : `<span class="center-message medium-font-size">No Poster Image</span>`}
                </div>
            </div>
            <div class="movie-info__sub-info">                
                <span class="release-info">${tvSerie.first_air_date}</span>
                <span class="language-info">${tvSerie.original_language}</span>                
                <div class="start-vote">
                    <img class="icon-star" src="../assets/icons/star.svg" alt="star icon">
                    ${tvSerie.vote_average}
                </div>
            </div>
            <div class="genres-section">
                ${tvSerieGenreList(tvSerie.genres)}
            </div>
            <div class="overview-section">${tvSerie.overview}</div>
            <article class="general-section cast-section">
                <h2 class="tittle-section">Casting</h2>
                <div id="js-cast-movies" class="movie-container">
                    ${tvSerie.credits.cast.length !== 0 ? getCast(tvSerie.credits.cast, 10) : ""}
                </div>
            </article>
            <article class="general-section seasons-section">
                <h2 class="tittle-section">Seasons</h2>
                <div id="js-cast-movies" class="season-container">
                    ${tvSerie.seasons.length !== 0 ? showSeasons(tvSerie.seasons) : ""}
                </div>
            </article>
            <article class="general-section">
                <h2 class="tittle-section">Similar Series</h2>
                <div id="js-related-movies" class="movie-container">
                    ${getTvSeriesRelated(tvSerie.similar.results)}
                </div>
            </article>
        </section>`;
    rootApp.innerHTML = htmlTvSerieInfo;
}

function showSeasons(seasonsData) {
    let seasonDOM = "";
    seasonsData.forEach((season) => {
        console.log(season);
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
    if(event.keyCode === 13) {
        let { value } = event.target; 
        if(value !== "") {
            const data = await queryWithWord(value, "tv");

            if(data.length !== 0) {
                const tvResults = renderSeries(data);

                rootApp.innerHTML = `
                <section class="general-section">
                    <h2 class="first-tittle">Series Results</h2>
                    <div class="movie-search-items">
                        ${tvResults}
                    </div>
                </section>`;
                observingTv();
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

function observingTv() {
    let imageTv = document.querySelectorAll(".movie-image");
    imageTv.forEach((tvImg) => {
        registerTvSerie(tvImg); // tracking every movie card with the observer
        /* movieImg.onclick = () => redirectToPage(movieImg.dataset.id); */
    });
}

// number_of_seasons, seasons, number_of_episodes, networks, last_episode_to_air, next_episode_to_air, 
// popular:  https://api.themoviedb.org/3/tv/popular?api_key=<<api_key>>
// top rated:  https://api.themoviedb.org/3/tv/top_rated?api_key=<<api_key>>
