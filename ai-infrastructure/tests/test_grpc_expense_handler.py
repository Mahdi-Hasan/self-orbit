"""gRPC contract tests for the ExpenseServiceHandler."""

import pytest

from app.grpc.handlers.expense_handler import ExpenseServiceHandler
from app.models.schemas import ParseExpenseRequest


@pytest.fixture
def handler() -> ExpenseServiceHandler:
    return ExpenseServiceHandler()


class TestExpenseGrpcHandler:
    """Contract tests verifying gRPC handler response structure."""

    @pytest.mark.asyncio
    async def test_parse_expense_returns_dict(self, handler: ExpenseServiceHandler) -> None:
        request = ParseExpenseRequest(raw_text="Lunch $15")
        result = await handler.ParseExpense(request)

        assert isinstance(result, dict)
        assert "success" in result

    @pytest.mark.asyncio
    async def test_parse_expense_contains_expense_data(self, handler: ExpenseServiceHandler) -> None:
        request = ParseExpenseRequest(raw_text="Gas $40")
        result = await handler.ParseExpense(request)

        assert result["success"] is True
        assert result["expense"] is not None
        assert "amount" in result["expense"]
        assert "category" in result["expense"]
