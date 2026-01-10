import { useState } from 'react';
import { X, Filter } from 'lucide-react';
import clsx from 'clsx';
import { CATEGORIES } from '../../utils/constants.js';

export default function FilterForm({ onFilterChange, filters = {} }) {
  const [localFilters, setLocalFilters] = useState({
    category: filters.category || 'all',
    salaryMin: filters.salaryMin || '',
    salaryMax: filters.salaryMax || '',
    location: filters.location || '',
    dateRange: filters.dateRange || 'last-year',
  });
  const [selectedCategories, setSelectedCategories] = useState(filters.categories || []);

  const handleChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleCategory = (category) => {
    const newSelected = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newSelected);
    handleChange('categories', newSelected);
  };

  const clearAll = () => {
    const resetFilters = { category: 'all', salaryMin: '', salaryMax: '', location: '', dateRange: 'last-year', categories: [] };
    setLocalFilters(resetFilters);
    setSelectedCategories([]);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-surface/50 p-4 rounded-lg border border-surface/50 space-y-4" role="region" aria-label="Filters">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center">
          <Filter className="w-4 h-4 mr-2 text-secondary" />
          Filters
        </h3>
        {(localFilters.category !== 'all' || selectedCategories.length > 0 || localFilters.salaryMin || localFilters.location) && (
          <button onClick={clearAll} className="text-error hover:text-error/80 text-sm" aria-label="Clear all filters">
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium mb-2 block">Categories</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={clsx(
                'px-3 py-1 rounded-full text-xs font-medium border-2 transition-all',
                selectedCategories.includes(cat)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-surface/50 text-text-secondary hover:border-primary hover:text-primary'
              )}
              aria-pressed={selectedCategories.includes(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium block mb-1">Min Salary</label>
          <input
            type="number"
            value={localFilters.salaryMin}
            onChange={(e) => handleChange('salaryMin', e.target.value)}
            placeholder="$0"
            className="w-full p-2 border border-surface/30 rounded focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Max Salary</label>
          <input
            type="number"
            value={localFilters.salaryMax}
            onChange={(e) => handleChange('salaryMax', e.target.value)}
            placeholder="$200k+"
            className="w-full p-2 border border-surface/30 rounded focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium block mb-1">Location</label>
          <input
            type="text"
            value={localFilters.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g., Remote"
            className="w-full p-2 border border-surface/30 rounded focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Date Range</label>
          <select
            value={localFilters.dateRange}
            onChange={(e) => handleChange('dateRange', e.target.value)}
            className="w-full p-2 border border-surface/30 rounded focus:ring-2 focus:ring-primary/50"
          >
            <option value="last-month">Last Month</option>
            <option value="last-year">Last Year</option>
            <option value="all-time">All Time</option>
          </select>
        </div>
      </div>

      {(selectedCategories.length > 0 || localFilters.salaryMin || localFilters.location) && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-surface/50">
          {selectedCategories.map((cat) => (
            <span key={cat} className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {cat}
              <button onClick={() => toggleCategory(cat)} className="ml-1 p-0.5 hover:bg-primary/20 rounded-full">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {localFilters.salaryMin && (
            <span className="inline-flex items-center px-2 py-1 bg-success/10 text-success text-xs rounded-full">
              Min: ${localFilters.salaryMin}
              <button onClick={() => handleChange('salaryMin', '')} className="ml-1 p-0.5 hover:bg-success/20 rounded-full">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {localFilters.location && (
            <span className="inline-flex items-center px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
              {localFilters.location}
              <button onClick={() => handleChange('location', '')} className="ml-1 p-0.5 hover:bg-secondary/20 rounded-full">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}