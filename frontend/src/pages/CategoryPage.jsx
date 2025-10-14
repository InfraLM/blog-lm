import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArticleList from '../components/ArticleList';
import './CategoryPage.css';
import { articleService } from '@/services/api';

const CategoryPage = () => {
  const { categoria } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryArticles();
  }, [categoria]);

  const fetchCategoryArticles = async () => {
    try {
      setLoading(true);
      // Usando o serviço centralizado
      const data = await articleService.getByCategory(categoria);
      
      if (data.success) {
        setArticles(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar artigos da categoria:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="category-page">
      <header className="category-header">
        <h1>Categoria: {categoria}</h1>
        <p>{articles.length} artigos encontrados</p>
      </header>
      
      <ArticleList articles={articles} />
    </div>
  );
};

export default CategoryPage;

