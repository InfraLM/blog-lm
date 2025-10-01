import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Eye } from 'lucide-react';
import './ArticleDetail.css';

const ArticleDetail = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [id, slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      
      // Dados de exemplo para demonstração
      const mockArticles = {
        '2': {
          id: 2,
          titulo: 'Urticária: Diagnóstico e Tratamento na Emergência',
          categoria: 'Dermatologia',
          autor: 'Dr. João Silva',
          data_criacao: '2025-09-30T10:00:00.000Z',
          data_atualizacao: '2025-09-30T15:00:00.000Z',
          content: `
            <h2>Definição</h2>
            <p>A urticária é uma das condições dermatológicas mais comuns na emergência, caracterizada por lesões eritematosas, elevadas e pruriginosas que podem aparecer e desaparecer rapidamente. O reconhecimento precoce e tratamento adequado são essenciais para o alívio dos sintomas e prevenção de complicações.</p>
            
            <h3>Classificação</h3>
            <p>A urticária é uma condição dermatológica caracterizada pela formação de <strong>urticas</strong> (pápulas ou placas eritematosas, elevadas e pruriginosas) que resultam da liberação de histamina e outros mediadores inflamatórios pelos mastócitos dérmicos.</p>
            
            <h4>Urticária aguda:</h4>
            <p>Duração menor que 6 semanas</p>
            
            <h4>Urticária crônica:</h4>
            <p>Duração igual ou maior que 6 semanas</p>
            
            <h4>Urticária física:</h4>
            <p>Desencadeada por estímulos físicos</p>
            
            <h4>Urticária colinérgica:</h4>
            <p>Relacionada ao calor e exercício</p>
            
            <h3>Causas e Fatores de Risco</h3>
            
            <h4>Principais Causas</h4>
            <ul>
              <li><strong>Medicamentos:</strong> AINEs, antibióticos (penicilina), ACE inibidores</li>
              <li><strong>Alimentos:</strong> Frutos do mar, nozes, ovos, leite, frutas cítricas</li>
              <li><strong>Infecções:</strong> Virais (mais comum), bacterianas, parasitárias</li>
              <li><strong>Fatores físicos:</strong> Frio, calor, pressão, vibração, luz solar</li>
            </ul>
            
            <h4>Fatores de Risco</h4>
            <ul>
              <li>História pessoal ou familiar de atopia</li>
              <li>Uso recente de medicamentos</li>
              <li>Infecções recentes</li>
              <li>Estresse emocional</li>
              <li>Doenças autoimunes</li>
            </ul>
            
            <h3>Epidemiologia</h3>
            <p><strong>Prevalência:</strong> 15-25% da população em algum momento da vida</p>
            
            <h3>Manifestações Clínicas</h3>
            
            <h4>Sintomas Constitucionais</h4>
            <p>As manifestações constitucionais incluem fadiga presente em mais de 90% dos pacientes, febre baixa sem foco infeccioso, perda de peso não intencional e mal-estar geral como sintoma inespecífico comum.</p>
            
            <h4>Manifestações Cutâneas</h4>
            <p>Presentes em 85% dos casos, as manifestações cutâneas incluem rash malar em "asa de borboleta", rash discoide com lesões cicatriciais, fotossensibilidade com exacerbação pela exposição solar e úlceras orais geralmente indolores.</p>
            
            <h4>Manifestações Articulares</h4>
            <p>Ocorrem em 95% dos pacientes e compreendem artralgia (dor articular sem inflamação), artrite não erosiva e simétrica, rigidez matinal de duração variável e raramente deformidades (artropatia de Jaccoud).</p>
          `
        },
        '3': {
          id: 3,
          titulo: 'Lúpus Eritematoso Sistêmico: Diagnóstico e Manejo Clínico',
          categoria: 'Reumatologia',
          autor: 'Dra. Maria Santos',
          data_criacao: '2025-09-30T09:00:00.000Z',
          data_atualizacao: '2025-09-30T14:00:00.000Z',
          content: `
            <h2>Definição</h2>
            <p>O Lúpus Eritematoso Sistêmico (LES) é uma doença autoimune multissistêmica crônica que pode afetar praticamente qualquer órgão. Caracteriza-se por períodos de atividade e remissão, exigindo diagnóstico precoce e manejo multidisciplinar para melhor prognóstico.</p>
            
            <h3>Características Principais</h3>
            <p>O LES é uma <strong>doença autoimune sistêmica crônica</strong> caracterizada pela produção de autoanticorpos dirigidos contra componentes nucleares e citoplasmáticos celulares, resultando em inflamação e dano tecidual em múltiplos órgãos.</p>
            
            <h3>Fatores Ambientais</h3>
            <p>A doença apresenta natureza autoimune com perda da tolerância imunológica, curso crônico com períodos de atividade e remissão, acometimento multissistêmico envolvendo pele, articulações, rim e sistema nervoso central, além de predominío feminino com relação de 9:1 entre mulheres e homens.</p>
            
            <h4>Fatores Genéticos</h4>
            <p>A predisposição genética inclui associação com HLA-DR2 e HLA-DR3, deficiências do complemento (C1q, C2, C4), genes de suscetibilidade como PTPN22, STAT4 e IRF5, além de concordância de 25-50% em gêmeos monozigóticos.</p>
            
            <h4>Fatores Hormonais</h4>
            <p>O estrógeno influencia no desenvolvimento e atividade da doença, a gravidez pode desencadear ou exacerbar os sintomas, e a menarca precoce constitui fator de risco.</p>
            
            <h4>Fatores Ambientais</h4>
            <p>Entre os fatores ambientais destacam-se infecções virais (EBV, CMV), exposição solar com radiação UV, medicamentos como hidralazina, procainamida e isoniazida, além de estresse físico e emocional.</p>
            
            <h3>Epidemiologia</h3>
            <p>A prevalência varia entre 40-200 casos por 100.000 habitantes, com idade de início típica entre 15-45 anos, apresentando pico na terceira década de vida. Há maior prevalência em afrodescendentes e hispânicos.</p>
            
            <h3>Manifestações Clínicas</h3>
            
            <h4>Sintomas Constitucionais</h4>
            <p>As manifestações constitucionais incluem fadiga presente em mais de 90% dos pacientes, febre baixa sem foco infeccioso, perda de peso não intencional e mal-estar geral como sintoma inespecífico comum.</p>
            
            <h4>Manifestações Cutâneas</h4>
            <p>Presentes em 85% dos casos, as manifestações cutâneas incluem rash malar em "asa de borboleta", rash discoide com lesões cicatriciais, fotossensibilidade com exacerbação pela exposição solar e úlceras orais geralmente indolores.</p>
            
            <h4>Manifestações Articulares</h4>
            <p>Ocorrem em 95% dos pacientes e compreendem artralgia (dor articular sem inflamação), artrite não erosiva e simétrica, rigidez matinal de duração variável e raramente deformidades (artropatia de Jaccoud).</p>
            
            <h4>Manifestações Renais</h4>
            <p>A nefrite lúpica acomete 50% dos pacientes, manifestando-se como glomerulonefrite, proteinúria maior que 0,5g/24h, hematúria microscópica ou macroscópica e hipertensão arterial secundária ao acometimento renal.</p>
          `
        }
      };
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockArticle = mockArticles[id];
      if (mockArticle) {
        setArticle(mockArticle);
      } else {
        throw new Error('Artigo não encontrado');
      }
      
    } catch (err) {
      console.error('❌ Erro ao carregar artigo:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Função para extrair títulos do conteúdo HTML e criar índice
  const extractHeadings = (htmlContent) => {
    if (!htmlContent) return [];
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    return Array.from(headings).map((heading, index) => ({
      id: `heading-${index}`,
      text: heading.textContent,
      level: parseInt(heading.tagName.charAt(1))
    }));
  };

  const scrollToHeading = (headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Função para adicionar IDs aos títulos no conteúdo HTML
  const addIdsToHeadings = (htmlContent) => {
    if (!htmlContent) return '';
    
    let content = htmlContent;
    const headingRegex = /<(h[1-6])([^>]*)>(.*?)<\/h[1-6]>/gi;
    let headingIndex = 0;
    
    content = content.replace(headingRegex, (match, tag, attributes, text) => {
      const id = `heading-${headingIndex}`;
      headingIndex++;
      return `<${tag}${attributes} id="${id}">${text}</${tag}>`;
    });
    
    return content;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando artigo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>❌ {error}</h2>
        <button onClick={() => navigate('/')}>Voltar para Home</button>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  const headings = extractHeadings(article.content);
  const contentWithIds = addIdsToHeadings(article.content);

  return (
    <div className="article-page">
      {/* Header Hero Section */}
      <div className="article-hero">
        <div className="article-hero-content">
          <div className="article-category-badge">
            {article.categoria}
          </div>
          <h1 className="article-hero-title">{article.titulo}</h1>
        </div>
      </div>

      <div className="article-layout">
        {/* Sidebar com Índice */}
        {headings.length > 0 && (
          <aside className="article-sidebar">
            <div className="sidebar-content">
              <h3 className="sidebar-title">ÍNDICE</h3>
              <nav className="article-index">
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    className={`index-item level-${heading.level}`}
                    onClick={() => scrollToHeading(heading.id)}
                  >
                    {heading.text}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* Conteúdo Principal */}
        <main className="article-main">
          <div className="article-container">
            {/* Botão Voltar */}
            <button 
              className="btn-back"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
              Voltar
            </button>

            {/* Meta informações */}
            <div className="article-meta">
              <span className="meta-author">Por {article.autor}</span>
              <span className="meta-separator">|</span>
              <span className="meta-date">{formatDate(article.data_criacao)}</span>
            </div>

            {/* Introdução/Resumo */}
            <div className="article-intro">
              <p>
                Você já se perguntou sobre <strong>{article.titulo.toLowerCase()}</strong>? 
                Este artigo apresenta informações baseadas em evidências científicas 
                para profissionais da saúde.
              </p>
            </div>

            {/* Conteúdo do Artigo */}
            <div className="article-content">
              {article.content && article.content.includes('<') ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: contentWithIds }}
                />
              ) : (
                <div className="article-text">
                  {article.content?.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Footer do Artigo */}
            <footer className="article-footer">
              {article.data_atualizacao && (
                <p className="last-update">
                  Última atualização: {formatDate(article.data_atualizacao)}
                </p>
              )}
              
              {article.tags && article.tags.length > 0 && (
                <div className="article-tags">
                  {article.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ArticleDetail;
