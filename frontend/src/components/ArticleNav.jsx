import React from 'react';
import { ArrowLeft } from 'lucide-react';

const ArticleNav = ({ onNavigateBack }) => {
  return (
    <div style={{
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        {onNavigateBack && (
          <button 
            onClick={onNavigateBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#f3f4f6',
              border: '1px solid #d1d5db',
              color: '#374151',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#e5e7eb';
              e.target.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#f3f4f6';
              e.target.style.color = '#374151';
            }}
          >
            <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
            Voltar
          </button>
        )}
      </div>
    </div>
  );
};

export default ArticleNav;
