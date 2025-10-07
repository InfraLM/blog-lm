import React from 'react';

const ArticleHeader = ({ 
  title, 
  lastUpdated, 
  categoria, 
  autor, 
  coautor, 
  resumo, 
  tempoLeitura = 5,
  visualizacoes = 0 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-8">
        {/* Categoria */}
        {categoria && (
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {categoria}
            </span>
          </div>
        )}

        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {title}
        </h1>

        {/* Resumo */}
        {resumo && (
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            {resumo}
          </p>
        )}

        {/* Metadados do artigo */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {/* Autor */}
          {autor && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>
                {autor}
                {coautor && `, ${coautor}`}
              </span>
            </div>
          )}

          {/* Data de atualização */}
          {lastUpdated && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>Atualizado em {formatDate(lastUpdated)}</span>
            </div>
          )}

          {/* Tempo de leitura */}
          {tempoLeitura && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{tempoLeitura} min de leitura</span>
            </div>
          )}

          {/* Visualizações */}
          {visualizacoes > 0 && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span>{visualizacoes.toLocaleString('pt-BR')} visualizações</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleHeader;
