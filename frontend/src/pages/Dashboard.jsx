import StatCard from '../components/cards/StatCard.jsx';
import JobDemandChart from '../components/charts/JobDemandChart.jsx';
import SalaryTrendChart from '../components/charts/SalaryTrendChart.jsx';
import FilterForm from '../components/forms/FilterForm.jsx';
import { useAnalytics } from '../hooks/useAnalytics.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { MOCK_DEMAND_TRENDS, MOCK_SALARY_TRENDS } from '../utils/constants.js';
import { formatSalary } from '../utils/formatters.js';

export default function Dashboard() {
  const { data, loading, error } = useAnalytics();

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-8 text-center"><p className="text-error">{error}</p><button onClick={() => window.location.reload()} className="btn-primary">Retry</button></div>;

  // Ensure arrays; fallback to mocks
  const chartDemand = Array.isArray(data?.demand) ? data.demand : MOCK_DEMAND_TRENDS;
  const chartSalary = Array.isArray(data?.salary) ? data.salary : MOCK_SALARY_TRENDS;

  // Safe reduce
  const totalJobs = chartDemand.reduce((sum, item) => sum + (item.jobs || 0), 0);
  const avgSalary = chartSalary.reduce((sum, item) => sum + (item.salary || 0), 0) / (chartSalary.length || 1);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <FilterForm onFilterChange={() => {}} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Jobs" value={totalJobs} icon="📊" />
        <StatCard title="Avg Salary" value={formatSalary(avgSalary)} icon="💰" />
        <StatCard title="Top Skill" value="Python" icon="🔥" />
        <StatCard title="Hot Category" value="Tech" icon="🚀" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <JobDemandChart data={chartDemand} />
        <SalaryTrendChart data={chartSalary} />
      </div>
    </div>
  );
}