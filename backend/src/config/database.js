const { Pool } = require('pg');
require('dotenv').config();

// Configuração do banco de dados PostgreSQL
const dbConfig = {
  host: process.env.DB_HOST || '35.199.101.38',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'liberdade-medica',
  user: process.env.DB_USER || 'vinilean',
  password: process.env.DB_PASSWORD || '-Infra55LM-',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  
  // Configurações de pool
  max: 20, // Máximo de conexões no pool
  idleTimeoutMillis: 30000, // Tempo limite para conexões inativas
  connectionTimeoutMillis: 2000, // Tempo limite para estabelecer conexão
  
  // Configurações de retry
  retryAttempts: 3,
  retryDelay: 1000
};

// Criar pool de conexões
const pool = new Pool(dbConfig);

// Event listeners para monitoramento
pool.on('connect', (client) => {
  console.log('🔗 Nova conexão estabelecida com o banco de dados');
});

pool.on('error', (err, client) => {
  console.error('❌ Erro inesperado no cliente do banco:', err);
  process.exit(-1);
});

// Função para testar conexão
async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    console.log('✅ Conexão com banco de dados estabelecida:', {
      time: result.rows[0].current_time,
      version: result.rows[0].version.split(' ')[0]
    });
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com banco de dados:', error.message);
    return false;
  }
}

// Função para executar queries com retry
async function query(text, params = []) {
  let attempts = 0;
  const maxAttempts = dbConfig.retryAttempts;
  
  while (attempts < maxAttempts) {
    try {
      const start = Date.now();
      const result = await pool.query(text, params);
      const duration = Date.now() - start;
      
      // Log para queries lentas (> 1 segundo)
      if (duration > 1000) {
        console.warn(`⚠️ Query lenta detectada (${duration}ms):`, text.substring(0, 100));
      }
      
      return result;
    } catch (error) {
      attempts++;
      console.error(`❌ Erro na query (tentativa ${attempts}/${maxAttempts}):`, error.message);
      
      if (attempts >= maxAttempts) {
        throw error;
      }
      
      // Aguardar antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, dbConfig.retryDelay * attempts));
    }
  }
}

// Função para executar transações
async function transaction(callback) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Função para obter estatísticas do pool
function getPoolStats() {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  };
}

// Função para fechar todas as conexões
async function closePool() {
  try {
    await pool.end();
    console.log('🔒 Pool de conexões fechado');
  } catch (error) {
    console.error('❌ Erro ao fechar pool:', error.message);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Recebido SIGINT, fechando conexões...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Recebido SIGTERM, fechando conexões...');
  await closePool();
  process.exit(0);
});

module.exports = {
  pool,
  query,
  transaction,
  testConnection,
  getPoolStats,
  closePool
};
