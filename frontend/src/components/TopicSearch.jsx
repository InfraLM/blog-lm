import React, { useState } from 'react';
import { Search } from 'lucide-react';

const TopicSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const topics = [
    "Taquicardia",
    "Sepse", 
    "Bradicardia",
    "Diarreia aguda",
    "Crise convulsiva",
    "Vasculite"
  ];

  const filteredTopics = topics.filter(topic => 
    topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Encontre um tópico:
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            placeholder="Digite para buscar..."
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filteredTopics.map((topic, index) => (
          <span
            key={index}
            className="inline-block bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 px-3 py-1 rounded-full text-sm cursor-pointer transition-colors duration-200"
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TopicSearch;
