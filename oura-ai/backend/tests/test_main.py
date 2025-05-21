import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock # For mocking async methods/objects

from oura_ai.backend.main import app, settings, get_oura_headers
from oura_ai.backend.deps import get_async_client # Import the actual dependency

client = TestClient(app)

MOCKED_OURA_PAT = "TEST_PAT_FOR_PYTEST"

@pytest.fixture(autouse=True)
def apply_test_settings():
    """
    Fixture to automatically mock settings.OURA_PAT and clear 
    get_oura_headers cache before each test.
    This ensures a consistent state for headers.
    """
    original_pat = settings.OURA_PAT
    settings.OURA_PAT = MOCKED_OURA_PAT
    get_oura_headers.cache_clear()
    yield
    settings.OURA_PAT = original_pat
    get_oura_headers.cache_clear()


@pytest.fixture
def mock_api_client():
    """
    Fixture to mock the httpx.AsyncClient used by the Oura API calls.
    It overrides the 'get_async_client' dependency.
    Yields the mock instance of the httpx.AsyncClient.
    """
    mock_httpx_client_instance = AsyncMock() # This is our mock AsyncClient

    async def mock_get_async_client_override(): # The generator function
        yield mock_httpx_client_instance

    # Override the dependency for the duration of the test
    app.dependency_overrides[get_async_client] = mock_get_async_client_override
    yield mock_httpx_client_instance # This is what the test function will receive
    # Clean up by removing the override after the test
    del app.dependency_overrides[get_async_client]


def test_healthz():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_get_oura_data_success(mock_api_client: AsyncMock): # mock_api_client is the yielded mock_httpx_client_instance
    # Configure the mock client's get method for this specific test
    mock_api_client.get.return_value = AsyncMock(
        status_code=200,
        json=lambda: {"id": "user123", "email": "test@example.com"}
    )

    response = client.get("/oura_data/personal_info")
    
    assert response.status_code == 200
    assert response.json() == {"id": "user123", "email": "test@example.com"}
    
    expected_headers = {"Authorization": f"Bearer {MOCKED_OURA_PAT}"}
    mock_api_client.get.assert_called_once_with(
        "https://api.ouraring.com/v2/usercollection/personal_info",
        headers=expected_headers,
        params={}
    )


def test_get_oura_data_oura_api_error(mock_api_client: AsyncMock):
    mock_api_client.get.return_value = AsyncMock(
        status_code=404,
        text="Oura API Error: Not Found", # .text is accessed by FastAPI for the HTTPException detail
        # json=lambda: {"detail": "Oura API Error: Not Found"} # Not strictly needed if .text is used by FastAPI
    )

    response = client.get("/oura_data/non_existent_endpoint")
    
    assert response.status_code == 404
    # FastAPI's HTTPException will use the .text attribute of the error response for the detail
    assert response.json() == {"detail": "Oura API Error: Not Found"} 
    
    expected_headers = {"Authorization": f"Bearer {MOCKED_OURA_PAT}"}
    mock_api_client.get.assert_called_once_with(
        "https://api.ouraring.com/v2/usercollection/non_existent_endpoint",
        headers=expected_headers,
        params={}
    )


def test_get_oura_data_with_params_success(mock_api_client: AsyncMock):
    mock_data = {"data": [{"day": "2024-03-10", "score": 85}], "next_token": None}
    mock_api_client.get.return_value = AsyncMock(
        status_code=200,
        json=lambda: mock_data
    )

    query_params = {"start_date": "2024-03-10", "end_date": "2024-03-11"}
    response = client.get("/oura_data/daily_activity", params=query_params)
    
    assert response.status_code == 200
    assert response.json() == mock_data
    
    expected_headers = {"Authorization": f"Bearer {MOCKED_OURA_PAT}"}
    mock_api_client.get.assert_called_once_with(
        "https://api.ouraring.com/v2/usercollection/daily_activity",
        headers=expected_headers,
        params=query_params
    )

# Instructions for running:
# 1. Ensure pytest and pytest-asyncio are installed:
#    `pip install pytest pytest-asyncio httpx fastapi`
# 2. Navigate to the `oura-ai/backend` directory in your terminal.
# 3. Run the command: `pytest`
#
# Note on `app.dependency_overrides[get_async_client]`:
# `get_async_client` is the actual function object imported from `oura_ai.backend.deps`.
# This is the standard and recommended way by FastAPI to override dependencies for testing.
# The `apply_test_settings` fixture uses `autouse=True` to run for every test automatically.
# The `mock_api_client` fixture is explicitly passed to tests that need it.
# The `json` callable in the AsyncMock for the response is important because FastAPI will call it.
# The `text` attribute is used by FastAPI when an error response is turned into an HTTPException if the response isn't 2xx.
# If the Oura API error response was JSON, and we wanted *that* JSON to be the detail,
# then `json=lambda: {"some_oura_error": "details"}` would be set on the error response mock,
# and FastAPI's HTTPException would show that as a string in `detail`.
# However, the current main.py code does `detail=resp.text`, so mocking `text` is correct for errors.
