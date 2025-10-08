//database.js

require('dotenv').config();
const { Pool } = require('pg');

// Configuração otimizada do pool de conexões PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { 
    rejectUnauthorized: false,
    requestCert: false,
    agent: false
  } : false,
  
  // Configurações otimizadas para conexão externa
  max: 10, // Reduzido de 20 para 10 conexões máximas
  idleTimeoutMillis: 60000, // 60 segundos (aumentado de 30s)
  connectionTimeoutMillis: 10000, // 10 segundos (aumentado de 2s)
  acquireTimeoutMillis: 60000, // 60 segundos para adquirir conexão
  createTimeoutMillis: 30000, // 30 segundos para criar conexão
  
  // Configurações adicionais para estabilidade
  statement_timeout: 30000, // 30 segundos para queries
  query_timeout: 30000, // 30 segundos para queries
  keepAlive: true, // Manter conexões vivas
  keepAliveInitialDelayMillis: 10000, // 10 segundos
});

// Eventos do pool com logs melhorados
pool.on('connect', (client) => {
  console.log('✅ Nova conexão estabelecida com PostgreSQL');
});

pool.on('acquire', (client) => {
  console.log('🔄 Conexão adquirida do pool');
});

pool.on('remove', (client) => {
  console.log('🗑️ Conexão removida do pool');
});

pool.on('error', (err, client) => {
  console.error('❌ Erro no pool de conexões PostgreSQL:', err.message);
  console.error('📊 Detalhes do pool:', {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  });
});

// Função para testar conectividade
const testConnection = async () => {
  let client;
  try {
    console.log('🔍 Testando conectividade com o banco...');
    client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Teste de conectividade bem-sucedido:', result.rows[0].current_time);
    return true;
  } catch (error) {
    console.error('❌ Falha no teste de conectividade:', error.message);
    return false;
  } finally {
    if (client) client.release();
  }
};

// Função para conectar com retry
const connectWithRetry = async (retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log(`✅ Conexão estabelecida na tentativa ${i + 1}`);
      return client;
    } catch (error) {
      console.log(`⚠️ Tentativa ${i + 1}/${retries} falhou: ${error.message}`);
      
      if (i === retries - 1) {
        console.error('❌ Todas as tentativas de conexão falharam');
        throw error;
      }
      
      const waitTime = delay * (i + 1);
      console.log(`⏳ Aguardando ${waitTime}ms antes da próxima tentativa...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

// Função para criar/atualizar estrutura da tabela (com retry)
const updateDatabaseStructure = async () => {
  let client;
  try {
    console.log('🔧 Iniciando atualização da estrutura do banco...');
    client = await connectWithRetry(3, 2000);
    
    // Verificar se a tabela existe
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'blog_artigos'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('⚠️ Tabela blog_artigos não existe. Pulando atualização de estrutura.');
      return;
    }

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
    console.error('⚠️ Erro ao atualizar estrutura do banco (não crítico):', error.message);
    console.error('💡 O servidor continuará funcionando sem as atualizações de estrutura');
  } finally {
    if (client) {
      client.release();
      console.log('🔄 Conexão liberada de volta ao pool');
    }
  }
};

// Função para obter estatísticas do pool
const getPoolStats = () => {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  };
};

// Função para graceful shutdown
const closePool = async () => {
  try {
    console.log('🔄 Fechando pool de conexões...');
    await pool.end();
    console.log('✅ Pool de conexões fechado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao fechar pool:', error.message);
  }
};

// Executar atualização de estrutura apenas se não for um teste
if (process.env.NODE_ENV !== 'test') {
  // Aguardar um pouco antes de tentar atualizar a estrutura
  setTimeout(() => {
    updateDatabaseStructure();
  }, 1000);
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Recebido SIGINT, fechando aplicação...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Recebido SIGTERM, fechando aplicação...');
  await closePool();
  process.exit(0);
});

module.exports = { 
  pool, 
  updateDatabaseStructure, 
  testConnection, 
  connectWithRetry, 
  getPoolStats, 
  closePool 
};
