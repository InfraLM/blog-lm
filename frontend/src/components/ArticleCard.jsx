import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye } from 'lucide-react';
import './ArticleCard.css';

const ArticleCard = ({ article }) => {
  if (!article) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Usar slug se disponível, senão usar ID
  const articleUrl = article.slug 
    ? `/post/${article.slug}` 
    : `/artigo/${article.id}`;

  return (
    <article className="article-card">
      <Link to={articleUrl} className="article-card-link">
        <div className="article-card-header">
          <span className="article-category">
            {article.categoria}
          </span>
        </div>

        <div className="article-card-body">
          <h3 className="article-title">{article.titulo}</h3>
          
          {/* Mostrar resumo ou parte do content */}
          {(article.resumo || article.content) && (
            <p className="article-excerpt">
              {article.resumo || article.content.substring(0, 150) + '...'}
            </p>
          )}
        </div>

        <div className="article-card-footer">
          <div className="article-meta">
            <span>
              <User size={14} />
              {article.autor}
            </span>
            <span>
              <Calendar size={14} />
              {formatDate(article.data_criacao)}
            </span>
          </div>
          
          {article.visualizacoes > 0 && (
            <span className="article-views">
              <Eye size={14} />
              {article.visualizacoes}
            </span>
          )}
        </div>
      </Link>
    </article>
  );
};

export default ArticleCard;