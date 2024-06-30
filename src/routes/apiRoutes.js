import { getGames, getGenres, getPlatforms, getTopRatedGames, getGameFullInfo, getSimilarGames } from '../controllers/apiController.js';

async function apiRoutes(fastify, options) {
  fastify.get('/api/games', getGames);
  fastify.get('/api/genres/all', getGenres);
  fastify.get('/api/platforms/all', getPlatforms);
  fastify.get('/api/games/info', getGameFullInfo);
  fastify.get('/api/games/toprated', getTopRatedGames);
  fastify.get('/api/games/similargames', getSimilarGames);
}

export default apiRoutes;