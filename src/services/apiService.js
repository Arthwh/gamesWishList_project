import { fetchGames as fetchGamesByParams, fetchAllGenres, fetchAllPlatforms, fetchGameData, getAccessToken } from "../repositories/apiRepository.js";

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

        const token = await getAccessToken();
        if (!token) {
            throw new Error('Failed to fetch games: token missing');
        }

        const games = await fetchGamesByParams(token, limit, offset, filterQuery);
        return games;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export async function fetchGenres(limit) {
    try {
        const token = await getAccessToken();
        if (!token) {
            throw new Error('Failed to fetch genres: token missing');
        }

        const genres = await fetchAllGenres(token, limit);
        return genres;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export async function fetchPlatforms(limit) {
    try {
        const token = await getAccessToken();
        if (!token) {
            throw new Error('Failed to fetch platforms: token missing');
        }

        const platforms = await fetchAllPlatforms(token, limit);
        return platforms;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export async function fetchGameFullInfo(id) {
    try {
        const token = await getAccessToken();
        if (!token) {
            throw new Error('Failed to fetch game data: token missing');
        }

        const gameData = fetchGameData(token, id);
        return gameData;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}