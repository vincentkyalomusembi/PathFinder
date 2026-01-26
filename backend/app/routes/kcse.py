"""KCSE career guidance endpoints."""
from fastapi import APIRouter, HTTPException
from app.schemas import KCSECareerRequest, KCSECareerResponse
from app.services.kcse_service import kcse_service

router = APIRouter(prefix="/kcse", tags=["kcse"])

@router.post("/ai-recommendations")
async def get_ai_recommendations(request: KCSECareerRequest):
    """Get AI-powered course and university recommendations."""
    try:
        recommendations = kcse_service.get_ai_recommendations(
            cluster_points=request.cluster_points,
            interests=request.interests,
            preferred_subjects=request.preferred_subjects,
            budget_preference=request.budget_range
        )
        
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get AI recommendations: {str(e)}")

@router.post("/career-guidance", response_model=KCSECareerResponse)
async def get_kcse_career_guidance(request: KCSECareerRequest):
    """Get career recommendations based on KCSE cluster points and interests."""
    try:
        recommendations = kcse_service.get_career_recommendations(
            cluster_points=request.cluster_points,
            interests=request.interests,
            preferred_subjects=request.preferred_subjects,
            budget_range=request.budget_range
        )
        
        return KCSECareerResponse(
            eligible_careers=recommendations["eligible"],
            related_careers=recommendations["related"],
            alternative_paths=recommendations["alternatives"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get career guidance: {str(e)}")

@router.get("/universities")
async def get_universities():
    """Get list of universities and their requirements."""
    return kcse_service.get_universities()

@router.get("/courses")
async def get_courses():
    """Get list of courses and their cluster point requirements."""
    return kcse_service.get_courses()