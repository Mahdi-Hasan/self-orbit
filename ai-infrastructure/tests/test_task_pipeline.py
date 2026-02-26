"""Integration tests for the task processing pipeline."""

import pytest

from app.models.schemas import ParseTaskRequest
from app.pipelines.task_pipeline import TaskPipeline


@pytest.fixture
def pipeline() -> TaskPipeline:
    return TaskPipeline()


class TestTaskPipeline:
    """Integration tests for the full task pipeline."""

    @pytest.mark.asyncio
    async def test_full_pipeline_produces_response(self, pipeline: TaskPipeline) -> None:
        request = ParseTaskRequest(raw_text="Schedule dentist appointment for Friday at 2pm")
        response = await pipeline.process(request)

        assert response.success is True
        assert response.task is not None

    @pytest.mark.asyncio
    async def test_pipeline_extracts_title(self, pipeline: TaskPipeline) -> None:
        request = ParseTaskRequest(raw_text="Buy birthday present for Sarah")
        response = await pipeline.process(request)

        assert response.task is not None
        assert len(response.task.title) > 0
