import React, { useState } from 'react';

const CareerRecommender = () => {
  const [formData, setFormData] = useState({
    skills: '',
    experience: '',
    interests: '',
    goals: '',
    education: '',
    currentRole: ''
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/ai/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
          experience: formData.experience,
          interests: formData.interests.split(',').map(s => s.trim()).filter(s => s),
          goals: formData.goals,
          education: formData.education,
          current_role: formData.currentRole
        }),
      });

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
      <div className="mb-8">
        <h1>AI Career Recommender</h1>
        <p className="text-lg text-gray-600">
          Get personalized career recommendations powered by AI
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tell us about yourself</h3>
            <p className="card-description">
              Provide information about your background and career goals
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Current Skills</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Python, React, Project Management (comma-separated)"
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Experience Level</label>
              <select
                className="form-select"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
              >
                <option value="">Select experience level</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior Level (6-10 years)</option>
                <option value="executive">Executive Level (10+ years)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Interests</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Technology, Education, Healthcare (comma-separated)"
                value={formData.interests}
                onChange={(e) => handleInputChange('interests', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Career Goals</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Describe your career aspirations and what you want to achieve"
                value={formData.goals}
                onChange={(e) => handleInputChange('goals', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Education</label>
              <select
                className="form-select"
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
              >
                <option value="">Select education level</option>
                <option value="high-school">High School</option>
                <option value="associate">Associate Degree</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="phd">PhD</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Current Role</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Software Developer, Teacher, Student"
                value={formData.currentRole}
                onChange={(e) => handleInputChange('currentRole', e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Getting Recommendations...' : 'Get AI Recommendations'}
            </button>
          </form>
        </div>

        {/* Recommendations */}
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
              <p>AI is analyzing your profile...</p>
            </div>
          )}

          {recommendations.length > 0 && (
            <div>
              <h3 className="mb-4">Recommended Career Paths</h3>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="card">
                    <h4 className="font-semibold text-lg mb-2">{rec.title}</h4>
                    <p className="text-gray-700 mb-4">{rec.description}</p>
                    
                    <div className="mb-4">
                      <h5 className="font-medium mb-2">Required Skills:</h5>
                      <div className="flex flex-wrap gap-2">
                        {rec.required_skills?.map((skill, skillIndex) => (
                          <span key={skillIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-600">Salary Range: </span>
                        <span className="font-semibold text-green-600">{rec.salary_range}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Growth: </span>
                        <span className={`font-medium ${
                          rec.growth_potential === 'High' || rec.growth_potential === 'Very High' 
                            ? 'text-green-600' 
                            : 'text-yellow-600'
                        }`}>
                          {rec.growth_potential}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && recommendations.length === 0 && (
            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🤖</div>
              <h3>Ready for AI Insights</h3>
              <p className="text-gray-600">
                Fill out the form to get personalized career recommendations
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-12">
        <h3 className="mb-6">Tips for Better Recommendations</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="card text-center">
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>💡</div>
            <h4 className="font-semibold mb-2">Be Specific</h4>
            <p className="text-sm text-gray-600">
              List specific skills and technologies you know or want to learn
            </p>
          </div>
          <div className="card text-center">
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>🎯</div>
            <h4 className="font-semibold mb-2">Clear Goals</h4>
            <p className="text-sm text-gray-600">
              Describe what you want to achieve in your career
            </p>
          </div>
          <div className="card text-center">
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>📈</div>
            <h4 className="font-semibold mb-2">Growth Mindset</h4>
            <p className="text-sm text-gray-600">
              Consider roles that challenge you and offer learning opportunities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerRecommender;