import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/globals.css';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import JobSearch from './pages/JobSearch';
import Analytics from './pages/Analytics';
import CareerRecommender from './pages/CareerRecommender';
import KCSECareerGuide from './pages/KCSECareerGuide';
import JobScraper from './pages/JobScraper';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<JobSearch />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/career" element={<CareerRecommender />} />
            <Route path="/kcse-guide" element={<KCSECareerGuide />} />
            <Route path="/scraper" element={<JobScraper />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;