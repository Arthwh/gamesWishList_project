import { fetchGamesService, fetchGenresService, fetchPlatformsService, fetchTopRatedGamesService, fetchGameFullInfoService } from '../services/apiService.js';

// Função utilitária para lidar com erros
const handleErrors = (reply, error, errorMessage) => {
    console.error(errorMessage, error);
    return reply.status(500).send({ error: errorMessage + error.message });
};

// Rota para obter jogos
export const getGames = async (request, reply) => {
    try {
        const { limit, page, search, filter } = request.query;
        const decodedSearch = decodeURIComponent(search) || null;
        const decodedFilter = decodeURIComponent(filter) || null;
        const offset = (page - 1) * limit;

        const games = await fetchGamesService(limit, offset, decodedSearch, decodedFilter);
        return reply.status(200).send(games);
    } catch (error) {
        return reply.status(500).send({ error: error.message });
    }
};

// Rota para obter gêneros
export const getGenres = async (request, reply) => {
    const { limit } = request.query;
    try {
        const genres = await fetchGenresService(limit);
        return reply.status(200).send(genres);
    } catch (error) {
        return reply.status(500).send({ error: error.message });
    }
};

// Rota para obter plataformas
export const getPlatforms = async (request, reply) => {
    const { limit } = request.query;
    try {
        const platforms = await fetchPlatformsService(limit);
        return reply.status(200).send(platforms);
    } catch (error) {
        return reply.status(500).send({ error: error.message });
    }
};

// Rota para obter jogos
export const getGameFullInfo = async (request, reply) => {
    try {
        const id = request.query.id;
        if (!id) {
            return reply.status(400).send({ error: 'Missing game id' });
        }
        const gameData = await fetchGameFullInfoService(id);
        return reply.status(200).send(gameData);
    } catch (error) {
        return reply.status(500).send({ error: error.message });
    }
};

// Rota para obter jogos mais avaliados
export const getTopRatedGames = async (request, reply) => {
    try {
        const platforms = await fetchTopRatedGamesService();
        return reply.status(200).send(platforms);
    } catch (error) {
        return reply.status(500).send({ error: error.message });
    }
};