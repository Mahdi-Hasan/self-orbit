"""Pydantic v2 schemas for AI service request/response models."""

from enum import StrEnum

from pydantic import BaseModel, Field


# --- Enums ---

class ConfidenceLevel(StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class TaskPriority(StrEnum):
    URGENT = "urgent"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class SummaryStyle(StrEnum):
    BRIEF = "brief"
    DETAILED = "detailed"
    BULLET_POINTS = "bullet_points"


# --- Expense Schemas ---

class MoneySchema(BaseModel):
    amount: float = Field(..., gt=0, description="Monetary amount")
    currency: str = Field(default="USD", max_length=3, description="ISO 4217 currency code")


class ParsedExpenseSchema(BaseModel):
    amount: MoneySchema
    category: str = Field(..., min_length=1, max_length=100)
    description: str = Field(default="", max_length=500)
    merchant: str = Field(default="", max_length=200)
    date: str | None = Field(default=None, description="ISO 8601 date string")
    confidence: ConfidenceLevel = ConfidenceLevel.MEDIUM
    tags: list[str] = Field(default_factory=list)
    metadata: dict[str, str] = Field(default_factory=dict)


class ParseExpenseRequest(BaseModel):
    raw_text: str = Field(..., min_length=1, max_length=2000)
    user_locale: str = Field(default="en-US")
    preferred_currency: str = Field(default="USD", max_length=3)


class ParseExpenseResponse(BaseModel):
    success: bool
    expense: ParsedExpenseSchema | None = None
    error: str | None = None


# --- Task Schemas ---

class ParsedTaskSchema(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(default="", max_length=2000)
    priority: TaskPriority = TaskPriority.MEDIUM
    deadline: str | None = Field(default=None, description="ISO 8601 datetime string")
    confidence: ConfidenceLevel = ConfidenceLevel.MEDIUM
    tags: list[str] = Field(default_factory=list)
    estimated_duration: str | None = Field(default=None, description="e.g. '2h', '30m'")
    metadata: dict[str, str] = Field(default_factory=dict)


class ParseTaskRequest(BaseModel):
    raw_text: str = Field(..., min_length=1, max_length=2000)
    timezone: str = Field(default="UTC")


class ParseTaskResponse(BaseModel):
    success: bool
    task: ParsedTaskSchema | None = None
    error: str | None = None


# --- Transcription Schemas ---

class TranscriptionSegment(BaseModel):
    text: str
    start_time: float
    end_time: float


class TranscriptionResult(BaseModel):
    text: str
    detected_language: str = "en"
    confidence_score: float = Field(ge=0.0, le=1.0)
    duration_seconds: int = 0
    segments: list[TranscriptionSegment] = Field(default_factory=list)


class TranscribeRequest(BaseModel):
    audio_format: str = Field(default="wav", description="Audio format: wav, mp3, ogg, webm")
    language: str = Field(default="en")


class TranscribeResponse(BaseModel):
    success: bool
    result: TranscriptionResult | None = None
    error: str | None = None


# --- Summarization Schemas ---

class ActionItem(BaseModel):
    description: str
    priority: TaskPriority = TaskPriority.MEDIUM


class SummaryResult(BaseModel):
    summary: str
    key_topics: list[str] = Field(default_factory=list)
    mood: str = Field(default="neutral")
    action_items: list[ActionItem] = Field(default_factory=list)


class SummarizeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=50000)
    style: SummaryStyle = SummaryStyle.BRIEF
    max_length: int = Field(default=500, gt=0, le=5000)


class SummarizeResponse(BaseModel):
    success: bool
    result: SummaryResult | None = None
    error: str | None = None
