import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import ArticleList from '../components/ArticleList';
import './Home.css';
import { articleService } from '@/services/api';

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
            // Usando o serviço centralizado em vez de fetch direto
            const data = await articleService.getAll();
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
            <ArticleList articles={articles} />
        </div>
    );
};

export default Home;