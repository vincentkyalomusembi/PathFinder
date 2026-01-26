import React, { useState, useEffect } from 'react';

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: '',
    salaryMin: ''
  });

  useEffect(() => {
    ensureFreshData();
  }, []);

  const ensureFreshData = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await fetch(`${baseUrl}/api/auto/ensure-fresh-data`, { method: 'POST' });
      fetchJobs();
    } catch (error) {
      console.error('Error ensuring fresh data:', error);
      fetchJobs();
    }
  };

  useEffect(() => {
    filterJobs();
  }, [jobs, filters]);

  const fetchJobs = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/jobs`);
      const data = await response.json();
      setJobs(data);
      setFilteredJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (filters.search) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(job => job.category === filters.category);
    }

    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.salaryMin) {
      filtered = filtered.filter(job => job.salary >= parseInt(filters.salaryMin));
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: 'var(--space-16) var(--space-6)' }}>
        <div className="text-center">
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid var(--gray-200)', 
            borderTop: '4px solid var(--primary-600)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
      <div className="mb-8">
        <h1>Job Search</h1>
        <p className="text-lg text-gray-600">
          Find your next career opportunity
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="form-group">
            <label className="form-label">Search</label>
            <input
              type="text"
              className="form-input"
              placeholder="Job title or company"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="tech">Technology</option>
              <option value="teaching">Teaching</option>
              <option value="hospitality">Hospitality</option>
              <option value="agriculture">Agriculture</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="City or remote"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Min Salary</label>
            <input
              type="number"
              className="form-input"
              placeholder="50000"
              value={filters.salaryMin}
              onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </p>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-2">{job.company} • {job.location}</p>
                <p className="text-gray-700 mb-4">{job.description}</p>
                
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {job.category}
                  </span>
                  {job.salary && (
                    <span className="font-semibold text-green-600">
                      ${job.salary.toLocaleString()}/year
                    </span>
                  )}
                </div>

                {job.skills && job.skills.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="ml-6">
                <a 
                  href={job.apply_url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ display: 'block', marginBottom: 'var(--space-2)' }}
                >
                  Apply Now
                </a>
                <button className="btn btn-secondary" style={{ display: 'block', width: '100%' }}>
                  Save Job
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🔍</div>
          <h3>No jobs found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default JobSearch;