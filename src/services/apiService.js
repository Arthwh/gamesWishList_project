import { fetchGames as fetchGamesByParams, fetchAllGenres, fetchAllPlatforms } from "../repositories/apiRepository.js";

export async function fetchGames(limit, offset, search, filter) {
    try {
        if (limit == null || offset == null) {
            throw new Error("Limit or offset are missing.");
        }
        let filterQuery = "";
        if (filter && search) {
            filterQuery = ` where ${filter}; search "${search}";`;
        } else if (filter && !search) {
            filterQuery = ` where ${filter}; sort rating desc;`;
        } else if (!filter && search) {
            filterQuery = ` search "${search}";`;
        }
        else {
            filterQuery = ` sort rating desc;`
        }
        const games = await fetchGamesByParams(limit, offset, filterQuery);
        return games;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export async function fetchGenres(limit) {
    try {
        const genres = await fetchAllGenres(limit);
        return genres;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export async function fetchPlatforms(limit) {
    try {
        const platforms = await fetchAllPlatforms(limit);
        return platforms;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}