"""gRPC handler for TranscribeAudio and SummarizeJournal RPCs."""

from app.core.logging import get_logger
from app.services.summarization_service import SummarizationService
from app.services.transcription_service import TranscriptionService
from app.models.schemas import SummarizeRequest, TranscribeResponse, SummarizeResponse

logger = get_logger(__name__)


class JournalServiceHandler:
    """Handles TranscribeAudio and SummarizeJournal gRPC requests."""

    def __init__(self) -> None:
        self._transcription = TranscriptionService()
        self._summarization = SummarizationService()

    async def TranscribeAudio(
        self, audio_data: bytes, audio_format: str = "wav", language: str = "en", context: object = None
    ) -> dict:
        """Handle TranscribeAudio RPC call.

        Args:
            audio_data: Raw audio bytes.
            audio_format: Audio format string.
            language: Language code.
            context: gRPC service context.

        Returns:
            TranscribeResponse as dict.
        """
        logger.info("grpc_transcribe_audio", size=len(audio_data), format=audio_format)

        response: TranscribeResponse = await self._transcription.transcribe(audio_data, audio_format, language)

        return response.model_dump()

    async def SummarizeJournal(self, request: SummarizeRequest, context: object = None) -> dict:
        """Handle SummarizeJournal RPC call.

        Args:
            request: SummarizeRequest (proto or Pydantic).
            context: gRPC service context.

        Returns:
            SummarizeResponse as dict.
        """
        logger.info("grpc_summarize_journal", text_length=len(request.text))

        response: SummarizeResponse = await self._summarization.summarize(request)

        return response.model_dump()
