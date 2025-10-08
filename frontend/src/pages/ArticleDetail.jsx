import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { articleService } from '../services/api';
import './ArticleDetail.css';

const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeHeading, setActiveHeading] = useState('');
  const observerRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  useEffect(() => {
    if (article && article.content) {
      setupIntersectionObserver();
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [article]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Buscando artigo com slug:', slug);

      let response;
      try {
        response = await articleService.getBySlug(slug);
      } catch (serviceError) {
        console.log('⚠️ Serviço falhou, tentando fetch direto...');
        const fetchResponse = await fetch(`${API_URL}/api/articles/slug/${slug}`);
        response = await fetchResponse.json();
      }

      console.log('📦 Resposta da API:', response);

      if (response.success && response.data) {
        const articleData = {
          ...response.data,
          content: response.data.conteudo_completo || response.data.content
        };
        
        console.log('✅ Artigo carregado:', articleData.titulo);
        setArticle(articleData);
      } else {
        throw new Error('Artigo não encontrado');
      }
    } catch (err) {
      console.error('❌ Erro ao carregar artigo:', err);
      setError(err.message || 'Erro ao carregar artigo');
    } finally {
      setLoading(false);
    }
  };

  const setupIntersectionObserver = () => {
    const options = {
      root: null,
      rootMargin: '-100px 0px -66%',
      threshold: 0
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveHeading(entry.target.id);
        }
      });
    }, options);

    // Observar apenas H1s
    const headings = document.querySelectorAll('.article-content h1[id]');
    headings.forEach((heading) => {
      observerRef.current.observe(heading);
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Extrair apenas H1s
  const extractH1Headings = (htmlContent) => {
    if (!htmlContent) return [];
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const h1Elements = tempDiv.querySelectorAll('h1');
    return Array.from(h1Elements).map((heading, index) => ({
      id: `h1-${index}`,
      text: heading.textContent
    }));
  };

  const scrollToHeading = (headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ 
        top: y, 
        behavior: 'smooth' 
      });
    }
  };

  // Adicionar IDs apenas aos H1s
  const addIdsToH1s = (htmlContent) => {
    if (!htmlContent) return '';
    
    let content = htmlContent;
    const h1Regex = /<h1([^>]*)>(.*?)<\/h1>/gi;
    let h1Index = 0;
    
    content = content.replace(h1Regex, (match, attributes, text) => {
      const id = `h1-${h1Index}`;
      h1Index++;
      return `<h1${attributes} id="${id}">${text}</h1>`;
    });
    
    return content;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando artigo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>❌ {error}</h2>
        <p>Não foi possível carregar o artigo.</p>
        <button onClick={() => navigate('/')} style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '500'
        }}>
          Voltar para Home
        </button>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="error-container">
        <h2>📄 Artigo não encontrado</h2>
        <button onClick={() => navigate('/')}>Voltar para Home</button>
      </div>
    );
  }

  const headings = extractH1Headings(article.content);
  const contentWithIds = addIdsToH1s(article.content);

  return (
    <div className="article-page">
      {/* Header Hero Section */}
      <div className="article-hero">
        <div className="article-hero-content">
          <div className="article-category-badge">
            {article.categoria}
          </div>
          <h1 className="article-hero-title">{article.titulo}</h1>
        </div>
      </div>

      <div className="article-layout">
        {/* Sidebar com Índice - apenas H1s */}
        {headings.length > 0 && (
          <aside className="article-sidebar">
            <div className="sidebar-content">
              <h3 className="sidebar-title">ÍNDICE</h3>
              <nav className="article-index">
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    className={`index-item ${activeHeading === heading.id ? 'active' : ''}`}
                    onClick={() => scrollToHeading(heading.id)}
                  >
                    {heading.text}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* Conteúdo Principal */}
        <main className="article-main">
          <div className="article-container">
            {/* Botão Voltar */}
            <button 
              className="btn-back"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
              Voltar
            </button>

            {/* Meta informações */}
            <div className="article-meta">
              <span className="meta-author">
                <User size={16} style={{ display: 'inline', marginRight: '4px' }} />
                Por {article.autor}
              </span>
              <span className="meta-separator">|</span>
              <span className="meta-date">
                <Calendar size={16} style={{ display: 'inline', marginRight: '4px' }} />
                {formatDate(article.created_at || article.data_criacao)}
              </span>
              {article.tempo_leitura && (
                <>
                  <span className="meta-separator">|</span>
                  <span className="meta-date">
                    <Clock size={16} style={{ display: 'inline', marginRight: '4px' }} />
                    {article.tempo_leitura} min de leitura
                  </span>
                </>
              )}
            </div>

            {/* Introdução/Resumo */}
            {article.resumo && (
              <div className="article-intro">
                <p>{article.resumo}</p>
              </div>
            )}

            {/* Conteúdo do Artigo */}
            <div className="article-content">
              {contentWithIds ? (
                <div dangerouslySetInnerHTML={{ __html: contentWithIds }} />
              ) : (
                <p>Conteúdo não disponível</p>
              )}
            </div>

            {/* Footer do Artigo */}
            <footer className="article-footer">
              {article.updated_at && (
                <p className="last-update">
                  Última atualização: {formatDate(article.updated_at || article.data_atualizacao)}
                </p>
              )}
              
              {article.tags && article.tags.length > 0 && (
                <div className="article-tags">
                  {article.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ArticleDetail;