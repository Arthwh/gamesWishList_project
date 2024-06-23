
import { fetchGames } from '../services/apiService.js';

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