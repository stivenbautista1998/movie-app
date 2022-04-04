const apiKey = "7518e90bd9bc2a6fa53eef1c15f77b7d";


async function getMovieById(movieId) {
    const endpoint = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
    
    try {
        let result = await fetch(endpoint);
        let data = await result.json();
        return data;
    } catch (err) {
        console.error(err.message);
    }
}

async function getTrending() {
    const endpoint = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;

    try {
        const result = await fetch(endpoint);
        const data = await result.json();
        return data.results;
    } catch (err) {
        console.error(err.message);
    }
}

async function getTopMovies(limit = 3) {

    try {
        const result = await getTrending();
        const moviesSelected = result.slice(0, limit);
        const movieFetches = moviesSelected.map((movie) => getMovieById(movie.id));
        let moviesInfo = await Promise.all(movieFetches);
        return moviesInfo;
    } catch (err) {
        console.error(err.message);
    }
}

export { getMovieById, getTopMovies };