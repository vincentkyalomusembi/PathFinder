"""Cache service for temporary data storage."""
from app.database import redis_client
from typing import Optional, Any
import hashlib
import json


def get_cache_key(prefix: str, params: dict) -> str:
    """Generate cache key from prefix and parameters."""
    params_str = json.dumps(params, sort_keys=True)
    params_hash = hashlib.md5(params_str.encode()).hexdigest()
    return f"{prefix}:{params_hash}"

def get_cached_data(key: str) -> Optional[Any]:
    """Get cached data"""
    return redis_client.get_cache(key)

def set_cached_data(key: str, data: Any, ttl: int = 300) -> bool:
    """Set cached data with TTL (default 5 minutes)."""
    return redis_client.set_cache(key, data, ttl)        