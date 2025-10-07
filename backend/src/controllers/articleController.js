const { pool } = require('../config/database');

// Função auxiliar para executar queries com retry
const executeQuery = async (query, params = []) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(query, params);
    return result;
  } finally {
    if (client) client.release();
  }
};

// Buscar todos os artigos com paginação e filtros
const getAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      categoria,
      sort = 'recent',
      excludeIds
    } = req.query;

    const offset = (page - 1) * limit;
    let whereClause = '';
    let orderClause = '';
    const queryParams = [];
    let paramIndex = 1;

    // Filtro por categoria
    if (categoria) {
      whereClause += ` AND categoria = $${paramIndex}`;
      queryParams.push(categoria);
      paramIndex++;
    }

    // Excluir IDs específicos
    if (excludeIds) {
      const idsArray = excludeIds.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      if (idsArray.length > 0) {
        whereClause += ` AND id NOT IN (${idsArray.map(() => `$${paramIndex++}`).join(',')})`;
        queryParams.push(...idsArray);
      }
    }

    // Ordenação
    switch (sort) {
      case 'oldest':
        orderClause = 'ORDER BY created_at ASC';
        break;
      case 'title':
        orderClause = 'ORDER BY titulo ASC';
        break;
      case 'views':
        orderClause = 'ORDER BY visualizacoes DESC, created_at DESC';
        break;
      case 'recent':
      default:
        orderClause = 'ORDER BY created_at DESC';
        break;
    }

    // Query para contar total
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM blog_artigos 
      WHERE 1=1 ${whereClause}
    `;

    // Query para buscar artigos
    const articlesQuery = `
      SELECT 
        id, titulo, resumo, categoria, autor, coautor,
        imagem_principal, tempo_leitura, visualizacoes,
        destaque, created_at, updated_at,
        CASE 
          WHEN LENGTH(titulo) > 50 THEN LOWER(REPLACE(REPLACE(REPLACE(titulo, ' ', '-'), 'ç', 'c'), 'ã', 'a'))
          ELSE LOWER(REPLACE(titulo, ' ', '-'))
        END as slug
      FROM blog_artigos 
      WHERE 1=1 ${whereClause}
      ${orderClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(parseInt(limit), parseInt(offset));

    // Executar queries
    const [countResult, articlesResult] = await Promise.all([
      executeQuery(countQuery, queryParams.slice(0, -2)),
      executeQuery(articlesQuery, queryParams)
    ]);

    const total = parseInt(countResult.rows[0].total);
    const articles = articlesResult.rows;

    res.json({
      success: true,
      data: articles,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Erro ao buscar artigos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

// Buscar artigo em destaque principal
const getFeaturedMain = async (req, res) => {
  try {
    const query = `
      SELECT 
        id, titulo, resumo, categoria, autor, coautor,
        imagem_principal, tempo_leitura, visualizacoes,
        destaque, created_at, updated_at,
        CASE 
          WHEN LENGTH(titulo) > 50 THEN LOWER(REPLACE(REPLACE(REPLACE(titulo, ' ', '-'), 'ç', 'c'), 'ã', 'a'))
          ELSE LOWER(REPLACE(titulo, ' ', '-'))
        END as slug
      FROM blog_artigos 
      WHERE destaque = true 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    const result = await executeQuery(query);

    if (result.rows.length > 0) {
      res.json({
        success: true,
        data: result.rows[0]
      });
    } else {
      // Se não há destaque, pegar o mais recente
      const fallbackQuery = `
        SELECT 
          id, titulo, resumo, categoria, autor, coautor,
          imagem_principal, tempo_leitura, visualizacoes,
          destaque, created_at, updated_at,
          CASE 
            WHEN LENGTH(titulo) > 50 THEN LOWER(REPLACE(REPLACE(REPLACE(titulo, ' ', '-'), 'ç', 'c'), 'ã', 'a'))
            ELSE LOWER(REPLACE(titulo, ' ', '-'))
          END as slug
        FROM blog_artigos 
        ORDER BY created_at DESC 
        LIMIT 1
      `;

      const fallbackResult = await executeQuery(fallbackQuery);

      res.json({
        success: true,
        data: fallbackResult.rows[0] || null
      });
    }

  } catch (error) {
    console.error('Erro ao buscar artigo em destaque:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

// Buscar artigos recentes
const getRecent = async (req, res) => {
  try {
    const { limit = 3, excludeId } = req.query;
    let whereClause = '';
    const queryParams = [];

    if (excludeId) {
      whereClause = 'WHERE id != $1';
      queryParams.push(parseInt(excludeId));
    }

    const query = `
      SELECT 
        id, titulo, resumo, categoria, autor, coautor,
        imagem_principal, tempo_leitura, visualizacoes,
        destaque, created_at, updated_at,
        CASE 
          WHEN LENGTH(titulo) > 50 THEN LOWER(REPLACE(REPLACE(REPLACE(titulo, ' ', '-'), 'ç', 'c'), 'ã', 'a'))
          ELSE LOWER(REPLACE(titulo, ' ', '-'))
        END as slug
      FROM blog_artigos 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${queryParams.length + 1}
    `;

    queryParams.push(parseInt(limit));

    const result = await executeQuery(query, queryParams);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Erro ao buscar artigos recentes:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

// Buscar por letra (manter para compatibilidade)
const searchByLetter = async (req, res) => {
  try {
    const { letter } = req.params;

    if (!letter || letter.length !== 1) {
      return res.status(400).json({
        success: false,
        error: 'Letra inválida'
      });
    }

    const query = `
      SELECT 
        id, titulo, resumo, categoria, autor, coautor,
        imagem_principal, tempo_leitura, visualizacoes,
        destaque, created_at, updated_at,
        CASE 
          WHEN LENGTH(titulo) > 50 THEN LOWER(REPLACE(REPLACE(REPLACE(titulo, ' ', '-'), 'ç', 'c'), 'ã', 'a'))
          ELSE LOWER(REPLACE(titulo, ' ', '-'))
        END as slug
      FROM blog_artigos 
      WHERE UPPER(LEFT(titulo, 1)) = UPPER($1)
      ORDER BY titulo ASC
    `;

    const result = await executeQuery(query, [letter]);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Erro ao buscar por letra:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

// Buscar por slug
const getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const query = `
      SELECT 
        id, titulo, resumo, categoria, autor, coautor,
        imagem_principal, tempo_leitura, visualizacoes,
        destaque, created_at, updated_at, conteudo_completo
      FROM blog_artigos 
      WHERE LOWER(REPLACE(titulo, ' ', '-')) = LOWER($1)
      LIMIT 1
    `;

    const result = await executeQuery(query, [slug]);

    if (result.rows.length > 0) {
      // Incrementar visualizações
      const updateQuery = `
        UPDATE blog_artigos 
        SET visualizacoes = COALESCE(visualizacoes, 0) + 1 
        WHERE id = $1
      `;
      await executeQuery(updateQuery, [result.rows[0].id]);

      res.json({
        success: true,
        data: result.rows[0]
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Artigo não encontrado'
      });
    }

  } catch (error) {
    console.error('Erro ao buscar artigo por slug:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

// Buscar por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        id, titulo, resumo, categoria, autor, coautor,
        imagem_principal, tempo_leitura, visualizacoes,
        destaque, created_at, updated_at, conteudo_completo
      FROM blog_artigos 
      WHERE id = $1
    `;

    const result = await executeQuery(query, [parseInt(id)]);

    if (result.rows.length > 0) {
      // Incrementar visualizações
      const updateQuery = `
        UPDATE blog_artigos 
        SET visualizacoes = COALESCE(visualizacoes, 0) + 1 
        WHERE id = $1
      `;
      await executeQuery(updateQuery, [parseInt(id)]);

      res.json({
        success: true,
        data: result.rows[0]
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Artigo não encontrado'
      });
    }

  } catch (error) {
    console.error('Erro ao buscar artigo por ID:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

// Buscar categorias com contagem
const getCategories = async (req, res) => {
  try {
    const query = `
      SELECT 
        categoria,
        COUNT(*) as total
      FROM blog_artigos 
      GROUP BY categoria 
      ORDER BY categoria ASC
    `;

    const result = await executeQuery(query);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

// Criar artigo (manter para compatibilidade)
const create = async (req, res) => {
  try {
    const {
      titulo, resumo, categoria, autor, coautor,
      imagem_principal, tempo_leitura, conteudo_completo,
      destaque = false
    } = req.body;

    if (!titulo || !categoria || !autor) {
      return res.status(400).json({
        success: false,
        error: 'Título, categoria e autor são obrigatórios'
      });
    }

    const query = `
      INSERT INTO blog_artigos 
      (titulo, resumo, categoria, autor, coautor, imagem_principal, tempo_leitura, conteudo_completo, destaque)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, titulo, created_at
    `;

    const values = [
      titulo, resumo, categoria, autor, coautor,
      imagem_principal, tempo_leitura || 5, conteudo_completo, destaque
    ];

    const result = await executeQuery(query, values);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Artigo criado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao criar artigo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

// Atualizar artigo (manter para compatibilidade)
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum campo para atualizar'
      });
    }

    const allowedFields = [
      'titulo', 'resumo', 'categoria', 'autor', 'coautor',
      'imagem_principal', 'tempo_leitura', 'conteudo_completo', 'destaque'
    ];

    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.keys(updateFields).forEach(field => {
      if (allowedFields.includes(field)) {
        fields.push(`${field} = $${paramIndex}`);
        values.push(updateFields[field]);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum campo válido para atualizar'
      });
    }

    const query = `
      UPDATE blog_artigos 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING id, titulo, updated_at
    `;

    values.push(parseInt(id));

    const result = await executeQuery(query, values);

    if (result.rows.length > 0) {
      res.json({
        success: true,
        data: result.rows[0],
        message: 'Artigo atualizado com sucesso'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Artigo não encontrado'
      });
    }

  } catch (error) {
    console.error('Erro ao atualizar artigo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

// Deletar artigo (manter para compatibilidade)
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      DELETE FROM blog_artigos 
      WHERE id = $1
      RETURNING id, titulo
    `;

    const result = await executeQuery(query, [parseInt(id)]);

    if (result.rows.length > 0) {
      res.json({
        success: true,
        data: result.rows[0],
        message: 'Artigo deletado com sucesso'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Artigo não encontrado'
      });
    }

  } catch (error) {
    console.error('Erro ao deletar artigo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  getAll,
  getFeaturedMain,
  getRecent,
  searchByLetter,
  getBySlug,
  getById,
  getCategories,
  create,
  update,
  delete: deleteArticle
};
