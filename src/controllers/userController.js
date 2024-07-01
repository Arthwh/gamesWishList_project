import { createUser as createUserService } from '../services/userService.js'

export const getNewAccountPage = async (request, reply) => {
    return reply.sendFile('new-account-page.html');
};

export async function createUser(request, reply) {
    try {
        const userData = request.body;
        await createUserService(userData);
        reply.status(200).send({ message: 'User created successfully' });
    } catch (error) {
        reply.status(400).send({ message: error.message });
    }
}


