import React, { useState } from 'react';
import './MedicalContentPage.css';

const MedicalContentPage = () => {
  const [activeSection, setActiveSection] = useState('descricao-geral');

  // Conteúdo das seções
  const contentSections = {
    'descricao-geral': {
      title: 'Descrição Geral',
      content: `
        O AVC isquêmico é uma condição médica grave que requer atenção imediata e conhecimento especializado para um manejo adequado. Esta condição representa uma das principais causas de morbidade e mortalidade em todo o mundo, sendo fundamental que profissionais de saúde estejam preparados para identificar, diagnosticar e tratar adequadamente os pacientes acometidos.

        A compreensão dos mecanismos fisiopatológicos, sinais clínicos e abordagens terapêuticas é essencial para otimizar os resultados e minimizar as sequelas neurológicas. O tempo é um fator crítico no tratamento do AVC isquêmico, onde cada minuto pode fazer a diferença entre a recuperação completa e deficiências permanentes.
      `
    },
    'fisiopatologia': {
      title: 'Fisiopatologia',
      content: `
        O AVC isquêmico resulta da interrupção do fluxo sanguíneo cerebral, levando à isquemia e posterior necrose do tecido nervoso. Os mecanismos principais incluem trombose, embolia e hipoperfusão sistêmica.

        A cascata isquêmica inicia-se com a depleção de ATP, seguida por falha da bomba sódio-potássio, despolarização celular e influxo de cálcio. Estes eventos desencadeiam uma série de processos deletérios que culminam na morte neuronal se não houver intervenção adequada.
      `
    },
    'clinica': {
      title: 'Apresentação Clínica',
      content: `
        A apresentação clínica do AVC isquêmico varia conforme a localização e extensão da lesão. Os sinais mais comuns incluem hemiparesia, afasia, disartria, alterações visuais e déficits sensitivos.

        O reconhecimento precoce dos sinais de AVC é fundamental. A escala FAST (Face, Arms, Speech, Time) é uma ferramenta útil para identificação rápida dos sintomas mais característicos.
      `
    },
    'exame-fisico': {
      title: 'Exame Físico',
      content: `
        O exame físico deve ser sistemático e focado na avaliação neurológica. A escala NIHSS (National Institutes of Health Stroke Scale) é o padrão-ouro para quantificar a gravidade do déficit neurológico.

        Deve-se avaliar nível de consciência, função motora, sensitiva, coordenação, linguagem e campos visuais. O exame cardiovascular também é essencial para identificar possíveis fontes embólicas.
      `
    },
    'diagnostico': {
      title: 'Diagnóstico',
      content: `
        O diagnóstico de AVC isquêmico baseia-se na apresentação clínica e confirmação por neuroimagem. A tomografia computadorizada (TC) é o exame inicial para excluir hemorragia.

        A ressonância magnética (RM) com sequências de difusão é mais sensível para detectar isquemia aguda. Exames complementares incluem eletrocardiograma, ecocardiograma e estudos vasculares.
      `
    },
    'tratamento': {
      title: 'Tratamento',
      content: `
        O tratamento do AVC isquêmico agudo inclui terapia de reperfusão com trombolíticos intravenosos (rtPA) dentro de 4,5 horas ou trombectomia mecânica até 24 horas em casos selecionados.

        O manejo de suporte inclui controle da pressão arterial, glicemia, temperatura e prevenção de complicações. A reabilitação precoce é fundamental para otimizar a recuperação funcional.
      `
    },
    'procedimento': {
      title: 'Procedimentos',
      content: `
        Os principais procedimentos no AVC isquêmico incluem a administração de trombolíticos intravenosos e a trombectomia mecânica. A seleção do procedimento depende do tempo de início, localização da oclusão e condições clínicas do paciente.

        A trombectomia mecânica é indicada para oclusões de grandes vasos e pode ser realizada até 24 horas em pacientes selecionados com critérios de imagem favoráveis.
      `
    }
  };

  // Menu de navegação
  const navigationMenu = [
    { id: 'descricao-geral', label: 'Descrição geral', active: true },
    { id: 'fisiopatologia', label: 'Fisiopatologia' },
    { id: 'clinica', label: 'Clínica' },
    { id: 'exame-fisico', label: 'Exame Físico' },
    { id: 'diagnostico', label: 'Diagnóstico' },
    { id: 'tratamento', label: 'Tratamento' },
    { id: 'procedimento', label: 'Procedimento' }
  ];

  return (
    <div className="medical-content-page">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-container">
          <h1 className="main-title">Domine a Medicina de Emergência e Intensiva</h1>
          <p className="subtitle">
            Estude com a Liberdade Médica e transforme conhecimento em prática com <strong>segurança e clareza</strong>.
          </p>
          
          <div className="course-links">
            <a href="#" className="course-link">Pós-graduação em Medicina de Emergência e Intensiva</a>
            <div className="course-badges">
              <a href="#" className="badge-link">Sala Vermelha Sempre Tranquila</a>
              <span className="separator">|</span>
              <a href="#" className="badge-link">BLS</a>
              <span className="separator">|</span>
              <a href="#" className="badge-link">ACLS</a>
              <span className="separator">|</span>
              <a href="#" className="badge-link">ATLS</a>
            </div>
          </div>
          
          <button className="cta-button">Cadastrar gratuitamente</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-container">
          
          {/* Left Column */}
          <div className="left-column">
            
            {/* Topic Card */}
            <div className="topic-card">
              <h2 className="topic-title">AVC Isquêmico</h2>
              <div className="topic-intro">
                <p>
                  Um acidente vascular cerebral (AVC) isquêmico (também conhecido como acidente 
                  cerebrovascular) é uma lesão neurológica aguda que resulta da isquemia cerebral. Esta 
                  patologia pode ser causada pela oclusão dos vasos sanguíneos cerebrais por processos 
                  de trombose ou embolia, ou, raramente, por hipoperfusão sistêmica. A apresentação 
                  clínica inclui sintomas neurológicos, com perda motora e sensorial em vários graus, 
                  correspondentes à área cerebral afetada e à extensão da lesão no tecido.
                </p>
                <p>
                  Um acidente vascular cerebral (AVC) isquêmico (também conhecido como acidente 
                  cerebrovascular) é uma lesão neurológica aguda que resulta da isquemia cerebral. Esta 
                  patologia pode ser causada pela oclusão dos vasos sanguíneos cerebrais por processos 
                  de trombose ou embolia, ou, raramente, por hipoperfusão sistêmica. A apresentação 
                  clínica inclui sintomas neurológicos, com perda motora e sensorial em vários graus, 
                  correspondentes à área cerebral afetada e à extensão da lesão no tecido. Um acidente 
                  vascular cerebral (AVC) isquêmico (também conhecido como acidente cerebrovascular) é 
                  uma lesão neurológica aguda que resulta da isquemia cerebral. Esta patologia pode ser 
                  causada pela oclusão dos vasos sanguíneos cerebrais por processos de trombose ou 
                  embolia, ou, raramente, por hipoperfusão sistêmica.
                </p>
              </div>
              <div className="last-updated">Última atualização: Jul 11, 2023</div>
            </div>

            {/* Content Navigation and Sections */}
            <div className="content-layout">
              
              {/* Navigation Sidebar */}
              <div className="content-nav">
                <h3 className="nav-title">Conteúdo</h3>
                <ul className="nav-menu">
                  {navigationMenu.map((item) => (
                    <li key={item.id}>
                      <button
                        className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                        onClick={() => setActiveSection(item.id)}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Content Area */}
              <div className="content-area">
                <div className="content-card">
                  <h3 className="content-title">
                    {contentSections[activeSection]?.title}
                  </h3>
                  <div className="content-text">
                    {contentSections[activeSection]?.content.split('\n\n').map((paragraph, index) => (
                      paragraph.trim() && (
                        <p key={index}>{paragraph.trim()}</p>
                      )
                    ))}
                  </div>

                  {/* Example Table for Treatment Section */}
                  {activeSection === 'tratamento' && (
                    <div className="content-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Critério</th>
                            <th>Descrição</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Tempo de início</td>
                            <td>Menos de 4,5 horas para trombolíticos</td>
                          </tr>
                          <tr>
                            <td>Escala NIHSS</td>
                            <td>Avaliação neurológica padronizada</td>
                          </tr>
                          <tr>
                            <td>Contraindicações</td>
                            <td>Hemorragia ativa, cirurgia recente</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            <div className="time-badge">
              <div className="clock-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span>Em 1 minuto</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalContentPage;
