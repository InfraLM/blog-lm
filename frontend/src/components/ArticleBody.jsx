import React, { useEffect, useState } from 'react';

const ArticleBody = ({ content }) => {
  const [tableOfContents, setTableOfContents] = useState([]);

  useEffect(() => {
    if (content) {
      // Extrair títulos do conteúdo HTML para criar o índice
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      const toc = Array.from(headings).map((heading, index) => ({
        id: `section-${index}`,
        text: heading.textContent.trim(),
        level: parseInt(heading.tagName.charAt(1)),
        element: heading.tagName.toLowerCase()
      }));
      
      setTableOfContents(toc);

      // Adicionar IDs aos títulos no DOM após renderização
      setTimeout(() => {
        const container = document.querySelector('.article-content-main');
        if (container) {
          const domHeadings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
          domHeadings.forEach((heading, index) => {
            heading.id = `section-${index}`;
          });
        }
      }, 100);
    }
  }, [content]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  // Se não há conteúdo, mostrar mensagem
  if (!content) {
    return (
      <div style={{
        background: '#f9fafb',
        minHeight: '50vh',
        padding: '2rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#6b7280',
          fontFamily: 'Inter, sans-serif'
        }}>
          <p>Conteúdo do artigo não disponível.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#f9fafb',
      minHeight: '100vh',
      padding: '2rem 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'grid',
        gridTemplateColumns: tableOfContents.length > 0 ? '250px 1fr' : '1fr',
        gap: '3rem'
      }}>
        {/* Sidebar com índice - só aparece se há títulos */}
        {tableOfContents.length > 0 && (
          <div style={{
            position: 'sticky',
            top: '2rem',
            height: 'fit-content',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            maxHeight: '70vh',
            overflowY: 'auto'
          }}>
            <div style={{
              background: '#f9fafb',
              padding: '1rem',
              borderBottom: '1px solid #e5e7eb',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '600',
              fontSize: '0.875rem',
              color: '#374151',
              letterSpacing: '0.05em',
              borderRadius: '0.75rem 0.75rem 0 0'
            }}>
              ÍNDICE
            </div>
            <nav style={{ padding: '0.5rem 0' }}>
              {tableOfContents.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    border: 'none',
                    background: 'none',
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    lineHeight: '1.4',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    borderLeft: '3px solid transparent',
                    paddingLeft: item.level === 3 ? '2rem' : 
                                item.level === 4 ? '2.5rem' : 
                                item.level === 5 ? '3rem' : 
                                item.level === 6 ? '3.5rem' : '1rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f9fafb';
                    e.target.style.color = '#ef4444';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = '#6b7280';
                  }}
                >
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '1.5rem',
                    height: '1.5rem',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    borderRadius: '50%',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </span>
                  <span style={{
                    flex: 1,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {item.text}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Conteúdo principal */}
        <div 
          className="article-content-main"
          style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            fontFamily: 'Spectral, serif',
            fontSize: '1.125rem',
            lineHeight: '1.7',
            color: '#374151'
          }}
        >
          <style>
            {`
              .article-content-main h1,
              .article-content-main h2,
              .article-content-main h3,
              .article-content-main h4,
              .article-content-main h5,
              .article-content-main h6 {
                font-family: 'Inter', sans-serif !important;
                font-weight: 600 !important;
                color: #1f2937 !important;
                margin-top: 2.5rem !important;
                margin-bottom: 1rem !important;
                line-height: 1.2 !important;
                scroll-margin-top: 2rem !important;
              }
              
              .article-content-main h1 {
                font-size: 2.5rem !important;
                margin-top: 0 !important;
              }
              
              .article-content-main h2 {
                font-size: 2rem !important;
                color: #ef4444 !important;
                border-bottom: 2px solid #fecaca !important;
                padding-bottom: 0.5rem !important;
              }
              
              .article-content-main h3 {
                font-size: 1.75rem !important;
                color: #dc2626 !important;
              }
              
              .article-content-main h4 {
                font-size: 1.5rem !important;
                color: #b91c1c !important;
              }
              
              .article-content-main h5 {
                font-size: 1.25rem !important;
                color: #991b1b !important;
              }
              
              .article-content-main h6 {
                font-size: 1.125rem !important;
                color: #7f1d1d !important;
              }
              
              .article-content-main p {
                margin-bottom: 1.5rem !important;
                text-align: justify !important;
              }
              
              .article-content-main strong,
              .article-content-main b {
                color: #ef4444 !important;
                font-weight: 600 !important;
              }
              
              .article-content-main ul,
              .article-content-main ol {
                margin: 1.5rem 0 !important;
                padding-left: 2rem !important;
              }
              
              .article-content-main li {
                margin-bottom: 0.5rem !important;
              }
              
              .article-content-main ul li::marker {
                color: #ef4444 !important;
              }
              
              .article-content-main ol li::marker {
                color: #ef4444 !important;
                font-weight: 600 !important;
              }
              
              .article-content-main blockquote {
                border-left: 4px solid #ef4444 !important;
                background: #fef2f2 !important;
                padding: 1rem 1.5rem !important;
                margin: 1.5rem 0 !important;
                font-style: italic !important;
              }
              
              .article-content-main table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin: 1.5rem 0 !important;
                border: 1px solid #e5e7eb !important;
                border-radius: 0.5rem !important;
                overflow: hidden !important;
              }
              
              .article-content-main th {
                background: #ef4444 !important;
                color: white !important;
                padding: 0.75rem !important;
                text-align: left !important;
                font-weight: 600 !important;
                font-family: 'Inter', sans-serif !important;
              }
              
              .article-content-main td {
                padding: 0.75rem !important;
                border-bottom: 1px solid #e5e7eb !important;
              }
              
              .article-content-main tr:hover {
                background: #f9fafb !important;
              }
              
              .article-content-main code {
                background: #f3f4f6 !important;
                color: #ef4444 !important;
                padding: 0.25rem 0.5rem !important;
                border-radius: 0.25rem !important;
                font-family: 'Courier New', monospace !important;
                font-size: 0.9em !important;
              }
              
              .article-content-main pre {
                background: #1f2937 !important;
                color: #f9fafb !important;
                padding: 1rem !important;
                border-radius: 0.5rem !important;
                overflow-x: auto !important;
                margin: 1.5rem 0 !important;
              }
              
              .article-content-main pre code {
                background: none !important;
                color: inherit !important;
                padding: 0 !important;
              }
              
              .article-content-main img {
                max-width: 100% !important;
                height: auto !important;
                border-radius: 0.5rem !important;
                margin: 1.5rem 0 !important;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
              }
              
              .article-content-main a {
                color: #ef4444 !important;
                text-decoration: underline !important;
                transition: color 0.2s ease !important;
              }
              
              .article-content-main a:hover {
                color: #dc2626 !important;
              }
              
              @media (max-width: 1024px) {
                .article-content-main {
                  padding: 2rem !important;
                }
              }
              
              @media (max-width: 768px) {
                .article-content-main {
                  padding: 1.5rem !important;
                  font-size: 1rem !important;
                }
                
                .article-content-main h1 {
                  font-size: 2rem !important;
                }
                
                .article-content-main h2 {
                  font-size: 1.75rem !important;
                }
                
                .article-content-main h3 {
                  font-size: 1.5rem !important;
                }
                
                .article-content-main h4 {
                  font-size: 1.25rem !important;
                }
              }
            `}
          </style>
          
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
      
      {/* CSS responsivo para o grid */}
      <style>
        {`
          @media (max-width: 1024px) {
            .article-body-container > div {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ArticleBody;
