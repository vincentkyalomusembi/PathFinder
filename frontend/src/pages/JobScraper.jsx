import React, { useState, useEffect } from 'react';

const JobScraper = () => {
  const [scrapingStatus, setScrapingStatus] = useState(null);
  const [scrapedJobs, setScrapedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);

  useEffect(() => {
    fetchScrapingStatus();
    fetchScrapedJobs();
  }, []);

  const fetchScrapingStatus = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/scraper/scraping-status`);
      const data = await response.json();
      setScrapingStatus(data);
    } catch (error) {
      console.error('Error fetching scraping status:', error);
    }
  };

  const fetchScrapedJobs = async () => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/scraper/scraped-jobs`);
      const data = await response.json();
      setScrapedJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching scraped jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeJobs = async () => {
    setScraping(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/scraper/scrape-jobs?max_jobs=30`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.jobs) {
        setScrapedJobs(data.jobs);
        await fetchScrapingStatus();
      }
    } catch (error) {
      console.error('Error scraping jobs:', error);
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
      <div className="mb-8">
        <h1>Job Scraper</h1>
        <p className="text-lg text-gray-600">
          Scrape real jobs from Kenyan job sites
        </p>
      </div>

      {/* Scraping Controls */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">Scraping Controls</h3>
          <p className="card-description">
            Fetch fresh job listings from multiple Kenyan job sites
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {scrapingStatus && (
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Supported Sites:</strong> {scrapingStatus.supported_sites?.join(', ')}
                </p>
                <p className="text-sm">
                  <strong>Cached Jobs:</strong> {scrapingStatus.cached_jobs_count} jobs
                </p>
                <p className="text-sm">
                  <strong>Cache Duration:</strong> {scrapingStatus.cache_duration}
                </p>
              </div>
            )}
          </div>
          
          <button
            onClick={handleScrapeJobs}
            disabled={scraping}
            className="btn btn-primary"
          >
            {scraping ? 'Scraping Jobs...' : 'Scrape Fresh Jobs'}
          </button>
        </div>
      </div>

      {/* Scraped Jobs */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            Scraped Jobs ({scrapedJobs.length})
          </h3>
          <p className="card-description">
            Real job listings from Kenyan job sites
          </p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid var(--gray-200)', 
              borderTop: '4px solid var(--primary-600)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
            <p className="mt-4 text-gray-600">Loading scraped jobs...</p>
          </div>
        )}

        {!loading && scrapedJobs.length === 0 && (
          <div className="text-center py-8">
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🔍</div>
            <h3>No Scraped Jobs</h3>
            <p className="text-gray-600 mb-4">
              Click "Scrape Fresh Jobs" to fetch real job listings
            </p>
          </div>
        )}

        {!loading && scrapedJobs.length > 0 && (
          <div className="space-y-4">
            {scrapedJobs.map((job, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{job.title}</h4>
                    <p className="text-gray-600">{job.company} • {job.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {job.source}
                    </span>
                    {job.salary && (
                      <p className="text-sm font-semibold text-green-600 mt-1">
                        KSh {job.salary.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{job.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                      {job.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {job.skills.slice(0, 3).map((skill, skillIndex) => (
                          <span key={skillIndex} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{job.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    {job.apply_url && (
                      <a 
                        href={job.apply_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        Apply Now
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-8">
        <h3 className="mb-4">How Job Scraping Works</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="card text-center">
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>🌐</div>
            <h4 className="font-semibold mb-2">Multiple Sources</h4>
            <p className="text-sm text-gray-600">
              Scrapes from BrighterMonday, MyJobMag, and Fuzu
            </p>
          </div>
          <div className="card text-center">
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>🤖</div>
            <h4 className="font-semibold mb-2">Smart Extraction</h4>
            <p className="text-sm text-gray-600">
              Automatically extracts job details, salary, and skills
            </p>
          </div>
          <div className="card text-center">
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>⚡</div>
            <h4 className="font-semibold mb-2">Cached Results</h4>
            <p className="text-sm text-gray-600">
              Results cached for 1 hour to avoid overloading job sites
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobScraper;