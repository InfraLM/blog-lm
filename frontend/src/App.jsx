import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import PageTitle from './components/PageTitle';
import MainLayout from './components/MainLayout';
import MedicalContentPage from './components/MedicalContentPage';
import ArticleHeader from './components/ArticleHeader';
import ArticleNav from './components/ArticleNav';
import ArticleBody from './components/ArticleBody';
import './App.css';

// Componente para a página dinâmica de artigo
function ArticlePage() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id, slug]);

  const fetchArticle = async () => {
    try {
      const url = id 
        ? `http://localhost:3001/api/articles/${id}`
        : `http://localhost:3001/api/articles/${slug}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success && data.data) {
        setArticle(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar artigo:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!article) return <div className="p-8 text-center">Artigo não encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ArticleHeader 
        title={article.titulo} 
        lastUpdated={article.data_atualizacao || article.data_criacao}
        categoria={article.categoria}
        autor={article.autor}
      />
      <ArticleNav 
        onNavigateBack={() => navigate('/')}
      />
      <ArticleBody content={article.content || article.conteudo_completo} />
    </div>
  );
}

// Componente HomePage com a lógica original
function HomePage() {
  const [currentView, setCurrentView] = useState('home');
  const navigate = useNavigate();

  const renderHomePage = () => (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MainLayout />
      
      <section className="container mx-auto px-4 py-8 text-center space-y-4">
        <button
          onClick={() => setCurrentView('medical')}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg mr-4"
        >
          Ver Página Médica: AVC Isquêmico
        </button>
        
        {/* Botões para acessar artigos por ID */}
        <div className="mt-4 space-x-4">
          <button
            onClick={() => navigate('/artigo/1')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Ver Artigo 1
          </button>
          <button
            onClick={() => navigate('/artigo/2')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Ver Artigo 2
          </button>
          <button
            onClick={() => navigate('/artigo/3')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Ver Artigo 3
          </button>
        </div>
      </section>
    </div>
  );

  const renderMedicalPage = () => (
    <div className="min-h-screen">
      <MedicalContentPage />
      
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => setCurrentView('home')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
          >
            ← Voltar para Home
          </button>
        </div>
      </div>
    </div>
  );

  const renderArticlePage = () => (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ArticleHeader 
        title="AVC Isquêmico" 
        lastUpdated="Jul 11, 2023" 
      />
      <ArticleNav />
      <ArticleBody />
      
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => setCurrentView('home')}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
        >
          ← Voltar para Home
        </button>
      </div>
    </div>
  );

  switch (currentView) {
    case 'medical':
      return renderMedicalPage();
    case 'article':
      return renderArticlePage();
    default:
      return renderHomePage();
  }
}

// App principal com rotas
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/artigo/:id" element={<ArticlePage />} />
        <Route path="/post/:slug" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
