"""Custom exception hierarchy for the AI infrastructure."""


class AIServiceError(Exception):
    """Base exception for all AI service errors."""

    def __init__(self, message: str, code: str = "AI_ERROR") -> None:
        self.message = message
        self.code = code
        super().__init__(self.message)


class ParsingError(AIServiceError):
    """Raised when NLP parsing fails to extract structured data."""

    def __init__(self, message: str = "Failed to parse input text") -> None:
        super().__init__(message=message, code="PARSING_ERROR")


class TranscriptionError(AIServiceError):
    """Raised when audio transcription fails."""

    def __init__(self, message: str = "Failed to transcribe audio") -> None:
        super().__init__(message=message, code="TRANSCRIPTION_ERROR")


class SummarizationError(AIServiceError):
    """Raised when text summarization fails."""

    def __init__(self, message: str = "Failed to summarize text") -> None:
        super().__init__(message=message, code="SUMMARIZATION_ERROR")


class ValidationError(AIServiceError):
    """Raised when input validation fails."""

    def __init__(self, message: str = "Input validation failed") -> None:
        super().__init__(message=message, code="VALIDATION_ERROR")


class PipelineError(AIServiceError):
    """Raised when a processing pipeline step fails."""

    def __init__(self, message: str, step: str = "unknown") -> None:
        self.step = step
        super().__init__(message=f"Pipeline failed at step '{step}': {message}", code="PIPELINE_ERROR")
