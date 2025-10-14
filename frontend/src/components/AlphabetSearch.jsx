import React, { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { articleService } from '@/services/api';

const AlphabetSearch = ({ onSearch, onClear }) => {
  const [selectedLetter, setSelectedLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultCount, setResultCount] = useState(0);
  
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  const handleLetterClick = async (letter) => {
    if (selectedLetter === letter) {
      handleClear();
      return;
    }

    setSelectedLetter(letter);
    setIsLoading(true);
    
    try {
      const response = await fetch(`${articleService.apiUrl}/api/articles/search-by-letter/${letter}`);
      const data = await response.json();
      
      if (data.success) {
        setResultCount(data.data.length);
        if (onSearch) onSearch(data.data, letter);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      setResultCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedLetter('');
    setResultCount(0);
    if (onClear) onClear();
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-lg">
            <Search className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Buscar por Tópicos
            </h3>
            <p className="text-sm text-gray-500">
              Clique em uma letra para filtrar
            </p>
          </div>
        </div>
        {selectedLetter && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
            Limpar
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-9 sm:grid-cols-13 gap-2 mb-4">
        {alphabet.map(letter => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            disabled={isLoading}
            className={`
              relative py-2 px-3 text-sm font-bold rounded-lg transition-all duration-200
              ${selectedLetter === letter 
                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg transform scale-110 z-10' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md hover:scale-105'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            `}
          >
            {letter}
          </button>
        ))}
      </div>
      
      {selectedLetter && (
        <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                <span className="text-sm text-gray-600">Buscando...</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  <span className="font-bold">{resultCount}</span> resultado(s) para a letra 
                  <span className="font-bold text-red-600 ml-1">"{selectedLetter}"</span>
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlphabetSearch;