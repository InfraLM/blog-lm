import React from 'react';
import { GraduationCap, Heart, Shield, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const PromoBlock = () => {
  const certifications = [
    { name: "Pós-graduação em Medicina de Emergência e Intensiva", icon: GraduationCap },
    { name: "Sala Vermelha Sempre Tranquila", icon: Heart },
    { name: "BLS", icon: Shield },
    { name: "ACLS", icon: Stethoscope },
    { name: "ATLS", icon: Shield }
  ];

  return (
    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-8 my-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">
          Domine a Medicina de Emergência e Intensiva
        </h2>
        <p className="text-red-100 text-lg">
          Estude com a Liberdade Médica e transforme conhecimento em prática com segurança e clareza.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {certifications.map((cert, index) => {
          const IconComponent = cert.icon;
          return (
            <div key={index} className="flex items-center gap-3 bg-red-400 bg-opacity-30 rounded-lg p-3">
              <IconComponent className="w-5 h-5 text-red-100" />
              <span className="text-sm font-medium text-red-50">{cert.name}</span>
            </div>
          );
        })}
      </div>
      
      <div className="text-center">
        <Button 
          className="bg-white text-red-600 hover:bg-red-50 font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
        >
          Cadastrar gratuitamente
        </Button>
      </div>
    </div>
  );
};

export default PromoBlock;
