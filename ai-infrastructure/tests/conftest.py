"""Shared test fixtures for the AI infrastructure test suite."""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.expense_parser import ExpenseParserService
from app.services.task_parser import TaskParserService
from app.services.transcription_service import TranscriptionService
from app.services.summarization_service import SummarizationService
from app.pipelines.expense_pipeline import ExpensePipeline
from app.pipelines.task_pipeline import TaskPipeline
from app.grpc.handlers.expense_handler import ExpenseServiceHandler
from app.grpc.handlers.task_handler import TaskServiceHandler
from app.grpc.handlers.journal_handler import JournalServiceHandler


@pytest.fixture
def api_client() -> TestClient:
    """FastAPI test client."""
    return TestClient(app)


@pytest.fixture
def expense_parser() -> ExpenseParserService:
    """Expense parser service instance."""
    return ExpenseParserService()


@pytest.fixture
def task_parser() -> TaskParserService:
    """Task parser service instance."""
    return TaskParserService()


@pytest.fixture
def transcription_service() -> TranscriptionService:
    """Transcription service instance."""
    return TranscriptionService()


@pytest.fixture
def summarization_service() -> SummarizationService:
    """Summarization service instance."""
    return SummarizationService()


@pytest.fixture
def expense_pipeline() -> ExpensePipeline:
    """Expense pipeline instance."""
    return ExpensePipeline()


@pytest.fixture
def task_pipeline() -> TaskPipeline:
    """Task pipeline instance."""
    return TaskPipeline()


@pytest.fixture
def expense_handler() -> ExpenseServiceHandler:
    """Expense gRPC handler instance."""
    return ExpenseServiceHandler()


@pytest.fixture
def task_handler() -> TaskServiceHandler:
    """Task gRPC handler instance."""
    return TaskServiceHandler()


@pytest.fixture
def journal_handler() -> JournalServiceHandler:
    """Journal gRPC handler instance."""
    return JournalServiceHandler()
