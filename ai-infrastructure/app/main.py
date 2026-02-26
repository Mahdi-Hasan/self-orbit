"""FastAPI application entrypoint with lifespan management."""

import asyncio
from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.core.config import get_settings
from app.core.logging import get_logger, setup_logging
from app.grpc.server import GrpcServer

settings = get_settings()
setup_logging(log_level=settings.log_level, log_format=settings.log_format)
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan — start/stop gRPC server alongside FastAPI."""
    grpc_server = GrpcServer()
    await grpc_server.start()
    logger.info("application_started", environment=settings.environment)

    yield

    await grpc_server.stop()
    logger.info("application_stopped")


app = FastAPI(
    title=settings.app_name,
    description="AI processing engine for Self-Orbit personal intelligence platform",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.rest_host,
        port=settings.rest_port,
        reload=settings.debug,
        log_level=settings.log_level.lower(),
    )
