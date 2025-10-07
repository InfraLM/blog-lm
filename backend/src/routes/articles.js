const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// Rotas para artigos
router.get('/', articleController.getAll);
router.get('/featured-main', articleController.getFeaturedMain);
router.get('/recent', articleController.getRecent);
router.get('/search/:letter', articleController.searchByLetter);
router.get('/slug/:slug', articleController.getBySlug);
router.get('/:id', articleController.getById);

// Rotas para categorias
router.get('/categories', articleController.getCategories);

// Rotas administrativas (se necessário)
router.post('/', articleController.create);
router.put('/:id', articleController.update);
router.delete('/:id', articleController.delete);

module.exports = router;