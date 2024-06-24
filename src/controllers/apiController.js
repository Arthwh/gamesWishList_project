
import { fetchGames, fetchGenres, fetchPlatforms } from '../services/apiService.js';

export const getGames = async (request, reply) => {
    const { limit, page } = request.query;
    const offset = (page - 1) * limit;
    try {
        const games = await fetchGames(limit, offset);
        // console.log("teste" + games)
        return reply.status(200).send(games);
    } catch (error) {
        console.error('Error fetching games:', error);
        return reply.status(500).send({ error: 'Failed to fetch games' + error.message });
    }
};

export const getGenres = async (request, reply) => {
    const { limit } = request.query;
    try {
        const genres = await fetchGenres(limit);
        // console.log("teste" + genres)
        return reply.status(200).send(genres);
    } catch (error) {
        console.error('Error fetching genres:', error);
        return reply.status(500).send({ error: 'Failed to fetch genres' + error.message });
    }
};

export const getPlatforms = async (request, reply) => {
    const { limit } = request.query;
    try {
        const platforms = await fetchPlatforms(limit);
        // console.log("teste" + platforms)
        return reply.status(200).send(platforms);
    } catch (error) {
        console.error('Error fetching platforms:', error);
        return reply.status(500).send({ error: 'Failed to fetch platforms' + error.message });
    }
};