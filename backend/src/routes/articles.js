// backend/src/routes/articles.js - VERSÃO CORRIGIDA
const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/articleController');

// Middleware de logging para debug
router.use((req, res, next) => {
  console.log(`📍 Rota Articles: ${req.method} ${req.path}`);
  next();
});

// Rotas específicas DEVEM vir ANTES das rotas com parâmetros
router.get('/featured', ArticleController.getFeatured);
router.get('/most-clicked', ArticleController.getMostClicked || ArticleController.getFeatured);
router.get('/stats', ArticleController.getStats || ((req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Estatísticas não implementadas ainda',
      total_artigos: 0
    }
  });
}));

// Rotas com parâmetros vêm depois
router.get('/slug/:slug', ArticleController.getBySlug);
router.get('/:id', ArticleController.getById);

// Rota principal (listar todos) vem por último
router.get('/', ArticleController.getAll);

// Middleware de tratamento de erros específico para articles
router.use((error, req, res, next) => {
  console.error('❌ Erro nas rotas de articles:', error);
  res.status(500).json({
    success: false,
    message: 'Erro interno nas rotas de artigos',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

module.exports = router;
