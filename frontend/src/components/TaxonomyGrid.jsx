import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

const TaxonomyGrid = () => {
  const topics = [
    "Tudo sobre AVC",
    "Tudo sobre asma", 
    "Tudo sobre choque cardiogênico",
    "Tudo sobre síndrome nefrótica"
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 card-shadow">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-bold text-gray-800">
          TÓPICOS DE A–Z / GRANDES TEMAS
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="group border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            style={{ 
              backgroundColor: '#ff7e82',
              borderColor: '#d9d9d9'
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold group-hover:text-red-50">
                {topic}
              </span>
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        ))}
      </div>
      
      
    </div>
  );
};

export default TaxonomyGrid;
