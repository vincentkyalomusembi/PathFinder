"""Main FastAPI application - lightweight, no auth."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import jobs, ai, analytics, kcse, scraper, auto, test
from app.database import redis_client

app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    debug=settings.DEBUG
)

# CORS middleware - allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(jobs.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(kcse.router, prefix="/api")
app.include_router(scraper.router, prefix="/api")
app.include_router(auto.router, prefix="/api")
app.include_router(test.router, prefix="/api")


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "PathFinder API",
        "version": settings.API_VERSION,
        "redis_connected": redis_client.ping()
    }
@app.get("/health")
async def health():
    """Health check with Redis status."""
    return {
        "status": "healthy",
        "redis": "connected" if redis_client.ping() else "disconnected"
    }