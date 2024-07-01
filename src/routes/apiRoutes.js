import { getGames, getGenres, getPlatforms, getTopRatedGames, getGameFullInfo, getGamesById } from '../controllers/apiController.js';
import { isAuthenticated as middlewareIsAuthenticated } from '../middleware/authMiddleware.js';

async function apiRoutes(fastify, options) {
  fastify.get('/api/games', getGames);
  fastify.get('/api/genres/all', getGenres);
  fastify.get('/api/platforms/all', getPlatforms);
  fastify.get('/api/games/info', getGameFullInfo);
  fastify.get('/api/games/toprated', { preHandler: middlewareIsAuthenticated }, getTopRatedGames);
  fastify.get('/api/games/by_id', getGamesById);
}

export default apiRoutes;