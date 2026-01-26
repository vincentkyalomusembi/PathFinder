"""Pydantic schemas for request/response validation"""
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

# Job Schemas
class JobResponse(BaseModel):
    id: int
    title: str
    company: str
    salary: Optional[int] = None 
    location: str
    category: str
    description: Optional[str] = None
    skills: List[str] = []
    apply_url: Optional[str] = None
    source: Optional[str] = None

#AI schemas
class RecommendationRequest(BaseModel):
    skills: Optional[List[str]] = []
    experience: Optional[str] = None
    interests: Optional[List[str]] = []
    goals: Optional[str] = None
    education: Optional[str] = None
    current_role: Optional[str] = None

class SkillsAnalysisRequest(BaseModel):
    text: str

class RoadmapRequest(BaseModel):
    skills: Optional[List[str]] = []
    goals: Optional[str] = None
    target_role: Optional[str] = None
    timeline: Optional[str] = None

class FitPredictionRequest(BaseModel):
    skills: Optional[List[str]] = []
    experience: Optional[str] = None
    target_role: Optional[str] = None

class RecommendationResponse(BaseModel):
    recommendations: List[Dict[str, Any]]

#Analytics schemas
class AnalyticsFilters(BaseModel):
    category: Optional[str] = "all"
    location: Optional[str] = None
    salaryMin: Optional[int] = None
    dateRange: Optional[str] = "last-year"

class DemandTrend(BaseModel):
    month: str
    jobs: int

class SalaryData(BaseModel):
    category: str
    salary: int

class SkillData(BaseModel):
    name: str
    count: int
    trend: Optional[str] = None

class CategoryData(BaseModel):
    name: str
    count: int
    percentage: float

# KCSE Career Guidance Schemas
class KCSECareerRequest(BaseModel):
    cluster_points: float
    interests: List[str]
    preferred_subjects: Optional[List[str]] = []
    budget_range: Optional[str] = "medium"

class CareerOption(BaseModel):
    name: str
    description: str
    required_points: float
    universities: List[str]
    job_prospects: str
    salary_range: str
    match_percentage: int

class KCSECareerResponse(BaseModel):
    eligible_careers: List[CareerOption]
    related_careers: List[CareerOption]
    alternative_paths: List[Dict[str, Any]]                                        