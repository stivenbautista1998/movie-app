import { getMovieById } from '../utils/connections.js'

window.addEventListener("load", () => {
    const movieId = getParameters("movieId");
    renderMovieInfo(movieId);
});

async function renderMovieInfo(id) {
    if(id !== null) {
        let movieInfo = await getMovieById(id);
        console.log(movieInfo);
    }
}

function getParameters( parameterName ) {
    let parameter = new URLSearchParams(window.location.search);
    return parameter.get(parameterName);
}