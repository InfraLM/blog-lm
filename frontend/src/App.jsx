import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import PageTitle from './components/PageTitle';
import MainLayout from './components/MainLayout';
import MedicalContentPage from './components/MedicalContentPage';
import ArticleHeader from './components/ArticleHeader';
import ArticleNav from './components/ArticleNav';
import ArticleBody from './components/ArticleBody';
import BlogPage from './components/BlogPage';
import Footer from './components/Footer';
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
      let url;
      
      // Se tem slug, usar rota de slug
      if (slug) {
        url = `http://localhost:3001/api/articles/slug/${slug}`;
      } else if (id) {
        // Se tem ID, usar rota de ID
        url = `http://localhost:3001/api/articles/${id}`;
      }
      
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
      <ArticleBody content={article.content} />
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
      <Footer />
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
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/artigo/:id" element={<ArticlePage />} />
        <Route path="/artigo/:slug" element={<ArticlePage />} />
        <Route path="/post/:slug" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
