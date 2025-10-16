// backend/src/server.js - VERSÃO CORRIGIDA PARA CPANEL
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;
let pgClient = null;
let dbConnected = false;

console.log('========================================');
console.log('🚀 Blog Liberdade Médica - Backend');
console.log('========================================');
console.log('Porta:', PORT);
console.log('Ambiente:', process.env.NODE_ENV || 'development');

// Middlewares básicos
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use(cors({
    origin: true,
    credentials: true
}));

// Conectar PostgreSQL
async function connectPostgreSQL() {
    try {
        console.log('🔄 Conectando PostgreSQL...');
        
        pgClient = new Client({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT) || 5432,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            ssl: false,
            connectionTimeoutMillis: 10000
        });
        
        await pgClient.connect();
        
        const result = await pgClient.query('SELECT version()');
        console.log('✅ PostgreSQL conectado');
        
        // Verificar se a tabela existe
        const tableCheck = await pgClient.query(`
            SELECT COUNT(*) as count 
            FROM information_schema.tables 
            WHERE table_name = 'blog_artigos'
        `);
        
        if (tableCheck.rows[0].count > 0) {
            const countResult = await pgClient.query('SELECT COUNT(*) as total FROM blog_artigos');
            console.log('📄 Artigos no banco:', countResult.rows[0].total);
            dbConnected = true;
            return true;
        } else {
            console.warn('⚠️ Tabela blog_artigos não encontrada');
            dbConnected = false;
            return false;
        }
    } catch (error) {
        console.error('❌ Erro PostgreSQL:', error.message);
        dbConnected = false;
        return false;
    }
}

// ============================================
// ROTAS - SEM PREFIXO (Passenger adiciona automaticamente)
// ============================================

// HEALTH CHECK
app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: dbConnected ? 'connected' : 'disconnected',
        environment: process.env.NODE_ENV || 'development'
    });
});

// LISTAR TODOS OS ARTIGOS
app.get('/api/articles', async (req, res) => {
    try {
        if (!dbConnected) {
            return res.status(500).json({
                success: false,
                message: 'Banco de dados desconectado',
                data: []
            });
        }

        const {
            page = 1,
            limit = 10,
            categoria,
            sort = 'recent'
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
                destaque, created_at, updated_at, slug
            FROM blog_artigos 
            WHERE 1=1 ${whereClause}
            ${orderClause}
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;

        queryParams.push(parseInt(limit), parseInt(offset));

        // Executar queries
        const countResult = await pgClient.query(countQuery, queryParams.slice(0, -2));
        const articlesResult = await pgClient.query(articlesQuery, queryParams);

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
        console.error('❌ Erro ao buscar artigos:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            data: []
        });
    }
});

// ARTIGO EM DESTAQUE PRINCIPAL
app.get('/api/articles/featured-main', async (req, res) => {
    try {
        if (!dbConnected) {
            return res.status(500).json({
                success: false,
                message: 'Banco de dados desconectado'
            });
        }

        const query = `
            SELECT 
                id, titulo, resumo, categoria, autor, coautor,
                imagem_principal, tempo_leitura, visualizacoes,
                destaque, created_at, updated_at, slug
            FROM blog_artigos 
            WHERE destaque = true 
            ORDER BY created_at DESC 
            LIMIT 1
        `;

        const result = await pgClient.query(query);

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
                    destaque, created_at, updated_at, slug
                FROM blog_artigos 
                ORDER BY created_at DESC 
                LIMIT 1
            `;

            const fallbackResult = await pgClient.query(fallbackQuery);

            res.json({
                success: true,
                data: fallbackResult.rows[0] || null
            });
        }

    } catch (error) {
        console.error('❌ Erro ao buscar artigo em destaque:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// ARTIGOS RECENTES
app.get('/api/articles/recent', async (req, res) => {
    try {
        if (!dbConnected) {
            return res.status(500).json({
                success: false,
                message: 'Banco de dados desconectado',
                data: []
            });
        }

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
                destaque, created_at, updated_at, slug
            FROM blog_artigos 
            ${whereClause}
            ORDER BY created_at DESC 
            LIMIT $${queryParams.length + 1}
        `;

        queryParams.push(parseInt(limit));

        const result = await pgClient.query(query, queryParams);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('❌ Erro ao buscar artigos recentes:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            data: []
        });
    }
});

