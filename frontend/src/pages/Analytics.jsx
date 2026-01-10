import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import FilterForm from '../components/forms/FilterForm.jsx';
import JobDemandChart from '../components/charts/JobDemandChart.jsx';
import SalaryTrendChart from '../components/charts/SalaryTrendChart.jsx';
import SkillsChart from '../components/charts/SkillsChart.jsx';
import CategoryPieChart from '../components/charts/CategoryPieChart.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { analyticsService } from '../services/analyticsService.js';
import { toast } from 'react-hot-toast';
import { Activity, Download } from 'lucide-react';
import clsx from 'clsx';

export default function Analytics() {
  const { setLoading: setGlobalLoading } = useApp();
  const [filters, setFilters] = useState({
    category: 'all',
    location: '',
    salaryMin: '',
    dateRange: 'last-year',
  });
  const [data, setData] = useState({
    demand: [],
    salary: [],
    skills: [],
    categories: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setGlobalLoading(true);

      try {
        const [demandRes, salaryRes, skillsRes, categoriesRes] = await Promise.all([
          analyticsService.getDemandTrends(filters),
          analyticsService.getSalaryData(filters),
          analyticsService.getSkills(filters),
          analyticsService.getCategories(filters),
        ]);

        setData({
          demand: demandRes || [],
          salary: salaryRes || [],
          skills: skillsRes || [],
          categories: categoriesRes || [],
        });
      } catch (err) {
        setError('Failed to load analytics data. Please check your connection.');
        toast.error('Analytics fetch error. Refreshing...');
        console.error('Analytics error:', err);
      } finally {
        setIsLoading(false);
        setGlobalLoading(false);
      }
    };

    fetchData();
  }, [filters, setGlobalLoading]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    toast.info('Filters updated. Reloading charts...');
  };

  const handleExport = () => {
    const exportData = { filters, ...data, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pathfinder-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Analytics data exported!');
  };

  if (error && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md space-y-4">
          <Activity className="w-16 h-16 text-error mx-auto" />
          <h2 className="text-2xl font-bold text-text-primary">Analytics Unavailable</h2>
          <p className="text-text-secondary">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Guard all data as arrays/objects
  const safeData = {
    demand: Array.isArray(data.demand) ? data.demand : [],
    salary: Array.isArray(data.salary) ? data.salary : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    categories: Array.isArray(data.categories) ? data.categories : [],
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8 px-4 space-y-8"
      role="main"
      aria-label="Analytics Dashboard"
    >
      <motion.div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary flex items-center">
            <Activity className="w-8 h-8 mr-3 text-primary" />
            Market Analytics
          </h1>
          <p className="text-text-secondary">Explore trends, salaries, and skills across industries.</p>
        </div>
        <div className="flex items-center space-x-4">
          <FilterForm onFilterChange={handleFilterChange} filters={filters} />
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-surface border border-surface/50 rounded-lg hover:bg-primary/5 transition-colors"
            aria-label="Export analytics data"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </motion.div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
          role="region"
          aria-live="polite"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.section
              className="card"
              whileHover={{ y: -2 }}
              role="img"
              aria-label="Job demand trends chart"
            >
              <h3 className="text-xl font-bold mb-4 text-text-primary flex items-center">
                Job Demand Trends
                <span className={clsx('ml-auto text-xs px-2 py-1 rounded-full bg-primary/10 text-primary', { 'bg-warning/10 text-warning': filters.category !== 'all' })}>
                  {filters.category === 'all' ? 'All' : filters.category}
                </span>
              </h3>
              <JobDemandChart data={safeData.demand} />
            </motion.section>

            <motion.section
              className="card"
              whileHover={{ y: -2 }}
              role="img"
              aria-label="Salary trends chart"
            >
              <h3 className="text-xl font-bold mb-4 text-text-primary">Salary Distribution</h3>
              <SalaryTrendChart data={safeData.salary} />
            </motion.section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.section
              className="card"
              whileHover={{ y: -2 }}
              role="img"
              aria-label="Skills word cloud"
            >
              <h3 className="text-xl font-bold mb-4 text-text-primary">Top Skills Forecast</h3>
              <SkillsChart data={safeData.skills} />
            </motion.section>

            <motion.section
              className="card"
              whileHover={{ y: -2 }}
              role="img"
              aria-label="Category comparison pie chart"
            >
              <h3 className="text-xl font-bold mb-4 text-text-primary">Category Comparison</h3>
              <CategoryPieChart data={safeData.categories} />
            </motion.section>
          </div>
        </motion.div>
      )}
    </motion.main>
  );
}