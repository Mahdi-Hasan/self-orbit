"""gRPC contract tests for the JournalServiceHandler."""

import pytest

from app.grpc.handlers.journal_handler import JournalServiceHandler
from app.models.schemas import SummarizeRequest


@pytest.fixture
def handler() -> JournalServiceHandler:
    return JournalServiceHandler()


class TestJournalGrpcHandler:
    """Contract tests verifying gRPC handler response structure."""

    @pytest.mark.asyncio
    async def test_transcribe_returns_dict(self, handler: JournalServiceHandler) -> None:
        result = await handler.TranscribeAudio(b"fake_audio", "wav", "en")

        assert isinstance(result, dict)
        assert "success" in result

    @pytest.mark.asyncio
    async def test_transcribe_contains_result(self, handler: JournalServiceHandler) -> None:
        result = await handler.TranscribeAudio(b"audio_bytes", "mp3", "en")

        assert result["success"] is True
        assert result["result"] is not None
        assert "text" in result["result"]

    @pytest.mark.asyncio
    async def test_summarize_returns_dict(self, handler: JournalServiceHandler) -> None:
        request = SummarizeRequest(text="Today was a productive day at work.")
        result = await handler.SummarizeJournal(request)

        assert isinstance(result, dict)
        assert "success" in result

    @pytest.mark.asyncio
    async def test_summarize_contains_result(self, handler: JournalServiceHandler) -> None:
        request = SummarizeRequest(text="Had meetings all morning, then worked on the API.")
        result = await handler.SummarizeJournal(request)

        assert result["success"] is True
        assert result["result"] is not None
        assert "summary" in result["result"]
        assert "key_topics" in result["result"]
