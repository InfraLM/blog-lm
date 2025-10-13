const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// 1. Rotas específicas (sem parâmetros dinâmicos)
router.get('/featured-main', articleController.getFeaturedMain);
router.get('/recent', articleController.getRecent);
router.get('/categories', articleController.getCategories);

// 2. Rotas com parâmetros nomeados
router.get('/search/:letter', articleController.searchByLetter);
router.get('/slug/:slug', articleController.getBySlug);
router.get('/articles/slug/:slug', async (req, res) => {
  const { slug } = req.params;
  // Busca o artigo que corresponde ao slug gerado
  const article = await Article.findOne({
    where: {
      titulo: {
        [Op.iLike]: `%${slug.replace(/-/g, ' ')}%`
      }
    }
  });
});

// 3. Rotas com parâmetros genéricos (:id pode capturar qualquer coisa)
router.get('/:id', articleController.getById);

// 4. Rota geral por último
router.get('/', articleController.getAll);

// Rotas administrativas
router.post('/', articleController.create);
router.put('/:id', articleController.update);
router.delete('/:id', articleController.delete);

module.exports = router;