import { fetchAndSendData } from '../controllers/apiController.js';

async function apiRoutes(fastify, options) {
  fastify.get('/fetch-api-data', fetchAndSendData);
}

export default apiRoutes;
