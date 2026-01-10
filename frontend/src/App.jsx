import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import Sidebar from './components/common/Sidebar.jsx';
import { AppProvider } from './context/AppContext.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const JobSearch = lazy(() => import('./pages/JobSearch.jsx'));
const CareerRecommender = lazy(() => import('./pages/CareerRecommender.jsx'));
const Analytics = lazy(() => import('./pages/Analytics.jsx'));
const About = lazy(() => import('./pages/About.jsx'));

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-center">
      <div>
        <h1 className="text-4xl font-bold text-error mb-4">404 - Page Not Found</h1>
        <p className="text-text-secondary mb-4">The page you're looking for doesn't exist.</p>
        <a href="/" className="btn-primary">Go Home</a>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-auto" role="main">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/jobs" element={<JobSearch />} />
              <Route path="/career" element={<CareerRecommender />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary fallback={<div className="min-h-screen flex items-center justify-center p-4 text-center">
        <div>
          <h1 className="text-4xl font-bold text-error mb-4">Something Went Wrong</h1>
          <p className="text-text-secondary mb-4">Please refresh or try a different page.</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Reload</button>
        </div>
      </div>}>
        <AppContent />
      </ErrorBoundary>
    </AppProvider>
  );
}