import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Eye } from 'lucide-react';
import './ArticleDetail.css';

const ArticleDetail = () => {
  const { id, slug } = useParams(); // Pega ID ou SLUG da URL
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [id, slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      let url;
      
      // Determinar se está usando ID ou SLUG
      if (id) {
        url = `http://localhost:3001/api/articles/${id}`;
        console.log(`📡 Buscando artigo por ID: ${id}`);
      } else if (slug) {
        url = `http://localhost:3001/api/articles/${slug}`;
        console.log(`📡 Buscando artigo por SLUG: ${slug}`);
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Artigo não encontrado');
      }

      const data = await response.json();
      console.log('✅ Artigo carregado:', data);

      if (data.success && data.data) {
        setArticle(data.data);
      } else {
        throw new Error('Formato de dados inválido');
      }
    } catch (err) {
      console.error('❌ Erro ao carregar artigo:', err);
      setError(err.message);
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
        <button onClick={() => navigate('/')}>Voltar para Home</button>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <article className="article-detail">
      <div className="article-container">
        {/* Botão Voltar */}
        <button 
          className="btn-back"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        {/* Header do Artigo */}
        <header className="article-header">
          <div className="article-category-badge">
            {article.categoria}
          </div>
          
          <h1 className="article-title">{article.titulo}</h1>
          
          <div className="article-meta">
            <span className="meta-item">
              <User size={16} />
              {article.autor}
            </span>
            <span className="meta-item">
              <Calendar size={16} />
              {formatDate(article.data_criacao)}
            </span>
            {article.tempo_leitura && (
              <span className="meta-item">
                <Clock size={16} />
                {article.tempo_leitura} min de leitura
              </span>
            )}
            {article.visualizacoes > 0 && (
              <span className="meta-item">
                <Eye size={16} />
                {article.visualizacoes} visualizações
              </span>
            )}
          </div>
        </header>

        {/* Conteúdo do Artigo */}
        <div className="article-content">
          {/* Se content é HTML */}
          {article.content && article.content.includes('<') ? (
            <div 
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            // Se content é texto simples
            <div className="article-text">
              {article.content?.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>

        {/* Informações Adicionais */}
        <footer className="article-footer">
          <div className="article-tags">
            {article.tags?.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
          
          {article.data_atualizacao && (
            <p className="last-update">
              Última atualização: {formatDate(article.data_atualizacao)}
            </p>
          )}
        </footer>
      </div>
    </article>
  );
};

export default ArticleDetail;