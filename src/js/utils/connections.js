const API_KEY = "7518e90bd9bc2a6fa53eef1c15f77b7d";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

// ============  movies  ================

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

async function getMovieGenres() {
    const endPoint = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;
    const data = await getFetchInfo(endPoint);
    return data;
}

async function getMoviesByGenre(genreId, pageNumber = 1) {
    const endPoint = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${pageNumber}`;
    const data = await getFetchInfo(endPoint);
    return data;
}

async function queryWithWord(query, pageNumber, content) {
    let type = (content === "movie" ? "movie" : "tv");
    const endPoint = `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${query}&page=${pageNumber}`;
    const data = await getFetchInfo(endPoint);
    console.log(data);
    return data;
}


// ============  tv  ================

async function getTvById(tvId) {
    const endpoint = `https://api.themoviedb.org/3/tv/${tvId}?api_key=${API_KEY}`;
    const data = await getFetchInfo(endpoint);
    return data;
}

async function getTvGenres() {
    const endPoint = `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`;
    const data = await getFetchInfo(endPoint);
    return data;
}

async function getTvByGenre(genreId, pageNumber = 1) {
    const endPoint = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&page=${pageNumber}`;
    const data = await getFetchInfo(endPoint);
    return data;
}

async function getFullTvInfo(tvId) {
    const endpoint = `https://api.themoviedb.org/3/tv/${tvId}?api_key=${API_KEY}&append_to_response=videos,similar,credits`;
    const data = await getFetchInfo(endpoint);
    return data;
}


export { 
    getMovieById, 
    getTopMovies, 
    getMovieGenres, 
    getMoviesByGenre, 
    getFullMovieInfo,
    queryWithWord,
    getTvGenres,
    getTvById,
    getTvByGenre,
    getFullTvInfo,
    IMAGE_URL
};