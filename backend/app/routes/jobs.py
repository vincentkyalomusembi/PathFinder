"""Job search endpoints."""
from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from app.schemas import JobResponse
from app.database import redis_client
from app.services.cache_service import get_cache_key, get_cached_data, set_cached_data
from app.services.job_scraper import job_scraper

router = APIRouter(prefix="/jobs", tags=["jobs"])

# Mock job data - fallback when scraping fails
MOCK_JOBS = [
    {
        "id": 1,
        "title": "Frontend Developer",
        "company": "Tech Corp",
        "salary": 85000,
        "location": "Remote",
        "category": "tech",
        "description": "Build modern web applications",
        "skills": ["React", "JavaScript", "CSS"]
    },
    {
        "id": 2,
        "title": "Backend Developer",
        "company": "StartupXYZ",
        "salary": 95000,
        "location": "San Francisco",
        "category": "tech",
        "description": "Design and implement APIs",
        "skills": ["Python", "FastAPI", "PostgreSQL"]
    },
    {
        "id": 3,
        "title": "Data Scientist",
        "company": "DataCo",
        "salary": 110000,
        "location": "New York",
        "category": "tech",
        "description": "Build ML models and analyze data",
        "skills": ["Python", "Machine Learning", "SQL"]
    }
]

@router.get("", response_model=List[JobResponse])
async def get_jobs(
    q: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    salary_min: Optional[int] = Query(None),
    use_scraped: bool = Query(True, description="Use scraped jobs if available")
):
    """Get jobs with optional filters."""
    cache_key = get_cache_key("jobs", {"q": q, "category": category, "location": location, "salary_min": salary_min, "scraped": use_scraped})
    cached = get_cached_data(cache_key)
    if cached:
        return cached
    
    # Try to get scraped jobs first
    jobs_data = MOCK_JOBS.copy()
    
    if use_scraped:
        scraped_jobs = get_cached_data("scraped_jobs")
        if scraped_jobs:
            jobs_data = scraped_jobs
    
    # Filter jobs
    filtered_jobs = jobs_data.copy()
    
    if q:
        q_lower = q.lower()
        filtered_jobs = [
            job for job in filtered_jobs
            if q_lower in job["title"].lower() or q_lower in job["description"].lower()
        ]
    
    if category:
        filtered_jobs = [job for job in filtered_jobs if job["category"] == category]
    
    if location:
        filtered_jobs = [job for job in filtered_jobs if location.lower() in job["location"].lower()]
    
    if salary_min:
        filtered_jobs = [job for job in filtered_jobs if job.get("salary", 0) >= salary_min]
    
    # Cache result
    set_cached_data(cache_key, filtered_jobs, ttl=300)
    
    return filtered_jobs

@router.get("/search", response_model=List[JobResponse])
async def search_jobs(q: str = Query(..., description="Search query")):
    """Search jobs by query."""
    return await get_jobs(q=q)


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(job_id: int):
    """Get a single job by ID."""
    job = next((j for j in MOCK_JOBS if j["id"] == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job    