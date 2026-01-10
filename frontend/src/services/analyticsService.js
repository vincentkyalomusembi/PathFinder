import api from './api.js';
import { toast } from 'react-hot-toast';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY_PREFIX = 'analytics_';

const cacheGet = (key) => {
  const item = localStorage.getItem(key);
  if (!item) return null;
  const { data, timestamp } = JSON.parse(item);
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(key);
    return null;
  }
  return data;
};

const cacheSet = (key, data) => {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
};

export const analyticsService = {
  getDemandTrends: (params) => {
    const cacheKey = `${CACHE_KEY_PREFIX}demand_${JSON.stringify(params)}`;
    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    return api.get('/analytics/demand', { params }).then((res) => {
      cacheSet(cacheKey, res.data);
      return res.data;
    }).catch((error) => {
      console.error('Failed to fetch demand trends:', error);
      toast.error('Unable to load demand trends. Please try again.');
      throw error;
    });
  },
  getSalaryData: (params) => {
    const cacheKey = `${CACHE_KEY_PREFIX}salary_${JSON.stringify(params)}`;
    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    return api.get('/analytics/salary', { params }).then((res) => {
      cacheSet(cacheKey, res.data);
      return res.data;
    }).catch((error) => {
      console.error('Failed to fetch salary data:', error);
      toast.error('Unable to load salary data. Please try again.');
      throw error;
    });
  },
  getSkills: (params) => {
    const cacheKey = `${CACHE_KEY_PREFIX}skills_${JSON.stringify(params)}`;
    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    return api.get('/analytics/skills', { params }).then((res) => {
      cacheSet(cacheKey, res.data);
      return res.data;
    }).catch((error) => {
      console.error('Failed to fetch skills data:', error);
      toast.error('Unable to load skills data. Please try again.');
      throw error;
    });
  },
  getCategories: (params) => {
    const cacheKey = `${CACHE_KEY_PREFIX}categories_${JSON.stringify(params)}`;
    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    return api.get('/analytics/categories', { params }).then((res) => {
      cacheSet(cacheKey, res.data);
      return res.data;
    }).catch((error) => {
      console.error('Failed to fetch category data:', error);
      toast.error('Unable to load category data. Please try again.');
      throw error;
    });
  },
  clearCache: () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(CACHE_KEY_PREFIX)) localStorage.removeItem(key);
    });
    toast.success('Analytics cache cleared.');
  },
};