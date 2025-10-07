import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MainLayout from './components/MainLayout';
import BlogPage from './components/BlogPage';
import ArticleDetail from './pages/ArticleDetail';
import Footer from './components/Footer';
import './App.css';

// Componente HomePage
function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MainLayout />
      <Footer />
    </div>
  );
}

// App principal com rotas
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/artigo/:slug" element={<ArticleDetail />} />
        <Route path="/post/:slug" element={<ArticleDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;