"""gRPC handler for ParseExpense RPC."""

from app.core.logging import get_logger
from app.pipelines.expense_pipeline import ExpensePipeline
from app.models.schemas import ParseExpenseRequest

logger = get_logger(__name__)


class ExpenseServiceHandler:
    """Handles ParseExpense gRPC requests.

    After protobuf compilation, this class should extend the generated
    AIServiceServicer and implement the ParseExpense method.
    """

    def __init__(self) -> None:
        self._pipeline = ExpensePipeline()

    async def ParseExpense(self, request: ParseExpenseRequest, context: object = None) -> dict:
        """Handle ParseExpense RPC call.

        In production, `request` would be a protobuf message object.
        This stub uses Pydantic models for development.

        Args:
            request: ParseExpenseRequest (proto or Pydantic).
            context: gRPC service context.

        Returns:
            ParseExpenseResponse as dict (will be proto message in production).
        """
        logger.info("grpc_parse_expense", text=request.raw_text[:50])

        response = await self._pipeline.process(request)

        return response.model_dump()
