// src/services/api.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Função auxiliar para fazer requests
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// Serviços da API
export const articleService = {
  // Buscar todos os artigos
  async getAll(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_URL}/articles${queryParams ? `?${queryParams}` : ''}`;
      
      console.log('📋 Buscando artigos:', url);
      
      const response = await fetchWithTimeout(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Artigos recebidos:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar artigos:', error);
      throw error;
    }
  },

  // Buscar artigo por ID
  async getById(id) {
    try {
      console.log(`🔍 Buscando artigo ID: ${id}`);
      
      const response = await fetchWithTimeout(`${API_URL}/articles/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Artigo recebido:', data);
      return data;
    } catch (error) {
      console.error(`❌ Erro ao buscar artigo ${id}:`, error);
      throw error;
    }
  },

  // Buscar artigo por slug
  async getBySlug(slug) {
    try {
      console.log(`🔍 Buscando artigo por slug: ${slug}`);
      
      const response = await fetchWithTimeout(`${API_URL}/articles/slug/${slug}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Artigo recebido:', data);
      return data;
    } catch (error) {
      console.error(`❌ Erro ao buscar artigo ${slug}:`, error);
      throw error;
    }
  },

  // Buscar artigo em destaque principal
  async getFeaturedMain() {
    try {
      console.log('⭐ Buscando artigo em destaque principal...');
      
      const response = await fetchWithTimeout(`${API_URL}/articles/featured-main`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Artigo em destaque recebido:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar artigo em destaque:', error);
      throw error;
    }
  },

  // Buscar artigos recentes
  async getRecent(limit = 3, excludeId = null) {
    try {
      console.log('📰 Buscando artigos recentes...');
      
      const params = new URLSearchParams({ limit: limit.toString() });
      if (excludeId) {
        params.append('excludeId', excludeId.toString());
      }
      
      const response = await fetchWithTimeout(`${API_URL}/articles/recent?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Artigos recentes recebidos:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar artigos recentes:', error);
      throw error;
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

  // Buscar categorias
  async getCategories() {
    try {
      console.log('📂 Buscando categorias...');
      
      const response = await fetchWithTimeout(`${API_URL}/articles/categories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Categorias recebidas:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar categorias:', error);
      throw error;
    }
  },
};

// Hook personalizado para usar com React
export const useApi = () => {
  return {
    articleService,
    isOnline: navigator.onLine,
    apiUrl: API_URL
  };
};

export default articleService;