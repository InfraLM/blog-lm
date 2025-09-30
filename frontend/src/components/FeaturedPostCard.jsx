import React from "react";
import "./FeaturedPostCard.css";

const FeaturedPostCard = () => {
  const miniCards = [
    {
      category: "RELATIONSHIPS",
      title: "Comunicação Efetiva no Relacionamento",
      author: "Por Dra. Maria Santos",
    },
    {
      category: "SLEEP AND DREAMING",
      title: "A Importância do Sono para a Saúde Mental",
      author: "Por Dr. Carlos Lima",
    },
    {
      category: "STRESS MANAGEMENT",
      title: "Técnicas de Relaxamento para o Dia a Dia",
      author: "Por Dra. Ana Costa",
    },
  ];

  return (
    <div className="featured-post-container">
      {/* Coluna da Esquerda */}
      <div className="left-column">
        {/* Card Principal de Destaque */}
        <article className="main-card">
          <div className="main-card-image">
            <img 
              src="https://via.placeholder.com/600x350/4a90e2/ffffff?text=Imagem+de+Destaque" 
              alt="Imagem de destaque"
            />
          </div>
          <div className="main-card-content">
            <div className="main-category">RELATIONSHIPS</div>
            <h1 className="main-title">
              Como Construir Relacionamentos Saudáveis e Duradouros
            </h1>
            <div className="main-authorship">
              Por Dr. João Silva • Revisado em 15 de março de 2024
            </div>
          </div>
        </article>

        {/* Três Mini-Cards em Linha */}
        <div className="mini-cards-row">
          {miniCards.map((card, index) => (
            <article key={index} className="mini-card">
              <div className="mini-category">{card.category}</div>
              <h3 className="mini-title">{card.title}</h3>
              <div className="mini-author">{card.author}</div>
            </article>
          ))}
        </div>
      </div>

      {/* Coluna da Direita */}
      <div className="right-column">
        {/* Card Superior (Vermelho) */}
        <article className="red-card">
          <div className="red-card-image-container">
            <img 
              src="https://via.placeholder.com/400x280/e74c3c/ffffff?text=Imagem+Médica" 
              alt="Imagem médica"
            />
            <div className="trending-badge">EM ALTA</div>
          </div>
          <div className="red-card-content">
            <h3 className="red-card-title">
              Diagnóstico por Imagem: Novos Avanços
            </h3>
          </div>
        </article>

        {/* Card Inferior (Laranja) */}
        <article className="orange-card">
          <div className="orange-card-content">
            <div className="phone-image">
              <img 
                src="https://via.placeholder.com/110x170/34495e/ffffff?text=Print+do+WhatsApp" 
                alt="Print do WhatsApp"
              />
            </div>
            <div className="promo-text">
              <h3>Obtenha condutas clínicas 24/7 pelo WhatsApp</h3>
              <p>Acesso rápido e prático a orientações médicas especializadas</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default FeaturedPostCard;
