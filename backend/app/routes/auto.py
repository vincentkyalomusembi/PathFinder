"""Auto-scraping endpoint to ensure fresh data."""
from fastapi import APIRouter
from app.services.simple_job_scraper import simple_job_scraper
from app.services.cache_service import get_cached_data, set_cached_data
import asyncio

router = APIRouter(prefix="/auto", tags=["auto"])

@router.post("/ensure-fresh-data")
async def ensure_fresh_data():
    """Ensure we have fresh scraped data for analytics and dashboard."""
    try:
        # Check if we have recent scraped data
        cached_jobs = get_cached_data("scraped_jobs")
        
        if not cached_jobs or len(cached_jobs) < 10:
            # Scrape fresh data if cache is empty or has too few jobs
            jobs = simple_job_scraper.scrape_all_jobs(max_jobs=30)
            
            if jobs:
                # Cache for 1 hour
                set_cached_data("scraped_jobs", jobs, ttl=3600)
                
                return {
                    "status": "success",
                    "message": "Fresh data scraped and cached",
                    "jobs_count": len(jobs),
                    "action": "scraped_new"
                }
            else:
                return {
                    "status": "warning", 
                    "message": "Scraping failed, using fallback data",
                    "jobs_count": 0,
                    "action": "fallback"
                }
        else:
            return {
                "status": "success",
                "message": "Using existing cached data",
                "jobs_count": len(cached_jobs),
                "action": "used_cache"
            }
            
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to ensure fresh data: {str(e)}",
            "jobs_count": 0,
            "action": "error"
        }