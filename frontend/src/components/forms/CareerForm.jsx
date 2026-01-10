import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react'; // Fixed: Added useEffect
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const schema = z.object({
  skills: z.string().min(1, 'Skills are required'),
  experience: z.number().min(0, 'Experience must be 0+ years').optional(),
  industry: z.enum(['tech', 'teaching', 'hospitality', 'agriculture'], { required_error: 'Select an industry' }),
});

export default function CareerForm({ onSubmit, onChange, isLoading, error }) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    onChange(watch());
  }, [watch(), onChange]); // Now defined

  const handleNext = (data) => {
    if (step < totalSteps) setStep(step + 1);
    else onSubmit(data);
  };

  return (
    <motion.form onSubmit={handleSubmit(handleNext)} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center">
        <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Step {step}/{totalSteps}</h2>
        <div className="w-full bg-surface/50 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        </div>
      </div>

      {step === 1 && (
        <div>
          <label className="block text-sm font-medium mb-2">Current Skills (comma-separated)</label>
          <textarea
            {...register('skills')}
            rows={3}
            className="form-input"
            placeholder="e.g., React, Python, SQL"
          />
          {errors.skills && <p className="text-error">{errors.skills.message}</p>}
        </div>
      )}

      {step === 2 && (
        <div>
          <label className="block text-sm font-medium mb-2">Years Experience</label>
          <input
            type="number"
            {...register('experience', { valueAsNumber: true })}
            className="form-input"
            placeholder="0"
          />
          {errors.experience && <p className="text-error">{errors.experience.message}</p>}
        </div>
      )}

      {step === 3 && (
        <div>
          <label className="block text-sm font-medium mb-2">Preferred Industry</label>
          <select
            {...register('industry')}
            className="form-input"
          >
            <option value="">Select...</option>
            <option value="tech">Tech</option>
            <option value="teaching">Teaching</option>
            <option value="hospitality">Hospitality</option>
            <option value="agriculture">Agriculture</option>
          </select>
          {errors.industry && <p className="text-error">{errors.industry.message}</p>}
        </div>
      )}

      <div className="flex justify-between">
        {step > 1 && (
          <button type="button" onClick={() => setStep(step - 1)} className="text-secondary hover:text-primary">
            Back
          </button>
        )}
        <button type="submit" className="ml-auto btn-primary" disabled={isLoading}>
          {step === totalSteps ? 'Get Recommendations' : 'Next'}
        </button>
      </div>
      {error && <p className="text-error text-center">{error}</p>}
    </motion.form>
  );
}