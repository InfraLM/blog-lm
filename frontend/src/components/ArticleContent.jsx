import React, { useEffect } from 'react';
import DOMPurify from 'dompurify';

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

  const cleanHTML = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'p', 'br', 'strong', 'em', 'u', 
      'img', 'div', 'span'
    ],
    ALLOWED_ATTR: ['src', 'alt', 'class', 'id']
  });
  
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