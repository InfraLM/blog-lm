import React, { useState, useEffect } from 'react';
import Header from './Header';
import MainFeaturedCard from './MainFeaturedCard';
import ArticleCard from './ArticleCard';
import AllArticlesList from './AllArticlesList';
import { Loader2, TrendingUp, BookOpen } from 'lucide-react';

const BlogPage = () => {
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, categories: 0 });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchHomeData();
    fetchStats();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Buscar artigo em destaque
      const featuredRes = await fetch(`${API_URL}/api/articles/featured-main`);
      const featuredData = await featuredRes.json();
      
      if (featuredData.success && featuredData.data) {
        setFeaturedArticle(featuredData.data);
      }
      
      // Buscar artigos recentes (excluindo o destaque)
      const excludeId = featuredData.data?.id;
      const recentRes = await fetch(
        `${API_URL}/api/articles/recent${excludeId ? `?excludeId=${excludeId}&limit=3` : '?limit=3'}`
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
      // Buscar contagem real de artigos
      const articlesRes = await fetch(`${API_URL}/api/articles?limit=1`);
      const articlesData = await articlesRes.json();
      
      // Buscar categorias
      const categoriesRes = await fetch(`${API_URL}/api/categories`);
      const categoriesData = await categoriesRes.json();
      
      if (articlesData.success && categoriesData.success) {
        setStats({
          total: articlesData.total || 0, // Total real do banco
          categories: categoriesData.data?.length || 0
        });
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  // IDs para excluir da listagem completa (destaque + 3 recentes)
  const excludeIds = [
    ...(featuredArticle ? [featuredArticle.id] : []),
    ...recentArticles.map(article => article.id)
  ];

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
        {/* Hero Section com estatísticas */}
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
            
            {/* Apenas 2 cards de estatísticas */}
            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
                <BookOpen className="w-10 h-10 mx-auto mb-3" />
                <div className="text-4xl font-bold">{stats.total}</div>
                <div className="text-base opacity-90">Artigos Publicados</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
                <TrendingUp className="w-10 h-10 mx-auto mb-3" />
                <div className="text-4xl font-bold">{stats.categories}</div>
                <div className="text-base opacity-90">Especialidades Médicas</div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Artigo em Destaque */}
          {featuredArticle && (
            <div className="mb-12">
              <MainFeaturedCard article={featuredArticle} />
            </div>
          )}
          
          {/* Artigos Recentes */}
          {recentArticles.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Artigos Recentes
                  </h2>
                  <p className="text-gray-600">
                    Últimas publicações da nossa equipe médica
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* Listagem Completa de Todos os Outros Artigos */}
          <AllArticlesList excludeIds={excludeIds} />
        </div>
      </div>
    </>
  );
};

export default BlogPage;
