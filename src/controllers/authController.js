export const getLoginPage = async (request, reply) => {
  return reply.sendFile('login-page.html'); // Fastify vai buscar esse arquivo na pasta 'public' configurada no app.js
};

export const login = async (request, reply) => {
  try {
    const { username, password } = request.body;
    const { user, token } = authService.authenticate(username, password);

    // Define o token nos cookies ou envia como resposta para ser armazenado pelo cliente
    reply.setCookie('token', token, { httpOnly: true });

    reply.send({ message: 'Login successful', user });
  } catch (error) {
    reply.code(401).send({ message: error.message });
  }
};