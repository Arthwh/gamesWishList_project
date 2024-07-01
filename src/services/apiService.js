import { fetchGamesRepository, fetchAllGenresRepository, fetchAllPlatformsRepository, fetchTopRatedGamesRepository, fetchGameDataRepository, getAccessToken, fetchGamesByIdRepository } from "../repositories/apiRepository.js";

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

        const token = await getAccessToken();
        if (!token) {
            throw new Error('Failed to fetch games: token missing');
        }

        const games = await fetchGamesRepository(token, limit, offset, filterQuery);
        return games;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export async function fetchTopRatedGamesService() {
    try {
        const token = await getAccessToken();
        if (!token) {
            throw new Error('Failed to fetch top rated games: token missing');
        }
        const games = await fetchTopRatedGamesRepository(token);
        return games;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export async function fetchGenresService(limit) {
    try {
        const token = await getAccessToken();
        if (!token) {
            throw new Error('Failed to fetch genres: token missing');
        }
        const genres = await fetchAllGenresRepository(token, limit);
        return genres;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export async function fetchPlatformsService(limit) {
    try {
        const token = await getAccessToken();
        if (!token) {
            throw new Error('Failed to fetch platforms: token missing');
        }

        const platforms = await fetchAllPlatformsRepository(token, limit);
        return platforms;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export async function fetchGameFullInfoService(id) {
    try {
        const token = await getAccessToken();
        if (!token) {
            throw new Error('Failed to fetch game data: token missing');
        }

        const gameData = await fetchGameDataRepository(token, id);
        return gameData;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export async function fetchGamesByIdService(ids) {
    try {
        const token = await getAccessToken();
        if (!token) {
            throw new Error('Failed to fetch games by id: token missing');
        }
        
        const similarGamesData = await fetchGamesByIdRepository(token, ids);
        return similarGamesData;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}