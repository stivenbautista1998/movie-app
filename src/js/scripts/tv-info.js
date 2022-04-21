import { 
    getFullTvInfo, 
    IMAGE_URL 
} from '../utils/connections.js';
import { registerMovie as registerTvSerie  } from '../utils/observer.js'
let rootApp;

window.addEventListener("load", () => {
    rootApp = document.querySelector("#app");
    const movieId = getParameters("tvId");
    renderMovieInfo(movieId); // execute the whole movie info section.
});

async function renderMovieInfo(id) {
    if(id !== null) {
        let movieInfo = await getFullTvInfo(id);
        console.log(movieInfo);

        createDomMovieInfo(movieInfo);
        observingTv();
    }
}

function getParameters( parameterName ) {
    let parameter = new URLSearchParams(window.location.search);
    return parameter.get(parameterName);
}

function createDomMovieInfo(movie) {
    let htmlMovieInfo = `
        <section>
            <h2 class="movie-info__tittle">${movie.name}</h2>
            <div class="movie-info__image-wrapper">
                <div>
                    <img id="js-image-movie" class="movie-info__image" src="${IMAGE_URL}${movie.poster_path}" alt="main movie image">
                </div>
                <div class="image-bg">
                    <img id="js-image-bg" class="movie-info__bg-image" src="${IMAGE_URL}${movie.backdrop_path}" alt="trailer image">
                </div>
            </div>
            <div class="movie-info__sub-info">                
                <span class="release-info">${movie.first_air_date}</span>
                <span class="language-info">${movie.original_language}</span>                
                <div class="start-vote">
                    <img class="icon-star" src="../assets/icons/star.svg" alt="star icon">
                    ${movie.vote_average}
                </div>
            </div>
            <div class="genres-section">
                ${tvSerieGenreList(movie.genres)}
            </div>
            <div class="overview-section">${movie.overview}</div>
            <article class="general-section cast-section">
                <h2 class="tittle-section">Casting</h2>
                <div id="js-cast-movies" class="movie-container">
                    ${movie.credits.cast.length !== 0 ? getCast(movie.credits.cast, 10) : ""}
                </div>
            </article>
            <article class="general-section">
                <h2 class="tittle-section">Similar Series</h2>
                <div id="js-related-movies" class="movie-container">
                    ${getTvSeriesRelated(movie.similar.results)}
                </div>
            </article>
        </section>`;
    rootApp.innerHTML = htmlMovieInfo;
}

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

function observingTv() {
    let imageTv = document.querySelectorAll(".movie-image");
    imageTv.forEach((tvImg) => {
        registerTvSerie(tvImg); // tracking every movie card with the observer
        /* movieImg.onclick = () => redirectToPage(movieImg.dataset.id); */
    });
}