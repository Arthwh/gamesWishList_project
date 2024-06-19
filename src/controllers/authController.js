export const getLoginPage = async (request, reply) => {
  return reply.sendFile('login-page.html'); // Fastify vai buscar esse arquivo na pasta 'public' configurada no app.js
};