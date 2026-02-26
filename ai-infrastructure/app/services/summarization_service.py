"""Journal summarization service — text summarization with topic/mood extraction."""

from app.core.exceptions import SummarizationError
from app.core.logging import get_logger
from app.models.schemas import SummarizeRequest, SummarizeResponse, SummaryResult, SummaryStyle

logger = get_logger(__name__)


class SummarizationService:
    """Summarizes journal text and extracts key topics, mood, and action items.

    In production, this would integrate with an LLM for intelligent summarization.
    """

    async def summarize(self, request: SummarizeRequest) -> SummarizeResponse:
        """Summarize journal text.

        Args:
            request: Summarization request with text and style preferences.

        Returns:
            SummarizeResponse with summary, topics, mood, and action items.
        """
        logger.info(
            "summarizing_journal",
            text_length=len(request.text),
            style=request.style,
            max_length=request.max_length,
        )

        try:
            result = await self._generate_summary(request.text, request.style, request.max_length)

            logger.info(
                "summarization_complete",
                summary_length=len(result.summary),
                topics_count=len(result.key_topics),
                action_items_count=len(result.action_items),
            )

            return SummarizeResponse(success=True, result=result)

        except Exception as e:
            logger.error("summarization_failed", error=str(e))
            raise SummarizationError(f"Summarization failed: {e}") from e

    async def _generate_summary(self, text: str, style: SummaryStyle, max_length: int) -> SummaryResult:
        """Generate summary using NLP model.

        Args:
            text: Journal text to summarize.
            style: Desired summary style.
            max_length: Maximum summary length.

        Returns:
            Summary result with extracted metadata.
        """
        # TODO: Integrate with LLM for intelligent summarization
        truncated = text[:max_length] if len(text) > max_length else text

        return SummaryResult(
            summary=f"[Summary stub] {truncated[:200]}...",
            key_topics=["general"],
            mood="neutral",
            action_items=[],
        )
