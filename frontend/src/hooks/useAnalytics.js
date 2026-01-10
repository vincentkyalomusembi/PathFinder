// src/hooks/useAnalytics.js
// Custom hook for fetching and managing analytics data (demand, salary, skills).
// Integrates with analyticsService; handles caching, loading, errors, and refetch.
// Optional filters param for dynamic queries; uses AppContext for global loading.

import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { analyticsService } from '../services/analyticsService.js';
import { toast } from 'react-hot-toast';

export function useAnalytics(filters = {}) {
  const { setLoading: setGlobalLoading } = useApp();
  const [data, setData] = useState({
    demand: [],
    salary: [],
    skills: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (currentFilters = {}) => {
    setLoading(true);
    setError(null);
    setGlobalLoading(true);

    try {
      const [demandRes, salaryRes, skillsRes, categoriesRes] = await Promise.all([
        analyticsService.getDemandTrends(currentFilters),
        analyticsService.getSalaryData(currentFilters),
        analyticsService.getSkills(currentFilters),
        analyticsService.getCategories(currentFilters),
      ]);

      setData({
        demand: demandRes || [],
        salary: salaryRes || [],
        skills: skillsRes || [],
        categories: categoriesRes || [],
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics data');
      toast.error('Analytics data unavailable. Please try again.');
      console.error('useAnalytics error:', err);
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  }, [setGlobalLoading]);

  useEffect(() => {
    fetchAnalytics(filters);
  }, [fetchAnalytics, JSON.stringify(filters)]); // Stabilized: Stringify filters to prevent object ref loops

  const refetch = useCallback(() => {
    analyticsService.clearCache(); // Clear cache for fresh data
    fetchAnalytics(filters);
    toast.info('Analytics refreshed.');
  }, [fetchAnalytics, JSON.stringify(filters)]); // Stabilized refetch too

  return {
    data,
    loading,
    error,
    refetch,
  };
}