"""Task processing pipeline — parse → classify → structure → respond."""

from app.core.logging import get_logger
from app.models.schemas import ParseTaskRequest, ParseTaskResponse
from app.services.task_parser import TaskParserService

logger = get_logger(__name__)


class TaskPipeline:
    """End-to-end task processing pipeline.

    Steps:
    1. Parse raw text via NLP
    2. Classify priority and urgency
    3. Structure into task format
    4. Return structured response
    """

    def __init__(self) -> None:
        self._parser = TaskParserService()

    async def process(self, request: ParseTaskRequest) -> ParseTaskResponse:
        """Process a task parsing request through the full pipeline.

        Args:
            request: Raw task text request.

        Returns:
            Structured task response.
        """
        logger.info("task_pipeline_started", text_length=len(request.raw_text))

        # Step 1: Parse
        response = await self._parser.parse(request)

        # Step 2: Classify
        if response.success and response.task:
            response = await self._classify(response)

        logger.info("task_pipeline_completed", success=response.success)
        return response

    async def _classify(self, response: ParseTaskResponse) -> ParseTaskResponse:
        """Classify and refine task priority.

        Args:
            response: Parsed task response.

        Returns:
            Classified response.
        """
        # TODO: Add ML-based priority classification
        return response
