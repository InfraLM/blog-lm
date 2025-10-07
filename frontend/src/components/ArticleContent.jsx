import React, { useEffect } from 'react';

const ArticleContent = ({ content }) => {
  useEffect(() => {
    const contentDiv = document.getElementById('article-content');
    if (contentDiv) {
      contentDiv.querySelectorAll('h1').forEach(el => {
        el.className = 'text-3xl font-bold text-gray-900 mb-4 mt-8 pb-2 border-b border-gray-200';
      });
      
      contentDiv.querySelectorAll('h2').forEach(el => {
        el.className = 'text-2xl font-semibold text-gray-800 mb-3 mt-6';
      });
      
      contentDiv.querySelectorAll('h3').forEach(el => {
        el.className = 'text-xl font-medium text-gray-700 mb-2 mt-4';
      });
      
      contentDiv.querySelectorAll('p').forEach(el => {
        el.className = 'text-gray-600 mb-4 leading-relaxed text-justify';
      });
      
      contentDiv.querySelectorAll('img').forEach(el => {
        el.className = 'rounded-lg shadow-lg my-6 w-full max-w-4xl mx-auto';
      });

      contentDiv.querySelectorAll('strong').forEach(el => {
        el.className = 'font-semibold text-gray-800';
      });
    }
  }, [content]);

  // Função simples de sanitização sem dependência externa
  const sanitizeHTML = (html) => {
    if (!html) return '';
    
    // Lista de tags permitidas
    const allowedTags = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'strong', 'em', 'u', 'b', 'i',
      'img', 'div', 'span', 'ul', 'ol', 'li',
      'blockquote', 'code', 'pre'
    ];
    
    // Lista de atributos permitidos
    const allowedAttributes = ['src', 'alt', 'class', 'id', 'href', 'target'];
    
    // Remover scripts e outros elementos perigosos
    let cleanHTML = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
      .replace(/javascript:/gi, ''); // Remove javascript: URLs
    
    return cleanHTML;
  };

  const cleanHTML = sanitizeHTML(content);
  
  return (
    <div className="max-w-none">
      <div 
        id="article-content"
        dangerouslySetInnerHTML={{ __html: cleanHTML }} 
      />
    </div>
  );
};

export default ArticleContent;
