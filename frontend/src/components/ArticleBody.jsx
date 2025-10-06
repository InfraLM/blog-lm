import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArticleContent from './ArticleContent';
import { 
  Calendar, Clock, User, Users, ArrowLeft, 
  Eye, Loader2 
} from 'lucide-react';

const ArticleBody = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchArticle();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`${API_URL}/api/articles/slug/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setArticle(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando artigo...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Artigo não encontrado
          </h1>
          <p className="text-gray-600 mb-8">
            O artigo que você está procurando não existe ou foi removido.
          </p>
          <a 
            href="/"
            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }

  return (
    <article className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {article.imagem_principal && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={article.imagem_principal} 
                alt={article.titulo}
                className="w-full h-auto"
              />
            </div>
          )}
          
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                {article.categoria}
              </span>
              {article.destaque && (
                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
                  ⭐ Destaque
                </span>
              )}
              {article.visualizacoes > 0 && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span>{article.visualizacoes} visualizações</span>
                </div>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.titulo}
            </h1>
            
            {article.resumo && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-600 p-6 rounded-r-lg mb-6">
                <p className="text-lg text-gray-700 italic leading-relaxed">
                  {article.resumo}
                </p>
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 pb-6 border-b">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-700" />
                <span className="font-semibold text-gray-900">{article.autor}</span>
              </div>
              
              {article.coautor && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-700" />
                  <span className="font-semibold text-gray-900">Co-autor: {article.coautor}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>{formatDate(article.created_at)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>{article.tempo_leitura || 5} min de leitura</span>
              </div>
            </div>
          </header>
          
          <div className="prose-wrapper mb-12">
            <ArticleContent content={article.content} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleBody;