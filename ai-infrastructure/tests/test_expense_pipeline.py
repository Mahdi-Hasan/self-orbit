"""Integration tests for the expense processing pipeline."""

import pytest

from app.models.schemas import ParseExpenseRequest
from app.pipelines.expense_pipeline import ExpensePipeline


@pytest.fixture
def pipeline() -> ExpensePipeline:
    return ExpensePipeline()


class TestExpensePipeline:
    """Integration tests for the full expense pipeline."""

    @pytest.mark.asyncio
    async def test_full_pipeline_produces_response(self, pipeline: ExpensePipeline) -> None:
        request = ParseExpenseRequest(raw_text="Spent $42.50 on dinner at Italian restaurant")
        response = await pipeline.process(request)

        assert response.success is True
        assert response.expense is not None

    @pytest.mark.asyncio
    async def test_pipeline_handles_different_currencies(self, pipeline: ExpensePipeline) -> None:
        request = ParseExpenseRequest(raw_text="Bought a coffee", preferred_currency="GBP")
        response = await pipeline.process(request)

        assert response.expense is not None
        assert response.expense.amount.currency == "GBP"

    @pytest.mark.asyncio
    async def test_pipeline_preserves_raw_text_in_description(self, pipeline: ExpensePipeline) -> None:
        text = "Uber ride to airport $35"
        request = ParseExpenseRequest(raw_text=text)
        response = await pipeline.process(request)

        assert response.expense is not None
        assert text in response.expense.description
