import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import ArticleList from '../components/ArticleList';
import './Home.css';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('🚀 Iniciando busca de artigos...');
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            // IMPORTANTE: URL correta da API
            const response = await fetch('http://localhost:3001/api/articles');
            console.log('📡 Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Dados recebidos:', data);
            
            if (data.success && data.data) {
                setArticles(data.data);
                console.log(`📚 ${data.data.length} artigos carregados do banco!`);
            }
        } catch (error) {
            console.error('❌ Erro ao buscar artigos:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2>Carregando artigos do banco de dados...</h2>
        </div>;
    }

    if (error) {
        return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>
            <h2>Erro: {error}</h2>
            <button onClick={() => window.location.reload()}>Recarregar</button>
        </div>;
    }

    return (
        <div className="home-container">
            <HeroSection />
            {/* IMPORTANTE: Passar articles como props */}
            <ArticleList articles={articles} />
        </div>
    );
};

export default Home;