import React from 'react';
import { TrendingUp, Eye, ArrowUp } from 'lucide-react';

const MostClicked = () => {
  const mostClickedItems = [
    { title: "Protocolo de Sepse", views: "2.3k", trend: "up" },
    { title: "Manejo da Dor Torácica", views: "1.8k", trend: "up" },
    { title: "Intubação de Emergência", views: "1.5k", trend: "stable" },
    { title: "Choque Séptico", views: "1.2k", trend: "up" },
    { title: "Parada Cardiorrespiratória", views: "987", trend: "up" }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 card-shadow overflow-hidden">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
        <div className="flex items-center gap-2 text-white">
          <TrendingUp className="w-5 h-5" />
          <h3 className="font-bold text-lg">
            MAIS CLICADOS
          </h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-2">
          {mostClickedItems.map((item, index) => (
            <div
              key={index}
              className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-orange-200"
            >
              {/* Número do ranking */}
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                index === 0 ? 'bg-yellow-100 text-yellow-700' :
                index === 1 ? 'bg-gray-100 text-gray-700' :
                index === 2 ? 'bg-orange-100 text-orange-700' :
                'bg-gray-50 text-gray-600'
              }`}>
                {index + 1}
              </div>
              
              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 group-hover:text-red-600 transition-colors duration-200 text-sm leading-tight">
                  {item.title}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Eye className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{item.views} visualizações</span>
                </div>
              </div>
              
              {/* Indicador de tendência */}
              {item.trend === 'up' && (
                <div className="flex items-center gap-1">
                  <ArrowUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">↗</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <button className="text-orange-600 hover:text-orange-700 font-semibold text-sm bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg transition-colors duration-200">
            Ver ranking completo
          </button>
        </div>
      </div>
    </div>
  );
};

export default MostClicked;
