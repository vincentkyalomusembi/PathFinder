import React, { useState } from 'react';

const KCSECareerGuide = () => {
  const [formData, setFormData] = useState({
    clusterPoints: '',
    interests: [],
    preferredSubjects: [],
    budgetRange: 'medium'
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const interestOptions = [
    'Science', 'Technology', 'Mathematics', 'Medicine', 'Engineering',
    'Business', 'Leadership', 'Teaching', 'Helping People', 'Research',
    'Art', 'Design', 'Writing', 'Communication', 'Sports',
    'Music', 'Drama', 'Computers', 'Programming', 'Analysis'
  ];

  const subjectOptions = [
    'Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry',
    'Physics', 'Geography', 'History', 'Business Studies', 'Economics',
    'Computer Studies', 'Art & Design', 'Music', 'French', 'German'
  ];

  const handleInterestChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubjectChange = (subject) => {
    setFormData(prev => ({
      ...prev,
      preferredSubjects: prev.preferredSubjects.includes(subject)
        ? prev.preferredSubjects.filter(s => s !== subject)
        : [...prev.preferredSubjects, subject]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/kcse/career-guidance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cluster_points: parseFloat(formData.clusterPoints),
          interests: formData.interests,
          preferred_subjects: formData.preferredSubjects,
          budget_range: formData.budgetRange
        }),
      });

      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error getting career guidance:', error);
    } finally {
      setLoading(false);
    }
  };

  const CareerCard = ({ career, type }) => (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-lg">{career.name}</h4>
          <p className="text-sm text-gray-600">
            Required Points: {career.required_points} | Match: {career.match_percentage}%
          </p>
        </div>
        <div className={`px-3 py-1 rounded text-sm font-medium ${
          type === 'eligible' ? 'bg-green-100 text-green-800' :
          type === 'related' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {type === 'eligible' ? '✅ Eligible' : 
           type === 'related' ? '🔗 Related' : '💡 Alternative'}
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{career.description}</p>
      
      <div className="space-y-3">
        <div>
          <span className="font-medium text-sm">Universities: </span>
          <span className="text-sm text-gray-600">{career.universities.join(', ')}</span>
        </div>
        <div>
          <span className="font-medium text-sm">Job Prospects: </span>
          <span className="text-sm text-gray-600">{career.job_prospects}</span>
        </div>
        <div>
          <span className="font-medium text-sm">Salary Range: </span>
          <span className="text-sm font-semibold text-green-600">{career.salary_range}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
      <div className="mb-8">
        <h1>KCSE Career Guidance</h1>
        <p className="text-lg text-gray-600">
          Discover career paths based on your KCSE performance and interests
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Your KCSE Information</h3>
            <p className="card-description">
              Tell us about your performance and interests
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Cluster Points</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="84"
                className="form-input"
                placeholder="e.g., 65.5"
                value={formData.clusterPoints}
                onChange={(e) => setFormData(prev => ({ ...prev, clusterPoints: e.target.value }))}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your total cluster points (0-84)
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Your Interests (Select multiple)</label>
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded p-3">
                {interestOptions.map((interest) => (
                  <label key={interest} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                    />
                    {interest}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Subjects (Select your best)</label>
              <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded p-3">
                {subjectOptions.map((subject) => (
                  <label key={subject} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={formData.preferredSubjects.includes(subject)}
                      onChange={() => handleSubjectChange(subject)}
                    />
                    {subject}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Budget Range</label>
              <select
                className="form-select"
                value={formData.budgetRange}
                onChange={(e) => setFormData(prev => ({ ...prev, budgetRange: e.target.value }))}
              >
                <option value="low">Low (Public Universities)</option>
                <option value="medium">Medium (Mixed)</option>
                <option value="high">High (Private Universities)</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Analyzing Your Profile...' : 'Get Career Guidance'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div>
          {loading && (
            <div className="card text-center">
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '4px solid var(--gray-200)', 
                borderTop: '4px solid var(--primary-600)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto var(--space-4)'
              }}></div>
              <p>Analyzing your KCSE performance and interests...</p>
            </div>
          )}

          {recommendations && (
            <div className="space-y-6">
              {/* Eligible Careers */}
              {recommendations.eligible_careers?.length > 0 && (
                <div>
                  <h3 className="mb-4 flex items-center gap-2">
                    <span>🎯</span> Careers You Qualify For
                  </h3>
                  <div className="space-y-4">
                    {recommendations.eligible_careers.map((career, index) => (
                      <CareerCard key={index} career={career} type="eligible" />
                    ))}
                  </div>
                </div>
              )}

              {/* Related Careers */}
              {recommendations.related_careers?.length > 0 && (
                <div>
                  <h3 className="mb-4 flex items-center gap-2">
                    <span>🔗</span> Related Career Options
                  </h3>
                  <div className="space-y-4">
                    {recommendations.related_careers.map((career, index) => (
                      <CareerCard key={index} career={career} type="related" />
                    ))}
                  </div>
                </div>
              )}

              {/* Alternative Paths */}
              {recommendations.alternative_paths?.length > 0 && (
                <div>
                  <h3 className="mb-4 flex items-center gap-2">
                    <span>🛤️</span> Alternative Career Paths
                  </h3>
                  <div className="space-y-4">
                    {recommendations.alternative_paths.map((path, index) => (
                      <div key={index} className="card">
                        <h4 className="font-semibold mb-2">{path.path}</h4>
                        <p className="text-gray-700 mb-3">{path.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Institutions: </span>
                            <span className="text-gray-600">{path.institutions.join(', ')}</span>
                          </div>
                          <div>
                            <span className="font-medium">Duration: </span>
                            <span className="text-gray-600">{path.duration}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="font-medium text-sm">Career Prospects: </span>
                          <span className="text-sm text-gray-600">{path.career_prospects}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !recommendations && (
            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎓</div>
              <h3>Ready for Career Guidance</h3>
              <p className="text-gray-600">
                Fill out your KCSE information to get personalized career recommendations
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-12">
        <h3 className="mb-6">Understanding Your Options</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="card text-center">
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>🎯</div>
            <h4 className="font-semibold mb-2">Direct Entry</h4>
            <p className="text-sm text-gray-600">
              Careers you can pursue directly with your current cluster points
            </p>
          </div>
          <div className="card text-center">
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>🔗</div>
            <h4 className="font-semibold mb-2">Related Fields</h4>
            <p className="text-sm text-gray-600">
              Similar careers that match your interests but may need bridging courses
            </p>
          </div>
          <div className="card text-center">
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>🛤️</div>
            <h4 className="font-semibold mb-2">Alternative Paths</h4>
            <p className="text-sm text-gray-600">
              Different routes to achieve your career goals through technical training
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KCSECareerGuide;