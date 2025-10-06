const pool = require('../config/database').pool;
const NodeCache = require('node-cache');

// Cache com TTL de 5 minutos
const cache = new NodeCache({ stdTTL: 300 });

class ArticleController {
  // Listar todos os artigos com filtros
  async getAll(req, res) {
    try {
      const { 
        categoria, 
        status = 'publicado', 
        limit = 10, 
        offset = 0,
        destaque,
        search 
      } = req.query;

      let query = 'SELECT * FROM blog_artigos WHERE 1=1';
      const params = [];
      let paramCount = 0;

      if (status) {
        params.push(status);
        query += ` AND status = $${++paramCount}`;
      }

      if (categoria) {
        params.push(categoria);
        query += ` AND categoria = $${++paramCount}`;
      }

      if (destaque !== undefined) {
        params.push(destaque === 'true');
        query += ` AND destaque = $${++paramCount}`;
      }

      if (search) {
        params.push(`%${search}%`);
        query += ` AND (titulo ILIKE $${++paramCount} OR resumo ILIKE $${paramCount})`;
      }

      query += ` ORDER BY created_at DESC`;
      params.push(limit);
      query += ` LIMIT $${++paramCount}`;
      params.push(offset);
      query += ` OFFSET $${++paramCount}`;

      const result = await pool.query(query, params);
      
      res.json({
        success: true,
        data: result.rows,
        total: result.rowCount
      });
    } catch (error) {
      console.error('Erro ao buscar artigos:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao buscar artigos' 
      });
    }
  }

  // Buscar artigo em destaque principal
  async getFeaturedMain(req, res) {
    try {
      const cacheKey = 'featured-main';
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        return res.json({ success: true, data: cachedData });
      }

      const query = `
        SELECT id, titulo, slug, categoria, autor, coautor, resumo, 
               imagem_principal, created_at, tempo_leitura, content
        FROM blog_artigos 
        WHERE destaque = true AND status = 'publicado'
        ORDER BY created_at DESC
        LIMIT 1
      `;
      
      const result = await pool.query(query);
      const data = result.rows[0] || null;
      
      cache.set(cacheKey, data);
      res.json({ success: true, data });
    } catch (error) {
      console.error('Erro ao buscar destaque:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao buscar artigo em destaque' 
      });
    }
  }

  // Buscar últimos 3 artigos
  async getRecent(req, res) {
    try {
      const { excludeId } = req.query;
      const cacheKey = `recent-${excludeId || 'all'}`;
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        return res.json({ success: true, data: cachedData });
      }

      let query = `
        SELECT id, titulo, slug, categoria, autor, coautor, resumo, 
               imagem_principal, created_at, tempo_leitura
        FROM blog_artigos 
        WHERE status = 'publicado'
      `;
      
      const params = [];
      if (excludeId) {
        params.push(excludeId);
        query += ` AND id != $1`;
      }
      
      query += ` ORDER BY created_at DESC LIMIT 3`;
      
      const result = await pool.query(query, params);
      
      cache.set(cacheKey, result.rows);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Erro ao buscar recentes:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao buscar artigos recentes' 
      });
    }
  }

  // Buscar por letra inicial
  async searchByLetter(req, res) {
    try {
      const { letter } = req.params;
      
      if (!letter || letter.length !== 1) {
        return res.status(400).json({ 
          success: false, 
          error: 'Letra inválida' 
        });
      }

      const query = `
        SELECT DISTINCT id, titulo, slug, categoria, autor, coautor, 
               resumo, imagem_principal, created_at, tempo_leitura
        FROM blog_artigos
        WHERE status = 'publicado'
          AND (
            LOWER(categoria) LIKE LOWER($1) 
            OR EXISTS (
              SELECT 1 FROM unnest(string_to_array(LOWER(titulo), ' ')) AS word
              WHERE word LIKE LOWER($1)
            )
          )
        ORDER BY created_at DESC
        LIMIT 20
      `;
      
      const result = await pool.query(query, [`${letter}%`]);
      
      res.json({ 
        success: true, 
        data: result.rows,
        letter: letter.toUpperCase()
      });
    } catch (error) {
      console.error('Erro na busca por letra:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro na busca por letra' 
      });
    }
  }

  // Buscar por slug
  async getBySlug(req, res) {
    try {
      const { slug } = req.params;
      const cacheKey = `article-${slug}`;
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        return res.json({ success: true, data: cachedData });
      }

      const query = `
        SELECT * FROM blog_artigos 
        WHERE slug = $1 AND status = 'publicado'
        LIMIT 1
      `;
      
      const result = await pool.query(query, [slug]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Artigo não encontrado' 
        });
      }

      // Incrementar visualizações
      await pool.query(
        'UPDATE blog_artigos SET visualizacoes = COALESCE(visualizacoes, 0) + 1 WHERE id = $1',
        [result.rows[0].id]
      );

      cache.set(cacheKey, result.rows[0]);
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Erro ao buscar artigo:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao buscar artigo' 
      });
    }
  }

  // Buscar por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const query = 'SELECT * FROM blog_artigos WHERE id = $1';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Artigo não encontrado' 
        });
      }

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Erro ao buscar artigo:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao buscar artigo' 
      });
    }
  }

  // Listar categorias
  async getCategories(req, res) {
    try {
      const query = `
        SELECT categoria, COUNT(*) as total 
        FROM blog_artigos 
        WHERE status = 'publicado'
        GROUP BY categoria 
        ORDER BY total DESC
      `;
      
      const result = await pool.query(query);
      
      res.json({ 
        success: true, 
        data: result.rows 
      });
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao buscar categorias' 
      });
    }
  }

  // Criar artigo
  async create(req, res) {
    try {
      const {
        titulo, slug, categoria, autor, coautor,
        resumo, content, status = 'publicado',
        destaque = false, imagem_principal,
        tempo_leitura = 5
      } = req.body;

      const query = `
        INSERT INTO blog_artigos 
        (titulo, slug, categoria, autor, coautor, resumo, content, 
         status, destaque, imagem_principal, tempo_leitura)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;
      
      const values = [
        titulo, slug, categoria, autor, coautor,
        resumo, content, status, destaque, 
        imagem_principal, tempo_leitura
      ];
      
      const result = await pool.query(query, values);
      
      // Limpar cache
      cache.flushAll();
      
      res.status(201).json({ 
        success: true, 
        data: result.rows[0] 
      });
    } catch (error) {
      console.error('Erro ao criar artigo:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao criar artigo' 
      });
    }
  }

  // Atualizar artigo
  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const setClause = [];
      const values = [];
      let paramCount = 1;
      
      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
      
      values.push(id);
      
      const query = `
        UPDATE blog_artigos 
        SET ${setClause.join(', ')}, updated_at = NOW()
        WHERE id = $${paramCount}
        RETURNING *
      `;
      
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Artigo não encontrado' 
        });
      }

      // Limpar cache
      cache.flushAll();

      res.json({ 
        success: true, 
        data: result.rows[0] 
      });
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao atualizar artigo' 
      });
    }
  }

  // Deletar/Arquivar artigo
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const query = `
        UPDATE blog_artigos 
        SET status = 'arquivado', updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Artigo não encontrado' 
        });
      }

      // Limpar cache
      cache.flushAll();

      res.json({ 
        success: true, 
        message: 'Artigo arquivado com sucesso',
        data: result.rows[0] 
      });
    } catch (error) {
      console.error('Erro ao arquivar:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao arquivar artigo' 
      });
    }
  }
}

module.exports = new ArticleController();