import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import CareerForm from '../components/forms/CareerForm.jsx';
import RecommendationCard from '../components/cards/RecommendationCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { aiService } from '../services/aiService.js';
import { toast } from 'react-hot-toast';
import { Brain, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

export default function CareerRecommender() {
  const { setLoading } = useApp();
  const [step, setStep] = useState(1);
  const [recommendations, setRecommendations] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalSteps = 3;

  const handleFormChange = (data) => setFormData(data);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    setLoading(true);

    try {
      const res = await aiService.getRecommendations({ ...formData, ...data });
      setRecommendations(res.recommendations || res.data || []);
      setStep(2);
      toast.success('Personalized recommendations ready!');
    } catch (err) {
      setError('Failed to generate recommendations. Please try again.');
      toast.error('AI recommendation error. Check your inputs.');
      console.error('Career Recommender error:', err);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError(null);
  };

  const handleReset = () => {
    setStep(1);
    setRecommendations([]);
    setFormData({});
    setError(null);
    aiService.clearCache();
  };

  return (
    <motion.main initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen py-8 px-4 max-w-4xl mx-auto space-y-8" role="main">
      <motion.div className="text-center" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
        <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">AI Career Recommender</h1>
        <p className="text-text-secondary max-w-md mx-auto">Get personalized job suggestions and roadmaps based on your skills and goals.</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.section
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Tell Us About You</h2>
            <CareerForm onSubmit={handleSubmit} onChange={handleFormChange} isLoading={isLoading} error={error} />
          </motion.section>
        )}

        {step === 2 && (
          <motion.section
            key="results"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Personalized Roadmap</h2>
              <button
                onClick={handleBack}
                className="flex items-center text-secondary hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Edit Details
              </button>
            </div>

            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-center py-8 bg-surface/50 rounded-lg p-6" role="alert">
                <p className="text-error mb-4">{error}</p>
                <button onClick={handleReset} className="btn-primary">Try Again</button>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {recommendations.map((rec, index) => (
                  <motion.div key={rec.id || index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <RecommendationCard rec={rec} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-text-secondary py-8">No recommendations available. Please complete the form.</p>
            )}

            <div className="text-center pt-6 border-t border-surface/50">
              <button onClick={handleReset} className="btn-primary px-6 py-3 rounded-full">
                Start Over
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.main>
  );
}