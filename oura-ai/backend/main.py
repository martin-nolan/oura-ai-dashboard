import os
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
# Removed SleepResponse, ActivityResponse, ReadinessResponse as they are no longer used
from .deps import get_async_client
from functools import lru_cache
import httpx
# Removed datetime import as to_local_iso8601 is no longer used
from typing import Any

app = FastAPI(title="Ōura Personal Dashboard API", version="0.1.0")

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Removed to_local_iso8601 function as it's no longer used.

@lru_cache(maxsize=128)
def get_oura_headers() -> dict:
    return {"Authorization": f"Bearer {settings.OURA_PAT}"}

# Removed get_oura function as it's no longer used.

# Removed oura_get helper function as its logic is now part of get_oura_data.

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/oura_data/{endpoint_name}")
async def get_oura_data(
    endpoint_name: str,
    start_date: str = Query(None),
    end_date: str = Query(None),
    start_datetime: str = Query(None),
    end_datetime: str = Query(None),
    next_token: str = Query(None),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    params = {}
    if start_date:
        params["start_date"] = start_date
    if end_date:
        params["end_date"] = end_date
    if start_datetime:
        params["start_datetime"] = start_datetime
    if end_datetime:
        params["end_datetime"] = end_datetime
    if next_token:
        params["next_token"] = next_token
    
    # Use the core logic of oura_get
    url = f"https://api.ouraring.com/v2/usercollection/{endpoint_name}"
    resp = await client.get(url, headers=get_oura_headers(), params=params)
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    return resp.json()
