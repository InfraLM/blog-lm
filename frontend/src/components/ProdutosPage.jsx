import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { ExternalLink, GraduationCap, BookOpen, Award, FileText, Stethoscope } from 'lucide-react';

const ProdutosPage = () => {
  const produtos = [
    {
      id: 1,
      titulo: 'Pós-Graduação em Paciente Grave',
      descricao: 'Especialização completa para profissionais que buscam excelência no atendimento ao paciente crítico.',
      categoria: 'Pós-Graduação',
      url: 'https://liberdademedicaedu.com.br/pos-graduacao-assistencia-paciente-grave/',
      icon: GraduationCap,
      cor: 'from-blue-500 to-blue-600',
      destaque: true
    },
    {
      id: 2,
      titulo: 'ACLS',
      descricao: 'Curso de Suporte Avançado de Vida em Cardiologia - certificação internacional.',
      categoria: 'Certificação',
      url: 'https://liberdademedicaedu.com.br/curso-acls/',
      icon: Stethoscope,
      cor: 'from-red-500 to-red-600'
    },
    {
      id: 3,
      titulo: 'ATLS',
      descricao: 'Advanced Trauma Life Support - protocolo padrão-ouro no atendimento ao trauma.',
      categoria: 'Certificação',
      url: 'https://liberdademedicaedu.com.br/atls/',
      icon: Award,
      cor: 'from-orange-500 to-orange-600'
    },
    {
      id: 4,
      titulo: 'Formação em Paciente Grave',
      descricao: 'Programa completo de capacitação prática para o manejo do paciente crítico.',
      categoria: 'Formação',
      url: 'https://liberdademedicaedu.com.br/formacao-em-paciente-grave/',
      icon: BookOpen,
      cor: 'from-green-500 to-green-600',
      destaque: true
    },
    {
      id: 5,
      titulo: 'Guia do Paciente Grave 2025',
      descricao: 'Material de referência completo e atualizado com os protocolos mais recentes.',
      categoria: 'Material',
      url: 'https://liberdademedicaedu.com.br/guia-do-paciente-grave-2025/',
      icon: FileText,
      cor: 'from-purple-500 to-purple-600'
    },
    {
      id: 6,
      titulo: 'IOT Rio de Janeiro',
      descricao: 'Curso de Intubação Orotraqueal - treinamento prático intensivo no Rio de Janeiro.',
      categoria: 'Curso Prático',
      url: 'https://liberdademedicaedu.com.br/curso-intubacao-orotraqueal-rio-de-janeiro',
      icon: Stethoscope,
      cor: 'from-teal-500 to-teal-600'
    },
    {
      id: 7,
      titulo: 'IOT Brasília',
      descricao: 'Curso de Intubação Orotraqueal - treinamento prático intensivo em Brasília.',
      categoria: 'Curso Prático',
      url: 'https://liberdademedicaedu.com.br/curso-intubacao-orotraqueal-brasilia/',
      icon: Stethoscope,
      cor: 'from-cyan-500 to-cyan-600'
    },
    {
      id: 8,
      titulo: 'Dominando Paciente Grave',
      descricao: 'Curso intensivo focado em habilidades práticas para dominar o paciente crítico.',
      categoria: 'Curso',
      url: 'https://liberdademedicaedu.com.br/dominando-paciente-grave/',
      icon: Award,
      cor: 'from-indigo-500 to-indigo-600'
    }
  ];

  const handleProductClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Agrupar por categoria
  const categorias = [...new Set(produtos.map(p => p.categoria))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nossos Produtos e Cursos
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Cursos, certificações e materiais de excelência para profissionais da saúde que buscam aprimoramento contínuo
            </p>
          </div>
        </div>
      </div>

      {/* Produtos em Destaque */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Mais procurados
          </h2>
          <p className="text-gray-600">
            Nossos programas mais completos e procurados
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {produtos.filter(p => p.destaque).map((produto) => {
            const Icon = produto.icon;
            return (
              <div
                key={produto.id}
                onClick={() => handleProductClick(produto.url)}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent hover:border-red-500"
              >
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${produto.cor} opacity-5 rounded-full -mr-32 -mt-32 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative p-8">
                  {/* Icon e Categoria */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${produto.cor} text-white`}>
                      <Icon size={32} />
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                      {produto.categoria}
                    </span>
                  </div>

                  {/* Título */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                    {produto.titulo}
                  </h3>

                  {/* Descrição */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {produto.descricao}
                  </p>

                  {/* Link */}
                  <div className="flex items-center text-red-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                    <span>Saiba mais</span>
                    <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Todos os Produtos */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Todos os Produtos
          </h2>
          <p className="text-gray-600">
            Explore nossa linha completa de cursos, materiais e certificações
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map((produto) => {
            const Icon = produto.icon;
            return (
              <div
                key={produto.id}
                onClick={() => handleProductClick(produto.url)}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1"
              >
                {/* Header com gradiente */}
                <div className={`h-2 bg-gradient-to-r ${produto.cor}`}></div>
                
                <div className="p-6">
                  {/* Icon e Categoria */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${produto.cor} text-white`}>
                      <Icon size={24} />
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      {produto.categoria}
                    </span>
                  </div>

                  {/* Título */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                    {produto.titulo}
                  </h3>

                  {/* Descrição */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {produto.descricao}
                  </p>

                  {/* Link */}
                  <div className="flex items-center text-red-600 text-sm font-semibold group-hover:gap-2 gap-1 transition-all">
                    <span>Acessar curso</span>
                    <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProdutosPage;