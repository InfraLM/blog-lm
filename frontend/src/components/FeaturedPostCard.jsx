import React from "react";

const FeaturedPostCard = () => {
  const featuredArticles = [
    {
      category: "MEDICINA DE EMERGÊNCIA",
      title: "Protocolo de Sepse: Diagnóstico e Tratamento Rápido",
      author: "Dr. João Silva",
      date: "15 de março de 2024",
      readTime: "8 min de leitura",
      image: "https://via.placeholder.com/400x250/f03b40/ffffff?text=Medicina+de+Emergência"
    },
    {
      category: "CARDIOLOGIA",
      title: "Infarto Agudo do Miocárdio: Reconhecimento Precoce",
      author: "Dra. Maria Santos",
      date: "12 de março de 2024",
      readTime: "6 min de leitura",
      image: "https://via.placeholder.com/400x250/dc2626/ffffff?text=Cardiologia"
    },
    {
      category: "NEUROLOGIA",
      title: "AVC Isquêmico: Protocolo de Atendimento",
      author: "Dr. Carlos Lima",
      date: "10 de março de 2024",
      readTime: "10 min de leitura",
      image: "https://via.placeholder.com/400x250/b91c1c/ffffff?text=Neurologia"
    }
  ];

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem 1rem',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Título da Seção */}
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

      {/* Grid de Artigos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr',
          gap: '1.5rem'
        }
      }}>
        {featuredArticles.map((article, index) => (
          <article
            key={index}
            style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: 'fit-content'
            }}
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
              position: 'relative'
            }}>
              <img
                src={article.image}
                alt={article.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
              />
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
                letterSpacing: '0.05em'
              }}>
                {article.category}
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
                fontFamily: 'Inter, sans-serif'
              }}>
                {article.title}
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
                  Por {article.author}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontFamily: 'Inter, sans-serif' }}>
                    {article.date}
                  </span>
                  <span style={{
                    color: '#f03b40',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {article.readTime}
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
