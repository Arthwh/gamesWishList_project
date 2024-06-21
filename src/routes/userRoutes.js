import { getNewAccountPage, createUser } from '../controllers/userController.js';

async function userRoutes(fastify, options) {
  fastify.post('/user/create', createUser);
  fastify.get('/user/create', getNewAccountPage);
}

export default userRoutes;
