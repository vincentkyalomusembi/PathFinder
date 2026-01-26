"""Improved Gemini AI service with better error handling."""
from app.config import settings
from typing import Dict, Any, List
import json
import re

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    print("Google Generative AI not available. Install with: pip install google-generativeai")

try:
    from .university_scraper import university_scraper
    SCRAPER_AVAILABLE = True
except ImportError:
    SCRAPER_AVAILABLE = False

class GeminiService:
    """Service for interacting with Google Gemini AI."""

    def __init__(self):
        """Initialize Gemini client."""
        self.model = None
        self.api_available = False
        
        print(f"Gemini API Key loaded: {bool(settings.GEMINI_API_KEY)}")
        print(f"Key preview: {settings.GEMINI_API_KEY[:20] if settings.GEMINI_API_KEY else 'None'}...")
        
        if GEMINI_AVAILABLE and settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here":
            try:
                print("Configuring Gemini API...")
                genai.configure(api_key=settings.GEMINI_API_KEY)
                
                # List available models
                print("Available Gemini models:")
                for model in genai.list_models():
                    if 'generateContent' in model.supported_generation_methods:
                        print(f"  - {model.name}")
                
                # Try current available model names
                model_names = ["models/gemini-2.5-flash", "models/gemini-2.5-pro", "models/gemini-flash-latest", "models/gemini-pro-latest"]
                
                for model_name in model_names:
                    try:
                        print(f"Trying model: {model_name}")
                        self.model = genai.GenerativeModel(model_name)
                        
                        # Test the API with a simple request
                        test_response = self.model.generate_content("Say hello")
                        print(f"✅ Success with {model_name}: {test_response.text[:50]}...")
                        
                        self.api_available = True
                        break
                    except Exception as e:
                        print(f"❌ Failed with {model_name}: {e}")
                        continue
                
                if self.api_available:
                    print("✅ Gemini AI initialized successfully")
                else:
                    print("❌ No working Gemini model found")
            except Exception as e:
                print(f"❌ Failed to initialize Gemini: {e}")
                self.api_available = False
        else:
            if not GEMINI_AVAILABLE:
                print("❌ Google Generative AI package not available")
            elif not settings.GEMINI_API_KEY:
                print("❌ GEMINI_API_KEY not found in environment")
            elif settings.GEMINI_API_KEY == "your_gemini_api_key_here":
                print("❌ GEMINI_API_KEY is still the placeholder value")
            print("🔄 Using mock responses instead of real AI")

    def get_recommendations(self, skills: List[str], experience: str, interests: List[str], goals: str) -> List[Dict[str, Any]]:
        """Generate career recommendations."""
        if not self.api_available:
            return self._mock_recommendations()

        prompt = f"""
        Based on the following information, provide career recommendations:
        
        Skills: {', '.join(skills) if skills else 'None specified'}
        Experience: {experience or 'Not specified'}
        Interests: {', '.join(interests) if interests else 'None specified'}
        Goals: {goals or 'Not specified'}
        
        Please provide 3-4 career recommendations in JSON format with the following structure:
        [
            {{
                "id": 1,
                "title": "Career Title",
                "description": "Brief description of the career",
                "required_skills": ["skill1", "skill2", "skill3"],
                "salary_range": "$XX,XXX - $XX,XXX",
                "growth_potential": "High/Medium/Low"
            }}
        ]
        
        Focus on realistic careers available in Kenya and globally.
        """

        try:
            response = self.model.generate_content(prompt)
            
            # Try to extract JSON from response
            response_text = response.text
            
            # Look for JSON array in the response
            json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                recommendations = json.loads(json_str)
                return recommendations
            else:
                # If no JSON found, parse manually
                return self._parse_text_response(response_text)
                
        except Exception as e:
            print(f"Gemini API error: {e}")
            return self._mock_recommendations()

    def analyze_skills(self, text: str) -> Dict[str, Any]:
        """Extract skills from text."""
        if not self.api_available:
            return {"skills": self._extract_skills_fallback(text)}

        prompt = f"""
        Extract technical and soft skills from this text: "{text}"
        
        Return a JSON object with:
        {{
            "skills": ["skill1", "skill2", "skill3"]
        }}
        
        Focus on skills relevant to the Kenyan job market.
        """

        try:
            response = self.model.generate_content(prompt)
            response_text = response.text
            
            # Try to extract JSON
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                result = json.loads(json_str)
                return result
            else:
                return {"skills": self._extract_skills_fallback(text)}
                
        except Exception as e:
            print(f"Gemini skills analysis error: {e}")
            return {"skills": self._extract_skills_fallback(text)}

    def _parse_text_response(self, text: str) -> List[Dict[str, Any]]:
        """Parse text response when JSON extraction fails."""
        recommendations = []
        
        # Try to extract career information from text
        lines = text.split('\n')
        current_career = {}
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Look for career titles (usually numbered or bolded)
            if any(keyword in line.lower() for keyword in ['1.', '2.', '3.', '4.', 'career', 'job', 'role']):
                if current_career:
                    recommendations.append(current_career)
                current_career = {
                    "id": len(recommendations) + 1,
                    "title": line.replace('1.', '').replace('2.', '').replace('3.', '').replace('4.', '').strip(),
                    "description": "AI-generated career recommendation",
                    "required_skills": ["Communication", "Problem Solving", "Teamwork"],
                    "salary_range": "$50,000 - $100,000",
                    "growth_potential": "High"
                }
        
        if current_career:
            recommendations.append(current_career)
        
        # If no careers found, return mock data
        if not recommendations:
            return self._mock_recommendations()
        
        return recommendations[:4]

    def _extract_skills_fallback(self, text: str) -> List[str]:
        """Fallback skill extraction."""
        text_lower = text.lower()
        
        common_skills = [
            "python", "javascript", "java", "react", "sql", "excel", 
            "communication", "leadership", "teamwork", "project management",
            "data analysis", "marketing", "sales", "customer service",
            "accounting", "finance", "teaching", "research"
        ]
        
        found_skills = []
        for skill in common_skills:
            if skill in text_lower:
                found_skills.append(skill.title())
        
        return found_skills[:5] if found_skills else ["Communication", "Problem Solving"]

    def get_kcse_recommendations(self, cluster_points: float, interests: List[str], 
                               preferred_subjects: List[str], budget_preference: str = "any") -> Dict[str, Any]:
        """Generate AI-powered KCSE course and university recommendations."""
        # Get real university data first
        real_courses = []
        if SCRAPER_AVAILABLE:
            real_courses = university_scraper.search_courses_by_points(cluster_points, interests)
        
        if not self.api_available:
            return self._mock_kcse_recommendations(cluster_points, interests, real_courses)

        # Include real data in prompt
        real_data_context = ""
        if real_courses:
            real_data_context = f"""
            Available courses based on cluster points {cluster_points}:
            {json.dumps(real_courses[:10], indent=2)}
            """

        prompt = f"""
        You are a Kenyan education counselor. Based on the following KCSE student information, 
        recommend suitable university courses and institutions:
        
        KCSE Cluster Points: {cluster_points}
        Student Interests: {', '.join(interests) if interests else 'Not specified'}
        Preferred Subjects: {', '.join(preferred_subjects) if preferred_subjects else 'Not specified'}
        Budget Preference: {budget_preference}
        
        {real_data_context}
        
        Provide recommendations in JSON format:
        {{
            "recommended_courses": [
                {{
                    "course_name": "Course Name",
                    "description": "Brief description",
                    "cluster_points_required": 65.0,
                    "career_prospects": "Career outlook",
                    "salary_range": "KSh XX,XXX - XX,XXX",
                    "match_reason": "Why this matches the student",
                    "universities_offering": ["Uni1", "Uni2"]
                }}
            ],
            "recommended_universities": [
                {{
                    "name": "University Name",
                    "type": "Public/Private",
                    "fees_range": "KSh XX,XXX - XX,XXX",
                    "courses_offered": ["Course1", "Course2"],
                    "why_recommended": "Reason for recommendation",
                    "location": "City",
                    "website": "URL if available"
                }}
            ],
            "alternative_paths": [
                {{
                    "path_name": "Alternative Path",
                    "description": "Description of path",
                    "institutions": ["Institution1", "Institution2"],
                    "duration": "Time required"
                }}
            ]
        }}
        
        Use the real course data provided above when available. Focus on realistic Kenyan universities and courses.
        """

        try:
            response = self.model.generate_content(prompt)
            response_text = response.text
            
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                recommendations = json.loads(json_str)
                return recommendations
            else:
                return self._mock_kcse_recommendations(cluster_points, interests, real_courses)
                
        except Exception as e:
            print(f"Gemini KCSE recommendation error: {e}")
            return self._mock_kcse_recommendations(cluster_points, interests, real_courses)

    def _mock_kcse_recommendations(self, cluster_points: float, interests: List[str], real_courses: List[Dict] = None) -> Dict[str, Any]:
        """Mock KCSE recommendations when AI is unavailable."""
        courses = []
        universities = []
        alternatives = []
        
        # Use real course data if available
        if real_courses and SCRAPER_AVAILABLE:
            for course_data in real_courses[:3]:
                courses.append({
                    "course_name": course_data["course"],
                    "description": f"Study {course_data['course'].lower()} at {course_data['university']}",
                    "cluster_points_required": course_data["cluster_points_required"],
                    "career_prospects": "Good prospects in Kenya",
                    "salary_range": "KSh 50,000 - 200,000",
                    "match_reason": f"Matches your cluster points ({cluster_points}) and interests",
                    "universities_offering": [course_data["university"]]
                })
            
            # Get unique universities from courses
            unique_unis = list(set([course["university"] for course in real_courses[:5]]))
            for uni_name in unique_unis:
                uni_details = university_scraper.get_university_details(uni_name)
                if uni_details:
                    universities.append({
                        "name": uni_name,
                        "type": uni_details.get("type", "Unknown"),
                        "fees_range": uni_details.get("fees_range", "Contact university"),
                        "courses_offered": list(uni_details.get("courses", {}).keys())[:3],
                        "why_recommended": uni_details.get("ranking", "Quality education"),
                        "location": uni_details.get("location", "Kenya"),
                        "website": uni_details.get("website", "")
                    })
        
        # Fallback to static data if no real courses
        if not courses:
            if cluster_points >= 65:
                courses.extend([
                    {
                        "course_name": "Medicine",
                        "description": "Study human health and disease treatment",
                        "cluster_points_required": 70.0,
                        "career_prospects": "Excellent - High demand",
                        "salary_range": "KSh 150,000 - 500,000+",
                        "match_reason": "High academic performance qualifies you",
                        "universities_offering": ["University of Nairobi", "Moi University"]
                    }
                ])
            elif cluster_points >= 50:
                courses.extend([
                    {
                        "course_name": "Computer Science",
                        "description": "Software development and IT systems",
                        "cluster_points_required": 60.0,
                        "career_prospects": "Excellent - High growth",
                        "salary_range": "KSh 70,000 - 400,000",
                        "match_reason": "Technology field with good prospects",
                        "universities_offering": ["JKUAT", "Strathmore University"]
                    }
                ])
        
        if not universities:
            universities = [
                {
                    "name": "University of Nairobi",
                    "type": "Public",
                    "fees_range": "KSh 16,000 - 120,000",
                    "courses_offered": ["Medicine", "Engineering", "Law"],
                    "why_recommended": "Top public university with excellent programs",
                    "location": "Nairobi",
                    "website": "https://www.uonbi.ac.ke"
                }
            ]
        
        if cluster_points < 50:
            alternatives.extend([
                {
                    "path_name": "Technical Training",
                    "description": "Diploma and certificate programs",
                    "institutions": ["Kenya Technical Trainers College", "Polytechnics"],
                    "duration": "1-3 years"
                }
            ])
        
        return {
            "recommended_courses": courses[:3],
            "recommended_universities": universities[:4],
            "alternative_paths": alternatives
        }

    def _mock_recommendations(self) -> List[Dict[str, Any]]:
        """Mock recommendations when AI is unavailable."""
        return [
            {
                "id": 1,
                "title": "Software Developer",
                "description": "Build web and mobile applications using modern technologies.",
                "required_skills": ["Python", "JavaScript", "React", "SQL"],
                "salary_range": "KSh 80,000 - 200,000",
                "growth_potential": "High"
            },
            {
                "id": 2,
                "title": "Data Analyst",
                "description": "Analyze data to help businesses make informed decisions.",
                "required_skills": ["Excel", "SQL", "Python", "Data Visualization"],
                "salary_range": "KSh 60,000 - 150,000",
                "growth_potential": "High"
            },
            {
                "id": 3,
                "title": "Digital Marketing Specialist",
                "description": "Create and manage online marketing campaigns.",
                "required_skills": ["Social Media", "Content Creation", "Analytics", "SEO"],
                "salary_range": "KSh 50,000 - 120,000",
                "growth_potential": "Medium"
            },
            {
                "id": 4,
                "title": "Project Manager",
                "description": "Lead teams and manage projects from start to finish.",
                "required_skills": ["Leadership", "Communication", "Planning", "Risk Management"],
                "salary_range": "KSh 90,000 - 250,000",
                "growth_potential": "High"
            }
        ]

    def is_available(self) -> bool:
        """Check if Gemini API is available."""
        return self.api_available

gemini_service = GeminiService()