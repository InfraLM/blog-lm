import React from 'react';
import { Clock, User, Users, Calendar, ChevronRight } from 'lucide-react';

const MainFeaturedCard = ({ article }) => {
  if (!article) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleClick = () => {
    window.location.href = `/artigo/${article.slug}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
         onClick={handleClick}>
      <div className="grid md:grid-cols-2">
        <div className="relative h-64 md:h-auto overflow-hidden bg-gradient-to-br from-red-100 to-red-50">
          {article.imagem_principal ? (
            <img 
              src={article.imagem_principal} 
              alt={article.titulo}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-red-200">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </div>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              ⭐ DESTAQUE
            </span>
          </div>
        </div>

        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-red-600 font-semibold text-sm uppercase tracking-wide">
                {article.categoria}
              </span>
              <span className="flex items-center gap-1 text-gray-500 text-sm">
                <Clock className="w-4 h-4" />
                {article.tempo_leitura || 5} min de leitura
              </span>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
              {article.titulo}
            </h2>

            {article.resumo && (
              <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                {article.resumo}
              </p>
            )}

            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User className="w-4 h-4 text-red-500" />
                <span className="font-medium">{article.autor}</span>
              </div>
              {article.coautor && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-red-400" />
                  <span>Co-autor: {article.coautor}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 text-red-600 font-medium group-hover:gap-3 transition-all">
              <span>Ler artigo</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFeaturedCard;