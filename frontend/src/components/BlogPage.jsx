import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const BlogPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/articles');
      const data = await response.json();
      
      if (data.success && data.data) {
        // Ordenar por data (mais recente primeiro)
        const sortedArticles = data.data.sort((a, b) => 
          new Date(b.data_criacao || b.data_atualizacao) - new Date(a.data_criacao || a.data_atualizacao)
        );
        setArticles(sortedArticles);
      }
    } catch (error) {
      console.error('Erro ao buscar artigos:', error);
      // Dados de exemplo para demonstração quando não há backend
      setArticles([
        {
          id: 1,
          titulo: "Protocolo de Sepse em Medicina de Emergência",
          categoria: "Medicina de Emergência",
          autor: "Dr. João Silva",
          resumo: "Protocolo completo para diagnóstico e tratamento de sepse em ambiente de emergência, baseado nas diretrizes mais recentes.",
          data_criacao: new Date().toISOString(),
          visualizacoes: 1250
        },
        {
          id: 2,
          titulo: "Urticária: Diagnóstico e Tratamento na Emergência",
          categoria: "Dermatologia",
          autor: "Dra. Maria Santos",
          resumo: "Abordagem completa para diagnóstico e manejo da urticária em situações de emergência.",
          data_criacao: new Date(Date.now() - 86400000).toISOString(),
          visualizacoes: 890
        },
        {
          id: 3,
          titulo: "Lúpus Eritematoso Sistêmico: Diagnóstico e Manejo Clínico",
          categoria: "Reumatologia",
          autor: "Dr. Carlos Lima",
          resumo: "Guia completo para diagnóstico e tratamento do lúpus eritematoso sistêmico.",
          data_criacao: new Date(Date.now() - 172800000).toISOString(),
          visualizacoes: 2100
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (articleId) => {
    navigate(`/artigo/${articleId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div style={{ backgroundColor: '#f03b40' }} className="text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-semibold mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            Blog Médico
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Explore nossa biblioteca completa de conteúdos médicos baseados em evidências científicas
          </p>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Carregando artigos...</div>
          </div>
        ) : (
          <>
            {/* Contador de artigos */}
            <div className="mb-8 text-center">
              <p className="text-lg text-gray-600">
                {articles.length} {articles.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
              </p>
            </div>

            {/* Grid de artigos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleArticleClick(article.id)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2 h-full flex flex-col"
                >
                  {/* Header do Card */}
                  <div className="p-6 pb-0">
                    <div className="inline-block bg-gradient-to-r from-[#f03b40] to-red-600 text-white px-3 py-1 rounded-md text-sm font-semibold uppercase tracking-wide mb-4">
                      {article.categoria || 'Medicina'}
                    </div>
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-6 pt-0 flex-1 flex flex-col">
                    <h3 
                      className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {article.titulo}
                    </h3>
                    
                    {article.resumo && (
                      <p 
                        className="text-gray-600 mb-4 flex-1 line-clamp-3"
                        style={{ fontFamily: 'Spectral, serif', fontSize: '0.95rem', lineHeight: '1.6' }}
                      >
                        {article.resumo}
                      </p>
                    )}
                  </div>

                  {/* Footer do Card */}
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex flex-col gap-1">
                          {article.autor && (
                            <span style={{ fontFamily: 'Inter, sans-serif' }}>
                              Por {article.autor}
                            </span>
                          )}
                          {article.data_criacao && (
                            <span style={{ fontFamily: 'Inter, sans-serif' }}>
                              {new Date(article.data_criacao).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                        
                        {article.visualizacoes && article.visualizacoes > 0 && (
                          <span 
                            className="text-gray-400 font-medium"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {article.visualizacoes} visualizações
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mensagem quando não há artigos */}
            {articles.length === 0 && (
              <div className="text-center py-12">
                <div className="text-xl text-gray-600 mb-4">Nenhum artigo encontrado</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
