import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      background: 'var(--gray-900)', 
      color: 'var(--gray-300)', 
      padding: 'var(--space-8) 0',
      marginTop: 'var(--space-16)'
    }}>
      <div className="container">
        <div className="text-center">
          <p className="mb-2">
            <strong style={{ color: 'white' }}>PathFinder</strong> - AI-Powered Job Market Analyzer
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>
            Built with FastAPI, React, and AI • © 2024 PathFinder Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;