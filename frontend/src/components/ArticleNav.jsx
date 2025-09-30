import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const ArticleNav = ({ sections }) => {
  const [activeSection, setActiveSection] = useState(0);

  const defaultSections = [
    "Descrição Geral",
    "Fisiopatologia", 
    "Apresentação Clínica",
    "Exame Físico",
    "Diagnóstico",
    "Tratamento",
    "Procedimento"
  ];

  const sectionList = sections || defaultSections;

  return (
    <div className="bg-gray-50 border-b border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <nav className="flex flex-wrap gap-2">
          {sectionList.map((section, index) => (
            <button
              key={index}
              onClick={() => setActiveSection(index)}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeSection === index
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200'
              }`}
            >
              {section}
              {activeSection === index && (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ArticleNav;
