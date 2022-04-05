const apiKey = "7518e90bd9bc2a6fa53eef1c15f77b7d";


async function getMovieById(movieId) {
    const endpoint = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
    
    try {
        let result = await fetch(endpoint);
        let data = await result.json();
        return data;
    } catch (err) {
        console.warn(err.message);
    }
}

async function getTrending() {
    const endpoint = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;

    try {
        const result = await fetch(endpoint);
        const data = await result.json();
        return data.results;
    } catch (err) {
        console.warn(err.message);
    }
}

async function getTopMovies() {

    try {
        const result = await getTrending();
        // const moviesSelected = result.slice(0, limit);
        const movieFetches = result.map((movie) => getMovieById(movie.id));
        let moviesInfo = await Promise.all(movieFetches);
        return moviesInfo;
    } catch (err) {
        console.warn(err.message);
    }
}

async function getAllGenres() {
    const endPoint = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;

    try {
        const result = await fetch(endPoint);
        const data = await result.json();
        return data;
    } catch (err) {
        console.warn(err.message);
    }
}

async function getMoviesByGenre(genreId) {
    const endPoint = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`;

    try {
        const result = await fetch(endPoint);
        const data = await result.json();
        return data.results;
    } catch (err) {
        console.warn(err.message);
    }
}

export { getMovieById, getTopMovies, getAllGenres, getMoviesByGenre };