"""REST endpoint integration tests."""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


class TestRestEndpoints:
    """Integration tests for REST fallback endpoints."""

    def test_health_check(self, client: TestClient) -> None:
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

    def test_parse_expense(self, client: TestClient) -> None:
        response = client.post(
            "/api/v1/parse/expense",
            json={"raw_text": "Spent $20 on coffee"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_parse_task(self, client: TestClient) -> None:
        response = client.post(
            "/api/v1/parse/task",
            json={"raw_text": "Buy groceries tomorrow"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_summarize_journal(self, client: TestClient) -> None:
        response = client.post(
            "/api/v1/summarize",
            json={"text": "Today I worked on the microservices project."},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_parse_expense_validation_error(self, client: TestClient) -> None:
        response = client.post(
            "/api/v1/parse/expense",
            json={"raw_text": ""},
        )
        assert response.status_code == 422
