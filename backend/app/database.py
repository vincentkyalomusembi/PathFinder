"""Redis connection for temporary session storage."""
import redis
from app.config import settings
import json
from typing import Optional, Any
import uuid

class RedisClient:
    """Redis client for session-based temporary storage."""

    def __init__(self):
        """Initialize Redis connection"""
        try:
            if settings.REDIS_URL:
                self.client = redis.from_url(
                    settings.REDIS_URL,
                    decode_responses=True
                )
            else:
                self.client = redis.Redis(
                    host=settings.REDIS_HOST,
                    port=settings.REDIS_PORT,
                    db=settings.REDIS_DB,
                    password=settings.REDIS_PASSWORD,
                    decode_responses=True
                )
            # Test connection
            self.client.ping()
            self.connected = True
        except Exception:
            self.client = None
            self.connected = False  

    def get_session_id(self) -> str:
        """Generate a temporary session ID"""
        return str(uuid.uuid4())

    def set_session_data(self, session_id: str, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """Store data in session with optional TTL."""
        if not self.connected:
            return False
        
        redis_key = f"session:{session_id}:{key}"
        ttl = ttl or settings.SESSION_TTL

        if isinstance(value, (dict, list)):
            value = json.dumps(value)

        return self.client.setex(redis_key, ttl, value)

    def get_session_data(self, session_id: str, key: str) -> Optional[Any]:
        """Retrieve data from session."""
        if not self.connected:
            return None
            
        redis_key = f"session:{session_id}:{key}"
        value = self.client.get(redis_key)

        if value is None:
            return None

        try:
            return json.loads(value)
        except (json.JSONDecodeError, TypeError):
            return value

    def delete_session(self, session_id: str) -> int:
        """Delete all data for a session."""
        if not self.connected:
            return 0
            
        pattern = f"session:{session_id}:*"
        keys = self.client.keys(pattern)
        if keys:
            return self.client.delete(*keys)
        return 0

    def set_cache(self, key: str, value: Any, ttl: int = 300) -> bool:
        """Set a cache entry (For API responses, not user-specific)."""
        if not self.connected:
            return False
            
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        return self.client.setex(f"cache:{key}", ttl, value)

    def get_cache(self, key: str) -> Optional[Any]:
        """Get a cache entry."""
        if not self.connected:
            return None
            
        value = self.client.get(f"cache:{key}")
        if value is None:
            return None
        try:
            return json.loads(value)
        except (json.JSONDecodeError, TypeError):
            return value

    def ping(self) -> bool:
        """Check redis connection."""
        if not self.connected:
            return False
        try:
            return self.client.ping()
        except Exception:
            return False

#Global Redis instance
redis_client = RedisClient()                        

