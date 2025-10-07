import React, { useState, useEffect } from "react";
import MainFeaturedCard from "./MainFeaturedCard";

const FeaturedPostCard = () => {
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchFeaturedArticles();
  }, []);

  const fetchFeaturedArticles = async () => {
    try {
      // Primeiro, buscar o artigo em destaque (destaque = true)
      const featuredRes = await fetch(`${API_URL}/api/articles/featured-main`);
      const featuredData = await featuredRes.json();
      
      let excludeId = null;
      if (featuredData.success && featuredData.data) {
        setFeaturedArticle(featuredData.data);
        excludeId = featuredData.data.id;
      }

      // Buscar os 3 artigos mais recentes (excluindo o destaque)
      const recentRes = await fetch(
        `${API_URL}/api/articles/recent${excludeId ? `?excludeId=${excludeId}&limit=3` : '?limit=3'}`
      );
      const recentData = await recentRes.json();
      
      if (recentData.success && recentData.data) {
        setRecentArticles(recentData.data);
      } else {
        // Fallback para dados estáticos se a API falhar
        setRecentArticles(getStaticFallback());
      }
    } catch (error) {
      console.error('Erro ao buscar artigos para a Home:', error);
      // Fallback para dados estáticos
      setRecentArticles(getStaticFallback());
    } finally {
      setLoading(false);
    }
  };

  const getStaticFallback = () => [
    {
      categoria: "MEDICINA DE EMERGÊNCIA",
      titulo: "Protocolo de Sepse: Diagnóstico e Tratamento Rápido",
      autor: "Dr. João Silva",
      created_at: "2024-03-15",
      tempo_leitura: 8,
      imagem_principal: "https://via.placeholder.com/600x338/f03b40/ffffff?text=Medicina+de+Emergência",
      slug: "protocolo-sepse-diagnostico-tratamento"
    },
    {
      categoria: "CARDIOLOGIA",
      titulo: "Infarto Agudo do Miocárdio: Reconhecimento Precoce",
      autor: "Dra. Maria Santos",
      created_at: "2024-03-12",
      tempo_leitura: 6,
      imagem_principal: "https://via.placeholder.com/600x338/dc2626/ffffff?text=Cardiologia",
      slug: "infarto-agudo-miocardio-reconhecimento"
    },
    {
      categoria: "NEUROLOGIA",
      titulo: "AVC Isquêmico: Protocolo de Atendimento",
      autor: "Dr. Carlos Lima",
      created_at: "2024-03-10",
      tempo_leitura: 10,
      imagem_principal: "https://via.placeholder.com/600x338/b91c1c/ffffff?text=Neurologia",
      slug: "avc-isquemico-protocolo-atendimento"
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleArticleClick = (article) => {
    window.location.href = `/artigo/${article.slug || article.id}`;
  };

  if (loading) {
    return (
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '1.125rem', 
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #f03b40',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Carregando artigos...
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem 1rem',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Artigo em Destaque Principal */}
      {featuredArticle && (
        <div style={{ marginBottom: '3rem' }}>
          <MainFeaturedCard article={featuredArticle} />
        </div>
      )}

      {/* Título da Seção dos 3 Cards */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '0.5rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          Artigos em Destaque
        </h2>
        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
          color: '#6b7280',
          fontFamily: 'Spectral, serif'
        }}>
          Conteúdos médicos baseados em evidências científicas
        </p>
      </div>

      {/* Grid de 3 Artigos Recentes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem'
      }}>
        {recentArticles.map((article, index) => (
          <article
            key={article.id || index}
            style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: 'fit-content'
            }}
            onClick={() => handleArticleClick(article)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            }}
          >
            {/* Imagem do Artigo */}
            <div style={{
              width: '100%',
              height: '200px',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#f3f4f6'
            }}>
              {article.imagem_principal ? (
                <img
                  src={article.imagem_principal}
                  alt={article.titulo}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#e5e7eb'
                }}>
                  <svg style={{ width: '48px', height: '48px', color: '#9ca3af' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                </div>
              )}
              
              {/* Badge da Categoria */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                background: 'linear-gradient(135deg, #f03b40, #dc2626)',
                color: 'white',
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                {article.categoria}
              </div>
            </div>

            {/* Conteúdo do Card */}
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{
                fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem',
                lineHeight: '1.4',
                fontFamily: 'Inter, sans-serif',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {article.titulo}
              </h3>

              {/* Meta Informações */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                <div style={{ fontFamily: 'Inter, sans-serif' }}>
                  Por {article.autor}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontFamily: 'Inter, sans-serif' }}>
                    {formatDate(article.created_at)}
                  </span>
                  <span style={{
                    color: '#f03b40',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {article.tempo_leitura || 5} min de leitura
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPostCard;
