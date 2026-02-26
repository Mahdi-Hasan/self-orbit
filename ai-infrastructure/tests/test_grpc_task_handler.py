"""gRPC contract tests for the TaskServiceHandler."""

import pytest

from app.grpc.handlers.task_handler import TaskServiceHandler
from app.models.schemas import ParseTaskRequest


@pytest.fixture
def handler() -> TaskServiceHandler:
    return TaskServiceHandler()


class TestTaskGrpcHandler:
    """Contract tests verifying gRPC handler response structure."""

    @pytest.mark.asyncio
    async def test_parse_task_returns_dict(self, handler: TaskServiceHandler) -> None:
        request = ParseTaskRequest(raw_text="Call John tomorrow")
        result = await handler.ParseTask(request)

        assert isinstance(result, dict)
        assert "success" in result

    @pytest.mark.asyncio
    async def test_parse_task_contains_task_data(self, handler: TaskServiceHandler) -> None:
        request = ParseTaskRequest(raw_text="Submit report by Friday")
        result = await handler.ParseTask(request)

        assert result["success"] is True
        assert result["task"] is not None
        assert "title" in result["task"]
        assert "priority" in result["task"]
