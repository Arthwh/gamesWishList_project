//import { getUser, createUser, addItemToUser, getUserItems } from '../services/userService.js';

export const getNewAccountPage = async (request, reply) => {
    return reply.sendFile('new-account-page.html'); // Fastify vai buscar esse arquivo na pasta 'public' configurada no app.js
};

// export async function getUserItemsController(req, reply) {
//     try {
//         const userId = req.params.id;
//         const items = await getUserItems(userId);
//         reply.send(items);
//     } catch (error) {
//         reply.status(500).send({ error: error.message });
//     }
// }

// export async function addUserItemController(req, reply) {
//     try {
//         const userId = req.params.id;
//         const item = req.body;
//         await addItemToUser(userId, item);
//         reply.send({ message: 'Item added to user list' });
//     } catch (error) {
//         reply.status(500).send({ error: error.message });
//     }
// }

// export async function createUserController(req, reply) {
//     try {
//         const user = req.body;
//         await createUser(user);
//         reply.send({ message: 'User created successfully' });
//     } catch (error) {
//         reply.status(500).send({ error: error.message });
//     }
// }
