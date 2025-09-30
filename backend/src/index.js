// backend/src/index.js - VERSÃO CORRIGIDA
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Iniciando servidor Blog LM...');

// Middlewares básicos
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  next();
});

// Middleware de headers de segurança
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: '🩺 Blog Liberdade Médica - API Backend',
    version: '1.0.0',
    status: 'Funcionando',
    endpoints: {
      'GET /api/articles': 'Listar todos os artigos',
      'GET /api/articles/:id': 'Buscar artigo por ID',
      'GET /api/articles/slug/:slug': 'Buscar artigo por slug',
      'GET /api/articles/featured': 'Artigos em destaque',
      'GET /health': 'Health check'
    },
    timestamp: new Date().toISOString()
  });
});

// Importar e usar rotas
try {
  console.log('📁 Carregando rotas...');
  
  // Importar rotas de artigos
  const articlesRoutes = require('./routes/articles');
  app.use('/api/articles', articlesRoutes);
  
  console.log('✅ Rotas de artigos carregadas');
  
  // Outras rotas podem ser adicionadas aqui
  // const usersRoutes = require('./routes/users');
  // app.use('/api/users', usersRoutes);
  
} catch (error) {
  console.error('❌ Erro ao carregar rotas:', error.message);
  
  // Fallback: criar rotas básicas inline se houver problema
  console.log('🔄 Criando rotas de fallback...');
  
  const ArticleController = require('./controllers/articleController');
  
  app.get('/api/articles', ArticleController.getAll);
  app.get('/api/articles/featured', ArticleController.getFeatured);
  app.get('/api/articles/:id', ArticleController.getById);
  app.get('/api/articles/slug/:slug', ArticleController.getBySlug);
  
  console.log('✅ Rotas de fallback criadas');
}

// Middleware para servir arquivos estáticos (se necessário)
const publicPath = path.join(__dirname, '../public');
app.use('/static', express.static(publicPath));

// Middleware de erro 404
app.use((req, res) => {
  console.log(`❌ 404 - Rota não encontrada: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado',
    path: req.path,
    method: req.method,
    available_endpoints: [
      'GET /api/articles',
      'GET /api/articles/:id',
      'GET /api/articles/slug/:slug',
      'GET /api/articles/featured',
      'GET /health'
    ]
  });
});

// Middleware de tratamento de erros global
app.use((error, req, res, next) => {
  console.error('💥 Erro global do servidor:', error);
  
  // Log detalhado do erro
  console.error('Stack trace:', error.stack);
  
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? {
      message: error.message,
      stack: error.stack
    } : undefined,
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log('');
  console.log('🎉 ========================================');
  console.log('🩺 Blog Liberdade Médica - Backend Online!');
  console.log('🎉 ========================================');
  console.log('');
  console.log(`🌐 Servidor rodando em: http://localhost:${PORT}`);
  console.log(`📋 Documentação: http://localhost:${PORT}/`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log('');
  console.log('📊 Endpoints disponíveis:');
  console.log(`   GET /api/articles - Listar artigos`);
  console.log(`   GET /api/articles/featured - Artigos em destaque`);
  console.log(`   GET /api/articles/:id - Buscar por ID`);
  console.log(`   GET /api/articles/slug/:slug - Buscar por slug`);
  console.log('');
  console.log('🧪 Teste rápido:');
  console.log(`   curl http://localhost:${PORT}/health`);
  console.log(`   curl http://localhost:${PORT}/api/articles`);
  console.log('');
  console.log('✅ Servidor pronto para receber requisições!');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Recebido SIGTERM, encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado graciosamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Recebido SIGINT (Ctrl+C), encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado graciosamente');
    process.exit(0);
  });
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('💥 Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Promise rejeitada não tratada:', reason);
  console.error('Promise:', promise);
  process.exit(1);
});

module.exports = app;
