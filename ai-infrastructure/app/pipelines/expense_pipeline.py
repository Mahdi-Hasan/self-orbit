"""Expense processing pipeline — parse → validate → enrich → respond."""

from app.core.logging import get_logger
from app.models.schemas import ParseExpenseRequest, ParseExpenseResponse
from app.services.expense_parser import ExpenseParserService

logger = get_logger(__name__)


class ExpensePipeline:
    """End-to-end expense processing pipeline.

    Steps:
    1. Parse raw text via NLP
    2. Validate extracted data
    3. Enrich with additional metadata
    4. Return structured response
    """

    def __init__(self) -> None:
        self._parser = ExpenseParserService()

    async def process(self, request: ParseExpenseRequest) -> ParseExpenseResponse:
        """Process an expense parsing request through the full pipeline.

        Args:
            request: Raw expense text request.

        Returns:
            Structured expense response.
        """
        logger.info("expense_pipeline_started", text_length=len(request.raw_text))

        # Step 1: Parse
        response = await self._parser.parse(request)

        # Step 2: Validate (extensible — add validation step)
        if response.success and response.expense:
            response = await self._validate(response)

        # Step 3: Enrich (extensible — add enrichment step)
        if response.success and response.expense:
            response = await self._enrich(response)

        logger.info("expense_pipeline_completed", success=response.success)
        return response

    async def _validate(self, response: ParseExpenseResponse) -> ParseExpenseResponse:
        """Validate parsed expense data.

        Args:
            response: Parsed expense response.

        Returns:
            Validated response.
        """
        # TODO: Add business validation rules
        return response

    async def _enrich(self, response: ParseExpenseResponse) -> ParseExpenseResponse:
        """Enrich parsed expense with additional metadata.

        Args:
            response: Validated expense response.

        Returns:
            Enriched response.
        """
        # TODO: Add category normalization, currency conversion, etc.
        return response
