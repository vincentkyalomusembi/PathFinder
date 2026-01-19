"""Pydantic schemas for request/response validation"""
from token import OP
from unicodedata import category
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

class RoadMapRequest(BaseModel):
    skills: Optional[List[str]] = []
    goals: Optional[str] = None
    target_role: Optional[str] = None
    timeline: Optional[str] = None

class FitPredictionRequest(BaseModel):
    skills: Optional[List[str]] = []
    experience: Optional[str] = None
    target_role: Optional[str] = None

class RecommendationResponse(BaseModel):
    recommendation: List[Dict[str, Any]]

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