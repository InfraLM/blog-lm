import React from 'react';
import { Calendar } from 'lucide-react';

const ArticleHeader = ({ title, lastUpdated }) => {
  return (
    <div className="bg-white border-b border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            Última atualização: {lastUpdated}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArticleHeader;
