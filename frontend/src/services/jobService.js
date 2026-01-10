import api from './api.js';

export const jobService = {
  getJobs: (params) => api.get('/jobs', { params }),
  searchJobs: (query) => api.get(`/jobs/search?q=${query}`),
  getJob: (id) => api.get(`/jobs/${id}`),
};