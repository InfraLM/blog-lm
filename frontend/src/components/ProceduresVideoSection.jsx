import React, { useState } from 'react';
import './ProceduresVideoSection.css';

const ProceduresVideoSection = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Dados dos vídeos de procedimentos - ATUALIZADOS COM TÍTULOS REAIS
  const procedureVideos = [
    {
      id: 1,
      title: "INTUBAÇÃO OROTRAQUEAL | COMO FAZER DE FORMA SIMPLES?",
      description: "Aprenda o passo a passo da intubação orotraqueal com técnicas avançadas e dicas práticas para realizar o procedimento de forma simples e segura.",
      duration: "32:55",
      views: "2K",
      videoId: "yTzbOhmpfqU",
      category: "Procedimentos Avançados"
    },
    {
      id: 2,
      title: "ACESSO VENOSO CENTRAL | AULA PRÁTICA COMPLETA",
      description: "Técnica segura para punção venoso central com orientações detalhadas sobre anatomia, indicações e como evitar complicações.",
      duration: "22:02",
      views: "102K",
      videoId: "zmO3kJCiV8g",
      category: "Procedimentos Invasivos"
    },
    {
      id: 3,
      title: "SUTURA NO COURO CABELUDO EM ANGOLA | PROCEDIMENTO COMPLETO",
      description: "Demonstração prática completa de técnica de sutura em couro cabeludo, com dicas sobre materiais e técnicas para melhor cicatrização.",
      duration: "07:11",
      views: "1K",
      videoId: "yDWWeg92a94",
      category: "Procedimentos Práticos"
    }
  ];

  const openVideo = (video) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
    window.open(youtubeUrl, '_blank');
  };

  // Função para obter thumbnail real do YouTube
  const getYoutubeThumbnail = (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  return (
    <section className="procedures-video-section">
      <div className="procedures-container">
        <div className="section-header">
          <h2 className="section-title">Procedimentos em Vídeo</h2>
          <p className="section-subtitle">
            Aprenda técnicas médicas essenciais com nossos vídeos educativos
          </p>
        </div>

        <div className="videos-grid">
          {procedureVideos.map((video) => (
            <div 
              key={video.id} 
              className="video-card"
              onClick={() => openVideo(video)}
            >
              <div className="video-thumbnail">
                <img 
                  src={getYoutubeThumbnail(video.videoId)}
                  alt={video.title}
                  className="thumbnail-image"
                />
                <div className="play-overlay">
                  <div className="play-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="video-duration">{video.duration}</div>
                <div className="video-category">{video.category}</div>
              </div>
              
              <div className="video-content">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-description">{video.description}</p>
                <div className="video-stats">
                  <span className="views">{video.views} visualizações</span>
                  <span className="youtube-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    YouTube
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-footer">
          <button 
            className="view-all-button"
            onClick={() => window.open('https://www.youtube.com/@liberdademedicatv', '_blank')}
          >
            Ver Todos os Procedimentos
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
export default ProceduresVideoSection;