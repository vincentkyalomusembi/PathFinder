"""KCSE career guidance service."""
from typing import Dict, List, Any

class KCSEService:
    """Service for KCSE career guidance and recommendations."""

    def __init__(self):
        self.career_database = self._load_career_data()
        self.universities = self._load_university_data()

    def _load_career_data(self) -> Dict[str, Any]:
        """Load career data with cluster point requirements."""
        return {
            # STEM Careers
            "Medicine": {
                "cluster_points": 70.0,
                "description": "Diagnose and treat patients, save lives",
                "universities": ["University of Nairobi", "Moi University", "JKUAT"],
                "job_prospects": "Excellent - High demand",
                "salary_range": "KSh 150,000 - 500,000+",
                "interests": ["science", "helping people", "biology", "chemistry"],
                "subjects": ["Biology", "Chemistry", "Physics", "Mathematics"]
            },
            "Engineering": {
                "cluster_points": 65.0,
                "description": "Design and build systems, infrastructure",
                "universities": ["University of Nairobi", "JKUAT", "Technical University of Kenya"],
                "job_prospects": "Very Good - Growing demand",
                "salary_range": "KSh 80,000 - 300,000",
                "interests": ["technology", "problem solving", "mathematics", "building"],
                "subjects": ["Mathematics", "Physics", "Chemistry"]
            },
            "Computer Science": {
                "cluster_points": 60.0,
                "description": "Develop software, manage IT systems",
                "universities": ["Strathmore University", "JKUAT", "University of Nairobi"],
                "job_prospects": "Excellent - High growth field",
                "salary_range": "KSh 70,000 - 400,000",
                "interests": ["technology", "programming", "problem solving", "computers"],
                "subjects": ["Mathematics", "Physics", "Computer Studies"]
            },
            
            # Business & Economics
            "Business Administration": {
                "cluster_points": 55.0,
                "description": "Manage businesses, lead organizations",
                "universities": ["Strathmore University", "USIU", "University of Nairobi"],
                "job_prospects": "Good - Versatile field",
                "salary_range": "KSh 50,000 - 250,000",
                "interests": ["leadership", "business", "management", "entrepreneurship"],
                "subjects": ["Mathematics", "Business Studies", "Economics"]
            },
            "Economics": {
                "cluster_points": 58.0,
                "description": "Analyze markets, advise on economic policy",
                "universities": ["University of Nairobi", "Kenyatta University", "Strathmore"],
                "job_prospects": "Good - Government and private sector",
                "salary_range": "KSh 60,000 - 200,000",
                "interests": ["analysis", "mathematics", "policy", "research"],
                "subjects": ["Mathematics", "Economics", "Geography"]
            },
            
            # Education & Social Sciences
            "Education": {
                "cluster_points": 45.0,
                "description": "Teach and shape future generations",
                "universities": ["Kenyatta University", "Moi University", "Egerton University"],
                "job_prospects": "Stable - Always in demand",
                "salary_range": "KSh 35,000 - 120,000",
                "interests": ["teaching", "children", "knowledge sharing", "mentoring"],
                "subjects": ["Any teaching subjects", "Education"]
            },
            "Psychology": {
                "cluster_points": 52.0,
                "description": "Understand human behavior, provide therapy",
                "universities": ["University of Nairobi", "Kenyatta University", "USIU"],
                "job_prospects": "Growing - Mental health awareness",
                "salary_range": "KSh 45,000 - 180,000",
                "interests": ["helping people", "human behavior", "counseling", "research"],
                "subjects": ["Biology", "Mathematics", "English"]
            },
            
            # Creative & Media
            "Journalism": {
                "cluster_points": 48.0,
                "description": "Report news, create media content",
                "universities": ["University of Nairobi", "Daystar University", "Moi University"],
                "job_prospects": "Competitive - Digital transformation",
                "salary_range": "KSh 40,000 - 150,000",
                "interests": ["writing", "current affairs", "communication", "storytelling"],
                "subjects": ["English", "Kiswahili", "History", "Geography"]
            },
            "Architecture": {
                "cluster_points": 62.0,
                "description": "Design buildings and spaces",
                "universities": ["University of Nairobi", "JKUAT", "Technical University of Kenya"],
                "job_prospects": "Good - Urban development",
                "salary_range": "KSh 60,000 - 250,000",
                "interests": ["design", "art", "mathematics", "building", "creativity"],
                "subjects": ["Mathematics", "Physics", "Art", "Geography"]
            }
        }

    def _load_university_data(self) -> List[Dict[str, Any]]:
        """Load university information."""
        return [
            {"name": "University of Nairobi", "type": "Public", "fees_range": "KSh 16,000 - 120,000"},
            {"name": "Kenyatta University", "type": "Public", "fees_range": "KSh 16,000 - 100,000"},
            {"name": "Moi University", "type": "Public", "fees_range": "KSh 16,000 - 110,000"},
            {"name": "JKUAT", "type": "Public", "fees_range": "KSh 16,000 - 130,000"},
            {"name": "Strathmore University", "type": "Private", "fees_range": "KSh 200,000 - 400,000"},
            {"name": "USIU", "type": "Private", "fees_range": "KSh 300,000 - 500,000"},
            {"name": "Daystar University", "type": "Private", "fees_range": "KSh 150,000 - 300,000"}
        ]

    def get_career_recommendations(self, cluster_points: float, interests: List[str], 
                                 preferred_subjects: List[str], budget_range: str) -> Dict[str, List]:
        """Get career recommendations based on KCSE performance and interests."""
        
        eligible_careers = []
        related_careers = []
        alternatives = []

        for career_name, career_data in self.career_database.items():
            # Calculate match percentage based on interests
            interest_match = self._calculate_interest_match(interests, career_data["interests"])
            subject_match = self._calculate_subject_match(preferred_subjects, career_data.get("subjects", []))
            
            career_option = {
                "name": career_name,
                "description": career_data["description"],
                "required_points": career_data["cluster_points"],
                "universities": career_data["universities"],
                "job_prospects": career_data["job_prospects"],
                "salary_range": career_data["salary_range"],
                "match_percentage": int((interest_match + subject_match) / 2)
            }

            # Categorize based on cluster points and interest match
            if cluster_points >= career_data["cluster_points"]:
                eligible_careers.append(career_option)
            elif cluster_points >= career_data["cluster_points"] - 10 and interest_match > 60:
                related_careers.append(career_option)

        # Sort by match percentage
        eligible_careers.sort(key=lambda x: x["match_percentage"], reverse=True)
        related_careers.sort(key=lambda x: x["match_percentage"], reverse=True)

        # Generate alternative paths for students who don't qualify directly
        if cluster_points < 45:
            alternatives = self._get_alternative_paths(interests, cluster_points)

        return {
            "eligible": eligible_careers[:5],  # Top 5 matches
            "related": related_careers[:3],    # Top 3 related
            "alternatives": alternatives
        }

    def _calculate_interest_match(self, user_interests: List[str], career_interests: List[str]) -> float:
        """Calculate percentage match between user interests and career interests."""
        if not user_interests or not career_interests:
            return 50.0  # Default match
        
        user_interests_lower = [interest.lower() for interest in user_interests]
        career_interests_lower = [interest.lower() for interest in career_interests]
        
        matches = sum(1 for interest in user_interests_lower 
                     if any(career_int in interest or interest in career_int 
                           for career_int in career_interests_lower))
        
        return min(100.0, (matches / len(user_interests)) * 100)

    def _calculate_subject_match(self, user_subjects: List[str], career_subjects: List[str]) -> float:
        """Calculate percentage match between preferred subjects and career requirements."""
        if not user_subjects or not career_subjects:
            return 50.0
        
        user_subjects_lower = [subject.lower() for subject in user_subjects]
        career_subjects_lower = [subject.lower() for subject in career_subjects]
        
        matches = sum(1 for subject in user_subjects_lower 
                     if any(career_sub in subject or subject in career_sub 
                           for career_sub in career_subjects_lower))
        
        return min(100.0, (matches / len(user_subjects)) * 100)

    def _get_alternative_paths(self, interests: List[str], cluster_points: float) -> List[Dict[str, Any]]:
        """Get alternative career paths for students with lower cluster points."""
        alternatives = []
        
        # Technical and vocational training
        if any(interest in ["technology", "computers", "building"] for interest in interests):
            alternatives.append({
                "path": "Technical Training",
                "description": "Pursue diploma/certificate in technical fields",
                "institutions": ["Kenya Technical Trainers College", "Polytechnics", "Youth Polytechnics"],
                "duration": "1-3 years",
                "career_prospects": "Technician, Artisan, Self-employment"
            })
        
        # Business and entrepreneurship
        if any(interest in ["business", "entrepreneurship", "leadership"] for interest in interests):
            alternatives.append({
                "path": "Business & Entrepreneurship",
                "description": "Start with certificate/diploma in business",
                "institutions": ["Kenya Institute of Management", "Colleges", "Online courses"],
                "duration": "6 months - 2 years",
                "career_prospects": "Business owner, Sales, Marketing"
            })
        
        # Creative arts
        if any(interest in ["art", "creativity", "design", "writing"] for interest in interests):
            alternatives.append({
                "path": "Creative Arts & Media",
                "description": "Pursue creative skills and build portfolio",
                "institutions": ["Creative arts colleges", "Online platforms", "Workshops"],
                "duration": "Flexible",
                "career_prospects": "Freelancer, Content creator, Designer"
            })

        return alternatives

    def get_universities(self) -> List[Dict[str, Any]]:
        """Get list of universities."""
        return self.universities

    def get_courses(self) -> Dict[str, Any]:
        """Get courses and their requirements."""
        return {name: {"cluster_points": data["cluster_points"], 
                      "subjects": data.get("subjects", [])} 
                for name, data in self.career_database.items()}

kcse_service = KCSEService()