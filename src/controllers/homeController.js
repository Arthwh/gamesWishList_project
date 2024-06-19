import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getHomePage = async (request, reply) => {
  return reply.sendFile('index.html'); // Fastify vai buscar esse arquivo na pasta 'public' configurada no app.js
};