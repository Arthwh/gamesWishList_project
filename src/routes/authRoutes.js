import { getLoginPage } from '../controllers/authController.js';

async function authRoutes(fastify, options) {
    fastify.get('/login', getLoginPage);
}

export default authRoutes;