// BUSCAR CATEGORIAS
app.get('/api/articles/categories', async (req, res) => {
    try {
        if (!dbConnected) {
            return res.status(500).json({
                success: false,
                message: 'Banco de dados desconectado',
                data: []
            });
        }

        const query = `
            SELECT 
                categoria,
                COUNT(*) as total
            FROM blog_artigos 
            GROUP BY categoria
            ORDER BY total DESC
        `;

        const result = await pgClient.query(query);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('❌ Erro ao buscar categorias:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            data: []
        });
    }
});

// BUSCAR POR SLUG
app.get('/api/articles/slug/:slug', async (req, res) => {
    try {
        if (!dbConnected) {
            return res.status(500).json({
                success: false,
                message: 'Banco de dados desconectado'
            });
        }

        let { slug } = req.params;
        
        // Decodificar e normalizar o slug
        slug = decodeURIComponent(slug)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
        
        console.log('🔍 Buscando slug:', slug);

        const query = `
            SELECT 
                id, titulo, resumo, categoria, autor, coautor,
                imagem_principal, tempo_leitura, visualizacoes,
                destaque, created_at, updated_at, content as conteudo_completo,
                slug
            FROM blog_artigos 
            WHERE slug = $1
            LIMIT 1
        `;

        const result = await pgClient.query(query, [slug]);

        if (result.rows.length > 0) {
            // Incrementar visualizações
            await pgClient.query(`
                UPDATE blog_artigos 
                SET visualizacoes = COALESCE(visualizacoes, 0) + 1 
                WHERE id = $1
            `, [result.rows[0].id]);

            res.json({
                success: true,
                data: result.rows[0]
            });
        } else {
            console.log('⚠️ Artigo não encontrado com slug:', slug);
            res.status(404).json({
                success: false,
                error: 'Artigo não encontrado'
            });
        }

    } catch (error) {
        console.error('❌ Erro ao buscar artigo por slug:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// BUSCAR POR ID
app.get('/api/articles/:id', async (req, res) => {
    try {
        if (!dbConnected) {
            return res.status(500).json({
                success: false,
                message: 'Banco de dados desconectado'
            });
        }

        const { id } = req.params;

        const query = `
            SELECT 
                id, titulo, resumo, categoria, autor, coautor,
                imagem_principal, tempo_leitura, visualizacoes,
                destaque, created_at, updated_at, content as conteudo_completo,
                slug
            FROM blog_artigos 
            WHERE id = $1
        `;

        const result = await pgClient.query(query, [parseInt(id)]);

        if (result.rows.length > 0) {
            // Incrementar visualizações
            await pgClient.query(`
                UPDATE blog_artigos 
                SET visualizacoes = COALESCE(visualizacoes, 0) + 1 
                WHERE id = $1
            `, [parseInt(id)]);

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
        console.error('❌ Erro ao buscar artigo por ID:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// 404 HANDLER
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Rota não encontrada',
        path: req.path
    });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.error('❌ Erro:', err.message);
    
    if (res.headersSent) {
        return next(err);
    }
    
    res.status(500).json({
        success: false,
        error: err.message || 'Erro interno do servidor'
    });
});

// INICIAR SERVIDOR
async function startServer() {
    try {
        await connectPostgreSQL();
        
        app.listen(PORT, () => {
            console.log('========================================');
            console.log('✅ Servidor iniciado com sucesso!');
            console.log('🌐 Porta:', PORT);
            console.log('📊 PostgreSQL:', dbConnected ? 'Conectado' : 'Desconectado');
            console.log('🔗 Health check: /health');
            console.log('🔗 API: /api/articles');
            console.log('⚠️ Passenger vai montar em: /home-e-blog-lm');
            console.log('========================================');
        });
    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error.message);
        process.exit(1);
    }
}

// ENCERRAMENTO GRACIOSO
process.on('SIGINT', async () => {
    console.log('\n🔄 Encerrando servidor...');
    if (pgClient) {
        await pgClient.end();
        console.log('✅ Conexão PostgreSQL fechada');
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🔄 Encerrando servidor...');
    if (pgClient) {
        await pgClient.end();
        console.log('✅ Conexão PostgreSQL fechada');
    }
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Erro não capturado:', error.message);
});

// INICIAR
startServer();