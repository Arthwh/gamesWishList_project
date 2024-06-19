//import { getNewAccountPage, getUserItemsController, addUserItemController, createUserController } from '../controllers/userController.js';
import { getNewAccountPage } from '../controllers/userController.js';

async function userRoutes(fastify, options) {
  // fastify.get('/user/list/:id', getUserItemsController);
  // fastify.post('/user/add-item/:id', addUserItemController);
  // fastify.post('/user/create', createUserController);
  fastify.get('/user/create', getNewAccountPage);
}

export default userRoutes;
