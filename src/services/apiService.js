import { fetchGames as fetchAll, fetchAllGenres, fetchAllPlatforms } from "../repositories/apiRepository.js";

export async function fetchGames(limit, offset) {
    try {
        const games = await fetchAll(limit, offset);
        // console.log("depuracaoService: " + games)
        return games;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export async function fetchGenres(limit) {
    try {
        const genres = await fetchAllGenres(limit);
        // console.log("depuracaoService: " + genres)
        return genres;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export async function fetchPlatforms(limit) {
    try {
        const platforms = await fetchAllPlatforms(limit);
        // console.log("depuracaoService: " + platforms)
        return platforms;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}