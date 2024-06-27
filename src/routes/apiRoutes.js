import { getGames, getGenres, getPlatforms, getTopRatedGames, getGameFullInfo } from '../controllers/apiController.js';

async function apiRoutes(fastify, options) {
  fastify.get('/api/games', getGames);
  fastify.get('/api/genres/all', getGenres);
  fastify.get('/api/platforms/all', getPlatforms);
  fastify.get('/api/games/info', getGameFullInfo);
  fastify.get('/api/games/toprated', getTopRatedGames);
}

export default apiRoutes;