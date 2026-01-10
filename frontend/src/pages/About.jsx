import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">About PathFinder</h1>
      <p className="text-text-secondary">PathFinder is an AI-powered tool that analyzes job markets using NLP and Gemini AI. Built for tech, teaching, hospitality, and agriculture industries.</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold mb-2">Our Mission</h3>
          <p>Empower career growth with data-driven insights.</p>
        </div>
        <div className="card">
          <h3 className="font-bold mb-2">Tech Stack</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>React + Vite</li>
            <li>Recharts for Visuals</li>
            <li>FastAPI Backend</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}