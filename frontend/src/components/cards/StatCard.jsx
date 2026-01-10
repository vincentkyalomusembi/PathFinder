import { motion } from 'framer-motion';
import clsx from 'clsx';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { formatSalary } from '../../utils/formatters.js';

export default function StatCard({ title, value, icon, trend = null, className = '' }) {
  const formattedValue = title.toLowerCase().includes('salary') ? formatSalary(value) : value;

  const IconComponent = typeof icon === 'string' ? <span className="text-3xl">{icon}</span> : icon;

  return (
    <motion.div
      className={clsx('card text-center p-6 md:p-8 relative overflow-hidden', className)}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      role="figure"
      aria-label={`${title}: ${formattedValue}`}
      tabIndex={0}
    >
      <div className="mb-4">{IconComponent}</div>
      <h3 className="text-2xl md:text-3xl font-bold text-primary mb-1">{formattedValue}</h3>
      <p className="text-text-secondary text-sm md:text-base">{title}</p>
      {trend && (
        <motion.div
          className={clsx(
            'absolute top-2 right-2 flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium',
            trend.type === 'up' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {trend.type === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          <span>{trend.value}%</span>
        </motion.div>
      )}
      <div className="absolute inset-0 rounded-xl ring-2 ring-transparent focus-within:ring-primary/50 pointer-events-none" />
    </motion.div>
  );
}