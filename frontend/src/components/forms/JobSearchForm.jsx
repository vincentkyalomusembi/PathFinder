import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Search, Sliders } from 'lucide-react';
import { useState, useEffect } from 'react'; // Fixed: Added useState import
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const schema = z.object({
  query: z.string().min(1, 'Search term is required').max(100, 'Too long'),
  category: z.string().optional(),
});

export default function JobSearchForm({ onSearch, initialQuery = '', isLoading = false }) {
  const [showAdvanced, setShowAdvanced] = useState(false); // Now defined
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { query: initialQuery },
  });

  const query = watch('query');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const onSubmit = (data) => {
    onSearch(data.query);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative max-w-2xl mx-auto space-y-4" role="search">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" />
        <input
          {...register('query')}
          type="search"
          placeholder="Search jobs..."
          className={clsx(
            'w-full pl-10 pr-20 py-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all',
            errors.query ? 'border-error' : 'border-surface/30'
          )}
          aria-invalid={!!errors.query}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query}
          className={clsx(
            'absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-lg font-semibold transition-colors',
            isLoading || !query ? 'bg-secondary/50 cursor-not-allowed' : 'btn-primary'
          )}
          aria-label="Search jobs"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {errors.query && <p className="text-error text-sm ml-1">{errors.query.message}</p>}

      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center justify-center w-full py-2 text-secondary hover:text-primary transition-colors"
        aria-expanded={showAdvanced}
        aria-controls="advanced-filters"
      >
        <Sliders className="w-4 h-4 mr-2" />
        {showAdvanced ? 'Hide Advanced' : 'Advanced Filters'}
      </button>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            id="advanced-filters"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            <select
              {...register('category')}
              className="w-full p-3 border border-surface/30 rounded-lg focus:ring-2 focus:ring-primary/50"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              <option value="tech">Tech</option>
              <option value="teaching">Teaching</option>
              <option value="hospitality">Hospitality</option>
              <option value="agriculture">Agriculture</option>
            </select>

            <div className="flex space-x-3">
              <input
                type="number"
                placeholder="Min Salary"
                className="flex-1 p-3 border border-surface/30 rounded-lg focus:ring-2 focus:ring-primary/50"
                onChange={(e) => onSearch({ ...watch(), salaryMin: e.target.value })}
              />
              <input
                type="text"
                placeholder="Location"
                className="flex-1 p-3 border border-surface/30 rounded-lg focus:ring-2 focus:ring-primary/50"
                onChange={(e) => onSearch({ ...watch(), location: e.target.value })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {query && (
        <button
          type="button"
          onClick={() => {
            reset();
            onSearch('');
          }}
          className="text-secondary hover:text-error text-sm"
        >
          Clear Search
        </button>
      )}
    </form>
  );
}