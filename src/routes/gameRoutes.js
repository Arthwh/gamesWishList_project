import { getGamesPage, getGameInfoPage, getUserGamesPage, addGameToList, deleteGameFromList, editGameStatusFromList, getUserGamesList, getUserListId, getSharedList, gameFullGameData, getGamesData } from '../controllers/gameController.js';
import { isAuthenticated as middlewareIsAuthenticated } from '../middleware/authMiddleware.js';

async function gamesRoutes(fastify, options) {
    fastify.get('/games', { preHandler: middlewareIsAuthenticated }, getGamesPage);
    fastify.get('/games/info', { preHandler: middlewareIsAuthenticated }, getGameInfoPage);
    fastify.get('/games/info/data', { preHandler: middlewareIsAuthenticated }, gameFullGameData);
    fastify.get('/games/list/page', { preHandler: middlewareIsAuthenticated }, getUserGamesPage);
    fastify.get('/games/list/data', { preHandler: middlewareIsAuthenticated }, getUserGamesList);
    fastify.post('/games/list/add', { preHandler: middlewareIsAuthenticated }, addGameToList);
    fastify.delete('/games/list/remove', { preHandler: middlewareIsAuthenticated }, deleteGameFromList);
    fastify.put('/games/list/edit/status', { preHandler: middlewareIsAuthenticated }, editGameStatusFromList);
    fastify.get('/games/list/listid', { preHandler: middlewareIsAuthenticated }, getUserListId);
    fastify.get('/games/share', { preHandler: middlewareIsAuthenticated }, getSharedList);
    fastify.get('/games/data', { preHandler: middlewareIsAuthenticated }, getGamesData);
}

export default gamesRoutes;