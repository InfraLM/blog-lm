// src/components/ArticleList.jsx
import React, { useState, useEffect } from 'react';
import { articleService } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ArticleCard from './ArticleCard';

const ArticleList = ({ 
  categoria = null, 
  destaque = null, 
  limit = 20,
  showPagination = true,
  className = ""
}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: limit,
    total: 0,
    totalPages: 0
  });
  const [meta, setMeta] = useState({});

  // Função para buscar artigos
  const fetchArticles = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Buscando artigos...', { categoria, destaque, page, limit });
      
      const filters = {
        page,
        limit,
        ...(categoria && { categoria }),
        ...(destaque !== null && { destaque: destaque.toString() })
      };
      
      const response = await articleService.getAll(filters);
      
      if (response.success) {
        setArticles(response.data || []);
        setPagination(response.pagination || { page: 1, limit, total: 0, totalPages: 0 });
        setMeta(response.meta || {});
        
        console.log(`✅ ${response.data?.length || 0} artigos carregados`);
        
        if (response.meta?.fallback) {
          console.log('⚠️ Usando dados de fallback - verifique a conexão com a API');
        }
      } else {
        throw new Error(response.message || 'Erro ao buscar artigos');
      }
      
    } catch (err) {
      console.error('❌ Erro ao carregar artigos:', err);
      setError(err.message || 'Erro ao carregar artigos');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Carregar artigos quando o componente montar ou filtros mudarem
  useEffect(() => {
    fetchArticles(1);
  }, [categoria, destaque, limit]);

  // Função para mudar página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchArticles(newPage);
      
      // Scroll para o topo da lista
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Função para retry
  const handleRetry = () => {
    fetchArticles(pagination.page);
  };

  if (loading) {
    return (
      <div className={`article-list ${className}`}>
        <LoadingSpinner message="Carregando artigos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`article-list ${className}`}>
        <div className="error-container bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Erro ao carregar artigos
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className={`article-list ${className}`}>
        <div className="empty-state text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Nenhum artigo encontrado
          </h3>
          <p className="text-gray-500">
            {categoria 
              ? `Não há artigos na categoria "${categoria}" no momento.`
              : 'Não há artigos disponíveis no momento.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`article-list ${className}`}>
      {/* Header com informações */}
      <div className="list-header mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {categoria ? `Artigos de ${categoria}` : 'Artigos'}
              {destaque && ' em Destaque'}
            </h2>
            <p className="text-gray-600 mt-1">
              {pagination.total} {pagination.total === 1 ? 'artigo encontrado' : 'artigos encontrados'}
            </p>
          </div>
          
          {/* Status indicator */}
          {meta.fallback && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-1 text-sm text-yellow-700">
              ⚠️ Modo offline
            </div>
          )}
          
          {meta.cached && (
            <div className="bg-blue-100 border border-blue-300 rounded-lg px-3 py-1 text-sm text-blue-700">
              ⚡ Em cache
            </div>
          )}
        </div>
      </div>

      {/* Lista de artigos */}
      <div className="articles-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard 
            key={article.id} 
            article={article}
            showCategory={!categoria}
          />
        ))}
      </div>

      {/* Paginação */}
      {showPagination && pagination.totalPages > 1 && (
        <div className="pagination mt-8 flex justify-center items-center space-x-2">
          {/* Botão anterior */}
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>

          {/* Números das páginas */}
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            let pageNum;
            if (pagination.totalPages <= 5) {
              pageNum = i + 1;
            } else if (pagination.page <= 3) {
              pageNum = i + 1;
            } else if (pagination.page >= pagination.totalPages - 2) {
              pageNum = pagination.totalPages - 4 + i;
            } else {
              pageNum = pagination.page - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-2 rounded-lg border ${
                  pageNum === pagination.page
                    ? 'bg-red-600 text-white border-red-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Botão próximo */}
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próximo →
          </button>
        </div>
      )}

      {/* Informações de debug (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
          <details>
            <summary className="cursor-pointer font-semibold">Debug Info</summary>
            <div className="mt-2 space-y-1">
              <div>Página atual: {pagination.page}</div>
              <div>Total de páginas: {pagination.totalPages}</div>
              <div>Total de artigos: {pagination.total}</div>
              <div>Artigos por página: {pagination.limit}</div>
              <div>Cache: {meta.cached ? 'Sim' : 'Não'}</div>
              <div>Fallback: {meta.fallback ? 'Sim' : 'Não'}</div>
              <div>Timestamp: {meta.timestamp}</div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default ArticleList;
