export const getHomePage = async (request, reply) => {
  return reply.sendFile('index.html'); // Fastify vai buscar esse arquivo na pasta 'public' configurada no app.js
};