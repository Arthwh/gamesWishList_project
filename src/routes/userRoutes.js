import { getUserItemsController, addUserItemController, createUserController } from '../controllers/userController.js';

async function userRoutes(fastify, options) {
  fastify.get('/user/list/:id', getUserItemsController);
  fastify.post('/user/add-item/:id', addUserItemController);
  fastify.post('/user/create', createUserController);
}

export default userRoutes;
