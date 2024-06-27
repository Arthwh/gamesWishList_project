import { getGames, getGenres, getPlatforms, getGameFullInfo } from '../controllers/apiController.js';

async function apiRoutes(fastify, options) {
  fastify.get('/api/games/all', getGames);
  fastify.get('/api/genres/all', getGenres);
  fastify.get('/api/platforms/all', getPlatforms);
  fastify.get('/api/games/info', getGameFullInfo);
}

export default apiRoutes;
