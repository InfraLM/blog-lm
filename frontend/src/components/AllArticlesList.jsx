import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { Loader2, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const AllArticlesList = ({ excludeIds = [] }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // recent, oldest, title

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const articlesPerPage = 9;

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, [currentPage, selectedCategory, sortBy, excludeIds]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: articlesPerPage,
        ...(selectedCategory && { categoria: selectedCategory }),
        ...(sortBy && { sort: sortBy }),
        ...(excludeIds.length > 0 && { excludeIds: excludeIds.join(',') })
      });

      const response = await fetch(`${API_URL}/api/articles?${params}`);
      const data = await response.json();

      if (data.success) {
        setArticles(data.data);
        setTotalPages(Math.ceil(data.total / articlesPerPage));
      }
    } catch (error) {
      console.error('Erro ao carregar artigos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="mt-12">
      {/* Cabeçalho da seção */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Todos os Artigos
        </h2>
        <p className="text-gray-600">
          Explore nossa biblioteca completa de conteúdo médico
        </p>
      </div>

      {/* Filtros e Ordenação */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Filtro por Categoria */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Todas as categorias</option>
                {categories.map((cat) => (
                  <option key={cat.categoria} value={cat.categoria}>
                    {cat.categoria} ({cat.total})
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenação */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="recent">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
                <option value="title">Título (A-Z)</option>
                <option value="views">Mais visualizados</option>
              </select>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="text-sm text-gray-500">
            Página {currentPage} de {totalPages} 
            {selectedCategory && ` • Categoria: ${selectedCategory}`}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
            <p className="text-gray-600">Carregando artigos...</p>
          </div>
        </div>
      )}

      {/* Grid de Artigos */}
      {!loading && articles.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Estado vazio */}
      {!loading && articles.length === 0 && (
        <div className="bg-white rounded-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum artigo encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            {selectedCategory 
              ? `Não há artigos na categoria "${selectedCategory}".`
              : 'Não há artigos disponíveis no momento.'
            }
          </p>
          {selectedCategory && (
            <button
              onClick={() => handleCategoryChange('')}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Ver todos os artigos
            </button>
          )}
        </div>
      )}

      {/* Paginação */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {getPaginationRange().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg border ${
                    currentPage === page
                      ? 'bg-red-600 text-white border-red-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AllArticlesList;
