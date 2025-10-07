import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import { ArrowLeft, Calendar, Clock, User, Eye, Share2, BookOpen } from 'lucide-react';

const ArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);

      // Tentar buscar por slug primeiro
      let response = await fetch(`${API_URL}/api/articles/slug/${slug}`);
      
      // Se não encontrar por slug, tentar por ID
      if (!response.ok) {
        response = await fetch(`${API_URL}/api/articles/${slug}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setArticle(data.data);
      } else {
        setError('Artigo não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
      setError('Erro ao carregar artigo');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const sanitizeAndRenderHTML = (htmlContent) => {
    if (!htmlContent) return '';

    // Sanitização básica - remove scripts e event handlers
    let cleanHTML = htmlContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '');

    return cleanHTML;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.titulo,
          text: article.resumo,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback para copiar URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando artigo...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {error || 'Artigo não encontrado'}
            </h1>
            <p className="text-gray-600 mb-6">
              O artigo que você está procurando não existe ou foi removido.
            </p>
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Blog
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      
      <article className="min-h-screen bg-gray-50">
        {/* Breadcrumb e Navegação */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Blog
            </button>
            
            <nav className="text-sm text-gray-500">
              <span>Blog</span>
              <span className="mx-2">•</span>
              <span>{article.categoria}</span>
              <span className="mx-2">•</span>
              <span className="text-gray-900">{article.titulo}</span>
            </nav>
          </div>
        </div>

        {/* Cabeçalho do Artigo */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Categoria */}
              <div className="mb-4">
                <span className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">
                  {article.categoria}
                </span>
                {article.destaque && (
                  <span className="ml-2 inline-block bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">
                    Destaque
                  </span>
                )}
              </div>

              {/* Título */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {article.titulo}
              </h1>

              {/* Resumo */}
              {article.resumo && (
                <div className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {article.resumo}
                </div>
              )}

              {/* Metadados */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Por {article.autor}</span>
                  {article.coautor && (
                    <span>e {article.coautor}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(article.created_at)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{article.tempo_leitura || 5} min de leitura</span>
                </div>
                
                {article.visualizacoes > 0 && (
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{article.visualizacoes} visualizações</span>
                  </div>
                )}
              </div>

              {/* Botão de Compartilhar */}
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo do Artigo */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div 
                className="prose prose-lg max-w-none
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
                  prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8
                  prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6
                  prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-6
                  prose-h5:text-base prose-h5:mb-2 prose-h5:mt-4
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-ul:my-6 prose-ol:my-6
                  prose-li:text-gray-700 prose-li:mb-2
                  prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
                  prose-blockquote:border-l-4 prose-blockquote:border-red-500 prose-blockquote:pl-6 prose-blockquote:italic
                  prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
                  prose-pre:bg-gray-900 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg
                  prose-table:border-collapse prose-table:border prose-table:border-gray-300
                  prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-3 prose-th:font-semibold
                  prose-td:border prose-td:border-gray-300 prose-td:p-3
                  prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ 
                  __html: sanitizeAndRenderHTML(article.conteudo_completo) 
                }}
              />
            </div>
          </div>
        </div>

        {/* Rodapé do Artigo */}
        <div className="bg-gray-100 border-t border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>Artigo médico baseado em evidências científicas</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                  </button>
                  
                  <button
                    onClick={() => navigate('/blog')}
                    className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Mais Artigos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default ArticlePage;
