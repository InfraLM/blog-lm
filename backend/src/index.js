const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const articlesRouter = require('./routes/articles');

const app = express();
const PORT = process.env.PORT || 3001;

// BASE PATH - Prefixo para todas as rotas (ex: /home-e-blog-lm)
// Em desenvolvimento: vazio (rotas em /api/articles)
// Em produção: /home-e-blog-lm (rotas em /home-e-blog-lm/api/articles)
const BASE_PATH = process.env.BASE_PATH || '';

// Middleware de segurança
app.use(helmet());
app.use(compression());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rotas - COM BASE_PATH
app.use(`${BASE_PATH}/api/articles`, articlesRouter);

// Health check - COM BASE_PATH
app.get(`${BASE_PATH}/health`, (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    basePath: BASE_PATH || '(raiz)'
  });
});

// Root do BASE_PATH - Informações da API
if (BASE_PATH) {
  app.get(BASE_PATH, (req, res) => {
    res.json({
      message: 'Blog Liberdade Médica API',
      version: '1.0.0',
      basePath: BASE_PATH,
      endpoints: {
        health: `${BASE_PATH}/health`,
        articles: `${BASE_PATH}/api/articles`,
        featuredMain: `${BASE_PATH}/api/articles/featured-main`,
        recent: `${BASE_PATH}/api/articles/recent`,
        categories: `${BASE_PATH}/api/articles/categories`
      }
    });
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Rota não encontrada',
    path: req.path,
    basePath: BASE_PATH || '(raiz)'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erro interno do servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📦 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Base path: ${BASE_PATH || '(raiz)'}`);
  if (BASE_PATH) {
    console.log(`✅ API disponível em: ${BASE_PATH}/api/articles`);
    console.log(`✅ Health check em: ${BASE_PATH}/health`);
  } else {
    console.log(`✅ API disponível em: /api/articles`);
    console.log(`✅ Health check em: /health`);
  }
});

module.exports = app;

