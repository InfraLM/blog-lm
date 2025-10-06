import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#1f2937',
      color: '#d1d5db',
      padding: '2rem 0',
      marginTop: '4rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '0.875rem',
          fontFamily: 'Inter, sans-serif',
          margin: 0,
          lineHeight: '1.5'
        }}>
          © 2025 | Liberdade Médica LTDA. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
