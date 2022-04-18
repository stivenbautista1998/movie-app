const API_KEY = "7518e90bd9bc2a6fa53eef1c15f77b7d";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

async function getFetchInfo(myEndPoint) {
    try {
        let result = await fetch(myEndPoint);
        let data = await result.json();
        return data;
    } catch (err) {
        console.warn(err.message);
    }
}

async function getMovieById(movieId) {
    const endpoint = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;
    const data = await getFetchInfo(endpoint);
    return data;
}

async function getFullMovieInfo(movieId) {
    const endpoint = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,similar,credits`;
    const data = await getFetchInfo(endpoint);
    return data;
}

async function getTrending() {
    const endpoint = `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`;
    const data = await getFetchInfo(endpoint);
    if(data?.results) return data.results;
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
    const endPoint = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;
    const data = await getFetchInfo(endPoint);
    return data;
}

async function getMoviesByGenre(genreId) {
    const endPoint = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`;
    const data = await getFetchInfo(endPoint);
    if(data?.results) return data.results;
}

export { 
    getMovieById, 
    getTopMovies, 
    getAllGenres, 
    getMoviesByGenre, 
    getFullMovieInfo,
    IMAGE_URL
};