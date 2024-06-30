import { getGamesPage, getGameInfoPage, getUserGamesPage } from '../controllers/gamesController.js';
import { isAuthenticated as middlewareIsAuthenticated } from '../middleware/authMiddleware.js';

async function gamesRoutes(fastify, options) {
    fastify.get('/games', { preHandler: middlewareIsAuthenticated }, getGamesPage);
    fastify.get('/games/info', { preHandler: middlewareIsAuthenticated }, getGameInfoPage);
    fastify.get('/games/list', { preHandler: middlewareIsAuthenticated }, getUserGamesPage);
    fastify.post('/games/list/add', { preHandler: middlewareIsAuthenticated }, getUserGamesPage);
    fastify.delete('/games/list/remove', { preHandler: middlewareIsAuthenticated }, getUserGamesPage);
    fastify.put('/games/list/edit', { preHandler: middlewareIsAuthenticated }, getUserGamesPage);
}

export default gamesRoutes;