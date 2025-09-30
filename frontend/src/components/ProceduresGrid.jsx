import React from 'react';
import { Stethoscope, Heart, Activity, Zap, Shield, Users } from 'lucide-react';

const ProceduresGrid = () => {
  const procedures = [
    {
      title: "Intubação de Emergência",
      icon: Stethoscope,
      color: "bg-blue-500",
      description: "Técnicas e protocolos"
    },
    {
      title: "Ressuscitação Cardíaca",
      icon: Heart,
      color: "bg-red-500",
      description: "RCP e ACLS"
    },
    {
      title: "Monitorização Avançada",
      icon: Activity,
      color: "bg-green-500",
      description: "Sinais vitais críticos"
    },
    {
      title: "Desfibrilação",
      icon: Zap,
      color: "bg-yellow-500",
      description: "Cardioversão elétrica"
    },
    {
      title: "Acesso Vascular",
      icon: Shield,
      color: "bg-purple-500",
      description: "Central e periférico"
    },
    {
      title: "Trabalho em Equipe",
      icon: Users,
      color: "bg-indigo-500",
      description: "Comunicação efetiva"
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 card-shadow">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-red-500 pb-2 inline-block">
          PROCEDIMENTOS
        </h2>
      </div>
      
      {/* Grid de procedimentos - 3 colunas no desktop, 2 no tablet, 1 no mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {procedures.map((procedure, index) => {
          const IconComponent = procedure.icon;
          return (
            <div
              key={index}
              className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`${procedure.color} p-2 rounded-lg`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors duration-200">
                    {procedure.title}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {procedure.description}
              </p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-red-600 hover:text-red-700 font-medium text-sm bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors duration-200">
          Ver todos os procedimentos
        </button>
      </div>
    </div>
  );
};

export default ProceduresGrid;
