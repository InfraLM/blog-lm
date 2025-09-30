import React, { useState } from 'react';
import './ProceduresVideoSection.css';

const ProceduresVideoSection = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Dados dos vídeos de procedimentos
  // Para usar vídeos reais do YouTube, substitua os IDs pelos seus vídeos
  const procedureVideos = [
    {
      id: 1,
      title: "Intubação Orotraqueal: Técnica Completa",
      description: "Aprenda o passo a passo da intubação orotraqueal com técnicas avançadas e dicas práticas.",
      duration: "8:45",
      views: "12.5K",
      // Para vídeo real do YouTube, use: videoId: "SEU_VIDEO_ID_AQUI"
      videoId: "dQw4w9WgXcQ", // Placeholder - substitua pelo ID real
      thumbnail: "https://via.placeholder.com/400x225/e74c3c/ffffff?text=Intubação+Orotraqueal",
      category: "Procedimentos Avançados"
    },
    {
      id: 2,
      title: "Punção Venosa Central: Guia Prático",
      description: "Técnica segura para punção venosa central com orientações sobre anatomia e complicações.",
      duration: "12:30",
      views: "8.9K",
      videoId: "dQw4w9WgXcQ", // Placeholder - substitua pelo ID real
      thumbnail: "https://via.placeholder.com/400x225/27ae60/ffffff?text=Punção+Venosa+Central",
      category: "Procedimentos Invasivos"
    },
    {
      id: 3,
      title: "Sutura: Técnicas e Materiais",
      description: "Diferentes tipos de sutura, escolha de materiais e técnicas para melhor cicatrização.",
      duration: "15:20",
      views: "25.3K",
      videoId: "dQw4w9WgXcQ", // Placeholder - substitua pelo ID real
      thumbnail: "https://via.placeholder.com/400x225/3498db/ffffff?text=Técnicas+de+Sutura",
      category: "Procedimentos Básicos"
    }
  ];

  // Função para abrir vídeo do YouTube
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
                  src={video.thumbnail} // Use getYoutubeThumbnail(video.videoId) para thumbnails reais
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
          <button className="view-all-button">
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
