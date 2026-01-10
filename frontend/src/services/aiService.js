import api from './api.js';
import { toast } from 'react-hot-toast';

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const CACHE_KEY_PREFIX = 'ai_';
let requestCount = 0;
const RATE_LIMIT = 5;

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

const waitForRateLimit = async () => {
  if (requestCount >= RATE_LIMIT) {
    toast.info('AI service is busy. Please wait a moment.');
    await new Promise(resolve => setTimeout(resolve, 60000));
    requestCount = 0;
  }
  requestCount++;
};

export const aiService = {
  getRecommendations: async (payload) => {
    const cacheKey = `${CACHE_KEY_PREFIX}recommend_${JSON.stringify(payload)}`;
    const cached = cacheGet(cacheKey);
    if (cached) {
      toast.info('Loading cached recommendations.');
      return cached;
    }

    await waitForRateLimit();

    const { data } = await api.post('/ai/recommend', payload);
    cacheSet(cacheKey, data);
    toast.success('Recommendations generated successfully!');
    return data;
  },
  analyzeSkills: async (text) => {
    await waitForRateLimit();

    const { data } = await api.post('/ai/skills', { text });
    toast.success('Skills analyzed!');
    return data;
  },
  generateRoadmap: async (payload) => {
    const cacheKey = `${CACHE_KEY_PREFIX}roadmap_${JSON.stringify(payload)}`;
    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    await waitForRateLimit();

    const { data } = await api.post('/ai/roadmap', payload);
    cacheSet(cacheKey, data);
    toast.success('Roadmap generated!');
    return data;
  },
  predictFit: async (payload) => {
    await waitForRateLimit();

    const { data } = await api.post('/ai/fit', payload);
    toast.success('Market fit predicted!');
    return data;
  },
  clearCache: () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(CACHE_KEY_PREFIX)) localStorage.removeItem(key);
    });
    toast.success('AI cache cleared for privacy.');
  },
};