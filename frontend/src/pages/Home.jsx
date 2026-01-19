import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      title: 'Job Market Analytics',
      description: 'Real-time insights into job demand, salary trends, and market opportunities across industries.',
      icon: '📊',
      link: '/analytics'
    },
    {
      title: 'Smart Job Search',
      description: 'Advanced filtering and search capabilities to find the perfect job opportunities.',
      icon: '🔍',
      link: '/jobs'
    },
    {
      title: 'AI Career Guidance',
      description: 'Personalized career recommendations powered by advanced AI and market data.',
      icon: '🤖',
      link: '/career'
    },
    {
      title: 'KCSE Career Guide',
      description: 'Career guidance for KCSE students based on cluster points and interests.',
      icon: '🎓',
      link: '/kcse-guide'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Job Listings' },
    { value: '15+', label: 'Industries' },
    { value: '95%', label: 'Accuracy' },
    { value: '24/7', label: 'Updates' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
        color: 'white',
        padding: 'var(--space-16) 0'
      }}>
        <div className="container text-center">
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700', 
            marginBottom: 'var(--space-6)',
            color: 'white'
          }}>
            Navigate Your Career with AI
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            marginBottom: 'var(--space-8)',
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '600px',
            margin: '0 auto var(--space-8)'
          }}>
            PathFinder analyzes job markets, predicts trends, and provides personalized career recommendations using advanced AI technology.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/dashboard" className="btn btn-lg" style={{
              background: 'white',
              color: 'var(--primary-600)',
              fontWeight: '600'
            }}>
              Get Started
            </Link>
            <Link to="/analytics" className="btn btn-lg" style={{
              background: 'transparent',
              color: 'white',
              border: '2px solid white'
            }}>
              View Analytics
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: 'var(--space-16) 0', background: 'white' }}>
        <div className="container">
          <div className="grid grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: 'var(--space-16) 0' }}>
        <div className="container">
          <div className="text-center mb-8">
            <h2>Powerful Features for Career Success</h2>
            <p className="text-lg text-gray-600">
              Everything you need to make informed career decisions
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link} className="card" style={{ textDecoration: 'none' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>
                  {feature.icon}
                </div>
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-description">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        background: 'var(--gray-50)',
        padding: 'var(--space-16) 0'
      }}>
        <div className="container text-center">
          <h2>Ready to Transform Your Career?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Join thousands of professionals using PathFinder to navigate their career journey.
          </p>
          <Link to="/career" className="btn btn-primary btn-lg">
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;