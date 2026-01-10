import { motion } from 'framer-motion';
import { Heart, MapPin, DollarSign, Briefcase } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { formatSalary } from '../../utils/formatters.js';
import { getCategoryColor } from '../../utils/helpers.js';
import { useApp } from '../../context/AppContext.jsx';
import { toast } from 'react-hot-toast';

export default function JobCard({ job, onApply, onBookmark }) {
  const [bookmarked, setBookmarked] = useState(false);
  const { user } = useApp();

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please log in to bookmark jobs.');
      return;
    }
    setBookmarked(!bookmarked);
    if (onBookmark) onBookmark(job.id, !bookmarked);
    toast.success(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleApply = () => {
    if (onApply) onApply(job);
    toast.success(`Applied to ${job.title}!`);
  };

  return (
    <motion.div
      className={clsx('card cursor-pointer overflow-hidden', 'focus:outline-none focus:ring-2 focus:ring-primary/50')}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      role="article"
      tabIndex={0}
      aria-label={`Job: ${job.title} at ${job.company}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1 line-clamp-2">{job.title}</h3>
            <p className="text-text-secondary font-medium mb-2">{job.company}</p>
          </div>
          <button
            onClick={handleBookmark}
            className="ml-2 p-2 rounded-full hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label={bookmarked ? 'Remove bookmark' : 'Add to bookmarks'}
          >
            <Heart
              className={clsx('w-5 h-5', { 'fill-primary text-primary': bookmarked, 'text-secondary': !bookmarked })}
            />
          </button>
        </div>
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-primary font-semibold">
            <DollarSign className="w-4 h-4 mr-1" />
            {formatSalary(job.salary)}
          </div>
          <div className="flex items-center text-text-secondary">
            <MapPin className="w-4 h-4 mr-1" />
            {job.location}
          </div>
          <div className="flex items-center text-text-secondary">
            <Briefcase className="w-4 h-4 mr-1" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(job.category)}`}>
              {job.category}
            </span>
          </div>
        </div>
        <p className="text-text-secondary text-sm mb-4 line-clamp-3">{job.description}</p>
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.slice(0, 4).map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && <span className="px-2 py-1 text-text-secondary text-xs">+{job.skills.length - 4} more</span>}
          </div>
        )}
        <button
          onClick={handleApply}
          className="w-full bg-primary text-white py-2 rounded-lg cursor-pointer"
          disabled={!user}
        >
          {user ? 'Apply Now' : 'Log in to Apply'}
        </button>
      </div>
    </motion.div>
  );
}