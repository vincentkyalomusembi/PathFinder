"""Analytics endpoints for market trends."""
from fastapi import APIRouter, Query
from typing import Optional, List
from app.schemas import DemandTrend, SalaryData, SkillData, CategoryData
from app.services.cache_service import get_cache_key, get_cached_data, set_cached_data

router = APIRouter(prefix="/analytics", tags=["analytics"])


# Mock data - in production, generate from real job market data
MOCK_DEMAND_TRENDS = [
    {"month": "Jan", "jobs": 1000},
    {"month": "Feb", "jobs": 1200},
    {"month": "Mar", "jobs": 1100},
    {"month": "Apr", "jobs": 1300},
    {"month": "May", "jobs": 1400},
    {"month": "Jun", "jobs": 1500},
]

MOCK_SALARY_DATA = [
    {"category": "Tech", "salary": 120000},
    {"category": "Teaching", "salary": 60000},
    {"category": "Hospitality", "salary": 50000},
    {"category": "Agriculture", "salary": 55000},
]

MOCK_SKILLS_DATA = [
    {"name": "Python", "count": 5000, "trend": "up"},
    {"name": "React", "count": 4500, "trend": "up"},
    {"name": "JavaScript", "count": 4000, "trend": "stable"},
    {"name": "Node.js", "count": 3500, "trend": "up"},
    {"name": "SQL", "count": 3000, "trend": "stable"},
]

MOCK_CATEGORIES_DATA = [
    {"name": "Tech", "count": 50000, "percentage": 45.5},
    {"name": "Teaching", "count": 20000, "percentage": 18.2},
    {"name": "Hospitality", "count": 15000, "percentage": 13.6},
    {"name": "Agriculture", "count": 10000, "percentage": 9.1},
    {"name": "Other", "count": 15000, "percentage": 13.6},
]


@router.get("/demand", response_model=List[DemandTrend])
async def get_demand_trends(
    category: Optional[str] = Query("all"),
    location: Optional[str] = Query(None),
    salaryMin: Optional[int] = Query(None),
    dateRange: Optional[str] = Query("last-year")
):
    """Get job demand trends."""
    cache_key = get_cache_key("analytics_demand", {
        "category": category,
        "location": location,
        "salaryMin": salaryMin,
        "dateRange": dateRange
    })
    
    cached = get_cached_data(cache_key)
    if cached:
        return cached
    
    # Filter/modify data based on params (simplified)
    result = MOCK_DEMAND_TRENDS.copy()
    set_cached_data(cache_key, result, ttl=300)
    return result

@router.get("/salary", response_model=List[SalaryData])
async def get_salary_data(
    category: Optional[str] = Query("all"),
    location: Optional[str] = Query(None),
    salaryMin: Optional[int] = Query(None),
    dateRange: Optional[str] = Query("last-year")
):
    """Get salary distribution data."""
    cache_key = get_cache_key("analytics_salary", {
        "category": category,
        "location": location,
        "salaryMin": salaryMin,
        "dateRange": dateRange
    })
    
    cached = get_cached_data(cache_key)
    if cached:
        return cached
    
    result = MOCK_SALARY_DATA.copy()
    set_cached_data(cache_key, result, ttl=300)
    return result

@router.get("/skills", response_model=List[SkillData])
async def get_skills(
    category: Optional[str] = Query("all"),
    location: Optional[str] = Query(None),
    salaryMin: Optional[int] = Query(None),
    dateRange: Optional[str] = Query("last-year")
):
    """Get top skills data."""
    cache_key = get_cache_key("analytics_skills", {
        "category": category,
        "location": location,
        "salaryMin": salaryMin,
        "dateRange": dateRange
    })
    
    cached = get_cached_data(cache_key)
    if cached:
        return cached
    
    result = MOCK_SKILLS_DATA.copy()
    set_cached_data(cache_key, result, ttl=300)
    return result

@router.get("/categories", response_model=List[CategoryData])
async def get_categories(
    category: Optional[str] = Query("all"),
    location: Optional[str] = Query(None),
    salaryMin: Optional[int] = Query(None),
    dateRange: Optional[str] = Query("last-year")
):
    """Get category distribution data."""
    cache_key = get_cache_key("analytics_categories", {
        "category": category,
        "location": location,
        "salaryMin": salaryMin,
        "dateRange": dateRange
    })
    
    cached = get_cached_data(cache_key)
    if cached:
        return cached
    
    result = MOCK_CATEGORIES_DATA.copy()
    set_cached_data(cache_key, result, ttl=300)
    return result