import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const [demandData, setDemandData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    ensureFreshData();
  }, []);

  const ensureFreshData = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await fetch(`${baseUrl}/api/auto/ensure-fresh-data`, { method: 'POST' });
      fetchAnalyticsData();
    } catch (error) {
      console.error('Error ensuring fresh data:', error);
      fetchAnalyticsData();
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const [demandRes, salaryRes, skillsRes, categoriesRes] = await Promise.all([
        fetch(`${baseUrl}/api/analytics/demand`),
        fetch(`${baseUrl}/api/analytics/salary`),
        fetch(`${baseUrl}/api/analytics/skills`),
        fetch(`${baseUrl}/api/analytics/categories`)
      ]);

      const [demand, salary, skills, categories] = await Promise.all([
        demandRes.json(),
        salaryRes.json(),
        skillsRes.json(),
        categoriesRes.json()
      ]);

      setDemandData(demand);
      setSalaryData(salary);
      setSkillsData(skills);
      setCategoriesData(categories);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
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
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
      <div className="mb-8">
        <h1>Job Market Analytics</h1>
        <p className="text-lg text-gray-600">
          Comprehensive insights into job market trends and opportunities
        </p>
      </div>

      {/* Job Demand Trends */}
      <div className="chart-container mb-6">
        <div className="card-header">
          <h3 className="card-title">Job Demand Trends</h3>
          <p className="card-description">Monthly job posting volume over time</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={demandData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
            <XAxis dataKey="month" stroke="var(--gray-600)" />
            <YAxis stroke="var(--gray-600)" />
            <Tooltip 
              contentStyle={{ 
                background: 'white', 
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--radius-md)'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="jobs" 
              stroke="var(--primary-600)" 
              strokeWidth={3}
              dot={{ fill: 'var(--primary-600)', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Salary by Category */}
        <div className="chart-container">
          <div className="card-header">
            <h3 className="card-title">Average Salary by Category</h3>
            <p className="card-description">Compensation across different industries</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
              <XAxis dataKey="category" stroke="var(--gray-600)" />
              <YAxis stroke="var(--gray-600)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-md)'
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Salary']}
              />
              <Bar dataKey="salary" fill="var(--primary-600)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="chart-container">
          <div className="card-header">
            <h3 className="card-title">Job Distribution by Category</h3>
            <p className="card-description">Market share of different job categories</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoriesData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="percentage"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {categoriesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Skills */}
      <div className="chart-container">
        <div className="card-header">
          <h3 className="card-title">Most In-Demand Skills</h3>
          <p className="card-description">Skills with highest job posting frequency</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={skillsData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
            <XAxis type="number" stroke="var(--gray-600)" />
            <YAxis dataKey="name" type="category" stroke="var(--gray-600)" width={100} />
            <Tooltip 
              contentStyle={{ 
                background: 'white', 
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--radius-md)'
              }}
              formatter={(value) => [value.toLocaleString(), 'Job Postings']}
            />
            <Bar dataKey="count" fill="var(--success-500)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Skills Trend Indicators */}
      <div className="mt-6">
        <h3 className="mb-4">Skill Trends</h3>
        <div className="grid grid-cols-3 gap-4">
          {skillsData.map((skill, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{skill.name}</h4>
                  <p className="text-sm text-gray-600">{skill.count.toLocaleString()} jobs</p>
                </div>
                <div className={`px-3 py-1 rounded text-sm font-medium ${
                  skill.trend === 'up' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {skill.trend === 'up' ? '↗️ Rising' : '➡️ Stable'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;