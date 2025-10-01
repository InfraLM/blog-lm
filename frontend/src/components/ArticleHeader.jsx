import React from 'react';
import { Calendar, User } from 'lucide-react';

const ArticleHeader = ({ title, lastUpdated, categoria, autor }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      {/* Importar fontes do Google Fonts */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Spectral:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap" 
        rel="stylesheet" 
      />
      
      {/* Hero Section com fundo vermelho */}
      <div style={{
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        padding: '3rem 0',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          {categoria && (
            <div style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              letterSpacing: '0.05em',
              fontFamily: 'Inter, sans-serif'
            }}>
              {categoria.toUpperCase()}
            </div>
          )}
          
          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            lineHeight: '1.1',
            margin: '0 0 2rem 0',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            {title || 'Título do Artigo'}
          </h1>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            {autor && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                opacity: '0.9'
              }}>
                <User style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>Por {autor}</span>
              </div>
            )}
            {lastUpdated && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                opacity: '0.9'
              }}>
                <Calendar style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>{formatDate(lastUpdated)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleHeader;
