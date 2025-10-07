require('dotenv').config();
const { Pool } = require('pg');

// Configuração do pool de conexões PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20, // máximo de conexões no pool
  idleTimeoutMillis: 30000, // tempo limite para conexões inativas
  connectionTimeoutMillis: 2000, // tempo limite para estabelecer conexão
});

// Teste de conexão
pool.on('connect', () => {
  console.log('✅ Conectado ao banco PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erro no pool de conexões:', err);
  process.exit(-1);
});

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
