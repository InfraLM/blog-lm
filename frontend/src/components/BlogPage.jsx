import React, { useState, useEffect } from 'react';
import Header from './Header';
import MainFeaturedCard from './MainFeaturedCard';
import ArticleCard from './ArticleCard';
import AllArticlesList from './AllArticlesList';
import { Loader2 } from 'lucide-react';
import { articleService } from '@/services/api';

const BlogPage = () => {
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchHomeData();
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
        {/* Hero Section simplificada */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Portal de Conhecimento Médico
              </h1>
              <p className="text-xl opacity-90">
                Artigos, protocolos e discussões para profissionais da saúde
              </p>
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

          {/* Listagem Completa de TODOS os Artigos - SEM EXCLUSÕES */}
          {/* Agora mostra todos os artigos, incluindo destaque e recentes */}
          <AllArticlesList excludeIds={[]} />
        </div>
      </div>
    </>
  );
};

export default BlogPage;