import { getLoginPage, login } from '../controllers/authController.js';

async function authRoutes(fastify, options) {
    fastify.get('/login', getLoginPage);
    fastify.post('/login', login);
}

export default authRoutes;
