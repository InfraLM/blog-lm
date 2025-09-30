const { query, transaction } = require('../config/database');
const slugify = require('slugify');

class Article {
  
  // Buscar todos os artigos (SIMPLIFICADO)
  static async findAll(filters = {}) {
    let whereClause = 'WHERE status = $1';
    let params = ['publicado'];
    let paramCount = 1;
    
    // Filtro por categoria
    if (filters.categoria) {
      paramCount++;
      whereClause += ` AND categoria = $${paramCount}`;
      params.push(filters.categoria);
    }
    
    // Filtro por autor
    if (filters.autor) {
      paramCount++;
      whereClause += ` AND autor = $${paramCount}`;
      params.push(filters.autor);
    }
    
    // Busca textual simples
    if (filters.search) {
      paramCount++;
      whereClause += ` AND to_tsvector('portuguese', titulo || ' ' || content) @@ plainto_tsquery('portuguese', $${paramCount})`;
      params.push(filters.search);
    }
    
    // Ordenação
    let orderBy = 'ORDER BY data_criacao DESC';
    if (filters.orderBy === 'titulo') {
      orderBy = 'ORDER BY titulo ASC';
    }
    
    // Paginação
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    
    const sql = `
      SELECT 
        id,
        titulo,
        categoria,
        autor,
        data_criacao,
        slug,
        LEFT(content, 200) as resumo
      FROM blog_artigos
      ${whereClause}
      ${orderBy}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    
    params.push(limit, offset);
    
    const result = await query(sql, params);
    return result.rows;
  }
  
  // Buscar artigo por ID (SIMPLIFICADO)
  static async findById(id) {
    const sql = `
      SELECT 
        id,
        titulo,
        categoria,
        autor,
        data_criacao,
        data_atualizacao,
        content,
        slug
      FROM blog_artigos
      WHERE id = $1 AND status = 'publicado'
    `;
    
    const result = await query(sql, [id]);
    return result.rows[0];
  }
  
  // Buscar artigo por slug (SIMPLIFICADO)
  static async findBySlug(slug) {
    const sql = `
      SELECT 
        id,
        titulo,
        categoria,
        autor,
        data_criacao,
        data_atualizacao,
        content,
        slug
      FROM blog_artigos
      WHERE slug = $1 AND status = 'publicado'
    `;
    
    const result = await query(sql, [slug]);
    return result.rows[0];
  }
  
  // Buscar por categoria (SIMPLIFICADO)
  static async findByCategory(categoria, limit = 20, offset = 0) {
    const sql = `
      SELECT 
        id,
        titulo,
        categoria,
        autor,
        data_criacao,
        slug,
        LEFT(content, 200) as resumo
      FROM blog_artigos
      WHERE categoria = $1 AND status = 'publicado'
      ORDER BY data_criacao DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await query(sql, [categoria, limit, offset]);
    return result.rows;
  }
  
  // Criar novo artigo (SIMPLIFICADO)
  static async create(articleData) {
    return await transaction(async (client) => {
      // Gerar slug único
      let slug = slugify(articleData.titulo, { 
        lower: true, 
        strict: true,
        locale: 'pt'
      });
      
      // Verificar se slug já existe
      let slugExists = await client.query('SELECT id FROM blog_artigos WHERE slug = $1', [slug]);
      let counter = 1;
      
      while (slugExists.rows.length > 0) {
        slug = `${slugify(articleData.titulo, { lower: true, strict: true, locale: 'pt' })}-${counter}`;
        slugExists = await client.query('SELECT id FROM blog_artigos WHERE slug = $1', [slug]);
        counter++;
      }
      
      const sql = `
        INSERT INTO blog_artigos (
          titulo, slug, categoria, autor,
          data_criacao, data_atualizacao, content, status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8
        ) RETURNING *
      `;
      
      const values = [
        articleData.titulo,
        slug,
        articleData.categoria,
        articleData.autor,
        articleData.data_criacao,
        articleData.data_atualizacao,
        articleData.content,
        articleData.status || 'publicado'
      ];
      
      const result = await client.query(sql, values);
      return result.rows[0];
    });
  }
  
  // Atualizar artigo (SIMPLIFICADO)
  static async update(id, articleData) {
    const sql = `
      UPDATE blog_artigos SET
        titulo = $2,
        categoria = $3,
        autor = $4,
        data_atualizacao = $5,
        content = $6,
        status = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const values = [
      id,
      articleData.titulo,
      articleData.categoria,
      articleData.autor,
      articleData.data_atualizacao || new Date().toISOString().split('T')[0],
      articleData.content,
      articleData.status || 'publicado'
    ];
    
    const result = await query(sql, values);
    return result.rows[0];
  }
  
  // Buscar estatísticas gerais (SIMPLIFICADO)
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_artigos,
        COUNT(DISTINCT categoria) as total_categorias,
        COUNT(DISTINCT autor) as total_autores
      FROM blog_artigos 
      WHERE status = 'publicado'
    `;
    
    const result = await query(sql);
    return result.rows[0];
  }
  
  // Buscar artigos recentes (SIMPLIFICADO)
  static async findRecent(limit = 5) {
    const sql = `
      SELECT 
        id,
        titulo,
        categoria,
        autor,
        data_criacao,
        slug,
        LEFT(content, 150) as resumo
      FROM blog_artigos
      WHERE status = 'publicado'
      ORDER BY data_criacao DESC
      LIMIT $1
    `;
    
    const result = await query(sql, [limit]);
    return result.rows;
  }
  
  // Busca textual simples
  static async search(searchTerm, limit = 20) {
    const sql = `
      SELECT 
        id,
        titulo,
        categoria,
        autor,
        data_criacao,
        slug,
        LEFT(content, 200) as resumo,
        ts_rank(to_tsvector('portuguese', titulo || ' ' || content), plainto_tsquery('portuguese', $1)) as relevancia
      FROM blog_artigos
      WHERE to_tsvector('portuguese', titulo || ' ' || content) @@ plainto_tsquery('portuguese', $1)
        AND status = 'publicado'
      ORDER BY relevancia DESC, data_criacao DESC
      LIMIT $2
    `;
    
    const result = await query(sql, [searchTerm, limit]);
    return result.rows;
  }
  
  // Deletar artigo (soft delete)
  static async delete(id) {
    const sql = `
      UPDATE blog_artigos 
      SET status = 'arquivado', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await query(sql, [id]);
    return result.rows[0];
  }
}

module.exports = Article;
