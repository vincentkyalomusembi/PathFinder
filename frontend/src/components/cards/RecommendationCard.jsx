import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { formatSalary } from '../../utils/formatters.js';

export default function RecommendationCard({ rec }) {
  return (
    <motion.div
      className="card border-l-4 border-success"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      role="article"
      aria-label={`Recommendation for ${rec.role}`}
    >
      <h3 className="font-bold mb-2">{rec.role}</h3>
      <p className="text-text-secondary mb-4">Learn: {rec.skills.join(', ')}</p>
      <div className="space-y-2">
        {rec.resources.map((res) => (
          <a key={res.id} href={res.link} className="block text-primary hover:underline text-sm">
            {res.title}
          </a>
        ))}
      </div>
    </motion.div>
  );
}