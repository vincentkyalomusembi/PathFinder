"""AI-powered endpoints for recommendations and analysis."""
from fastapi import APIRouter, HTTPException
from app.schemas import (
    RecommendationRequest,
    RecommendationResponse,
    SkillsAnalysisRequest,
    RoadmapRequest,
    FitPredictionRequest
)
from app.services.gemini_service import gemini_service
from app.database import redis_client
from typing import Dict, Any

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """Get AI-powered career recommendations."""
    try:
        recommendations = gemini_service.get_recommendations(
            skills=request.skills or [],
            experience=request.experience or "",
            interests=request.interests or [],
            goals=request.goals or ""
        )
        
        return RecommendationResponse(recommendations=recommendations)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendations: {str(e)}")

@router.post("/skills")
async def analyze_skills(request: SkillsAnalysisRequest):
    """Extract skills from text."""
    try:
        result = gemini_service.analyze_skills(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze skills: {str(e)}")


@router.post("/roadmap")
async def generate_roadmap(request: RoadmapRequest):
    """Generate a career roadmap."""
    try:
        # Mock roadmap - implement with AI if needed
        roadmap = {
            "steps": [
                {"step": 1, "title": "Learn Core Skills", "description": "Master the fundamentals", "duration": "3 months"},
                {"step": 2, "title": "Build Projects", "description": "Create portfolio projects", "duration": "2 months"},
                {"step": 3, "title": "Network", "description": "Connect with professionals", "duration": "1 month"},
                {"step": 4, "title": "Apply", "description": "Start applying to positions", "duration": "Ongoing"}
            ],
            "target_role": request.target_role or "Developer",
            "timeline": request.timeline or "6 months"
        }
        return roadmap
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate roadmap: {str(e)}")


@router.post("/fit")
async def predict_fit(request: FitPredictionRequest):
    """Predict market fit for a role."""
    try:
        # Mock prediction
        fit_score = 75  # Calculate based on skills match
        prediction = {
            "fit_score": fit_score,
            "match_percentage": fit_score,
            "strengths": request.skills or [],
            "gaps": ["Cloud Computing", "DevOps"],
            "recommendations": ["Learn AWS", "Get certified"]
        }
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to predict fit: {str(e)}")