"""Unit tests for the SummarizationService."""

import pytest

from app.models.schemas import SummarizeRequest, SummaryStyle
from app.services.summarization_service import SummarizationService


@pytest.fixture
def service() -> SummarizationService:
    return SummarizationService()


class TestSummarizationService:
    """Tests for journal summarization logic."""

    @pytest.mark.asyncio
    async def test_summarize_returns_success(self, service: SummarizationService) -> None:
        request = SummarizeRequest(text="Today I went to the park and had a great time.")
        response = await service.summarize(request)

        assert response.success is True
        assert response.result is not None

    @pytest.mark.asyncio
    async def test_summarize_returns_summary_text(self, service: SummarizationService) -> None:
        request = SummarizeRequest(text="Had a productive day at work. Finished the API design.")
        response = await service.summarize(request)

        assert response.result is not None
        assert len(response.result.summary) > 0

    @pytest.mark.asyncio
    async def test_summarize_returns_key_topics(self, service: SummarizationService) -> None:
        request = SummarizeRequest(text="Discussed the new architecture with the team.")
        response = await service.summarize(request)

        assert response.result is not None
        assert isinstance(response.result.key_topics, list)

    @pytest.mark.asyncio
    async def test_summarize_returns_mood(self, service: SummarizationService) -> None:
        request = SummarizeRequest(text="Feeling great about the progress today!")
        response = await service.summarize(request)

        assert response.result is not None
        assert response.result.mood == "neutral"  # Stub returns neutral

    @pytest.mark.asyncio
    async def test_summarize_respects_max_length(self, service: SummarizationService) -> None:
        long_text = "x" * 10000
        request = SummarizeRequest(text=long_text, max_length=100)
        response = await service.summarize(request)

        assert response.success is True
