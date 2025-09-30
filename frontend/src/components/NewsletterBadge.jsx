import React from 'react';
import { Users, Mail, TrendingUp } from 'lucide-react';

const NewsletterBadge = ({ count }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 card-shadow relative overflow-hidden">
      {/* Padrão de fundo decorativo */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-5 rounded-full translate-y-8 -translate-x-8"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg">Newsletter</h3>
        </div>
        
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-6 h-6 text-blue-100" />
            <span className="text-white font-bold text-2xl">
              {count || "12 mil+"}
            </span>
          </div>
          <p className="text-blue-100 text-sm font-medium">
            profissionais assinantes
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-blue-100 text-xs">
          <TrendingUp className="w-3 h-3" />
          <span>+15% este mês</span>
        </div>
        
        <button className="w-full mt-4 bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-200">
          Assinar gratuitamente
        </button>
      </div>
    </div>
  );
};

export default NewsletterBadge;
