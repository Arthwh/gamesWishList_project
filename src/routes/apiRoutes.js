import { getGames } from '../controllers/apiController.js';

async function apiRoutes(fastify, options) {
  fastify.get('/api/games/all', getGames);
}

export default apiRoutes;
