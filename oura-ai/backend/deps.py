import httpx
from typing import AsyncGenerator

async def get_async_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    async with httpx.AsyncClient(timeout=10) as client:
        yield client
