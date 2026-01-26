"""Test endpoint for Gemini API."""
from fastapi import APIRouter
from app.services.gemini_service import gemini_service
from app.config import settings

router = APIRouter(prefix="/test", tags=["test"])

@router.get("/gemini-status")
async def check_gemini_status():
    """Check if Gemini API is properly configured."""
    return {
        "gemini_available": gemini_service.is_available(),
        "api_key_configured": bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here"),
        "api_key_preview": f"{settings.GEMINI_API_KEY[:10]}..." if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here" else "Not configured",
        "message": "Gemini API is ready" if gemini_service.is_available() else "Gemini API not available - using mock responses"
    }

@router.post("/gemini-test")
async def test_gemini():
    """Test Gemini API with a simple request."""
    try:
        recommendations = gemini_service.get_recommendations(
            skills=["Python", "Communication"],
            experience="2 years",
            interests=["Technology", "Problem Solving"],
            goals="Become a senior developer"
        )
        
        return {
            "status": "success",
            "using_real_ai": gemini_service.is_available(),
            "recommendations": recommendations
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "using_real_ai": False
        }