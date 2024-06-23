import { getGamesPage } from '../controllers/gamesController.js';
import { isAuthenticated as middlewareIsAuthenticated } from '../middleware/authMiddleware.js';

async function homeRoutes(fastify, options) {
    fastify.get('/games', { preHandler: middlewareIsAuthenticated }, getGamesPage);
}

export default homeRoutes;