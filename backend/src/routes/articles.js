const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// Rotas públicas de leitura
router.get('/articles', articleController.getAll);
router.get('/articles/featured-main', articleController.getFeaturedMain);
router.get('/articles/recent', articleController.getRecent);
router.get('/articles/search-by-letter/:letter', articleController.searchByLetter);
router.get('/articles/slug/:slug', articleController.getBySlug);
router.get('/articles/:id', articleController.getById);
router.get('/categories', articleController.getCategories);

// Rotas de escrita (proteger em produção)
router.post('/articles', articleController.create);
router.put('/articles/:id', articleController.update);
router.delete('/articles/:id', articleController.delete);

module.exports = router;