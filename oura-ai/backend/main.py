import os
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .models import SleepResponse, ActivityResponse, ReadinessResponse
from .deps import get_async_client
from functools import lru_cache
import httpx
from datetime import datetime
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

def to_local_iso8601(dt: str) -> str:
    from dateutil import parser, tz
    dt_obj = parser.isoparse(dt)
    london = tz.gettz("Europe/London")
    return dt_obj.astimezone(london).isoformat()

@lru_cache(maxsize=128)
def get_oura_headers() -> dict:
    return {"Authorization": f"Bearer {settings.OURA_PAT}"}

async def get_oura(endpoint: str, client: httpx.AsyncClient) -> Any:
    url = f"https://api.ouraring.com/v2/usercollection/{endpoint}"
    resp = await client.get(url, headers=get_oura_headers())
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    data = resp.json()
    for item in data.get(endpoint, []):
        if "timestamp" in item:
            item["timestamp"] = to_local_iso8601(item["timestamp"])
    return data

# Helper for generic Oura GET endpoint with query params
async def oura_get(endpoint: str, params: dict, client: httpx.AsyncClient):
    url = f"https://api.ouraring.com/v2/usercollection/{endpoint}"
    resp = await client.get(url, headers=get_oura_headers(), params=params)
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    return resp.json()

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/sleep", response_model=SleepResponse)
async def sleep(client: httpx.AsyncClient = Depends(get_async_client)):
    data = await get_oura("sleep", client)
    return data

@app.get("/activity", response_model=ActivityResponse)
async def activity(client: httpx.AsyncClient = Depends(get_async_client)):
    data = await get_oura("activity", client)
    return data

@app.get("/readiness", response_model=ReadinessResponse)
async def readiness(client: httpx.AsyncClient = Depends(get_async_client)):
    data = await get_oura("readiness", client)
    return data

@app.get("/daily_activity")
async def daily_activity(
    start_date: str = Query(None),
    end_date: str = Query(None),
    next_token: str = Query(None),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    params = {"start_date": start_date, "end_date": end_date, "next_token": next_token}
    return await oura_get("daily_activity", params, client)

@app.get("/daily_cardiovascular_age")
async def daily_cardiovascular_age(
    start_date: str = Query(None),
    end_date: str = Query(None),
    next_token: str = Query(None),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    params = {"start_date": start_date, "end_date": end_date, "next_token": next_token}
    return await oura_get("daily_cardiovascular_age", params, client)

@app.get("/daily_readiness")
async def daily_readiness(
    start_date: str = Query(None),
    end_date: str = Query(None),
    next_token: str = Query(None),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    params = {"start_date": start_date, "end_date": end_date, "next_token": next_token}
    return await oura_get("daily_readiness", params, client)

@app.get("/daily_resilience")
async def daily_resilience(
    start_date: str = Query(None),
    end_date: str = Query(None),
    next_token: str = Query(None),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    params = {"start_date": start_date, "end_date": end_date, "next_token": next_token}
    return await oura_get("daily_resilience", params, client)

@app.get("/daily_sleep")
async def daily_sleep(
    start_date: str = Query(None),
    end_date: str = Query(None),
    next_token: str = Query(None),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    params = {"start_date": start_date, "end_date": end_date, "next_token": next_token}
    return await oura_get("daily_sleep", params, client)

@app.get("/daily_spo2")
async def daily_spo2(
    start_date: str = Query(None),
    end_date: str = Query(None),
    next_token: str = Query(None),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    params = {"start_date": start_date, "end_date": end_date, "next_token": next_token}
    return await oura_get("daily_spo2", params, client)

@app.get("/daily_stress")
async def daily_stress(
    start_date: str = Query(None),
    end_date: str = Query(None),
    next_token: str = Query(None),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    params = {"start_date": start_date, "end_date": end_date, "next_token": next_token}
    return await oura_get("daily_stress", params, client)

@app.get("/enhanced_tag")
async def enhanced_tag(
    start_date: str = Query(None),
    end_date: str = Query(None),
    next_token: str = Query(None),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    params = {"start_date": start_date, "end_date": end_date, "next_token": next_token}
    return await oura_get("enhanced_tag", params, client)

@app.get("/heartrate")
async def heartrate(
    start_datetime: str = Query(None),
    end_datetime: str = Query(None),
    next_token: str = Query(None),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    params = {"start_datetime": start_datetime, "end_datetime": end_datetime, "next_token": next_token}
    return await oura_get("heartrate", params, client)

@app.get("/personal_info")
async def personal_info(client: httpx.AsyncClient = Depends(get_async_client)):
    return await oura_get("personal_info", {}, client)

@app.get("/rest_mode_period")
async def rest_mode_period(
    start_date: str = Query(None),
    end_date: str = Query(None),
    next_token: str = Query(None),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    params = {"start_date": start_date, "end_date": end_date, "next_token": next_token}
    return await oura_get("rest_mode_period", params, client)

@app.get("/ring_configuration")
async def ring_configuration(
    next_token: str = Query(None),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    params = {"next_token": next_token}
    return await oura_get("ring_configuration", params, client)

@app.get("/session")
async def session(
    start_date: str = Query(None),
    end_date: str = Query(None),
    next_token: str = Query(None),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    params = {"start_date": start_date, "end_date": end_date, "next_token": next_token}
    return await oura_get("session", params, client)

@app.get("/sleep")
async def sleep(
    start_date: str = Query(None),
    end_date: str = Query(None),
    next_token: str = Query(None),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    params = {"start_date": start_date, "end_date": end_date, "next_token": next_token}
    return await oura_get("sleep", params, client)

@app.get("/sleep_time")
async def sleep_time(
    start_date: str = Query(None),
    end_date: str = Query(None),
    next_token: str = Query(None),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    params = {"start_date": start_date, "end_date": end_date, "next_token": next_token}
    return await oura_get("sleep_time", params, client)

@app.get("/tag")
async def tag(
    start_date: str = Query(None),
    end_date: str = Query(None),
    next_token: str = Query(None),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    params = {"start_date": start_date, "end_date": end_date, "next_token": next_token}
    return await oura_get("tag", params, client)

@app.get("/vo2max")
async def vo2max(
    start_date: str = Query(None),
    end_date: str = Query(None),
    next_token: str = Query(None),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    params = {"start_date": start_date, "end_date": end_date, "next_token": next_token}
    return await oura_get("vo2max", params, client)

@app.get("/workout")
async def workout(
    start_date: str = Query(None),
    end_date: str = Query(None),
    next_token: str = Query(None),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    params = {"start_date": start_date, "end_date": end_date, "next_token": next_token}
    return await oura_get("workout", params, client)
