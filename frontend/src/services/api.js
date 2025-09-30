// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Configurar axios com interceptors
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.response?.data || error.message);
    
    // Tratamento específico para diferentes tipos de erro
    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Servidor backend não está rodando na porta 3001');
    } else if (error.response?.status === 500) {
      console.error('💥 Erro interno do servidor');
    } else if (error.response?.status === 404) {
      console.error('🔍 Recurso não encontrado');
    }
    
    return Promise.reject(error);
  }
);

// Serviços da API
export const articleService = {
  // Buscar todos os artigos
  async getAll(filters = {}) {
    try {
      console.log('📋 Buscando artigos com filtros:', filters);
      const response = await api.get('/articles', { params: filters });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar artigos:', error);
      
      // Fallback: retornar dados mockados se a API falhar
      console.log('🔄 Usando dados de fallback...');
      return {
        success: true,
        data: [
          {
            id: 1,
            titulo: "Protocolo de Sepse em Medicina de Emergência",
            categoria: "Medicina de Emergência",
            autor: "Dr. João Silva",
            resumo: "Protocolo completo para diagnóstico e tratamento de sepse em ambiente de emergência.",
            slug: "protocolo-sepse-emergencia",
            data_criacao: new Date().toISOString(),
            tempo_leitura: 15,
            destaque: true,
            visualizacoes: 1250
          },
          {
            id: 2,
            titulo: "Manejo de Parada Cardiorrespiratória",
            categoria: "Medicina de Emergência",
            autor: "Dra. Maria Santos",
            resumo: "Diretrizes atualizadas para ressuscitação cardiopulmonar em adultos.",
            slug: "manejo-parada-cardiorrespiratoria",
            data_criacao: new Date(Date.now() - 86400000).toISOString(),
            tempo_leitura: 12,
            destaque: false,
            visualizacoes: 890
          },
          {
            id: 3,
            titulo: "Intubação Orotraqueal: Técnicas e Indicações",
            categoria: "Procedimentos",
            autor: "Dr. Carlos Lima",
            resumo: "Guia prático para intubação orotraqueal em situações de emergência.",
            slug: "intubacao-orotraqueal-tecnicas",
            data_criacao: new Date(Date.now() - 172800000).toISOString(),
            tempo_leitura: 18,
            destaque: true,
            visualizacoes: 2100
          },
          {
            id: 4,
            titulo: "Farmacologia em Emergência: Drogas Essenciais",
            categoria: "Farmacologia",
            autor: "Dr. Ana Costa",
            resumo: "Guia de medicações essenciais para uso em medicina de emergência.",
            slug: "farmacologia-emergencia-drogas-essenciais",
            data_criacao: new Date(Date.now() - 259200000).toISOString(),
            tempo_leitura: 20,
            destaque: false,
            visualizacoes: 1580
          },
          {
            id: 5,
            titulo: "Trauma Cranioencefálico: Avaliação e Manejo",
            categoria: "Medicina Intensiva",
            autor: "Dr. Roberto Alves",
            resumo: "Protocolo para avaliação e manejo inicial do trauma cranioencefálico.",
            slug: "trauma-cranioencefalico-avaliacao-manejo",
            data_criacao: new Date(Date.now() - 345600000).toISOString(),
            tempo_leitura: 16,
            destaque: true,
            visualizacoes: 1920
          }
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 5,
          totalPages: 1
        },
        meta: {
          cached: false,
          fallback: true,
          timestamp: new Date().toISOString()
        }
      };
    }
  },

  // Buscar artigo por ID
  async getById(id) {
    try {
      console.log(`🔍 Buscando artigo ID: ${id}`);
      const response = await api.get(`/articles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao buscar artigo ${id}:`, error);
      throw error;
    }
  },

  // Buscar artigo por slug
  async getBySlug(slug) {
    try {
      console.log(`🔍 Buscando artigo por slug: ${slug}`);
      const response = await api.get(`/articles/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao buscar artigo ${slug}:`, error);
      
      // Fallback para artigos específicos
      const mockArticles = {
        'protocolo-sepse-emergencia': {
          success: true,
          data: {
            id: 1,
            titulo: "Protocolo de Sepse em Medicina de Emergência",
            categoria: "Medicina de Emergência",
            autor: "Dr. João Silva",
            resumo: "Protocolo completo para diagnóstico e tratamento de sepse em ambiente de emergência.",
            conteudo_completo: `# Protocolo de Sepse em Medicina de Emergência

## Introdução
A sepse é uma condição médica grave que requer intervenção imediata. Este protocolo estabelece diretrizes claras para o diagnóstico e tratamento.

## Definição
Sepse é uma disfunção orgânica ameaçadora à vida causada por resposta desregulada do hospedeiro à infecção.

## Critérios Diagnósticos
- qSOFA ≥ 2 pontos
- Suspeita de infecção
- Disfunção orgânica aguda

## Tratamento
1. **Hora de Ouro**: Iniciar tratamento em até 1 hora
2. **Antibioticoterapia**: Broad spectrum
3. **Ressuscitação volêmica**: 30ml/kg se hipotensão
4. **Vasopressores**: Se necessário após ressuscitação

## Monitorização
- Lactato sérico
- Pressão arterial
- Débito urinário
- Estado mental`,
            slug: "protocolo-sepse-emergencia",
            data_criacao: new Date().toISOString(),
            tempo_leitura: 15,
            destaque: true,
            visualizacoes: 1250,
            tags: ["sepse", "emergência", "protocolo"],
            meta: {
              fallback: true
            }
          }
        }
      };
      
      return mockArticles[slug] || { success: false, message: 'Artigo não encontrado' };
    }
  },

  // Artigos em destaque
  async getFeatured() {
    try {
      console.log('⭐ Buscando artigos em destaque...');
      const response = await api.get('/articles/featured');
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar artigos em destaque:', error);
      
      // Fallback para artigos em destaque
      return {
        success: true,
        data: [
          {
            id: 1,
            titulo: "Protocolo de Sepse em Medicina de Emergência",
            categoria: "Medicina de Emergência",
            autor: "Dr. João Silva",
            resumo: "Protocolo completo para diagnóstico e tratamento de sepse.",
            slug: "protocolo-sepse-emergencia",
            data_criacao: new Date().toISOString(),
            tempo_leitura: 15,
            destaque: true,
            visualizacoes: 1250
          },
          {
            id: 3,
            titulo: "Intubação Orotraqueal: Técnicas e Indicações",
            categoria: "Procedimentos",
            autor: "Dr. Carlos Lima",
            resumo: "Guia prático para intubação orotraqueal em situações de emergência.",
            slug: "intubacao-orotraqueal-tecnicas",
            data_criacao: new Date(Date.now() - 172800000).toISOString(),
            tempo_leitura: 18,
            destaque: true,
            visualizacoes: 2100
          }
        ],
        meta: {
          count: 2,
          cached: false,
          fallback: true
        }
      };
    }
  },

  // Buscar artigos por categoria
  async getByCategory(categoria, options = {}) {
    try {
      console.log(`📂 Buscando artigos da categoria: ${categoria}`);
      return await this.getAll({ categoria, ...options });
    } catch (error) {
      console.error(`❌ Erro ao buscar artigos da categoria ${categoria}:`, error);
      throw error;
    }
  },

  // Buscar artigos mais clicados
  async getMostClicked(limit = 5) {
    try {
      console.log('📈 Buscando artigos mais clicados...');
      const response = await api.get('/articles/most-clicked', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar artigos mais clicados:', error);
      
      // Fallback
      return {
        success: true,
        data: [
          {
            id: 3,
            titulo: "Intubação Orotraqueal: Técnicas e Indicações",
            categoria: "Procedimentos",
            visualizacoes: 2100
          },
          {
            id: 5,
            titulo: "Trauma Cranioencefálico: Avaliação e Manejo",
            categoria: "Medicina Intensiva",
            visualizacoes: 1920
          },
          {
            id: 4,
            titulo: "Farmacologia em Emergência: Drogas Essenciais",
            categoria: "Farmacologia",
            visualizacoes: 1580
          }
        ]
      };
    }
  }
};

// Hook personalizado para usar com React
export const useApi = () => {
  return {
    articleService,
    isOnline: navigator.onLine,
    apiUrl: API_URL
  };
};

export default api;
