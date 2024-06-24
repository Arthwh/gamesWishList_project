import { fetchGames, fetchGenres, fetchPlatforms } from '../services/apiService.js';

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

        const games = await fetchGames(limit, offset, decodedSearch, decodedFilter);
        return reply.status(200).send(games);
    } catch (error) {
        return handleErrors(reply, error, 'Error fetching games:');
    }
};

// Rota para obter gêneros
export const getGenres = async (request, reply) => {
    const { limit } = request.query;
    try {
        const genres = await fetchGenres(limit);
        return reply.status(200).send(genres);
    } catch (error) {
        return handleErrors(reply, error, 'Error fetching genres:');
    }
};

// Rota para obter plataformas
export const getPlatforms = async (request, reply) => {
    const { limit } = request.query;
    try {
        const platforms = await fetchPlatforms(limit);
        return reply.status(200).send(platforms);
    } catch (error) {
        return handleErrors(reply, error, 'Error fetching platforms:');
    }
};