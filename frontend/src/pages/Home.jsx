import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import JobCard from '../components/cards/JobCard.jsx';
import { useAnalytics } from '../hooks/useAnalytics.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { MOCK_JOBS, MOCK_DEMAND } from '../utils/constants.js';

export default function Home() {
  const { data: { demand }, loading } = useAnalytics();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 pt-20" id="home"> {/* pt-20 for fixed header */}
      <div className="bg-primary text-white p-4 rounded mb-4">Test: Tailwind Working (remove after)</div>
      <section className="text-center py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Welcome to My Portfolio
          </motion.h2>
          <p className="text-xl mb-8">I'm a front-end developer passionate about creating amazing user experiences.</p>
        </div>
      </section>

      <section id="about" className="container">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold mb-4">
          About Me
        </motion.h2>
        <p className="text-text-secondary">Skills: HTML, CSS, JS, React. Experience: 2+ years building responsive sites.</p>
      </section>

      <section id="projects" className="container">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold mb-6">
          Projects
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_JOBS.slice(0, 3).map((job, index) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <JobCard job={job} />
            </motion.div>
          ))}
        </div>
      </section>

      <section id="contact" className="container">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold mb-6">
          Contact
        </motion.h2>
        <form className="max-w-md mx-auto space-y-4">
          <input type="text" placeholder="Your Name" className="form-input" required />
          <input type="email" placeholder="Your Email" className="form-input" required />
          <textarea placeholder="Message" className="form-input h-32" required></textarea>
          <button type="submit" className="btn-primary w-full">Send</button>
        </form>
      </section>
    </div>
  );
}