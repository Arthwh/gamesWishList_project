import { getHomePage } from '../controllers/homeController.js';

async function homeRoutes(fastify, options) {
  fastify.get('/', getHomePage);
}

export default homeRoutes;