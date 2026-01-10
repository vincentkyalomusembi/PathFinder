import { useState } from 'react';
import JobSearchForm from '../components/forms/JobSearchForm.jsx';
import JobCard from '../components/cards/JobCard.jsx';
import { useJobs } from '../hooks/useJobs.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { MOCK_JOBS } from '../utils/constants.js';

export default function JobSearch() {
  const [query, setQuery] = useState('');
  const { jobs, loading, error } = useJobs(query);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-8 text-center"><p className="text-error">{error}</p><button onClick={() => window.location.reload()} className="btn-primary">Retry</button></div>;

  // Explicit array guard - fallback if not array
  const safeJobs = Array.isArray(jobs) ? jobs : MOCK_JOBS;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Job Search</h1>
      <JobSearchForm onSearch={setQuery} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {safeJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}