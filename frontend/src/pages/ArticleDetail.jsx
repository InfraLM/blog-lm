import React, { useState, useEffect } from 'react';
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

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Buscando artigo com slug:', slug);

      // Tentar usar o serviço primeiro
      let response;
      try {
        response = await articleService.getBySlug(slug);
      } catch (serviceError) {
        console.log('⚠️ Serviço falhou, tentando fetch direto...');
        // Fallback para fetch direto
        const fetchResponse = await fetch(`${API_URL}/api/articles/slug/${slug}`);
        response = await fetchResponse.json();
      }

      console.log('📦 Resposta da API:', response);

      if (response.success && response.data) {
        // Normalizar o campo de conteúdo (pode vir como content ou conteudo_completo)
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Função para extrair títulos do conteúdo HTML e criar índice
  const extractHeadings = (htmlContent) => {
    if (!htmlContent) return [];
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    return Array.from(headings).map((heading, index) => ({
      id: `heading-${index}`,
      text: heading.textContent,
      level: parseInt(heading.tagName.charAt(1))
    }));
  };

  const scrollToHeading = (headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Função para adicionar IDs aos títulos no conteúdo HTML
  const addIdsToHeadings = (htmlContent) => {
    if (!htmlContent) return '';
    
    let content = htmlContent;
    const headingRegex = /<(h[1-6])([^>]*)>(.*?)<\/h[1-6]>/gi;
    let headingIndex = 0;
    
    content = content.replace(headingRegex, (match, tag, attributes, text) => {
      const id = `heading-${headingIndex}`;
      headingIndex++;
      return `<${tag}${attributes} id="${id}">${text}</${tag}>`;
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

  const headings = extractHeadings(article.content);
  const contentWithIds = addIdsToHeadings(article.content);

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
        {/* Sidebar com Índice */}
        {headings.length > 0 && (
          <aside className="article-sidebar">
            <div className="sidebar-content">
              <h3 className="sidebar-title">ÍNDICE</h3>
              <nav className="article-index">
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    className={`index-item level-${heading.level}`}
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