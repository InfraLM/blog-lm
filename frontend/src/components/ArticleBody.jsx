import React from 'react';

const ArticleBody = ({ content }) => {
  // Se receber content, use-o, senão use o conteúdo padrão
  if (content) {
    return (
      <div className="article-body">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  }

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <div className="space-y-6">
                {defaultContent.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            )}
          </div>
          
          {/* Tabela de destaque exemplo */}
          <div className="mt-8 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#ff7e82' }}>
                  <th className="px-6 py-3 text-left text-white font-semibold">
                    Critério
                  </th>
                  <th className="px-6 py-3 text-left text-white font-semibold">
                    Descrição
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    Tempo de início
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Menos de 4,5 horas para trombolíticos
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    Escala NIHSS
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Avaliação neurológica padronizada
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    Contraindicações
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Hemorragia ativa, cirurgia recente
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleBody;
