import { getLoginPage, login, isAuthenticated, logout } from '../controllers/authController.js';
import { isAuthenticated as middlewareIsAuthenticated } from '../middleware/authMiddleware.js';

async function authRoutes(fastify, options) {
    fastify.get('/login', getLoginPage);
    fastify.post('/login', login);
    fastify.get('/auth', { preHandler: middlewareIsAuthenticated }, isAuthenticated)
    fastify.get('/logout', { preHandler: middlewareIsAuthenticated }, logout)
}

export default authRoutes;
