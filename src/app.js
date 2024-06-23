import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fastifyStatic from '@fastify/static';
import homeRoutes from './routes/homeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import authRoutes from './routes/authRoutes.js';
import gamesRoutes from './routes/gamesRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify({
  logger: true
});

app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/',
});

app.register(fastifyCookie);
app.register(homeRoutes);
app.register(userRoutes);
app.register(apiRoutes);
app.register(authRoutes);
app.register(gamesRoutes);
export default app;