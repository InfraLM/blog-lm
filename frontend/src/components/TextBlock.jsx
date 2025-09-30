import React from 'react';
import { MessageCircle, Clock, Phone } from 'lucide-react';

const TextBlock = ({ text }) => {
  return (
    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 card-shadow relative overflow-hidden">
      {/* Padrão de fundo decorativo */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-10 rounded-full -translate-y-8 translate-x-8"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-white opacity-5 rounded-full translate-y-6 -translate-x-6"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg">WhatsApp</h3>
        </div>
        
        <p className="text-green-100 text-sm font-medium mb-4 leading-relaxed">
          {text || "Obtenha condutas clínicas 24/7 pelo WhatsApp"}
        </p>
        
        <div className="flex items-center gap-4 text-green-100 text-xs mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>24/7</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>Resposta rápida</span>
          </div>
        </div>
        
        <button className="w-full bg-white text-green-600 font-semibold py-2 px-4 rounded-lg hover:bg-green-50 transition-colors duration-200 flex items-center justify-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Iniciar conversa
        </button>
      </div>
    </div>
  );
};

export default TextBlock;
