"""gRPC handler for ParseTask RPC."""

from app.core.logging import get_logger
from app.pipelines.task_pipeline import TaskPipeline
from app.models.schemas import ParseTaskRequest

logger = get_logger(__name__)


class TaskServiceHandler:
    """Handles ParseTask gRPC requests.

    After protobuf compilation, this class should extend the generated
    AIServiceServicer and implement the ParseTask method.
    """

    def __init__(self) -> None:
        self._pipeline = TaskPipeline()

    async def ParseTask(self, request: ParseTaskRequest, context: object = None) -> dict:
        """Handle ParseTask RPC call.

        Args:
            request: ParseTaskRequest (proto or Pydantic).
            context: gRPC service context.

        Returns:
            ParseTaskResponse as dict.
        """
        logger.info("grpc_parse_task", text=request.raw_text[:50])

        response = await self._pipeline.process(request)

        return response.model_dump()
