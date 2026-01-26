"""Analytics endpoints for market trends."""
from fastapi import APIRouter, Query
from typing import Optional, List
from app.schemas import DemandTrend, SalaryData, SkillData, CategoryData
from app.services.cache_service import get_cache_key, get_cached_data, set_cached_data
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/demand", response_model=List[DemandTrend])
async def get_demand_trends(
    category: Optional[str] = Query("all"),
    location: Optional[str] = Query(None),
    salaryMin: Optional[int] = Query(None),
    dateRange: Optional[str] = Query("last-year")
):
    """Get job demand trends from real scraped data."""
    cache_key = get_cache_key("analytics_demand", {
        "category": category,
        "location": location,
        "salaryMin": salaryMin,
        "dateRange": dateRange
    })
    
    cached = get_cached_data(cache_key)
    if cached:
        return cached
    
    # Get scraped jobs data
    scraped_jobs = get_cached_data("scraped_jobs") or []
    
    # Generate analytics from real data
    result = analytics_service.generate_demand_trends(scraped_jobs)
    
    set_cached_data(cache_key, result, ttl=300)
    return result

@router.get("/salary", response_model=List[SalaryData])
async def get_salary_data(
    category: Optional[str] = Query("all"),
    location: Optional[str] = Query(None),
    salaryMin: Optional[int] = Query(None),
    dateRange: Optional[str] = Query("last-year")
):
    """Get salary distribution from real scraped data."""
    cache_key = get_cache_key("analytics_salary", {
        "category": category,
        "location": location,
        "salaryMin": salaryMin,
        "dateRange": dateRange
    })
    
    cached = get_cached_data(cache_key)
    if cached:
        return cached
    
    # Get scraped jobs data
    scraped_jobs = get_cached_data("scraped_jobs") or []
    
    # Generate analytics from real data
    result = analytics_service.generate_salary_data(scraped_jobs)
    
    set_cached_data(cache_key, result, ttl=300)
    return result

@router.get("/skills", response_model=List[SkillData])
async def get_skills(
    category: Optional[str] = Query("all"),
    location: Optional[str] = Query(None),
    salaryMin: Optional[int] = Query(None),
    dateRange: Optional[str] = Query("last-year")
):
    """Get top skills from real scraped data."""
    cache_key = get_cache_key("analytics_skills", {
        "category": category,
        "location": location,
        "salaryMin": salaryMin,
        "dateRange": dateRange
    })
    
    cached = get_cached_data(cache_key)
    if cached:
        return cached
    
    # Get scraped jobs data
    scraped_jobs = get_cached_data("scraped_jobs") or []
    
    # Generate analytics from real data
    result = analytics_service.generate_skills_data(scraped_jobs)
    
    set_cached_data(cache_key, result, ttl=300)
    return result

@router.get("/categories", response_model=List[CategoryData])
async def get_categories(
    category: Optional[str] = Query("all"),
    location: Optional[str] = Query(None),
    salaryMin: Optional[int] = Query(None),
    dateRange: Optional[str] = Query("last-year")
):
    """Get category distribution from real scraped data."""
    cache_key = get_cache_key("analytics_categories", {
        "category": category,
        "location": location,
        "salaryMin": salaryMin,
        "dateRange": dateRange
    })
    
    cached = get_cached_data(cache_key)
    if cached:
        return cached
    
    # Get scraped jobs data
    scraped_jobs = get_cached_data("scraped_jobs") or []
    
    # Generate analytics from real data
    result = analytics_service.generate_categories_data(scraped_jobs)
    
    set_cached_data(cache_key, result, ttl=300)
    return result