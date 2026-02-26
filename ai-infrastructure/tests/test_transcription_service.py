"""Unit tests for the TranscriptionService."""

import pytest

from app.services.transcription_service import TranscriptionService


@pytest.fixture
def service() -> TranscriptionService:
    return TranscriptionService()


class TestTranscriptionService:
    """Tests for audio transcription logic."""

    @pytest.mark.asyncio
    async def test_transcribe_returns_success(self, service: TranscriptionService) -> None:
        response = await service.transcribe(b"fake_audio_data", "wav", "en")

        assert response.success is True
        assert response.result is not None

    @pytest.mark.asyncio
    async def test_transcribe_returns_detected_language(self, service: TranscriptionService) -> None:
        response = await service.transcribe(b"fake_audio_data", "mp3", "fr")

        assert response.result is not None
        assert response.result.detected_language == "fr"

    @pytest.mark.asyncio
    async def test_transcribe_returns_text(self, service: TranscriptionService) -> None:
        response = await service.transcribe(b"fake_audio_data", "wav", "en")

        assert response.result is not None
        assert isinstance(response.result.text, str)
        assert len(response.result.text) > 0

    @pytest.mark.asyncio
    async def test_transcribe_no_error_on_success(self, service: TranscriptionService) -> None:
        response = await service.transcribe(b"audio", "wav", "en")

        assert response.error is None
