import React, { useState } from 'react';
import TaxonomyGrid from './TaxonomyGrid';
import './CombinedTopicsSection.css';

const CombinedTopicsSection = () => {
  const [activeFilter, setActiveFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Dados dos tópicos A-Z com placeholders de imagens
  const topicos = [
    {
      id: 1,
      title: "Taquicardia",
      image: "https://via.placeholder.com/120x80/e74c3c/ffffff?text=Taquicardia",
      letter: "T",
      color: "#e74c3c"
    },
    {
      id: 2,
      title: "Sepse",
      image: "https://via.placeholder.com/120x80/27ae60/ffffff?text=Sepse",
      letter: "S",
      color: "#27ae60"
    },
    {
      id: 3,
      title: "Bradicardia",
      image: "https://via.placeholder.com/120x80/e74c3c/ffffff?text=Bradicardia",
      letter: "B",
      color: "#e74c3c"
    },
    {
      id: 4,
      title: "Diarreia aguda",
      image: "https://via.placeholder.com/120x80/95a5a6/ffffff?text=Diarreia",
      letter: "D",
      color: "#95a5a6"
    },
    {
      id: 5,
      title: "Crise convulsiva",
      image: "https://via.placeholder.com/120x80/f39c12/ffffff?text=Convulsiva",
      letter: "C",
      color: "#f39c12"
    },
    {
      id: 6,
      title: "Vasculite",
      image: "https://via.placeholder.com/120x80/3498db/ffffff?text=Vasculite",
      letter: "V",
      color: "#3498db"
    }
  ];

  // Letras do alfabeto
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  // Filtrar tópicos baseado na busca e filtro de letra
  const filteredTopics = topicos.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !activeFilter || topic.letter === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <section className="combined-topics-section">
      <div className="combined-topics-container">
        {/* Coluna da Esquerda - Grandes Temas */}
        <div className="left-topics-column">
          <h2 className="section-title">GRANDES TEMAS</h2>
          <TaxonomyGrid />
        </div>

        {/* Coluna da Direita - Tópicos A-Z */}
        <div className="right-topics-column">
          <h2 className="section-title">TÓPICOS DE A-Z</h2>
          <p className="find-topic-text">Encontre um tópico:</p>
          
          {/* Navegação por alfabeto */}
          <div className="alphabet-nav">
            {alphabet.map((letter) => (
              <button
                key={letter}
                className={`alphabet-letter ${activeFilter === letter ? 'active' : ''}`}
                onClick={() => setActiveFilter(activeFilter === letter ? '' : letter)}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Barra de pesquisa */}
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Digite para buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          {/* Grid de tópicos com imagens */}
          <div className="topics-grid">
            {filteredTopics.map((topic) => (
              <div key={topic.id} className="topic-card">
                <div className="topic-card-image">
                  <img 
                    src={topic.image} 
                    alt={topic.title}
                    className="topic-image"
                  />
                </div>
                <div className="topic-card-content">
                  <div className="topic-card-title">{topic.title}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Mensagem quando não há resultados */}
          {filteredTopics.length === 0 && (
            <div className="no-results">
              <p>Nenhum tópico encontrado para "{searchTerm}" {activeFilter && `na letra "${activeFilter}"`}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CombinedTopicsSection;
