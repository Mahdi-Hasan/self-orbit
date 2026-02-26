"""Application configuration using pydantic-settings (12-factor compliant)."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Service
    app_name: str = "Self-Orbit AI Engine"
    environment: str = "development"
    debug: bool = False

    # gRPC Server
    grpc_port: int = 50051
    grpc_max_workers: int = 10
    grpc_max_message_length: int = 50 * 1024 * 1024  # 50MB for audio

    # REST Server
    rest_port: int = 8000
    rest_host: str = "0.0.0.0"

    # Logging
    log_level: str = "INFO"
    log_format: str = "json"

    # AI Model Configuration
    model_temperature: float = 0.3
    model_max_tokens: int = 2048

    model_config = {
        "env_prefix": "",
        "env_file": ".env",
        "case_sensitive": False,
    }


def get_settings() -> Settings:
    """Factory function for dependency injection."""
    return Settings()
