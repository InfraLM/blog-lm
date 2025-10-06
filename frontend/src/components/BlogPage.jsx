import React, { useState, useEffect } from 'react';
import Header from './Header';
import MainFeaturedCard from './MainFeaturedCard';
import ArticleCard from './ArticleCard';
import AlphabetSearch from './AlphabetSearch';
import { Loader2, TrendingUp, Clock, BookOpen } from 'lucide-react';

const BlogPage = () => {
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, categories: 0 });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchHomeData();
    fetchStats();
  }, []);

  const fetchHomeData = async () => {
    try {
      const featuredRes = await fetch(`${API_URL}/api/articles/featured-main`);
      const featuredData = await featuredRes.json();
      
      if (featuredData.success) {
        setFeaturedArticle(featuredData.data);
      }
      
      const excludeId = featuredData.data?.id;
      const recentRes = await fetch(
        `${API_URL}/api/articles/recent${excludeId ? `?excludeId=${excludeId}` : ''}`
      );
      const recentData = await recentRes.json();
      
      if (recentData.success) {
        setRecentArticles(recentData.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      const data = await res.json();
      if (data.success) {
        const totalArticles = data.data.reduce((acc, cat) => acc + cat.total, 0);
        setStats({
          total: totalArticles,
          categories: data.data.length
        });
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleSearch = (results, letter) => {
    setSearchResults(results);
    setSelectedLetter(letter);
  };

  const handleClearSearch = () => {
    setSearchResults(null);
    setSelectedLetter('');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
            <p className="text-gray-600">Carregando conteúdo...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Portal de Conhecimento Médico
              </h1>
              <p className="text-xl opacity-90">
                Artigos, protocolos e discussões para profissionais da saúde
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2" />
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-sm opacity-90">Artigos</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                <div className="text-3xl font-bold">{stats.categories}</div>
                <div className="text-sm opacity-90">Categorias</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-90">Disponível</div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <AlphabetSearch onSearch={handleSearch} onClear={handleClearSearch} />
          
          {searchResults ? (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Resultados para letra "{selectedLetter}"
                </h2>
                <span className="text-sm text-gray-500">
                  {searchResults.length} resultado(s)
                </span>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-8 text-center">
                  <p className="text-gray-600">
                    Nenhum artigo encontrado para a letra "{selectedLetter}".
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {featuredArticle && (
                <MainFeaturedCard article={featuredArticle} />
              )}
              
              {recentArticles.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Artigos Recentes
                    </h2>
                    <a href="/artigos" className="text-red-600 hover:text-red-700 font-medium text-sm">
                      Ver todos →
                    </a>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentArticles.map(article => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPage;