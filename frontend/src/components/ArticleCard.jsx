import React from 'react';
import { Clock, User, Users, Calendar, ArrowRight } from 'lucide-react';

const ArticleCard = ({ article }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleClick = () => {
    window.location.href = `/artigo/${article.slug}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col"
         onClick={handleClick}>
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
        {article.imagem_principal ? (
          <img 
            src={article.imagem_principal} 
            alt={article.titulo}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-300">
              <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
          </div>
        )}
        {article.destaque && (
          <div className="absolute top-2 right-2">
            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
              Destaque
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">
            {article.categoria}
          </span>
          <span className="flex items-center gap-1 text-gray-500 text-xs">
            <Clock className="w-3 h-3" />
            {article.tempo_leitura || 5} min
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
          {article.titulo}
        </h3>

        {article.resumo && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
            {article.resumo}
          </p>
        )}

        <div className="space-y-2 pt-3 border-t border-gray-100">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <User className="w-3 h-3" />
              <span>{article.autor}</span>
            </div>
            {article.coautor && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                <span>{article.coautor}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(article.created_at)}
            </span>
            <ArrowRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;