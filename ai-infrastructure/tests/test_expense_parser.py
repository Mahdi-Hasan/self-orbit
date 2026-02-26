"""Unit tests for the ExpenseParserService."""

import pytest

from app.models.schemas import ParseExpenseRequest
from app.services.expense_parser import ExpenseParserService


@pytest.fixture
def parser() -> ExpenseParserService:
    return ExpenseParserService()


class TestExpenseParser:
    """Tests for expense parsing logic."""

    @pytest.mark.asyncio
    async def test_parse_returns_success(self, parser: ExpenseParserService) -> None:
        request = ParseExpenseRequest(raw_text="Spent $25 on lunch at McDonald's")
        response = await parser.parse(request)

        assert response.success is True
        assert response.expense is not None

    @pytest.mark.asyncio
    async def test_parse_uses_preferred_currency(self, parser: ExpenseParserService) -> None:
        request = ParseExpenseRequest(raw_text="Bought groceries for 50", preferred_currency="EUR")
        response = await parser.parse(request)

        assert response.expense is not None
        assert response.expense.amount.currency == "EUR"

    @pytest.mark.asyncio
    async def test_parse_includes_description(self, parser: ExpenseParserService) -> None:
        text = "Paid $100 for electricity bill"
        request = ParseExpenseRequest(raw_text=text)
        response = await parser.parse(request)

        assert response.expense is not None
        assert response.expense.description == text

    @pytest.mark.asyncio
    async def test_parse_sets_metadata_source(self, parser: ExpenseParserService) -> None:
        request = ParseExpenseRequest(raw_text="Coffee $5")
        response = await parser.parse(request)

        assert response.expense is not None
        assert "source" in response.expense.metadata

    @pytest.mark.asyncio
    async def test_parse_returns_no_error_on_success(self, parser: ExpenseParserService) -> None:
        request = ParseExpenseRequest(raw_text="Dinner $45")
        response = await parser.parse(request)

        assert response.error is None
