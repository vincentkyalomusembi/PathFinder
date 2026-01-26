"""Job scraping endpoints."""
from fastapi import APIRouter, BackgroundTasks, HTTPException
from app.services.simple_job_scraper import simple_job_scraper
from app.services.cache_service import get_cached_data, set_cached_data
from typing import List, Dict

router = APIRouter(prefix="/scraper", tags=["scraper"])

@router.post("/scrape-jobs")
async def scrape_jobs(background_tasks: BackgroundTasks, max_jobs: int = 30):
    """Scrape jobs from multiple sources with realistic fallback."""
    try:
        # Check cache first
        cached_jobs = get_cached_data("scraped_jobs")
        if cached_jobs and len(cached_jobs) >= 10:
            return {
                "message": "Using cached jobs (scraped within last hour)",
                "jobs_count": len(cached_jobs),
                "jobs": cached_jobs,
                "sources": list(set(job.get("source", "Unknown") for job in cached_jobs))
            }
        
        # Scrape new jobs (with realistic fallback)
        jobs = simple_job_scraper.scrape_all_jobs(max_jobs)
        
        if jobs:
            # Cache for 1 hour
            set_cached_data("scraped_jobs", jobs, ttl=3600)
            
            return {
                "message": "Successfully scraped/generated jobs",
                "jobs_count": len(jobs),
                "jobs": jobs,
                "sources": list(set(job.get("source", "Unknown") for job in jobs))
            }
        else:
            # This shouldn't happen with the new scraper, but just in case
            fallback_jobs = simple_job_scraper._generate_realistic_kenyan_jobs(max_jobs)
            set_cached_data("scraped_jobs", fallback_jobs, ttl=3600)
            
            return {
                "message": "Using generated realistic job data",
                "jobs_count": len(fallback_jobs),
                "jobs": fallback_jobs,
                "sources": ["Generated (Kenyan Market)"]
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")

@router.get("/scraped-jobs")
async def get_scraped_jobs():
    """Get previously scraped jobs from cache."""
    cached_jobs = get_cached_data("scraped_jobs")
    
    if cached_jobs:
        return {
            "message": "Cached scraped jobs",
            "jobs_count": len(cached_jobs),
            "jobs": cached_jobs
        }
    else:
        return {
            "message": "No cached jobs found. Run /scrape-jobs first.",
            "jobs_count": 0,
            "jobs": []
        }

@router.get("/scraping-status")
async def get_scraping_status():
    """Get status of job scraping."""
    cached_jobs = get_cached_data("scraped_jobs")
    
    return {
        "has_cached_jobs": bool(cached_jobs),
        "cached_jobs_count": len(cached_jobs) if cached_jobs else 0,
        "supported_sites": ["Indeed Kenya", "Generated Kenyan Jobs"],
        "cache_duration": "1 hour"
    }