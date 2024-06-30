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

// Obter o caminho do arquivo atual e seu diretório
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Criar uma instância do Fastify
const app = fastify({
  // logger: true
});

// Registrar o plugin Fastify Static para servir arquivos estáticos
app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'), // Define o diretório raiz para arquivos estáticos
  prefix: '/', // Prefixo da URL para servir arquivos estáticos
});

// Registrar o plugin Fastify Cookie para manipulação de cookies
app.register(fastifyCookie);

// Registrar os diferentes grupos de rotas
app.register(homeRoutes);    // Rotas relacionadas à página inicial
app.register(userRoutes);    // Rotas relacionadas a usuários
app.register(apiRoutes);     // Rotas da API
app.register(authRoutes);    // Rotas de autenticação
app.register(gamesRoutes);   // Rotas relacionadas a jogos

export default app;