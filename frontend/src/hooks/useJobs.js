// src/hooks/useJobs.js
// Custom hook for fetching jobs with search/debounce.
// Integrates with jobService; handles loading, errors, and refetch.
// Uses constants.js mocks if API fails.

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce.js';
import { jobService } from '../services/jobService.js';
import { MOCK_JOBS } from '../utils/constants.js';

export function useJobs(query = '', filters = {}) {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debouncedQuery = useDebounce(query, 300);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobService.getJobs({ q: debouncedQuery, ...filters });
      setJobs(data);
    } catch (err) {
      setError(err.message);
      setJobs(MOCK_JOBS); // Fallback to mocks
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, JSON.stringify(filters)]); // Stabilized: Stringify filters to prevent loops

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, loading, error, refetch: fetchJobs };
}