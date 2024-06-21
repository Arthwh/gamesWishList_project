import { authenticateUser } from '../services/authService.js'

export const getLoginPage = async (request, reply) => {
  return reply.sendFile('login-page.html');
};

export const login = async (request, reply) => {
  try {
    const { email, password } = request.body;
    const { userId, token } = await authenticateUser(email, password);

    reply.setCookie('jwt-token', token, { httpOnly: true });
    reply.code(200).send({ message: 'Login successful', userId});
  } catch (error) {
    reply.code(401).send({ message: error.message });
  }
};