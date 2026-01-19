"""Gemini AI service for recommendations and analysis."""
from  app.config import Settings
from typing import Dict, Any, List
import google.generativeai as genai

class GeminiService:
    """Service for interacting with Google Gemini AI."""

    def __init__(self):
        """Initialize Gemini client."""
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMNINI_API_KEY)
            self.model = genai.GenerativeModel("gemini-2.5-flash")
        else:
            self.model = None

    def get_recommendations(self, skills: List[str], experience: str, interests: List[str], goals: str) -> List[Dict[str, Any]]:
        """Generate career recomendations."""
        if not self.model:
            return self._mock_recommendations()

        prompt = f"""
        Based on the following information, suggest 3-5 career paths:
        Skills: {', '.join(skills)}
        Experience: {experience}
        Interests: {interests}
        Goal: {goals}

        Return JSON format with: title, description, required_skills, salary_range, growth_potential
        """

        try:
            response = self.model.generate_content(prompt)
            #Parse response and return structured data
            # implement parsing base on Gemini's response format
            return self._mock_recommendations()
        except Exception:
            return self.mock_recommendations()

    def analyze_skills(self, text: str) -> Dict[str, Any]:
        """Extract skills from text"""
        if not self.model:
            return {"skills": ["Python", "React", "JavaScript"]}

        prompt = f"Extract technical skills from this text: {text}. Return as JSON array."
        try:
            response = self.model.generate_content(prompt)
            # parse and return
            return {"skills": ["Python", "React", "JavaScript"]}
        except Exception:
             return {"skills": ["Python", "React", "JavaScript"]} 

    def _mock_recommendations(self) -> List[Dict[str, Any]]:
        """Mock recommendation when AI is unavailable."""
        return [
            {
                "id": 1,
                "title": "Full Stack Developer",
                "description": "Build web applications using modern frameworks.",
                "required_skills": ["React", "Node.js", "Python"],
                "salary_range": "$80k - $120k",
                "growth_potential": "High"
            },
             {
                "id": 2,
                "title": "Data Scientist",
                "description": "Analyze data and build ML models",
                "required_skills": ["Machine Learning", "SQL", "Python"],
                "salary_range": "$100k - $150k",
                "growth_potential": "Very High"
            }
        ]   

gemini_service = GeminiService()                                            