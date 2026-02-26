"""REST fallback routes for the AI service."""

from fastapi import APIRouter, HTTPException, UploadFile

from app.core.exceptions import AIServiceError
from app.core.logging import get_logger
from app.models.schemas import (
    ParseExpenseRequest,
    ParseExpenseResponse,
    ParseTaskRequest,
    ParseTaskResponse,
    SummarizeRequest,
    SummarizeResponse,
    TranscribeResponse,
)
from app.pipelines.expense_pipeline import ExpensePipeline
from app.pipelines.task_pipeline import TaskPipeline
from app.services.summarization_service import SummarizationService
from app.services.transcription_service import TranscriptionService

logger = get_logger(__name__)

router = APIRouter(prefix="/api/v1", tags=["AI"])

# Service instances
_expense_pipeline = ExpensePipeline()
_task_pipeline = TaskPipeline()
_transcription_service = TranscriptionService()
_summarization_service = SummarizationService()


@router.post("/parse/expense", response_model=ParseExpenseResponse)
async def parse_expense(request: ParseExpenseRequest) -> ParseExpenseResponse:
    """Parse natural language into structured expense data.

    This is a REST fallback. Primary communication uses gRPC.
    """
    try:
        return await _expense_pipeline.process(request)
    except AIServiceError as e:
        raise HTTPException(status_code=422, detail=e.message) from e


@router.post("/parse/task", response_model=ParseTaskResponse)
async def parse_task(request: ParseTaskRequest) -> ParseTaskResponse:
    """Parse natural language into structured task data."""
    try:
        return await _task_pipeline.process(request)
    except AIServiceError as e:
        raise HTTPException(status_code=422, detail=e.message) from e


@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_audio(file: UploadFile) -> TranscribeResponse:
    """Transcribe uploaded audio file to text."""
    try:
        audio_data = await file.read()
        audio_format = file.content_type or "audio/wav"
        return await _transcription_service.transcribe(audio_data, audio_format, language="en")
    except AIServiceError as e:
        raise HTTPException(status_code=422, detail=e.message) from e


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_journal(request: SummarizeRequest) -> SummarizeResponse:
    """Summarize journal text and extract key topics."""
    try:
        return await _summarization_service.summarize(request)
    except AIServiceError as e:
        raise HTTPException(status_code=422, detail=e.message) from e


@router.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy", "service": "ai-infrastructure"}
