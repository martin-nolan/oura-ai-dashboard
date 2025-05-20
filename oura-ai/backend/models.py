from pydantic import BaseModel, Field
from typing import List, Any

class SleepEntry(BaseModel):
    timestamp: str
    score: int
    total_sleep_duration: int
    # ... add more fields as needed

class SleepResponse(BaseModel):
    sleep: List[SleepEntry]

class ActivityEntry(BaseModel):
    timestamp: str
    steps: int
    calories: int
    # ... add more fields as needed

class ActivityResponse(BaseModel):
    activity: List[ActivityEntry]

class ReadinessEntry(BaseModel):
    timestamp: str
    score: int
    # ... add more fields as needed

class ReadinessResponse(BaseModel):
    readiness: List[ReadinessEntry]
