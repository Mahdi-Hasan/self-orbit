"""Unit tests for the TaskParserService."""

import pytest

from app.models.schemas import ParseTaskRequest
from app.services.task_parser import TaskParserService


@pytest.fixture
def parser() -> TaskParserService:
    return TaskParserService()


class TestTaskParser:
    """Tests for task parsing logic."""

    @pytest.mark.asyncio
    async def test_parse_returns_success(self, parser: TaskParserService) -> None:
        request = ParseTaskRequest(raw_text="Schedule a meeting with John tomorrow at 3pm")
        response = await parser.parse(request)

        assert response.success is True
        assert response.task is not None

    @pytest.mark.asyncio
    async def test_parse_extracts_title(self, parser: TaskParserService) -> None:
        text = "Buy groceries from the store"
        request = ParseTaskRequest(raw_text=text)
        response = await parser.parse(request)

        assert response.task is not None
        assert len(response.task.title) > 0

    @pytest.mark.asyncio
    async def test_parse_uses_timezone(self, parser: TaskParserService) -> None:
        request = ParseTaskRequest(raw_text="Call dentist at 2pm", timezone="America/New_York")
        response = await parser.parse(request)

        assert response.task is not None
        assert response.task.metadata.get("timezone") == "America/New_York"

    @pytest.mark.asyncio
    async def test_parse_default_priority_is_medium(self, parser: TaskParserService) -> None:
        request = ParseTaskRequest(raw_text="Clean the house")
        response = await parser.parse(request)

        assert response.task is not None
        assert response.task.priority == "medium"

    @pytest.mark.asyncio
    async def test_parse_returns_no_error_on_success(self, parser: TaskParserService) -> None:
        request = ParseTaskRequest(raw_text="Write report")
        response = await parser.parse(request)

        assert response.error is None
