import { createUser as createUserService } from '../services/userService.js'

export const getNewAccountPage = async (request, reply) => {
    return reply.sendFile('new-account-page.html');
};

export async function createUser(req, reply) {
    try {
        const userData = req.body;
        await createUserService(userData);
        reply.status(200).send({ message: 'User created successfully' });
    } catch (error) {
        reply.status(400).send({ message: error.message });
    }
}

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

