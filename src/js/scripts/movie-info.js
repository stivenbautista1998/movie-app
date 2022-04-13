import { getMovieById, getFullMovieInfo, IMAGE_URL } from '../utils/connections.js'
let rootApp;

window.addEventListener("load", () => {
    rootApp = document.querySelector("#app");
    const movieId = getParameters("movieId");
    renderMovieInfo(movieId);
});

async function renderMovieInfo(id) {
    if(id !== null) {
        let movieInfo = await getFullMovieInfo(id);
        console.log(movieInfo);

        createDomMovieInfo(movieInfo);
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
                <div>
                    <img id="js-image-bg" class="movie-info__bg-image" src="${IMAGE_URL}${movie.backdrop_path}" alt="trailer image">
                </div>
            </div>
            <div class="movie-info__sub-info">                
                <span class="release-info">${movie.release_date}</span>               
                <span class="language-info">${movie.original_language}</span>                
                <img class="icon-star" src="../assets/icons/star.svg" alt="star icon">
                ${movie.vote_average}
            </div>
        </section>`;
    rootApp.innerHTML = htmlMovieInfo;
}
// <div></div>

