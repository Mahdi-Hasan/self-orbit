"""Task parsing service — NLP extraction of structured task data."""

from app.core.exceptions import ParsingError
from app.core.logging import get_logger
from app.models.schemas import (
    ConfidenceLevel,
    ParsedTaskSchema,
    ParseTaskRequest,
    ParseTaskResponse,
    TaskPriority,
)

logger = get_logger(__name__)


class TaskParserService:
    """Parses natural language text into structured task records.

    Extracts title, description, priority, deadline, and tags
    from free-form task descriptions.
    """

    async def parse(self, request: ParseTaskRequest) -> ParseTaskResponse:
        """Parse raw text into a structured task.

        Args:
            request: The parse task request containing raw text.

        Returns:
            ParseTaskResponse with extracted task data.
        """
        logger.info("parsing_task", raw_text=request.raw_text[:100])

        try:
            parsed = await self._extract_task(request.raw_text, request.timezone)

            logger.info(
                "task_parsed",
                title=parsed.title,
                priority=parsed.priority,
                confidence=parsed.confidence,
            )

            return ParseTaskResponse(success=True, task=parsed)

        except Exception as e:
            logger.error("task_parsing_failed", error=str(e))
            raise ParsingError(f"Failed to parse task: {e}") from e

    async def _extract_task(self, text: str, timezone: str) -> ParsedTaskSchema:
        """Extract task data from text using NLP.

        Args:
            text: Raw task text.
            timezone: User's timezone.

        Returns:
            Parsed task schema.
        """
        # TODO: Integrate with actual NLP model
        return ParsedTaskSchema(
            title=text[:100].strip(),
            description=text,
            priority=TaskPriority.MEDIUM,
            confidence=ConfidenceLevel.LOW,
            tags=[],
            metadata={"source": "nlp_stub", "timezone": timezone},
        )
