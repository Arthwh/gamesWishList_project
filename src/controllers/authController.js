import { authenticateUser } from '../services/authService.js'

export const getLoginPage = async (request, reply) => {
  return reply.sendFile('login-page.html');
};

export const login = async (request, reply) => {
  try {
    const { email, password } = request.body;
    const { userId, token } = await authenticateUser(email, password);

    reply.setCookie('jwt-token', token, { httpOnly: true });
    reply.code(200).send({ message: 'Login successful', userId });
  } catch (error) {
    reply.code(401).send({ message: error.message });
  }
};

export const isAuthenticated = async (request, reply) => {
  return reply.send({ isAuthenticated: request.isAuthenticated });
}

export const logout = async (request, reply) => {
  if (!request.isAuthenticated) {
    return reply.code(401).send({ message: 'You are not logged in' });
  }
  reply.clearCookie('jwt-token', {
    path: '/', // Defina o mesmo caminho onde o cookie foi definido
    httpOnly: true, // Garante que o cookie só seja acessível através de HTTP/S
    secure: process.env.NODE_ENV === 'production', // Apenas seguro em produção
    sameSite: 'Strict' // Restringe o envio do cookie em solicitações cross-site
  });
  reply.code(200).send({ message: 'Logged out successfully' });
} 