import { fetchGamesRepository, fetchAllGenresRepository, fetchAllPlatformsRepository, fetchTopRatedGamesRepository } from "../repositories/apiRepository.js";

export async function fetchGamesService(limit, offset, search, filter) {
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
        const games = await fetchGamesRepository(limit, offset, filterQuery);
        return games;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export async function fetchTopRatedGamesService() {
    try {
        const games = await fetchTopRatedGamesRepository();
        return games;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export async function fetchGenresService(limit) {
    try {
        const genres = await fetchAllGenresRepository(limit);
        return genres;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export async function fetchPlatformsService(limit) {
    try {
        const platforms = await fetchAllPlatformsRepository(limit);
        return platforms;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}