import { motion } from 'framer-motion';
import WordCloud from 'react-d3-cloud';
import { toast } from 'react-hot-toast';

export default function SkillsChart({ data = [] }) {
  // Ensure array
  const safeData = Array.isArray(data) ? data : [];

  const words = safeData.length > 0 ? safeData.map((skill) => ({ text: skill.name, value: skill.frequency * 10 })) : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="card h-[400px] relative"
      role="img"
      aria-label="Top skills word cloud"
    >
      <h3 className="text-xl font-bold mb-4">Top Skills</h3>
      {words.length > 0 ? (
        <WordCloud
          data={words}
          width={350}
          height={350}
          fontSize={(word) => Math.log2(word.value) * 5}
          spiral="archimedean"
          onWordClick={(word) => toast(`Focus on ${word.text} for better opportunities!`)}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-text-secondary text-center">No skills data available.</p>
        </div>
      )}
    </motion.div>
  );
}