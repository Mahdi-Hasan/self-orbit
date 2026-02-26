"""Expense parsing service — NLP extraction of structured expense data."""

from app.core.exceptions import ParsingError
from app.core.logging import get_logger
from app.models.schemas import (
    ConfidenceLevel,
    MoneySchema,
    ParsedExpenseSchema,
    ParseExpenseRequest,
    ParseExpenseResponse,
)

logger = get_logger(__name__)


class ExpenseParserService:
    """Parses natural language text into structured expense records.

    This service uses NLP techniques to extract amount, category,
    merchant, date, and tags from free-form expense descriptions.
    """

    async def parse(self, request: ParseExpenseRequest) -> ParseExpenseResponse:
        """Parse raw text into a structured expense.

        Args:
            request: The parse expense request containing raw text.

        Returns:
            ParseExpenseResponse with extracted expense data.
        """
        logger.info("parsing_expense", raw_text=request.raw_text[:100])

        try:
            parsed = await self._extract_expense(request.raw_text, request.preferred_currency)

            logger.info(
                "expense_parsed",
                category=parsed.category,
                amount=parsed.amount.amount,
                confidence=parsed.confidence,
            )

            return ParseExpenseResponse(success=True, expense=parsed)

        except Exception as e:
            logger.error("expense_parsing_failed", error=str(e))
            raise ParsingError(f"Failed to parse expense: {e}") from e

    async def _extract_expense(self, text: str, currency: str) -> ParsedExpenseSchema:
        """Extract expense data from text using NLP.

        This is a stub implementation. In production, this would call
        an LLM or custom NLP model.

        Args:
            text: Raw expense text.
            currency: Preferred currency code.

        Returns:
            Parsed expense schema.
        """
        # TODO: Integrate with actual NLP model (OpenAI, local LLM, etc.)
        # Stub implementation for scaffolding
        return ParsedExpenseSchema(
            amount=MoneySchema(amount=0.0, currency=currency),
            category="uncategorized",
            description=text,
            merchant="",
            confidence=ConfidenceLevel.LOW,
            tags=[],
            metadata={"source": "nlp_stub"},
        )
