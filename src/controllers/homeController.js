export const getHomePage = async (request, reply) => {
  return reply.sendFile('index.html');
};
