// Função para criar/atualizar estrutura da tabela
const updateDatabaseStructure = async () => {
  const client = await pool.connect();
  try {
    // Adicionar novas colunas se não existirem
    await client.query(`
      ALTER TABLE blog_artigos 
      ADD COLUMN IF NOT EXISTS coautor VARCHAR(255),
      ADD COLUMN IF NOT EXISTS resumo TEXT,
      ADD COLUMN IF NOT EXISTS destaque BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS imagem_principal TEXT,
      ADD COLUMN IF NOT EXISTS tempo_leitura INTEGER DEFAULT 5,
      ADD COLUMN IF NOT EXISTS visualizacoes INTEGER DEFAULT 0
    `);

    // Criar índices para melhorar performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_blog_artigos_destaque 
      ON blog_artigos(destaque, created_at DESC)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_blog_artigos_titulo_gin 
      ON blog_artigos USING gin(to_tsvector('portuguese', titulo))
    `);

    console.log('✅ Estrutura do banco atualizada com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar estrutura:', error);
  } finally {
    client.release();
  }
};

// Chamar ao iniciar
updateDatabaseStructure();

module.exports = { pool, updateDatabaseStructure };